class MapRenderer {
    static drawPath(scene, path) {
        const graphics = scene.add.graphics();
        
        // Tracé du chemin (Sable/Pierre)
        graphics.lineStyle(25, 0xe1c16e, 1); // Chemin large couleur sable
        graphics.beginPath();
        graphics.moveTo(path[0].x, path[0].y);
        path.forEach(point => graphics.lineTo(point.x, point.y));
        graphics.strokePath();

        // Bordures du chemin
        graphics.lineStyle(2, 0xd4af37, 0.5); 
        graphics.strokePath();
        
        // Dessiner des points aux coins (Dalles)
        graphics.fillStyle(0xc0c0c0, 0.8);
        path.forEach(point => {
            graphics.fillCircle(point.x, point.y, 6);
        });
    }
    
    static drawGrid(scene, width, height, cellSize) {
        const graphics = scene.add.graphics();
        graphics.lineStyle(1, 0x333333, 0.5);
        
        // Lignes verticales
        for (let x = 0; x <= width; x += cellSize) {
            graphics.lineTo(x, 0);
            graphics.lineTo(x, height);
            graphics.moveTo(x + cellSize, 0);
        }
        
        // Lignes horizontales
        for (let y = 0; y <= height; y += cellSize) {
            graphics.lineTo(0, y);
            graphics.lineTo(width, y);
            graphics.moveTo(0, y + cellSize);
        }
        
        graphics.strokePath();
    }
}

