class UI {
    constructor() {
        this.messageLog = [];
        this.maxMessages = 5;
    }
    
    update() {
        // Update stat bars
        document.getElementById('health-bar').style.width = `${(game.player.health / game.player.maxHealth) * 100}%`;
        document.getElementById('hunger-bar').style.width = `${(game.player.hunger / game.player.maxHunger) * 100}%`;
        document.getElementById('thirst-bar').style.width = `${(game.player.thirst / game.player.maxThirst) * 100}%`;
        document.getElementById('stamina-bar').style.width = `${(game.player.stamina / game.player.maxStamina) * 100}%`;
        
        // Update time display
        const timeElement = document.getElementById('game-time');
        if (timeElement) {
            timeElement.textContent = `Time: ${game.world.getTimeString()}`;
        }
        
        // Update inventory display if open
        if (!document.getElementById('inventory').classList.contains('hidden')) {
            this.updateInventoryDisplay();
        }
        
        // Update crafting display if open
        if (!document.getElementById('crafting').classList.contains('hidden')) {
            this.updateCraftingDisplay();
        }
    }
    
    updateInventoryDisplay() {
        const inventoryGrid = document.getElementById('inventory-grid');
        inventoryGrid.innerHTML = '';
        
        for (let i = 0; i < game.player.inventory.size; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.index = i;
            
            if (game.player.inventory.items[i].item) {
                const itemIcon = document.createElement('div');
                itemIcon.className = 'item-icon';
                itemIcon.style.backgroundColor = this.getItemColor(game.player.inventory.items[i].item);
                slot.appendChild(itemIcon);
                
                const itemCount = document.createElement('div');
                itemCount.className = 'item-count';
                itemCount.textContent = game.player.inventory.items[i].count;
                slot.appendChild(itemCount);
                
                slot.addEventListener('click', () => {
                    game.player.inventory.useItem(i);
                    this.updateInventoryDisplay();
                });
            }
            
            inventoryGrid.appendChild(slot);
        }
    }
    
    updateCraftingDisplay() {
        const craftingRecipes = document.getElementById('crafting-recipes');
        craftingRecipes.innerHTML = '';
        
        const availableRecipes = game.craftingSystem.getAvailableRecipes(game.player.inventory);
        
        for (const recipe of game.craftingSystem.recipes) {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe';
            
            const recipeName = document.createElement('div');
            recipeName.className = 'recipe-name';
            recipeName.textContent = recipe.name;
            recipeElement.appendChild(recipeName);
            
            const recipeIngredients = document.createElement('div');
            recipeIngredients.className = 'recipe-ingredients';
            
            const ingredientsList = [];
            for (const [item, count] of Object.entries(recipe.ingredients)) {
                ingredientsList.push(`${item}: ${count}`);
            }
            
            recipeIngredients.textContent = ingredientsList.join(', ');
            recipeElement.appendChild(recipeIngredients);
            
            const recipeDescription = document.createElement('div');
            recipeDescription.className = 'recipe-description';
            recipeDescription.textContent = recipe.description;
            recipeElement.appendChild(recipeDescription);
            
            // Check if player can craft this
            const canCraft = availableRecipes.includes(recipe);
            
            if (canCraft) {
                recipeElement.style.borderColor = '#2ecc71';
                recipeElement.addEventListener('click', () => {
                    game.craftingSystem.craft(recipe, game.player.inventory);
                    this.updateCraftingDisplay();
                    this.showMessage(`Crafted ${recipe.name}`);
                });
            } else {
                recipeElement.style.borderColor = '#e74c3c';
                recipeElement.style.opacity = '0.7';
            }
            
            craftingRecipes.appendChild(recipeElement);
        }
    }
    
    showMessage(message) {
        this.messageLog.unshift({
            text: message,
            time: Date.now()
        });
        
        // Keep only the latest messages
        if (this.messageLog.length > this.maxMessages) {
            this.messageLog.pop();
        }
        
        this.updateMessageLog();
    }
    
    updateMessageLog() {
        const messageLogElement = document.getElementById('message-log');
        messageLogElement.innerHTML = '';
        
        for (const message of this.messageLog) {
            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.textContent = message.text;
            messageLogElement.appendChild(messageElement);
        }
    }
    
    getItemColor(item) {
        const colors = {
            'wood': '#27ae60',
            'stone': '#7f8c8d',
            'berry': '#e74c3c',
            'water': '#3498db',
            'meat': '#e67e22',
            'cooked_meat': '#d35400',
            'fur': '#ecf0f1',
            'bone': '#bdc3c7',
            'fang': '#2c3e50',
            'claw': '#34495e',
            'wooden_axe': '#8b4513',
            'stone_pickaxe': '#95a5a6',
            'campfire': '#e74c3c',
            'water_bottle': '#3498db',
            'shelter': '#7f8c8d',
            'fur_armor': '#ecf0f1',
            'bone_spear': '#bdc3c7',
            'bottle': '#3498db'
        };
        
        return colors[item] || '#ffffff';
    }
}
