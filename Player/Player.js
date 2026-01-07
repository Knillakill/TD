class Player {
    constructor() {
        this.hp = 10;
        this.gold = 100;
    }
    
    loseHp() {
        this.hp--;
        console.log("Base HP:", this.hp);
    }
}

