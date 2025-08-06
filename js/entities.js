class Entity {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 30;
        this.height = 30;
        this.speed = 1;
        this.direction = randomInt(0, 3); // 0: up, 1: right, 2: down, 3: left
        this.moveCounter = 0;
        this.moveInterval = randomInt(30, 120);
        this.hostile = false;
        this.health = 50;
        this.maxHealth = 50;
        this.drops = [];
        
        // Set properties based on type
        switch (type) {
            case 'rabbit':
                this.color = '#f5f5f5';
                this.speed = 2;
                this.hostile = false;
                this.health = 20;
                this.maxHealth = 20;
                this.drops = [
                    { item: 'meat', chance: 0.8, min: 1, max: 2 },
                    { item: 'fur', chance: 0.5, min: 1, max: 1 }
                ];
                break;
            case 'deer':
                this.color = '#8B4513';
                this.width = 40;
                this.height = 40;
                this.speed = 1.5;
                this.hostile = false;
                this.health = 40;
                this.maxHealth = 40;
                this.drops = [
                    { item: 'meat', chance: 0.9, min: 2, max: 4 },
                    { item: 'fur', chance: 0.7, min: 1, max: 2 }
                ];
                break;
            case 'wolf':
                this.color = '#696969';
                this.speed = 2.5;
                this.hostile = true;
                this.health = 60;
                this.maxHealth = 60;
                this.drops = [
                    { item: 'meat', chance: 0.9, min: 1, max: 3 },
                    { item: 'fang', chance: 0.3, min: 1, max: 1 }
                ];
                break;
            case 'bear':
                this.color = '#654321';
                this.width = 50;
                this.height = 50;
                this.speed = 1.8;
                this.hostile = true;
                this.health = 100;
                this.maxHealth = 100;
                this.drops = [
                    { item: 'meat', chance: 1, min: 3, max: 5 },
                    { item: 'fur', chance: 0.8, min: 2, max: 3 },
                    { item: 'claw', chance: 0.4, min: 1, max: 2 }
                ];
                break;
        }
    }
    
    update(player, world) {
        // Move entity
        this.moveCounter++;
        
        if (this.moveCounter >= this.moveInterval) {
            this.moveCounter = 0;
            this.moveInterval = randomInt(30, 120);
            
            // Change direction randomly or based on player
            if (this.hostile && distance(this.x, this.y, player.x, player.y) < 300) {
                // Move towards player
                if (player.x < this.x) this.direction = 3; // left
                else if (player.x > this.x) this.direction = 1; // right
                else if (player.y < this.y) this.direction = 0; // up
                else if (player.y > this.y) this.direction = 2; // down
            } else {
                // Random direction
                this.direction = randomInt(0, 3);
            }
        }
        
        // Move in current direction
        switch (this.direction) {
            case 0: // up
                this.y -= this.speed;
                break;
            case 1: // right
                this.x += this.speed;
                break;
            case 2: // down
                this.y += this.speed;
                break;
            case 3: // left
                this.x -= this.speed;
                break;
        }
        
        // Keep within bounds
        this.x = clamp(this.x, 0, world.width - this.width);
        this.y = clamp(this.y, 0, world.height - this.height);
        
        // Attack player if hostile and close enough
        if (this.hostile && distance(this.x, this.y, player.x, player.y) < 50) {
            if (game.frameCount % 60 === 0) { // Every second
                player.health -= 10;
                game.ui.showMessage(`Attacked by ${this.type}!`);
            }
        }
    }
    
    draw(ctx) {
        // Draw entity
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw eyes
        ctx.fillStyle = '#000';
        const eyeSize = 4;
        const eyeOffsetX = this.width / 4;
        const eyeOffsetY = this.height / 4;
        
        switch (this.direction) {
            case 0: // up
                ctx.fillRect(this.x + eyeOffsetX, this.y + eyeOffsetY, eyeSize, eyeSize);
                ctx.fillRect(this.x + this.width - eyeOffsetX - eyeSize, this.y + eyeOffsetY, eyeSize, eyeSize);
                break;
            case 1: // right
                ctx.fillRect(this.x + this.width - eyeOffsetX - eyeSize, this.y + eyeOffsetY, eyeSize, eyeSize);
                ctx.fillRect(this.x + this.width - eyeOffsetX - eyeSize, this.y + this.height - eyeOffsetY - eyeSize, eyeSize, eyeSize);
                break;
            case 2: // down
                ctx.fillRect(this.x + eyeOffsetX, this.y + this.height - eyeOffsetY - eyeSize, eyeSize, eyeSize);
                ctx.fillRect(this.x + this.width - eyeOffsetX - eyeSize, this.y + this.height - eyeOffsetY - eyeSize, eyeSize, eyeSize);
                break;
            case 3: // left
                ctx.fillRect(this.x + eyeOffsetX, this.y + eyeOffsetY, eyeSize, eyeSize);
                ctx.fillRect(this.x + eyeOffsetX, this.y + this.height - eyeOffsetY - eyeSize, eyeSize, eyeSize);
                break;
        }
        
        // Draw health bar if damaged
        if (this.health < this.maxHealth) {
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, this.y - 10, this.width, 5);
            
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(this.x, this.y - 10, this.width * (this.health / this.maxHealth), 5);
        }
        
        // Draw hostile indicator
        if (this.hostile) {
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y - 15, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
