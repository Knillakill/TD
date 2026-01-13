/**
 * Menu horizontal en haut de l'écran avec plusieurs onglets
 */
class TopMenu {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        
        // Position du menu (au-dessus des contrôles de vagues)
        this.x = 300; // Début de la zone de jeu
        this.y = 10;
        this.width = 1100; // Largeur de la zone de jeu
        this.height = 50;
        
        // Onglets
        this.tabs = [
            { id: 'stats', label: 'STATS', icon: '📊' },
            { id: 'pokedex', label: 'COLLECTION', icon: '📚' },
            { id: 'shop', label: 'BOUTIQUE', icon: '🛒' },
            { id: 'maps', label: 'MAPS', icon: '🗺️' },
            { id: 'settings', label: 'RÉGLAGES', icon: '⚙️' },
            { id: 'profile', label: 'PROFIL', icon: '👤' }
        ];
        
        this.activeTab = null;
        this.tabButtons = [];
        
        // Modals pour chaque onglet
        this.activeModal = null;
        
        this.create();
    }
    
    create() {
        // Fond du menu
        const bg = this.scene.add.rectangle(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width,
            this.height,
            0x1a1a2e,
            0.95
        );
        bg.setDepth(1000);
        bg.setStrokeStyle(2, 0x3d5a80, 1);
        
        // Créer les boutons d'onglets
        const tabWidth = this.width / this.tabs.length;
        
        this.tabs.forEach((tab, index) => {
            const x = this.x + index * tabWidth + tabWidth / 2;
            const y = this.y + this.height / 2;
            
            // Bouton
            const button = this.scene.add.rectangle(
                x, y,
                tabWidth - 4,
                this.height - 4,
                0x16213e,
                0.8
            );
            button.setDepth(1001);
            button.setStrokeStyle(1, 0x3d5a80, 0.5);
            button.setInteractive({ useHandCursor: true });
            
            // Icône + Texte
            const label = this.scene.add.text(
                x, y,
                `${tab.icon} ${tab.label}`,
                {
                    fontSize: '14px',
                    fontFamily: 'Arial',
                    color: '#e0e0e0',
                    fontStyle: 'bold'
                }
            );
            label.setOrigin(0.5);
            label.setDepth(1002);
            
            // Événements
            button.on('pointerover', () => {
                if (this.activeTab !== tab.id) {
                    button.setFillStyle(0x233a5a, 0.9);
                    label.setColor('#ffffff');
                }
            });
            
            button.on('pointerout', () => {
                if (this.activeTab !== tab.id) {
                    button.setFillStyle(0x16213e, 0.8);
                    label.setColor('#e0e0e0');
                }
            });
            
            button.on('pointerdown', () => {
                this.openTab(tab.id);
            });
            
            this.tabButtons.push({
                tab: tab,
                button: button,
                label: label
            });
        });
    }
    
    openTab(tabId) {
        // Fermer la modal active si elle existe
        if (this.activeModal) {
            this.closeModal();
        }
        
        // Réinitialiser l'apparence des onglets
        this.tabButtons.forEach(({ tab, button, label }) => {
            if (tab.id === tabId) {
                button.setFillStyle(0x3d5a80, 1);
                label.setColor('#ffd700');
            } else {
                button.setFillStyle(0x16213e, 0.8);
                label.setColor('#e0e0e0');
            }
        });
        
        this.activeTab = tabId;
        
        // Ouvrir la modal correspondante
        switch(tabId) {
            case 'stats':
                this.openStatsModal();
                break;
            case 'pokedex':
                this.openPokedexModal();
                break;
            case 'shop':
                this.openShopModal();
                break;
            case 'maps':
                this.openMapsModal();
                break;
            case 'settings':
                this.openSettingsModal();
                break;
            case 'profile':
                this.openProfileModal();
                break;
        }
    }
    
    closeModal() {
        if (this.activeModal) {
            this.activeModal.destroy();
            this.activeModal = null;
        }
        
        // Réinitialiser l'onglet actif
        this.tabButtons.forEach(({ button, label }) => {
            button.setFillStyle(0x16213e, 0.8);
            label.setColor('#e0e0e0');
        });
        
        this.activeTab = null;
    }
    
    openStatsModal() {
        // Afficher les stats dans le panneau de gauche au lieu d'une modale
        if (this.scene.enemyInfoPanel) {
            // Basculer le mode stats
            if (this.scene.enemyInfoPanel.towerStatsMode) {
                // Si déjà en mode stats, fermer
                this.scene.enemyInfoPanel.hideTowerStats();
                this.closeModal();
            } else {
                // Ouvrir le mode stats de combat
                this.scene.enemyInfoPanel.showCombatStats();
            }
        }
        // Pas de modale à stocker, mais on garde l'onglet actif visuellement
        this.activeModal = null;
    }
    
    openPokedexModal() {
        this.activeModal = new PokedexModal(this.scene, this, this.player);
    }
    
    openShopModal() {
        this.activeModal = new ShopModal(this.scene, this, this.player);
    }
    
    openMapsModal() {
        this.activeModal = new MapsModal(this.scene, this);
    }
    
    openSettingsModal() {
        this.activeModal = new SettingsModal(this.scene, this);
    }
    
    openProfileModal() {
        this.activeModal = new ProfileModal(this.scene, this, this.player);
    }
    
    destroy() {
        this.tabButtons.forEach(({ button, label }) => {
            button.destroy();
            label.destroy();
        });
        
        if (this.activeModal) {
            this.activeModal.destroy();
        }
    }
}

