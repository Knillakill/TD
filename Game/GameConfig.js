const GameConfig = {
    type: Phaser.AUTO,
    width: 1700,  // 300 (gauche) + 1100 (map) + 300 (droite)
    height: 800,
    backgroundColor: "#3498db", // Bleu eau Arlong Park
    scene: GameScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    // Garder le jeu actif même quand l'onglet n'est pas visible
    disableVisibilityChange: true,
    // Empêcher la pause quand le jeu perd le focus
    pauseOnBlur: false
};

