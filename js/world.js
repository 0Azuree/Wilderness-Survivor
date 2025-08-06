class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.resources = [];
        this.entities = [];
        this.timeOfDay = 0; // 0-2400 (24 hours in game time)
        this.dayDuration = 2400; // Game time for a full day
        this.timeSpeed = 1; // How fast time passes
        
        // Generate world
        this.generateResources();
    }
    
    generateResources() {
        // Generate trees
        for (let i = 0; i < 30; i++) {
            this.resources.push(new Resource(
                randomInt(50, this.width - 50),
                randomInt(50, this.height - 50),
                'wood',
                '#27ae60',
                40,
                40,
                3
            ));
        }
        
        // Generate stones
        for (let i = 0; i < 20; i++) {
            this.resources.push(new Resource(
                randomInt(50, this.width - 50),
                randomInt(50, this.height - 50),
                'stone',
                '#7f8c8d',
                30,
                30,
                2
            ));
        }
        
        // Generate berry bushes
        for (let i = 0; i < 15; i++) {
            this.resources.push(new Resource(
                randomInt(50, this.width - 50),
                randomInt(50, this.height - 50),
                'berry',
                '#e74c3c',
                25,
                25,
                2
            ));
        }
        
        // Generate water sources
        for (let i = 0; i < 5; i++) {
            this.resources.push(new Resource(
                randomInt(50, this.width - 50),
                randomInt(50, this.height - 50),
                'water',
                '#3498db',
                50,
                50,
                5
            ));
        }
    }
    
    update() {
        // Update time of day
        this.timeOfDay = (this.timeOfDay + this.timeSpeed) % this.dayDuration;
        
        // Spawn entities based on time of day
        if (game.frameCount % 600 === 0) { // Every 10 seconds
            // More hostile entities at night
            const isNight = this.timeOfDay > 1800 || this.timeOfDay < 600;
            const hostileChance = isNight ? 0.3 : 0.1;
            
            if (Math.random() < hostileChance) {
                // Spawn hostile entity
                const entityTypes = ['wolf', 'bear'];
                const type = entityTypes[randomInt(0, entityTypes.length - 1)];
                
                this.entities.push(new Entity(
                    randomInt(50, this.width - 50),
                    randomInt(50, this.height - 50),
                    type
                ));
            } else {
                // Spawn passive entity
                const entityTypes = ['rabbit', 'deer'];
                const type = entityTypes[randomInt(0, entityTypes.length - 1)];
                
                this.entities.push(new Entity(
                    randomInt(50, this.width - 50),
                    randomInt(50, this.height - 50),
                    type
                ));
            }
        }
        
        // Update entities
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const entity = this.entities[i];
            entity.update(game.player, this);
            
            // Remove entities that are too far from player
            if (distance(entity.x, entity.y, game.player.x, game.player.y) > 1000) {
                this.entities.splice(i, 1);
            }
        }
        
        // Respawn resources occasionally
        if (game.frameCount % 1200 === 0) { // Every 20 seconds
            if (this.resources.length < 50) {
                const resourceTypes = [
                    { type: 'wood', color: '#27ae60', width: 40, height: 40, yield: 3 },
                    { type: 'stone', color: '#7f8c8d', width: 30, height: 30, yield: 2 },
                    { type: 'berry', color: '#e74c3c', width: 25, height: 25, yield: 2 }
                ];
                
                const resourceType = resourceTypes[randomInt(0, resourceTypes.length - 1)];
                
                this.resources.push(new Resource(
                    randomInt(50, this.width - 50),
                    randomInt(50, this.height - 50),
                    resourceType.type,
                    resourceType.color,
                    resourceType.width,
                    resourceType.height,
                    resourceType.yield
                ));
            }
        }
    }
    
    draw(ctx) {
        // Draw background based on time of day
        const isNight = this.timeOfDay > 1800 || this.timeOfDay < 600;
        
        if (isNight) {
            // Night sky
            ctx.fillStyle = '#0c1445';
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Draw stars
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 100; i++) {
                const x = (i * 37) % this.width;
                const y = (i * 41) % this.height;
                ctx.fillRect(x, y, 1, 1);
            }
        } else {
            // Day sky
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, this.width, this.height);
        }
        
        // Draw ground
        ctx.fillStyle = isNight ? '#1a3d1a' : '#2a4d3a';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw resources
        for (const resource of this.resources) {
            resource.draw(ctx);
        }
        
        // Draw entities
        for (const entity of this.entities) {
            entity.draw(ctx);
        }
    }
    
    getTimeString() {
        const hours = Math.floor(this.timeOfDay / 100);
        const minutes = Math.floor((this.timeOfDay % 100) * 0.6);
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }
}

class Resource {
    constructor(x, y, type, color, width, height, yield) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        this.width = width;
        this.height = height;
        this.yield = yield;
        this.health = 100;
        this.maxHealth = 100;
    }
    
    harvest() {
        this.health -= 25;
        return this.health > 0;
    }
    
    draw(ctx) {
        // Draw resource
        ctx.fillStyle = this.color;
        
        if (this.type === 'wood') {
            // Draw tree
            ctx.fillRect(this.x + this.width/3, this.y + this.height/2, this.width/3, this.height/2);
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/3, this.width/2, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'stone') {
            // Draw rock
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'berry') {
            // Draw bush
            ctx.fillRect(this.x, this.y + this.height/2, this.width, this.height/2);
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/3, this.width/2, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'water') {
            // Draw water
            ctx.fillStyle = '#3498db';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Draw water ripples
            ctx.strokeStyle = '#2980b9';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/3, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw health bar if damaged
        if (this.health < this.maxHealth) {
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, this.y - 10, this.width, 5);
            
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(this.x, this.y - 10, this.width * (this.health / this.maxHealth), 5);
        }
    }
}

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
