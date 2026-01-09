/**
 * Modal des réglages du jeu
 */
class SettingsModal extends BaseModal {
    constructor(scene, topMenu) {
        super(scene, topMenu, '⚙️ RÉGLAGES', 700, 650);
        this.createContent();
    }
    
    createContent() {
        const startY = this.contentY + 40;
        
        // Section Slots d'équipement
        const slotsTitle = this.scene.add.text(
            this.x, startY,
            '👥 SLOTS D\'ÉQUIPEMENT',
            {
                fontSize: '22px',
                fontFamily: 'Arial',
                color: '#ffd700',
                fontStyle: 'bold'
            }
        );
        slotsTitle.setOrigin(0.5);
        slotsTitle.setDepth(2002);
        this.addElement(slotsTitle);
        
        // Informations sur les slots
        const unlockedSlots = this.scene.player.collection.getUnlockedSlots();
        const maxSlots = this.scene.player.collection.maxEquipped;
        const stars = this.scene.player.collection.getStars();
        const slotCost = this.scene.player.collection.slotCost;
        
        const infoText = this.scene.add.text(
            this.x, startY + 50,
            `Slots débloqués: ${unlockedSlots} / ${maxSlots}\nÉtoiles disponibles: ⭐ ${stars}`,
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#e0e0e0',
                align: 'center'
            }
        );
        infoText.setOrigin(0.5);
        infoText.setDepth(2002);
        this.addElement(infoText);
        
        // Affichage visuel des slots
        const slotStartX = this.x - 200;
        const slotStartY = startY + 130;
        const slotSize = 35;
        const slotGap = 10;
        
        for (let i = 0; i < maxSlots; i++) {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const x = slotStartX + col * (slotSize + slotGap);
            const y = slotStartY + row * (slotSize + slotGap);
            
            const isUnlocked = i < unlockedSlots;
            const isPremium = i >= 6; // Slots 7-10 sont premium
            
            const slotBox = this.scene.add.rectangle(
                x, y,
                slotSize, slotSize,
                isUnlocked ? 0x51cf66 : 0x333333, 0.9
            );
            slotBox.setDepth(2002);
            slotBox.setStrokeStyle(2, isUnlocked ? 0xffffff : (isPremium ? 0xffd700 : 0x666666), 0.8);
            this.addElement(slotBox);
            
            // Icône de cadenas pour les slots verrouillés
            if (!isUnlocked && isPremium) {
                const lockIcon = this.scene.add.text(
                    x, y,
                    '🔒',
                    {
                        fontSize: '16px'
                    }
                );
                lockIcon.setOrigin(0.5);
                lockIcon.setDepth(2003);
                this.addElement(lockIcon);
            }
            
            // Numéro du slot
            const slotNum = this.scene.add.text(
                x, y,
                (i + 1).toString(),
                {
                    fontSize: '14px',
                    fontFamily: 'Arial',
                    color: isUnlocked ? '#ffffff' : '#666666',
                    fontStyle: 'bold'
                }
            );
            slotNum.setOrigin(0.5);
            slotNum.setDepth(isUnlocked ? 2003 : 2002);
            this.addElement(slotNum);
        }
        
        // Bouton pour débloquer un slot
        if (unlockedSlots < maxSlots) {
            const canUnlock = this.scene.player.collection.canUnlockSlot();
            
            const unlockBtn = this.scene.add.rectangle(
                this.x, startY + 250,
                300, 50,
                canUnlock ? 0xffd700 : 0x555555, 0.9
            );
            unlockBtn.setDepth(2002);
            unlockBtn.setStrokeStyle(2, 0xffffff, 0.8);
            this.addElement(unlockBtn);
            
            const unlockText = this.scene.add.text(
                this.x, startY + 250,
                canUnlock ? `⭐ Débloquer Slot ${unlockedSlots + 1} (-${slotCost} étoiles)` : `🔒 Pas assez d'étoiles (${stars}/${slotCost})`,
                {
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    align: 'center'
                }
            );
            unlockText.setOrigin(0.5);
            unlockText.setDepth(2003);
            this.addElement(unlockText);
            
            if (canUnlock) {
                unlockBtn.setInteractive({ useHandCursor: true });
                
                unlockBtn.on('pointerover', () => {
                    unlockBtn.setFillStyle(0xffed4e, 0.9);
                });
                
                unlockBtn.on('pointerout', () => {
                    unlockBtn.setFillStyle(0xffd700, 0.9);
                });
                
                unlockBtn.on('pointerdown', () => {
                    const result = this.scene.player.collection.unlockSlot();
                    if (result.success) {
                        // Sauvegarder
                        if (this.scene.saveManager) {
                            this.scene.saveManager.autoSave();
                        }
                        // Rafraîchir la modal
                        this.topMenu.closeModal();
                        this.topMenu.openTab('settings');
                    }
                });
            }
        } else {
            // Tous les slots sont débloqués
            const completeText = this.scene.add.text(
                this.x, startY + 250,
                '✅ Tous les slots sont débloqués !',
                {
                    fontSize: '18px',
                    fontFamily: 'Arial',
                    color: '#51cf66',
                    fontStyle: 'bold'
                }
            );
            completeText.setOrigin(0.5);
            completeText.setDepth(2002);
            this.addElement(completeText);
        }
        
        // Section Sauvegarde
        const saveTitle = this.scene.add.text(
            this.x, startY + 320,
            '💾 SAUVEGARDE',
            {
                fontSize: '22px',
                fontFamily: 'Arial',
                color: '#4dabf7',
                fontStyle: 'bold'
            }
        );
        saveTitle.setOrigin(0.5);
        saveTitle.setDepth(2002);
        this.addElement(saveTitle);
        
        // Créer un input file caché pour l'import
        if (!document.getElementById('save-file-input')) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'save-file-input';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.scene.saveManager.importSave(file)
                        .then(() => {
                            alert('Sauvegarde importée avec succès ! Le jeu va se recharger.');
                            window.location.reload();
                        })
                        .catch((error) => {
                            alert('Erreur lors de l\'import : ' + error.message);
                        });
                }
                // Réinitialiser l'input
                fileInput.value = '';
            });
        }
        
        // Bouton Exporter
        const exportBtn = this.scene.add.rectangle(
            this.x - 160, startY + 380,
            220, 40,
            0x4dabf7, 0.9
        );
        exportBtn.setDepth(2002);
        exportBtn.setStrokeStyle(2, 0xffffff, 0.6);
        exportBtn.setInteractive({ useHandCursor: true });
        this.addElement(exportBtn);
        
        const exportText = this.scene.add.text(
            this.x - 160, startY + 380,
            '📥 Exporter',
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        );
        exportText.setOrigin(0.5);
        exportText.setDepth(2003);
        this.addElement(exportText);
        
        exportBtn.on('pointerover', () => exportBtn.setFillStyle(0x74c0fc, 0.9));
        exportBtn.on('pointerout', () => exportBtn.setFillStyle(0x4dabf7, 0.9));
        exportBtn.on('pointerdown', () => {
            if (this.scene.saveManager.exportSave()) {
                alert('Sauvegarde exportée avec succès !');
            } else {
                alert('Erreur lors de l\'export de la sauvegarde.');
            }
        });
        
        // Bouton Importer
        const importBtn = this.scene.add.rectangle(
            this.x + 60, startY + 380,
            220, 40,
            0x51cf66, 0.9
        );
        importBtn.setDepth(2002);
        importBtn.setStrokeStyle(2, 0xffffff, 0.6);
        importBtn.setInteractive({ useHandCursor: true });
        this.addElement(importBtn);
        
        const importText = this.scene.add.text(
            this.x + 60, startY + 380,
            '📤 Importer',
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        );
        importText.setOrigin(0.5);
        importText.setDepth(2003);
        this.addElement(importText);
        
        importBtn.on('pointerover', () => importBtn.setFillStyle(0x8ce99a, 0.9));
        importBtn.on('pointerout', () => importBtn.setFillStyle(0x51cf66, 0.9));
        importBtn.on('pointerdown', () => {
            document.getElementById('save-file-input').click();
        });
        
        // Info auto-save
        const autoSaveInfo = this.scene.add.text(
            this.x, startY + 440,
            '💡 La sauvegarde est automatique toutes les 30s',
            {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#a0a0a0',
                fontStyle: 'italic'
            }
        );
        autoSaveInfo.setOrigin(0.5);
        autoSaveInfo.setDepth(2002);
        this.addElement(autoSaveInfo);
        
        // Bouton réinitialiser progression
        const resetBtn = this.scene.add.rectangle(
            this.x, startY + 510,
            300, 45,
            0xff6b6b, 0.9
        );
        resetBtn.setDepth(2002);
        resetBtn.setStrokeStyle(2, 0xffffff, 0.5);
        resetBtn.setInteractive({ useHandCursor: true });
        this.addElement(resetBtn);
        
        const resetText = this.scene.add.text(
            this.x, startY + 510,
            '⚠️ Réinitialiser la progression',
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        );
        resetText.setOrigin(0.5);
        resetText.setDepth(2003);
        this.addElement(resetText);
        
        resetBtn.on('pointerover', () => resetBtn.setFillStyle(0xff8787, 0.9));
        resetBtn.on('pointerout', () => resetBtn.setFillStyle(0xff6b6b, 0.9));
        resetBtn.on('pointerdown', () => {
            if (confirm('Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cela supprimera TOUT : vagues, or, tours obtenues, niveaux, etc.')) {
                // Rediriger vers l'URL avec le paramètre reset=1
                // Le GameScene détectera ce paramètre et supprimera tout AVANT de charger
                window.location.href = window.location.pathname + '?reset=1';
            }
        });
    }
}

