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
     * Sauvegarde à une vague spécifique (pour les boutons de restart)
     */
    saveAtWave(waveNumber) {
        try {
            const player = this.scene.player;
            const collection = player.collection;
            
            // Réinitialiser les HP
            player.hp = 10;
            
            // Garder les tours placées sur la map
            const placedTowers = this.collectPlacedTowers();
            
            // Collecter les niveaux des tours du joueur
            const towerLevels = player.towerLevels || {};
            
            // Collecter les réglages
            const settings = this.collectSettings();
            
            const saveData = {
                version: this.saveVersion,
                timestamp: Date.now(),
                game: {
                    currentWave: waveNumber,
                    lastCheckpoint: this.getLastCheckpoint(waveNumber),
                    isGameOver: false
                },
                player: {
                    hp: 10,
                    gold: player.gold,
                    completedWaves: player.completedWaves || {},
                    towerLevels: towerLevels
                },
                collection: {
                    unlockedTowers: collection.getUnlockedTowers(),
                    equippedTowers: collection.getEquippedTowers(),
                    unlockedSlots: collection.unlockedSlots,
                    stars: collection.stars,
                    stats: collection.stats
                },
                towers: {
                    placed: placedTowers // Garder les tours placées
                },
                settings: settings
            };
            
            const encrypted = this.encrypt(saveData);
            
            if (encrypted) {
                localStorage.setItem(this.saveKey, encrypted);
                console.log(`[SaveManager] Sauvegarde à la vague ${waveNumber} réussie (${placedTowers.length} tours conservées)`);
            }
        } catch (error) {
            console.error('[SaveManager] Erreur lors de la sauvegarde:', error);
        }
    }
    
    /**
     * Obtient le dernier checkpoint atteint pour une vague donnée
     */
    getLastCheckpoint(waveNumber = null) {
        const checkpoints = [1, 25, 50, 75, 100];
        const wave = waveNumber !== null ? waveNumber : (this.scene.waveManager ? this.scene.waveManager.currentWave : 0);
        
        let lastCheckpoint = 1;
        for (const cp of checkpoints) {
            if (wave >= cp) {
                lastCheckpoint = cp;
            }
        }
        return lastCheckpoint;
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
        
        // Collecter les tours placées sur la map
        const placedTowers = this.collectPlacedTowers();
        
        // Collecter les niveaux des tours du joueur
        const towerLevels = player.towerLevels || {};
        
        // Collecter les réglages
        const settings = this.collectSettings();
        
        console.log(`[SaveManager] Collecte sauvegarde - lastCompletedWave=${lastCompletedWave}, tours placées: ${placedTowers.length}`);

        return {
            version: '1.1.0',
            timestamp: Date.now(),
            mapId: this.scene.mapId || 'map1',
            player: {
                hp: player.hp,
                gold: player.gold,
                stars: player.stars,
                completedWaves: player.completedWaves,
                towerLevels: towerLevels
            },
            collection: {
                unlockedTowers: Array.from(collection.unlockedTowers),
                equippedTowers: Array.from(collection.equippedTowers),
                unlockedSlots: collection.unlockedSlots,
                towerStats: collection.towerStats,
                stars: collection.stars || 0
            },
            game: {
                currentWave: lastCompletedWave,
                lastCheckpoint: this.getLastCheckpoint(lastCompletedWave),
                highestWave: this.getHighestWave(),
                isGameOver: player.hp <= 0,
                autoPlay: this.scene.waveControl ? this.scene.waveControl.autoPlay : false
            },
            towers: {
                placed: placedTowers
            },
            settings: settings
        };
    }
    
    /**
     * Collecte les tours placées sur la map
     */
    collectPlacedTowers() {
        const placedTowers = [];
        
        if (this.scene.placementSystem && this.scene.placementSystem.placementSpots) {
            this.scene.placementSystem.placementSpots.forEach((spot, index) => {
                if (spot.occupied && spot.tower) {
                    placedTowers.push({
                        spotIndex: index,
                        towerId: spot.tower.towerId,
                        level: spot.tower.level || 1,
                        x: spot.x,
                        y: spot.y
                    });
                }
            });
        }
        
        return placedTowers;
    }
    
    /**
     * Collecte les réglages du jeu
     */
    collectSettings() {
        return {
            musicVolume: localStorage.getItem('musicVolume') || 0.5,
            sfxVolume: localStorage.getItem('sfxVolume') || 0.7,
            showDamageNumbers: localStorage.getItem('showDamageNumbers') !== 'false',
            showRangeOnHover: localStorage.getItem('showRangeOnHover') !== 'false',
            gameSpeed: localStorage.getItem('gameSpeed') || 1
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
            
            // Restaurer les niveaux des tours (garder les valeurs par défaut si non sauvegardées)
            if (saveData.player.towerLevels) {
                Object.keys(saveData.player.towerLevels).forEach(towerId => {
                    player.towerLevels[towerId] = saveData.player.towerLevels[towerId];
                });
            }

            // Restaurer la collection
            collection.unlockedTowers = new Set(saveData.collection.unlockedTowers || ['luffy']);
            collection.equippedTowers = new Set(saveData.collection.equippedTowers || ['luffy']);
            collection.unlockedSlots = saveData.collection.unlockedSlots || 6;
            collection.towerStats = saveData.collection.towerStats || {};
            collection.stars = saveData.collection.stars || 0;

            // Définir la vague de départ
            this.scene.waveNumber = startWave;
            
            // Stocker les tours à placer (seront placées après l'initialisation du placement system)
            this.scene.towersToRestore = saveData.towers ? saveData.towers.placed : [];
            
            // Restaurer les réglages
            if (saveData.settings) {
                this.applySettings(saveData.settings);
            }
            
            // Restaurer l'autoPlay
            if (saveData.game && typeof saveData.game.autoPlay !== 'undefined') {
                this.scene.savedAutoPlay = saveData.game.autoPlay;
            }

            // Sauvegarder dans le localStorage de la collection
            collection.save();

            console.log(`[SaveManager] Données appliquées avec succès - Vague de départ: ${startWave}, Tours à restaurer: ${this.scene.towersToRestore.length}`);
            return true;
        } catch (error) {
            console.error('[SaveManager] Erreur lors de l\'application de la sauvegarde:', error);
            return false;
        }
    }
    
    /**
     * Applique les réglages sauvegardés
     */
    applySettings(settings) {
        if (settings.musicVolume !== undefined) {
            localStorage.setItem('musicVolume', settings.musicVolume);
        }
        if (settings.sfxVolume !== undefined) {
            localStorage.setItem('sfxVolume', settings.sfxVolume);
        }
        if (settings.showDamageNumbers !== undefined) {
            localStorage.setItem('showDamageNumbers', settings.showDamageNumbers);
        }
        if (settings.showRangeOnHover !== undefined) {
            localStorage.setItem('showRangeOnHover', settings.showRangeOnHover);
        }
        if (settings.gameSpeed !== undefined) {
            localStorage.setItem('gameSpeed', settings.gameSpeed);
        }
    }
    
    /**
     * Restaure les tours placées sur la map (appelé après l'initialisation)
     */
    restorePlacedTowers() {
        if (!this.scene.towersToRestore || this.scene.towersToRestore.length === 0) {
            return;
        }
        
        if (!this.scene.placementSystem) {
            console.warn('[SaveManager] PlacementSystem non disponible pour restaurer les tours');
            return;
        }
        
        console.log(`[SaveManager] Restauration de ${this.scene.towersToRestore.length} tours...`);
        
        this.scene.towersToRestore.forEach(towerData => {
            const spot = this.scene.placementSystem.placementSpots[towerData.spotIndex];
            if (spot && !spot.occupied) {
                // Placer la tour
                this.scene.placementSystem.placeTowerAtSpot(spot, towerData.towerId);
                console.log(`[SaveManager] Tour ${towerData.towerId} restaurée à l'emplacement ${towerData.spotIndex}`);
            }
        });
        
        // Vider la liste après restauration
        this.scene.towersToRestore = [];
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

