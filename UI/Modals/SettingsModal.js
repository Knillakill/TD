/**
 * Modal des réglages - Style moderne One Piece
 */
class SettingsModal extends BaseModal {
    constructor(scene, topMenu) {
        super(scene, topMenu, '⚙️ RÉGLAGES', 700, 620);
        this.createContent();
    }
    
    createContent() {
        const startY = this.contentY;
        
        // === Section Slots d'équipement ===
        let currentY = this.createSection(startY, 'SLOTS D\'ÉQUIPEMENT', '👥');
        
        const unlockedSlots = this.scene.player.collection.getUnlockedSlots();
        const maxSlots = this.scene.player.collection.maxEquipped;
        const stars = this.scene.player.collection.getStars();
        const slotCost = this.scene.player.collection.slotCost;
        
        // Info slots
        const slotInfoCard = this.createCard(this.x, currentY + 35, this.width - 80, 50, false);
        
        const slotsInfo = this.scene.add.text(
            this.x, currentY + 35,
            `${unlockedSlots} / ${maxSlots} slots débloqués  •  ⭐ ${stars} étoiles disponibles`,
            {
                fontSize: '16px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#b0b0b0'
            }
        );
        slotsInfo.setOrigin(0.5);
        slotsInfo.setDepth(2003);
        this.addElement(slotsInfo);
        
        // Affichage visuel des slots
        currentY += 75;
        const slotSize = 38;
        const slotGap = 8;
        const totalWidth = maxSlots * slotSize + (maxSlots - 1) * slotGap;
        const slotStartX = this.x - totalWidth / 2 + slotSize / 2;
        
        for (let i = 0; i < maxSlots; i++) {
            const x = slotStartX + i * (slotSize + slotGap);
            const isUnlocked = i < unlockedSlots;
            const isPremium = i >= 6;
            
            // Fond du slot
            const slotBg = this.scene.add.rectangle(
                x, currentY,
                slotSize, slotSize,
                isUnlocked ? this.colors.success : this.colors.secondary,
                isUnlocked ? 0.9 : 0.6
            );
            slotBg.setDepth(2002);
            slotBg.setStrokeStyle(2, isUnlocked ? 0x27ae60 : (isPremium ? this.colors.accent : this.colors.border), 0.8);
            this.addElement(slotBg);
            
            if (!isUnlocked) {
                const lockIcon = this.scene.add.text(x, currentY, isPremium ? '🔒' : '•', {
                    fontSize: isPremium ? '16px' : '20px'
                });
                lockIcon.setOrigin(0.5);
                lockIcon.setDepth(2003);
                this.addElement(lockIcon);
            } else {
                const checkIcon = this.scene.add.text(x, currentY, '✓', {
                    fontSize: '18px',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    color: '#ffffff',
                    fontStyle: 'bold'
                });
                checkIcon.setOrigin(0.5);
                checkIcon.setDepth(2003);
                this.addElement(checkIcon);
                }
        }
        
        // Bouton débloquer slot
        currentY += 50;
        if (unlockedSlots < maxSlots) {
            const canUnlock = this.scene.player.collection.canUnlockSlot();
            
            const unlockBtn = this.scene.add.rectangle(
                this.x, currentY,
                280, 45,
                canUnlock ? this.colors.accent : 0x444444, 0.9
            );
            unlockBtn.setDepth(2002);
            unlockBtn.setStrokeStyle(2, canUnlock ? 0xffd700 : 0x555555, 0.6);
            this.addElement(unlockBtn);
            
            const unlockText = this.scene.add.text(
                this.x, currentY,
                canUnlock ? `🔓 Débloquer Slot ${unlockedSlots + 1} (${slotCost} ⭐)` : `🔒 ${slotCost} ⭐ requis`,
                {
                    fontSize: '15px',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    color: canUnlock ? '#1a1a2e' : '#888888',
                    fontStyle: 'bold'
                }
            );
            unlockText.setOrigin(0.5);
            unlockText.setDepth(2003);
            this.addElement(unlockText);
            
            if (canUnlock) {
                unlockBtn.setInteractive({ useHandCursor: true });
                unlockBtn.on('pointerover', () => unlockBtn.setFillStyle(0xffd700, 1));
                unlockBtn.on('pointerout', () => unlockBtn.setFillStyle(this.colors.accent, 0.9));
                unlockBtn.on('pointerdown', () => {
                    const result = this.scene.player.collection.unlockSlot();
                    if (result.success) {
                        if (this.scene.saveManager) this.scene.saveManager.autoSave();
                        this.topMenu.closeModal();
                        this.topMenu.openTab('settings');
                    }
                });
            }
        } else {
            const completeText = this.scene.add.text(
                this.x, currentY,
                '✅ Tous les slots débloqués !',
                {
                    fontSize: '16px',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    color: '#2ecc71',
                    fontStyle: 'bold'
                }
            );
            completeText.setOrigin(0.5);
            completeText.setDepth(2002);
            this.addElement(completeText);
        }
        
        // === Section Sauvegarde ===
        currentY = this.createSection(currentY + 45, 'SAUVEGARDE', '💾');
        currentY += 25;
        
        // Créer l'input file caché
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
                            alert('Sauvegarde importée ! Le jeu va se recharger.');
                            window.location.reload();
                        })
                        .catch((error) => {
                            alert('Erreur: ' + error.message);
                        });
                }
                fileInput.value = '';
            });
        }
        
        // Boutons export/import côte à côte
        const btnWidth = 180;
        const btnGap = 20;
        
        // Bouton Exporter
        const exportBtn = this.scene.add.rectangle(
            this.x - btnWidth / 2 - btnGap / 2, currentY,
            btnWidth, 45,
            0x3498db, 0.9
        );
        exportBtn.setDepth(2002);
        exportBtn.setStrokeStyle(2, 0x5dade2, 0.6);
        exportBtn.setInteractive({ useHandCursor: true });
        this.addElement(exportBtn);
        
        const exportText = this.scene.add.text(
            this.x - btnWidth / 2 - btnGap / 2, currentY,
            '📥 Exporter',
            {
                fontSize: '16px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#ffffff',
                fontStyle: 'bold'
            }
        );
        exportText.setOrigin(0.5);
        exportText.setDepth(2003);
        this.addElement(exportText);
        
        exportBtn.on('pointerover', () => exportBtn.setFillStyle(0x5dade2, 1));
        exportBtn.on('pointerout', () => exportBtn.setFillStyle(0x3498db, 0.9));
        exportBtn.on('pointerdown', () => {
            if (this.scene.saveManager.exportSave()) {
                this.scene.ui.showMessage('Sauvegarde exportée !', 2000);
            }
        });
        
        // Bouton Importer
        const importBtn = this.scene.add.rectangle(
            this.x + btnWidth / 2 + btnGap / 2, currentY,
            btnWidth, 45,
            this.colors.success, 0.9
        );
        importBtn.setDepth(2002);
        importBtn.setStrokeStyle(2, 0x27ae60, 0.6);
        importBtn.setInteractive({ useHandCursor: true });
        this.addElement(importBtn);
        
        const importText = this.scene.add.text(
            this.x + btnWidth / 2 + btnGap / 2, currentY,
            '📤 Importer',
            {
                fontSize: '16px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#ffffff',
                fontStyle: 'bold'
            }
        );
        importText.setOrigin(0.5);
        importText.setDepth(2003);
        this.addElement(importText);
        
        importBtn.on('pointerover', () => importBtn.setFillStyle(0x27ae60, 1));
        importBtn.on('pointerout', () => importBtn.setFillStyle(this.colors.success, 0.9));
        importBtn.on('pointerdown', () => {
            document.getElementById('save-file-input').click();
        });
        
        // Info auto-save
        currentY += 40;
        const autoSaveInfo = this.scene.add.text(
            this.x, currentY,
            '💡 Sauvegarde automatique toutes les 30 secondes',
            {
                fontSize: '13px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#6c7a89',
                fontStyle: 'italic'
            }
        );
        autoSaveInfo.setOrigin(0.5);
        autoSaveInfo.setDepth(2002);
        this.addElement(autoSaveInfo);
        
        // === Section Danger ===
        currentY = this.createSection(currentY + 30, 'ZONE DANGER', '⚠️');
        currentY += 35;
        
        // Bouton Reset
        const resetBtn = this.scene.add.rectangle(
            this.x, currentY,
            280, 45,
            this.colors.danger, 0.9
        );
        resetBtn.setDepth(2002);
        resetBtn.setStrokeStyle(2, 0xc0392b, 0.6);
        resetBtn.setInteractive({ useHandCursor: true });
        this.addElement(resetBtn);
        
        const resetText = this.scene.add.text(
            this.x, currentY,
            '🗑️ Réinitialiser tout',
            {
                fontSize: '16px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#ffffff',
                fontStyle: 'bold'
            }
        );
        resetText.setOrigin(0.5);
        resetText.setDepth(2003);
        this.addElement(resetText);
        
        resetBtn.on('pointerover', () => resetBtn.setFillStyle(0xc0392b, 1));
        resetBtn.on('pointerout', () => resetBtn.setFillStyle(this.colors.danger, 0.9));
        resetBtn.on('pointerdown', () => {
            if (confirm('⚠️ Êtes-vous sûr de vouloir TOUT réinitialiser ?\n\nCela supprimera définitivement:\n- Votre progression\n- Vos tours débloquées\n- Vos étoiles\n- Toutes vos statistiques')) {
                window.location.href = window.location.pathname + '?reset=1';
            }
        });
    }
}
