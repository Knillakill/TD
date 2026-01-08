/**
 * Gère la collection de tours du joueur
 */
class PlayerCollection {
    constructor() {
        // Tours débloquées (disponibles à l'achat)
        this.unlockedTowers = new Set(['luffy']); // On commence avec Luffy
        
        // Tours dans l'équipement (disponibles pour placement)
        this.equippedTowers = new Set(['luffy']);
        
        // Système de slots d'équipement
        this.maxEquipped = 10; // Maximum 10 tours dans l'équipement
        this.unlockedSlots = 6; // 6 slots disponibles de base (dont Luffy)
        this.slotCost = 50; // Coût en étoiles pour débloquer un slot
        
        // Monnaie premium (étoiles)
        this.stars = 0;
        
        // Stats du joueur
        this.stats = {
            playTime: 0, // En secondes
            towersPlaced: 0,
            enemiesKilled: 0,
            wavesCompleted: 0,
            goldEarned: 0,
            goldSpent: 0,
            damageDealt: 0
        };
        
        // Stats des tours (dégâts infligés par chaque tour)
        this.towerStats = {};
        
        // Charger depuis localStorage
        this.load();
    }
    
    /**
     * Débloque une tour
     */
    unlockTower(towerId) {
        if (!this.unlockedTowers.has(towerId)) {
            this.unlockedTowers.add(towerId);
            this.save();
            return true;
        }
        return false;
    }
    
    /**
     * Équipe une tour
     */
    equipTower(towerId) {
        if (this.unlockedTowers.has(towerId)) {
            // Vérifier la limite d'équipement (selon les slots débloqués)
            if (this.equippedTowers.size >= this.unlockedSlots && !this.equippedTowers.has(towerId)) {
                return false; // Équipement plein (pas assez de slots débloqués)
            }
            this.equippedTowers.add(towerId);
            this.save();
            return true;
        }
        return false;
    }
    
    /**
     * Déséquipe une tour
     */
    unequipTower(towerId) {
        if (towerId !== 'luffy') { // Ne peut pas déséquiper Luffy
            this.equippedTowers.delete(towerId);
            this.save();
            return true;
        }
        return false;
    }
    
    /**
     * Vérifie si une tour est débloquée
     */
    isTowerUnlocked(towerId) {
        return this.unlockedTowers.has(towerId);
    }
    
    /**
     * Vérifie si une tour est équipée
     */
    isTowerEquipped(towerId) {
        return this.equippedTowers.has(towerId);
    }
    
    /**
     * Récupère toutes les tours débloquées
     */
    getUnlockedTowers() {
        return Array.from(this.unlockedTowers);
    }
    
    /**
     * Récupère toutes les tours équipées
     */
    getEquippedTowers() {
        return Array.from(this.equippedTowers);
    }
    
    /**
     * Vérifie si il y a de la place dans l'équipement
     */
    hasEquipmentSpace() {
        return this.equippedTowers.size < this.unlockedSlots;
    }
    
    /**
     * Récupère le nombre de places restantes
     */
    getEquipmentSpace() {
        return this.unlockedSlots - this.equippedTowers.size;
    }
    
    /**
     * Récupère le nombre de slots débloqués
     */
    getUnlockedSlots() {
        return this.unlockedSlots;
    }
    
    /**
     * Récupère le nombre de slots verrouillés
     */
    getLockedSlots() {
        return this.maxEquipped - this.unlockedSlots;
    }
    
    /**
     * Vérifie si on peut débloquer un nouveau slot
     */
    canUnlockSlot() {
        return this.unlockedSlots < this.maxEquipped && this.stars >= this.slotCost;
    }
    
    /**
     * Débloque un nouveau slot d'équipement
     */
    unlockSlot() {
        if (this.unlockedSlots >= this.maxEquipped) {
            return { success: false, reason: 'Tous les slots sont déjà débloqués' };
        }
        
        if (this.stars < this.slotCost) {
            return { success: false, reason: 'Pas assez d\'étoiles' };
        }
        
        this.stars -= this.slotCost;
        this.unlockedSlots++;
        this.save();
        return { success: true, unlockedSlots: this.unlockedSlots };
    }
    
    /**
     * Ajoute des étoiles
     */
    addStars(amount) {
        this.stars += amount;
        this.save();
    }
    
    /**
     * Récupère le nombre d'étoiles
     */
    getStars() {
        return this.stars;
    }
    
    /**
     * Met à jour les stats
     */
    updateStats(statName, value) {
        if (this.stats.hasOwnProperty(statName)) {
            this.stats[statName] += value;
            this.save();
        }
    }
    
    /**
     * Récupère les stats
     */
    getStats() {
        return { ...this.stats };
    }
    
    /**
     * Sauvegarde dans localStorage
     */
    save() {
        const data = {
            unlockedTowers: Array.from(this.unlockedTowers),
            equippedTowers: Array.from(this.equippedTowers),
            unlockedSlots: this.unlockedSlots,
            stars: this.stars,
            stats: this.stats,
            towerStats: this.towerStats
        };
        localStorage.setItem('onepiece_td_collection', JSON.stringify(data));
    }
    
    /**
     * Charge depuis localStorage
     */
    load() {
        try {
            const data = localStorage.getItem('onepiece_td_collection');
            if (data) {
                const parsed = JSON.parse(data);
                this.unlockedTowers = new Set(parsed.unlockedTowers || ['luffy']);
                this.equippedTowers = new Set(parsed.equippedTowers || ['luffy']);
                this.unlockedSlots = parsed.unlockedSlots || 6;
                this.stars = parsed.stars || 0;
                this.stats = { ...this.stats, ...parsed.stats };
                this.towerStats = parsed.towerStats || {};
            }
        } catch (e) {
            console.error('Erreur lors du chargement de la collection:', e);
        }
    }
    
    /**
     * Réinitialise la collection
     */
    reset() {
        this.unlockedTowers = new Set(['luffy']);
        this.equippedTowers = new Set(['luffy']);
        this.unlockedSlots = 6;
        this.stars = 0;
        this.stats = {
            playTime: 0,
            towersPlaced: 0,
            enemiesKilled: 0,
            wavesCompleted: 0,
            goldEarned: 0,
            goldSpent: 0,
            damageDealt: 0
        };
        this.towerStats = {};
        
        // Supprimer complètement le localStorage pour repartir à zéro
        localStorage.removeItem('onepiece_td_collection');
        console.log('[PlayerCollection] Collection réinitialisée et localStorage supprimé');
    }
}

