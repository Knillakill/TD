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
    }
};

