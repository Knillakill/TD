/**
 * Gestionnaire de sauvegarde centralisé
 * Gère la sauvegarde automatique, l'export et l'import des données de jeu
 * Avec cryptage/décryptage pour sécuriser les données
 */
class SaveManager {
    constructor(scene) {
        this.scene = scene;
        this.saveKey = 'onepiece_td_save';
        this.autoSaveInterval = 30000; // Sauvegarde automatique toutes les 30 secondes
        this.encryptionKey = 'OnePiece_TD_2026_Luffy_Mugiwara_Secret_Key_v1.0'; // Clé de cryptage
        this.setupAutoSave();
    }
    
    /**
     * Crypte les données avec XOR + Base64
     */
    encrypt(data) {
        try {
            const jsonStr = JSON.stringify(data);
            
            // Ajouter un checksum pour vérifier l'intégrité
            const checksum = this.calculateChecksum(jsonStr);
            const dataWithChecksum = checksum + '|' + jsonStr;
            
            // XOR avec la clé de cryptage
            let encrypted = '';
            for (let i = 0; i < dataWithChecksum.length; i++) {
                const charCode = dataWithChecksum.charCodeAt(i);
                const keyChar = this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
                encrypted += String.fromCharCode(charCode ^ keyChar);
            }
            
            // Encoder en Base64
            const base64 = btoa(unescape(encodeURIComponent(encrypted)));
            
            return base64;
        } catch (error) {
            console.error('[SaveManager] Erreur lors du cryptage:', error);
            return null;
        }
    }
    
    /**
     * Décrypte les données
     */
    decrypt(encryptedData) {
        try {
            // Décoder le Base64
            const encrypted = decodeURIComponent(escape(atob(encryptedData)));
            
            // XOR avec la clé de cryptage (inverse)
            let decrypted = '';
            for (let i = 0; i < encrypted.length; i++) {
                const charCode = encrypted.charCodeAt(i);
                const keyChar = this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
                decrypted += String.fromCharCode(charCode ^ keyChar);
            }
            
            // Séparer le checksum et les données
            const parts = decrypted.split('|');
            if (parts.length !== 2) {
                throw new Error('Format de sauvegarde invalide');
            }
            
            const [checksum, jsonStr] = parts;
            
            // Vérifier l'intégrité
            const calculatedChecksum = this.calculateChecksum(jsonStr);
            if (checksum !== calculatedChecksum) {
                throw new Error('Checksum invalide - données corrompues');
            }
            
            // Parser le JSON
            const data = JSON.parse(jsonStr);
            
            return data;
        } catch (error) {
            console.error('[SaveManager] Erreur lors du décryptage:', error);
            return null;
        }
    }
    
    /**
     * Calcule un checksum simple pour vérifier l'intégrité
     */
    calculateChecksum(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(36);
    }

    /**
     * Configure la sauvegarde automatique
     */
    setupAutoSave() {
        // Sauvegarder toutes les 30 secondes
        this.autoSaveTimer = this.scene.time.addEvent({
            delay: this.autoSaveInterval,
            callback: () => this.autoSave(),
            loop: true
        });

        // Sauvegarder avant de quitter la page
        window.addEventListener('beforeunload', () => {
            this.autoSave();
        });
    }

    /**
     * Sauvegarde automatique
     */
    autoSave() {
        try {
            const saveData = this.collectSaveData();
            const encrypted = this.encrypt(saveData);
            
            if (encrypted) {
                localStorage.setItem(this.saveKey, encrypted);
                console.log(`[SaveManager] Auto-save cryptée réussie - Vague ${saveData.game.currentWave}, Checkpoint ${saveData.game.lastCheckpoint}, HP: ${saveData.player.hp}, GameOver: ${saveData.game.isGameOver}`);
            } else {
                console.error('[SaveManager] Échec du cryptage');
            }
        } catch (error) {
            console.error('[SaveManager] Erreur lors de la sauvegarde automatique:', error);
        }
    }

    /**
     * Collecte toutes les données à sauvegarder
     */
    collectSaveData() {
        const player = this.scene.player;
        const collection = player.collection;

        // Sauvegarder la DERNIÈRE VAGUE COMPLÉTÉE, pas la vague en cours
        // Ainsi, quand on recharge, on recommence la vague qu'on n'a pas terminée
        let lastCompletedWave = 0;
        
        if (this.scene.waveManager) {
            const wm = this.scene.waveManager;
            // Si une vague est en cours ou s'il reste des ennemis, on sauvegarde la vague précédente
            if (wm.waveInProgress || wm.enemiesRemainingInWave > 0 || this.scene.enemies.length > 0) {
                lastCompletedWave = Math.max(0, wm.currentWave - 1);
            } else {
                // Vague terminée, on sauvegarde la vague actuelle
                lastCompletedWave = wm.currentWave;
            }
        } else if (typeof this.scene.waveNumber !== 'undefined') {
            lastCompletedWave = this.scene.waveNumber;
        }
        
        console.log(`[SaveManager] Collecte sauvegarde - lastCompletedWave=${lastCompletedWave}, waveInProgress=${this.scene.waveManager?.waveInProgress}`);

        return {
            version: '1.0.0',
            timestamp: Date.now(),
            player: {
                hp: player.hp,
                gold: player.gold,
                stars: player.stars,
                completedWaves: player.completedWaves
            },
            collection: {
                unlockedTowers: Array.from(collection.unlockedTowers),
                equippedTowers: Array.from(collection.equippedTowers),
                unlockedSlots: collection.unlockedSlots,
                towerStats: collection.towerStats
            },
            game: {
                currentWave: lastCompletedWave,
                lastCheckpoint: this.getLastCheckpoint(lastCompletedWave),
                highestWave: this.getHighestWave(),
                isGameOver: player.hp <= 0
            }
        };
    }
    
    /**
     * Obtient le dernier checkpoint atteint
     */
    getLastCheckpoint(currentWave = null) {
        if (currentWave === null) {
            currentWave = (this.scene.waveManager && typeof this.scene.waveManager.currentWave !== 'undefined') 
                ? this.scene.waveManager.currentWave 
                : (this.scene.waveNumber || 0);
        }
        
        // Si aucune vague n'a été lancée, pas de checkpoint
        if (currentWave === 0) {
            return 1;
        }
        
        const checkpoints = [1, 25, 50, 75, 100];
        
        // Trouver le checkpoint le plus élevé atteint
        let lastCheckpoint = 1;
        for (const checkpoint of checkpoints) {
            if (currentWave >= checkpoint) {
                lastCheckpoint = checkpoint;
            }
        }
        
        return lastCheckpoint;
    }

    /**
     * Obtient la vague la plus élevée atteinte
     */
    getHighestWave() {
        const player = this.scene.player;
        const waves = Object.keys(player.completedWaves).map(w => parseInt(w));
        return waves.length > 0 ? Math.max(...waves) : 0;
    }

    /**
     * Charge les données sauvegardées
     */
    loadSave() {
        try {
            const encryptedData = localStorage.getItem(this.saveKey);
            if (!encryptedData) {
                console.log('[SaveManager] Aucune sauvegarde trouvée');
                return null;
            }

            const saveData = this.decrypt(encryptedData);
            if (!saveData) {
                console.error('[SaveManager] Échec du décryptage - sauvegarde corrompue');
                return null;
            }
            
            console.log('[SaveManager] Sauvegarde décryptée et chargée:', {
                currentWave: saveData.game?.currentWave,
                lastCheckpoint: saveData.game?.lastCheckpoint,
                isGameOver: saveData.game?.isGameOver,
                hp: saveData.player?.hp
            });
            return saveData;
        } catch (error) {
            console.error('[SaveManager] Erreur lors du chargement de la sauvegarde:', error);
            return null;
        }
    }

    /**
     * Applique les données sauvegardées au jeu
     */
    applySaveData(saveData) {
        if (!saveData) return false;

        try {
            const player = this.scene.player;
            const collection = player.collection;

            // Déterminer la vague de départ selon le système de checkpoint
            let startWave = 0;
            if (saveData.game && typeof saveData.game.currentWave !== 'undefined') {
                if (saveData.game.isGameOver) {
                    // Le joueur est mort, revenir au dernier checkpoint
                    startWave = saveData.game.lastCheckpoint || 1;
                    player.hp = 10; // Réinitialiser les HP au maximum (10)
                    console.log(`[SaveManager] Game Over - Retour au checkpoint ${startWave}`);
                } else {
                    // Le joueur a quitté sans mourir, reprendre à la vague actuelle
                    // Si currentWave = 0, cela signifie qu'aucune vague n'a été lancée
                    startWave = saveData.game.currentWave;
                    player.hp = saveData.player.hp !== undefined ? saveData.player.hp : 10;
                    console.log(`[SaveManager] Reprise à la vague ${startWave} (depuis sauvegarde: ${saveData.game.currentWave}), HP: ${player.hp}`);
                }
            } else {
                // Pas de données de vague, commencer à 0
                player.hp = saveData.player?.hp !== undefined ? saveData.player.hp : 10;
                console.log('[SaveManager] Pas de données de vague - Démarrage à la vague 0');
            }

            // Restaurer les données du joueur
            player.gold = saveData.player.gold || 0;
            player.stars = saveData.player.stars || 0;
            player.completedWaves = saveData.player.completedWaves || {};

            // Restaurer la collection
            collection.unlockedTowers = new Set(saveData.collection.unlockedTowers || ['luffy']);
            collection.equippedTowers = new Set(saveData.collection.equippedTowers || ['luffy']);
            collection.unlockedSlots = saveData.collection.unlockedSlots || 6;
            collection.towerStats = saveData.collection.towerStats || {};

            // Définir la vague de départ
            this.scene.waveNumber = startWave;

            // Sauvegarder dans le localStorage de la collection
            collection.save();

            console.log(`[SaveManager] Données appliquées avec succès - Vague de départ: ${startWave}`);
            return true;
        } catch (error) {
            console.error('[SaveManager] Erreur lors de l\'application de la sauvegarde:', error);
            return false;
        }
    }

    /**
     * Exporte la sauvegarde vers un fichier JSON (crypté)
     */
    exportSave() {
        try {
            const saveData = this.collectSaveData();
            const encrypted = this.encrypt(saveData);
            
            if (!encrypted) {
                console.error('[SaveManager] Échec du cryptage pour l\'export');
                return false;
            }
            
            // Créer un objet JSON avec les données cryptées
            const exportData = {
                encrypted: true,
                version: '1.0.0',
                data: encrypted
            };
            
            const json = JSON.stringify(exportData, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Créer un nom de fichier avec la date
            const date = new Date();
            const dateStr = date.toISOString().split('T')[0];
            const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
            const filename = `onepiece_td_save_${dateStr}_${timeStr}.json`;

            // Télécharger le fichier
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('[SaveManager] Sauvegarde cryptée exportée:', filename);
            return true;
        } catch (error) {
            console.error('[SaveManager] Erreur lors de l\'export:', error);
            return false;
        }
    }

    /**
     * Importe une sauvegarde depuis un fichier JSON (crypté)
     */
    importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const fileContent = JSON.parse(e.target.result);
                    
                    let saveData;
                    
                    // Vérifier si le fichier est crypté
                    if (fileContent.encrypted && fileContent.data) {
                        // Décrypter les données
                        saveData = this.decrypt(fileContent.data);
                        
                        if (!saveData) {
                            reject(new Error('Impossible de décrypter la sauvegarde - fichier corrompu ou modifié'));
                            return;
                        }
                        
                        console.log('[SaveManager] Sauvegarde décryptée avec succès');
                    } else {
                        // Ancien format non crypté (rétrocompatibilité)
                        saveData = fileContent;
                        console.log('[SaveManager] Sauvegarde non cryptée (ancien format)');
                    }

                    // Valider les données
                    if (!this.validateSaveData(saveData)) {
                        reject(new Error('Fichier de sauvegarde invalide'));
                        return;
                    }

                    // Appliquer les données
                    if (this.applySaveData(saveData)) {
                        // Sauvegarder dans localStorage (crypté)
                        const encrypted = this.encrypt(saveData);
                        if (encrypted) {
                            localStorage.setItem(this.saveKey, encrypted);
                        }
                        console.log('[SaveManager] Sauvegarde importée et cryptée avec succès');
                        resolve(saveData);
                    } else {
                        reject(new Error('Erreur lors de l\'application de la sauvegarde'));
                    }
                } catch (error) {
                    console.error('[SaveManager] Erreur lors de l\'import:', error);
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error('Erreur lors de la lecture du fichier'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Valide les données de sauvegarde
     */
    validateSaveData(saveData) {
        if (!saveData || typeof saveData !== 'object') {
            console.error('[SaveManager] Données invalides: pas un objet');
            return false;
        }

        // Vérifier la présence des sections essentielles
        if (!saveData.player || !saveData.collection) {
            console.error('[SaveManager] Données invalides: sections manquantes');
            return false;
        }

        // Vérifier les types
        if (typeof saveData.player.hp !== 'number' || 
            typeof saveData.player.gold !== 'number') {
            console.error('[SaveManager] Données invalides: types incorrects');
            return false;
        }

        console.log('[SaveManager] Validation réussie');
        return true;
    }

    /**
     * Supprime la sauvegarde
     */
    deleteSave() {
        try {
            localStorage.removeItem(this.saveKey);
            console.log('[SaveManager] Sauvegarde supprimée');
            return true;
        } catch (error) {
            console.error('[SaveManager] Erreur lors de la suppression:', error);
            return false;
        }
    }

    /**
     * Nettoie le gestionnaire
     */
    destroy() {
        if (this.autoSaveTimer) {
            this.autoSaveTimer.remove();
        }
    }
}

