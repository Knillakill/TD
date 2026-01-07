# 🎨 Guide pour ajouter des sprites de personnages One Piece

## Structure actuelle
Pour l'instant, les personnages sont représentés par des **carrés colorés** dans `TowerConfig.js`.

## Comment ajouter des sprites

### 1. Préparer les sprites
- Taille recommandée : **64x64 pixels** ou **128x128 pixels**
- Format : PNG avec transparence
- Nommer les fichiers : `luffy.png`, `zoro.png`, `nami.png`, etc.
- Placer les fichiers dans un dossier : `assets/characters/`

### 2. Charger les sprites dans GameScene.js

Ajouter dans la méthode `preload()` :

```javascript
preload() {
    // Charger les sprites des personnages
    this.load.image('luffy', 'assets/characters/luffy.png');
    this.load.image('zoro', 'assets/characters/zoro.png');
    this.load.image('nami', 'assets/characters/nami.png');
    this.load.image('sanji', 'assets/characters/sanji.png');
    this.load.image('robin', 'assets/characters/robin.png');
    this.load.image('franky', 'assets/characters/franky.png');
    this.load.image('chopper', 'assets/characters/chopper.png');
    this.load.image('brook', 'assets/characters/brook.png');
}
```

### 3. Modifier TowerMenu.js

Remplacer dans `createTowerButton()` :

```javascript
// Remplacer cette ligne :
const icon = this.scene.add.rectangle(20, yPos, 40, 40, towerData.color);

// Par :
const icon = this.scene.add.image(20, yPos, towerId);
icon.setDisplaySize(40, 40);
```

### 4. Modifier Tower.js

Remplacer dans le `constructor` :

```javascript
// Remplacer cette ligne :
this.sprite = scene.add.rectangle(x, y, 20, 20, this.color);

// Par :
this.sprite = scene.add.image(x, y, type);
this.sprite.setDisplaySize(50, 50);
```

### 5. Modifier le drag and drop dans TowerMenu.js

Dans `startDrag()` :

```javascript
// Remplacer :
this.dragSprite = this.scene.add.rectangle(pointer.x, pointer.y, 40, 40, towerData.color, 0.8);

// Par :
this.dragSprite = this.scene.add.image(pointer.x, pointer.y, towerId);
this.dragSprite.setDisplaySize(50, 50);
this.dragSprite.setAlpha(0.7);
```

## Sprites recommandés

Pour un style cohérent One Piece :
- Style manga/anime
- Poses dynamiques
- Fond transparent
- Couleurs vives

## Ressources

- [OpenGameArt](https://opengameart.org/)
- [Itch.io](https://itch.io/game-assets/free)
- Créer vos propres sprites avec **Aseprite** ou **Piskel**

## Note

Le système est déjà **100% prêt** pour les sprites. Il suffit de remplacer les rectangles par des images !

