# 🏴‍☠️ Système d'Ennemis - Pirates

## Types d'ennemis disponibles

### 1. 🟤 Pirate Basique (`pirate_basic`)
- **HP**: 5
- **Vitesse**: 60
- **Récompense**: 10 gold
- **Couleur**: Marron
- **Description**: Pirate standard, équilibré

### 2. ⚪ Pirate Blindé (`pirate_shield`)
- **HP**: 15 (3x plus résistant!)
- **Vitesse**: 40 (plus lent)
- **Récompense**: 20 gold
- **Couleur**: Gris métallique
- **Effet visuel**: Cercle de bouclier autour
- **Description**: Tank - Difficile à tuer mais lent

### 3. 🔴 Pirate Rapide (`pirate_fast`)
- **HP**: 3 (fragile)
- **Vitesse**: 100 (très rapide!)
- **Récompense**: 15 gold
- **Couleur**: Rouge-orange
- **Effet visuel**: Traînée de vitesse derrière
- **Description**: Speedster - Traverse vite le chemin

## Distribution par vague

### Vagues prédéfinies (1-5)
- **Vague 1**: 5 pirates basiques (introduction)
- **Vague 2**: 3 basiques + 2 rapides
- **Vague 3**: 3 basiques + 1 blindé + 1 rapide (mix)
- **Vague 4**: 3 rapides + 1 blindé + 1 basique
- **Vague 5**: 2 blindés + 2 rapides + 1 basique (difficile)

### Vagues 6-7
- Mix équilibré automatique
- 50% basiques, 25% rapides, 25% blindés

### Vagues 8+
- Génération plus difficile
- 30% basiques, 35% rapides, 35% blindés
- Plus d'ennemis par vague (+2 par vague)

## Effets visuels

### Barre de vie
- Largeur adaptée aux HP (blindés = barre plus large)
- Fond noir transparent
- Couleurs: Vert → Jaune → Rouge

### Effets de dégâts
- Flash rouge quand touché
- Durée: 100ms

### Effets spéciaux
- **Blindé**: Cercle de bouclier gris autour
- **Rapide**: Traînée orange en mouvement

## Ajouter un nouveau type d'ennemi

### 1. Dans `EnemyConfig.js`

```javascript
pirate_boss: {
    id: 'pirate_boss',
    name: 'Captain Pirate',
    hp: 50,
    speed: 30,
    color: 0x8B0000, // Rouge foncé
    size: 15,
    reward: 100,
    description: 'Boss de fin de vague'
}
```

### 2. Dans `Enemy.js` (optionnel)

Ajouter un effet visuel spécial dans `createVisualEffects()`:

```javascript
else if (this.type === 'pirate_boss') {
    // Couronne de boss
    this.crown = this.scene.add.text(
        this.sprite.x, 
        this.sprite.y - 20, 
        '👑', 
        { fontSize: '16px' }
    );
    this.crown.setOrigin(0.5);
    this.crown.setDepth(8);
}
```

N'oubliez pas de mettre à jour la position dans `update()` et de détruire dans `destroy()` !

## Stratégies de gameplay

### Contre les Basiques
- N'importe quelle tour fonctionne
- Priorité moyenne

### Contre les Blindés
- Utiliser **Franky** ou **Zoro** (dégâts élevés)
- Plusieurs tours focusées
- Priorité haute!

### Contre les Rapides
- Utiliser **Sanji** ou **Brook** (cadence rapide)
- Placer les tours tôt sur le chemin
- Priorité haute si peu de HP base restants

## Notes techniques

- Les ennemis sont instanciés avec `new Enemy(scene, path, type)`
- Le WaveManager gère la distribution automatiquement
- Récompenses variables selon la difficulté
- Profondeur d'affichage: 4-7 (ennemis et barres)

