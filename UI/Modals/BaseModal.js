/**
 * Classe de base pour toutes les modals
 */
class BaseModal {
    constructor(scene, topMenu, title, width = 900, height = 600) {
        this.scene = scene;
        this.topMenu = topMenu;
        this.title = title;
        this.width = width;
        this.height = height;
        
        // Centre de l'écran (zone de jeu)
        this.x = 300 + (1100 / 2); // Centre de la zone de jeu
        this.y = 400; // Centre vertical
        
        this.elements = [];
        
        this.create();
    }
    
    create() {
        // Overlay sombre
        const overlay = this.scene.add.rectangle(
            850, 400,
            1700, 800,
            0x000000,
            0.7
        );
        overlay.setDepth(2000);
        overlay.setInteractive();
        overlay.on('pointerdown', () => {
            this.topMenu.closeModal();
        });
        this.elements.push(overlay);
        
        // Fond de la modal
        const bg = this.scene.add.rectangle(
            this.x, this.y,
            this.width, this.height,
            0x1a1a2e,
            0.98
        );
        bg.setDepth(2001);
        bg.setStrokeStyle(3, 0x3d5a80, 1);
        this.elements.push(bg);
        
        // Titre
        const titleText = this.scene.add.text(
            this.x,
            this.y - this.height / 2 + 30,
            this.title,
            {
                fontSize: '28px',
                fontFamily: 'Arial',
                color: '#ffd700',
                fontStyle: 'bold'
            }
        );
        titleText.setOrigin(0.5);
        titleText.setDepth(2002);
        this.elements.push(titleText);
        
        // Bouton de fermeture
        const closeBtn = this.scene.add.text(
            this.x + this.width / 2 - 30,
            this.y - this.height / 2 + 30,
            '✕',
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#ff4444',
                fontStyle: 'bold'
            }
        );
        closeBtn.setOrigin(0.5);
        closeBtn.setDepth(2003);
        closeBtn.setInteractive({ useHandCursor: true });
        closeBtn.on('pointerover', () => closeBtn.setColor('#ff0000'));
        closeBtn.on('pointerout', () => closeBtn.setColor('#ff4444'));
        closeBtn.on('pointerdown', () => this.topMenu.closeModal());
        this.elements.push(closeBtn);
        
        // Zone de contenu
        this.contentY = this.y - this.height / 2 + 80;
        this.contentHeight = this.height - 120;
    }
    
    addElement(element) {
        this.elements.push(element);
    }
    
    destroy() {
        this.elements.forEach(el => {
            if (el && el.destroy) {
                el.destroy();
            }
        });
        this.elements = [];
    }
}

