class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.keys = {};
        this.frameCount = 0;
        this.running = false;
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Initialize game components
        this.world = new World(this.canvas.width, this.canvas.height);
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.craftingSystem = new CraftingSystem();
        this.ui = new UI();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.start();
    }
    
    setupEventListeners() {
        // Keyboard input
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Handle special keys
            if (e.key.toLowerCase() === 'i') {
                this.toggleInventory();
            } else if (e.key.toLowerCase() === 'c') {
                this.toggleCrafting();
            } else if (e.key.toLowerCase() === 'e') {
                this.interact();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // UI buttons
        document.getElementById('close-inventory').addEventListener('click', () => {
            document.getElementById('inventory').classList.add('hidden');
        });
        
        document.getElementById('close-crafting').addEventListener('click', () => {
            document.getElementById('crafting').classList.add('hidden');
        });
    }
    
    toggleInventory() {
        const inventoryElement = document.getElementById('inventory');
        inventoryElement.classList.toggle('hidden');
        
        if (!inventoryElement.classList.contains('hidden')) {
            this.ui.updateInventoryDisplay();
        }
    }
    
    toggleCrafting() {
        const craftingElement = document.getElementById('crafting');
        craftingElement.classList.toggle('hidden');
        
        if (!craftingElement.classList.contains('hidden')) {
            this.ui.updateCraftingDisplay();
        }
    }
    
    interact() {
        // Check for water sources to drink from
        for (const resource of this.world.resources) {
            if (resource.type === 'water' && 
                distance(this.player.x, this.player.y, resource.x, resource.y) < 100) {
                this.player.thirst = clamp(this.player.thirst + 30, 0, this.player.maxThirst);
                this.ui.showMessage('Drank water from source');
                return;
            }
        }
        
        // Check for berries to eat directly
        for (const resource of this.world.resources) {
            if (resource.type === 'berry' && 
                distance(this.player.x, this.player.y, resource.x, resource.y) < 50) {
                this.player.hunger = clamp(this.player.hunger + 10, 0, this.player.maxHunger);
                resource.health -= 25;
                
                if (resource.health <= 0) {
                    const index = this.world.resources.indexOf(resource);
                    this.world.resources.splice(index, 1);
                }
                
                this.ui.showMessage('Ate berries');
                return;
            }
        }
    }
    
    start() {
        this.running = true;
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.running) return;
        
        // Update game state
        this.update();
        
        // Render game
        this.render();
        
        // Increment frame counter
        this.frameCount++;
        
        // Continue game loop
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update player
        this.player.update(this.keys, this.world);
        
        // Update world
        this.world.update();
        
        // Update UI
        this.ui.update();
        
        // Check game over conditions
        if (this.player.health <= 0) {
            this.gameOver();
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw world
        this.world.draw(this.ctx);
        
        // Draw player
        this.player.draw(this.ctx);
    }
    
    gameOver() {
        this.running = false;
        
        // Display game over screen
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('You survived for ' + Math.floor(this.frameCount / 60) + ' seconds', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.fillText('Refresh to play again', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    window.game = new Game();
});
