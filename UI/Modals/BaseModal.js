/**
 * Classe de base pour toutes les modals - Design moderne One Piece
 */
class BaseModal {
    constructor(scene, topMenu, title, width = 900, height = 600) {
        this.scene = scene;
        this.topMenu = topMenu;
        this.title = title;
        this.width = width;
        this.height = height;
        
        // Centre de l'écran (zone de jeu)
        this.x = 300 + (1100 / 2); // Centre de la zone de jeu (300 = offset map)
        this.y = 400; // Centre vertical
        
        // Palette de couleurs thème One Piece
        this.colors = {
            primary: 0x1a1a2e,      // Fond principal
            secondary: 0x16213e,    // Fond secondaire
            accent: 0xd4af37,       // Or (accent principal)
            accentLight: 0xffd700,  // Or clair
            border: 0x2d4a6f,       // Bordure
            borderLight: 0x4a6fa5,  // Bordure claire
            success: 0x2ecc71,      // Vert succès
            danger: 0xe74c3c,       // Rouge danger
            text: 0xf0f0f0,         // Texte principal
            textMuted: 0x8892a0,    // Texte grisé
            highlight: 0x0891b2     // Cyan highlight
        };
        
        this.elements = [];
        
        this.create();
    }
    
    create() {
        // Overlay sombre avec effet blur simulé
        const overlay = this.scene.add.rectangle(
            850, 400,
            1700, 800,
            0x000000,
            0.85
        );
        overlay.setDepth(2000);
        overlay.setInteractive();
        overlay.on('pointerdown', () => {
            this.topMenu.closeModal();
        });
        this.elements.push(overlay);
        
        // Ombre de la modal
        const shadow = this.scene.add.rectangle(
            this.x + 8, this.y + 8,
            this.width, this.height,
            0x000000,
            0.5
        );
        shadow.setDepth(2000);
        this.elements.push(shadow);
        
        // Fond de la modal avec dégradé simulé
        const bgOuter = this.scene.add.rectangle(
            this.x, this.y,
            this.width + 4, this.height + 4,
            this.colors.border,
            1
        );
        bgOuter.setDepth(2001);
        this.elements.push(bgOuter);
        
        const bg = this.scene.add.rectangle(
            this.x, this.y,
            this.width, this.height,
            this.colors.primary,
            1
        );
        bg.setDepth(2001);
        // Rendre le fond interactif pour bloquer les clics (empêcher la fermeture)
        bg.setInteractive();
        bg.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation();
        });
        this.elements.push(bg);
        
        // Barre de titre avec effet brillant
        const titleBar = this.scene.add.rectangle(
            this.x, this.y - this.height / 2 + 35,
            this.width - 20, 50,
            this.colors.secondary,
            1
        );
        titleBar.setDepth(2002);
        this.elements.push(titleBar);
        
        // Ligne dorée sous le titre
        const titleLine = this.scene.add.rectangle(
            this.x, this.y - this.height / 2 + 62,
            this.width - 40, 2,
            this.colors.accent,
            0.8
        );
        titleLine.setDepth(2002);
        this.elements.push(titleLine);
        
        // Coins décoratifs
        this.createCornerDecoration(this.x - this.width / 2 + 15, this.y - this.height / 2 + 15, 0);
        this.createCornerDecoration(this.x + this.width / 2 - 15, this.y - this.height / 2 + 15, 90);
        this.createCornerDecoration(this.x - this.width / 2 + 15, this.y + this.height / 2 - 15, 270);
        this.createCornerDecoration(this.x + this.width / 2 - 15, this.y + this.height / 2 - 15, 180);
        
        // Titre avec style amélioré
        const titleText = this.scene.add.text(
            this.x,
            this.y - this.height / 2 + 35,
            this.title,
            {
                fontSize: '26px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#d4af37',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2
            }
        );
        titleText.setOrigin(0.5);
        titleText.setDepth(2003);
        this.elements.push(titleText);
        
        // Bouton de fermeture amélioré
        const closeBtnBg = this.scene.add.circle(
            this.x + this.width / 2 - 35,
            this.y - this.height / 2 + 35,
            18,
            0xe74c3c,
            0.9
        );
        closeBtnBg.setDepth(2003);
        closeBtnBg.setStrokeStyle(2, 0xffffff, 0.3);
        closeBtnBg.setInteractive({ useHandCursor: true });
        closeBtnBg.on('pointerover', () => {
            closeBtnBg.setFillStyle(0xff6b6b, 1);
            closeBtnBg.setScale(1.1);
        });
        closeBtnBg.on('pointerout', () => {
            closeBtnBg.setFillStyle(0xe74c3c, 0.9);
            closeBtnBg.setScale(1);
        });
        closeBtnBg.on('pointerdown', () => this.topMenu.closeModal());
        this.elements.push(closeBtnBg);
        
        const closeBtn = this.scene.add.text(
            this.x + this.width / 2 - 35,
            this.y - this.height / 2 + 34,
            '✕',
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        );
        closeBtn.setOrigin(0.5);
        closeBtn.setDepth(2004);
        this.elements.push(closeBtn);
        
        // Zone de contenu
        this.contentY = this.y - this.height / 2 + 90;
        this.contentHeight = this.height - 120;
    }
    
    createCornerDecoration(x, y, angle) {
        const corner = this.scene.add.graphics();
        corner.lineStyle(2, this.colors.accent, 0.8);
        corner.beginPath();
        corner.moveTo(0, 12);
        corner.lineTo(0, 0);
        corner.lineTo(12, 0);
        corner.stroke();
        corner.setPosition(x, y);
        corner.setAngle(angle);
        corner.setDepth(2003);
        this.elements.push(corner);
    }
    
    // Créer un bouton stylisé
    createButton(x, y, width, height, text, color, onClick) {
        const btnBg = this.scene.add.rectangle(x, y, width, height, color, 0.9);
        btnBg.setDepth(2002);
        btnBg.setStrokeStyle(2, 0xffffff, 0.3);
        btnBg.setInteractive({ useHandCursor: true });
        this.addElement(btnBg);
        
        const btnText = this.scene.add.text(x, y, text, {
            fontSize: '16px',
            fontFamily: "'Segoe UI', Arial, sans-serif",
            color: '#ffffff',
            fontStyle: 'bold'
        });
        btnText.setOrigin(0.5);
        btnText.setDepth(2003);
        this.addElement(btnText);
        
        const hoverColor = Phaser.Display.Color.IntegerToColor(color);
        hoverColor.brighten(20);
        
        btnBg.on('pointerover', () => {
            btnBg.setFillStyle(hoverColor.color, 1);
            btnBg.setScale(1.02);
        });
        btnBg.on('pointerout', () => {
            btnBg.setFillStyle(color, 0.9);
            btnBg.setScale(1);
        });
        btnBg.on('pointerdown', onClick);
        
        return { bg: btnBg, text: btnText };
    }
    
    // Créer une section avec titre
    createSection(y, title, iconEmoji = '') {
        const sectionBg = this.scene.add.rectangle(
            this.x, y + 15,
            this.width - 60, 35,
            this.colors.secondary,
            0.8
        );
        sectionBg.setDepth(2002);
        this.addElement(sectionBg);
        
        const sectionTitle = this.scene.add.text(
            this.x - this.width / 2 + 50, y + 15,
            `${iconEmoji} ${title}`,
            {
                fontSize: '18px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#d4af37',
                fontStyle: 'bold'
            }
        );
        sectionTitle.setOrigin(0, 0.5);
        sectionTitle.setDepth(2003);
        this.addElement(sectionTitle);
        
        return y + 45;
    }
    
    // Créer une carte/panneau
    createCard(x, y, width, height, highlighted = false) {
        const card = this.scene.add.rectangle(
            x, y, width, height,
            this.colors.secondary,
            0.9
        );
        card.setDepth(2002);
        card.setStrokeStyle(2, highlighted ? this.colors.accent : this.colors.border, highlighted ? 1 : 0.5);
        this.addElement(card);
        return card;
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
