class WaveControl {
    constructor(scene) {
        this.scene = scene;
        this.autoPlay = false;
        this.gameSpeed = 1; // Vitesse du jeu : 1, 2 ou 3
        
        // Position juste au-dessus du trait noir (séparateur avant les stats vie)
        const panelX = 10;
        const panelY = 650;  // Remonté pour être au-dessus du trait
        const panelWidth = 280;
        const btnWidth = 82;
        const btnHeight = 32;
        const gap = 5;
        
        // Bouton "Lancer Vague"
        this.startWaveButton = scene.add.rectangle(
            panelX + 10,
            panelY,
            btnWidth,
            btnHeight,
            0x2ecc71
        );
        this.startWaveButton.setOrigin(0, 0);
        this.startWaveButton.setDepth(101);
        this.startWaveButton.setInteractive({ useHandCursor: true });
        this.startWaveButton.setScrollFactor(0);
        
        this.startWaveText = scene.add.text(
            panelX + 10 + btnWidth / 2,
            panelY + btnHeight / 2,
            '▶ VAGUE',
            {
                fontSize: '12px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        );
        this.startWaveText.setOrigin(0.5);
        this.startWaveText.setDepth(102);
        this.startWaveText.setScrollFactor(0);
        
        // Bouton "Auto-Play"
        this.autoPlayButton = scene.add.rectangle(
            panelX + 10 + btnWidth + gap,
            panelY,
            btnWidth,
            btnHeight,
            0x95a5a6
        );
        this.autoPlayButton.setOrigin(0, 0);
        this.autoPlayButton.setDepth(101);
        this.autoPlayButton.setInteractive({ useHandCursor: true });
        this.autoPlayButton.setScrollFactor(0);
        
        this.autoPlayText = scene.add.text(
            panelX + 10 + btnWidth + gap + btnWidth / 2,
            panelY + btnHeight / 2,
            'AUTO',
            {
                fontSize: '12px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        );
        this.autoPlayText.setOrigin(0.5);
        this.autoPlayText.setDepth(102);
        this.autoPlayText.setScrollFactor(0);
        
        // Bouton "Vitesse"
        this.speedButton = scene.add.rectangle(
            panelX + 10 + (btnWidth + gap) * 2,
            panelY,
            btnWidth,
            btnHeight,
            0x9b59b6
        );
        this.speedButton.setOrigin(0, 0);
        this.speedButton.setDepth(101);
        this.speedButton.setInteractive({ useHandCursor: true });
        this.speedButton.setScrollFactor(0);
        
        this.speedText = scene.add.text(
            panelX + 10 + (btnWidth + gap) * 2 + btnWidth / 2,
            panelY + btnHeight / 2,
            '⚡ x1',
            {
                fontSize: '12px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        );
        this.speedText.setOrigin(0.5);
        this.speedText.setDepth(102);
        this.speedText.setScrollFactor(0);
        
        // Événements
        this.startWaveButton.on('pointerdown', () => {
            this.startNextWave();
        });
        
        this.startWaveButton.on('pointerover', () => {
            this.startWaveButton.setFillStyle(0x27ae60);
        });
        
        this.startWaveButton.on('pointerout', () => {
            this.startWaveButton.setFillStyle(0x2ecc71);
        });
        
        this.autoPlayButton.on('pointerdown', () => {
            this.toggleAutoPlay();
        });
        
        this.autoPlayButton.on('pointerover', () => {
            const color = this.autoPlay ? 0x2980b9 : 0x7f8c8d;
            this.autoPlayButton.setFillStyle(color);
        });
        
        this.autoPlayButton.on('pointerout', () => {
            const color = this.autoPlay ? 0x3498db : 0x95a5a6;
            this.autoPlayButton.setFillStyle(color);
        });
        
        this.speedButton.on('pointerdown', () => {
            this.toggleSpeed();
        });
        
        this.speedButton.on('pointerover', () => {
            this.speedButton.setFillStyle(0x8e44ad);
        });
        
        this.speedButton.on('pointerout', () => {
            this.updateSpeedButtonColor();
        });
        
        // Appliquer la vitesse sauvegardée
        const savedSpeed = localStorage.getItem('gameSpeed');
        if (savedSpeed) {
            this.gameSpeed = parseInt(savedSpeed) || 1;
            this.applyGameSpeed();
        }
    }
    
    toggleSpeed() {
        // Cycle: 1 -> 2 -> 3 -> 1
        this.gameSpeed = this.gameSpeed >= 3 ? 1 : this.gameSpeed + 1;
        this.applyGameSpeed();
        
        // Sauvegarder la vitesse
        localStorage.setItem('gameSpeed', this.gameSpeed);
        
        this.scene.ui.showMessage(`Vitesse x${this.gameSpeed}`, 1000);
    }
    
    applyGameSpeed() {
        // Mettre à jour le texte du bouton
        this.speedText.setText(`⚡ x${this.gameSpeed}`);
        this.updateSpeedButtonColor();
        
        // Appliquer la vitesse au jeu via le timeScale de Phaser
        this.scene.time.timeScale = this.gameSpeed;
        this.scene.tweens.timeScale = this.gameSpeed;
        this.scene.physics.world.timeScale = 1 / this.gameSpeed;
        
        // Mettre à jour la vitesse des animations
        this.scene.anims.globalTimeScale = this.gameSpeed;
    }
    
    updateSpeedButtonColor() {
        // Couleur selon la vitesse
        const colors = {
            1: 0x9b59b6,  // Violet normal
            2: 0xe67e22,  // Orange
            3: 0xe74c3c   // Rouge
        };
        this.speedButton.setFillStyle(colors[this.gameSpeed] || 0x9b59b6);
    }
    
    startNextWave() {
        if (this.scene.waveManager) {
            const wm = this.scene.waveManager;
            
            // Si une vague est en cours, on ne peut pas en lancer une autre
            if (wm.waveInProgress) {
                this.scene.ui.showMessage('Vague en cours!', 1000);
                return;
            }
            
            // Vérifier s'il reste des ennemis vivants sur le terrain
            const enemiesOnField = this.scene.enemies ? this.scene.enemies.length : 0;
            
            if (enemiesOnField > 0) {
                this.scene.ui.showMessage('Terminez la vague actuelle!', 1000);
                return;
            }
            
            // On peut lancer la prochaine vague
            wm.startNextWave();
        }
    }
    
    toggleAutoPlay() {
        this.autoPlay = !this.autoPlay;
        
        if (this.autoPlay) {
            this.autoPlayButton.setFillStyle(0x3498db);
            this.autoPlayText.setText('AUTO ✓');
            this.scene.ui.showMessage('Auto-Play activé', 1000);
        } else {
            this.autoPlayButton.setFillStyle(0x95a5a6);
            this.autoPlayText.setText('AUTO');
            this.scene.ui.showMessage('Auto-Play désactivé', 1000);
        }
    }
    
    update() {
        // Si auto-play est activé et qu'on peut lancer la vague
        if (this.autoPlay && 
            this.scene.waveManager &&
            !this.scene.waveManager.waveInProgress && 
            this.scene.waveManager.enemiesRemainingInWave === 0 &&
            this.scene.enemies.length === 0) {
            
            // Lancer automatiquement la prochaine vague après un court délai
            if (!this.autoPlayTimer) {
                this.autoPlayTimer = this.scene.time.now;
            }
            
            if (this.scene.time.now > this.autoPlayTimer + 2000) {
                this.scene.waveManager.startNextWave();
                this.autoPlayTimer = null;
            }
        } else {
            this.autoPlayTimer = null;
        }
        
        // Désactiver le bouton pendant la vague
        if (this.scene.waveManager && this.scene.waveManager.waveInProgress) {
            this.startWaveButton.setAlpha(0.5);
            this.startWaveButton.disableInteractive();
        } else {
            this.startWaveButton.setAlpha(1);
            this.startWaveButton.setInteractive({ useHandCursor: true });
        }
    }
}

