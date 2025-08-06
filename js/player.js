class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 3;
        this.color = '#3498db';
        
        // Player stats
        this.health = 100;
        this.maxHealth = 100;
        this.hunger = 100;
        this.maxHunger = 100;
        this.thirst = 100;
        this.maxThirst = 100;
        this.stamina = 100;
        this.maxStamina = 100;
        
        // Player state
        this.direction = 'down';
        this.moving = false;
        this.harvesting = false;
        this.attacking = false;
        this.harvestProgress = 0;
        this.attackCooldown = 0;
        
        // Inventory
        this.inventory = new Inventory(20); // 20 slots
    }
    
    update(keys, world) {
        // Reset movement
        this.moving = false;
        
        // Movement
        if (keys['w'] || keys['ArrowUp']) {
            this.y -= this.speed;
            this.direction = 'up';
            this.moving = true;
        }
        if (keys['s'] || keys['ArrowDown']) {
            this.y += this.speed;
            this.direction = 'down';
            this.moving = true;
        }
        if (keys['a'] || keys['ArrowLeft']) {
            this.x -= this.speed;
            this.direction = 'left';
            this.moving = true;
        }
        if (keys['d'] || keys['ArrowRight']) {
            this.x += this.speed;
            this.direction = 'right';
            this.moving = true;
        }
        
        // Keep player within bounds
        this.x = clamp(this.x, 0, world.width - this.width);
        this.y = clamp(this.y, 0, world.height - this.height);
        
        // Harvesting/Attacking
        if (keys[' '] && this.attackCooldown <= 0) {
            this.harvesting = true;
            this.attacking = true;
            this.attackCooldown = 30; // Half second cooldown at 60fps
            
            // Try to harvest or attack
            this.harvestOrAttack(world);
        } else {
            this.harvesting = false;
            this.attacking = false;
        }
        
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
        
        // Update stats
        this.updateStats();
    }
    
    updateStats() {
        // Decrease hunger over time
        if (game.frameCount % 300 === 0) { // Every 5 seconds at 60fps
            this.hunger = clamp(this.hunger - 1, 0, this.maxHunger);
            
            // Decrease health if hunger is too low
            if (this.hunger <= 0) {
                this.health = clamp(this.health - 2, 0, this.maxHealth);
            }
        }
        
        // Decrease thirst over time
        if (game.frameCount % 240 === 0) { // Every 4 seconds at 60fps
            this.thirst = clamp(this.thirst - 1, 0, this.maxThirst);
            
            // Decrease health if thirst is too low
            if (this.thirst <= 0) {
                this.health = clamp(this.health - 3, 0, this.maxHealth);
            }
        }
        
        // Regenerate stamina when not moving
        if (!this.moving && this.stamina < this.maxStamina) {
            this.stamina = clamp(this.stamina + 0.2, 0, this.maxStamina);
        }
        
        // Decrease stamina when moving
        if (this.moving) {
            this.stamina = clamp(this.stamina - 0.1, 0, this.maxStamina);
        }
        
        // Slowly regenerate health if hunger and thirst are above 70%
        if (this.hunger > 70 && this.thirst > 70 && this.health < this.maxHealth) {
            if (game.frameCount % 60 === 0) { // Every second
                this.health = clamp(this.health + 1, 0, this.maxHealth);
            }
        }
    }
    
    harvestOrAttack(world) {
        // Calculate harvest/attack area based on direction
        let harvestArea = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
        
        // Adjust harvest area based on direction
        switch (this.direction) {
            case 'up':
                harvestArea.y -= this.height;
                break;
            case 'down':
                harvestArea.y += this.height;
                break;
            case 'left':
                harvestArea.x -= this.width;
                break;
            case 'right':
                harvestArea.x += this.width;
                break;
        }
        
        // Check for resources to harvest
        for (let i = 0; i < world.resources.length; i++) {
            const resource = world.resources[i];
            if (rectCollision(harvestArea, resource)) {
                // Harvest the resource
                const harvested = resource.harvest();
                
                if (harvested) {
                    // Add to inventory
                    this.inventory.addItem(resource.type, resource.yield);
                    
                    // Remove resource if depleted
                    if (resource.health <= 0) {
                        world.resources.splice(i, 1);
                    }
                    
                    // Show message
                    game.ui.showMessage(`Harvested ${resource.type}`);
                    return;
                }
            }
        }
        
        // Check for entities to attack
        for (let i = 0; i < world.entities.length; i++) {
            const entity = world.entities[i];
            if (rectCollision(harvestArea, entity) && entity.hostile) {
                // Attack the entity
                entity.health -= 10;
                
                // Show message
                game.ui.showMessage(`Attacked ${entity.name}`);
                
                // Remove entity if dead
                if (entity.health <= 0) {
                    // Drop loot
                    if (entity.drops) {
                        for (const drop of entity.drops) {
                            if (Math.random() < drop.chance) {
                                this.inventory.addItem(drop.item, randomInt(drop.min, drop.max));
                                game.ui.showMessage(`Found ${drop.item}`);
                            }
                        }
                    }
                    
                    world.entities.splice(i, 1);
                }
                return;
            }
        }
    }
    
    draw(ctx) {
        // Draw player
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw direction indicator
        ctx.fillStyle = '#fff';
        switch (this.direction) {
            case 'up':
                ctx.fillRect(this.x + this.width/2 - 3, this.y - 5, 6, 5);
                break;
            case 'down':
                ctx.fillRect(this.x + this.width/2 - 3, this.y + this.height, 6, 5);
                break;
            case 'left':
                ctx.fillRect(this.x - 5, this.y + this.height/2 - 3, 5, 6);
                break;
            case 'right':
                ctx.fillRect(this.x + this.width, this.y + this.height/2 - 3, 5, 6);
                break;
        }
        
        // Draw harvesting/attacking indicator
        if (this.harvesting || this.attacking) {
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 2;
            
            let harvestArea = {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height
            };
            
            // Adjust harvest area based on direction
            switch (this.direction) {
                case 'up':
                    harvestArea.y -= this.height;
                    break;
                case 'down':
                    harvestArea.y += this.height;
                    break;
                case 'left':
                    harvestArea.x -= this.width;
                    break;
                case 'right':
                    harvestArea.x += this.width;
                    break;
            }
            
            ctx.strokeRect(harvestArea.x, harvestArea.y, harvestArea.width, harvestArea.height);
        }
    }
}
