class Inventory {
    constructor(size) {
        this.size = size;
        this.items = [];
        
        // Initialize empty slots
        for (let i = 0; i < size; i++) {
            this.items.push({ item: null, count: 0 });
        }
    }
    
    addItem(item, count) {
        // First try to stack with existing items
        for (let i = 0; i < this.size; i++) {
            if (this.items[i].item === item) {
                this.items[i].count += count;
                return true;
            }
        }
        
        // Then try to find an empty slot
        for (let i = 0; i < this.size; i++) {
            if (this.items[i].item === null) {
                this.items[i].item = item;
                this.items[i].count = count;
                return true;
            }
        }
        
        // Inventory is full
        return false;
    }
    
    removeItem(item, count) {
        for (let i = 0; i < this.size; i++) {
            if (this.items[i].item === item) {
                if (this.items[i].count >= count) {
                    this.items[i].count -= count;
                    
                    if (this.items[i].count === 0) {
                        this.items[i].item = null;
                    }
                    
                    return true;
                }
            }
        }
        
        return false;
    }
    
    hasItem(item, count) {
        for (let i = 0; i < this.size; i++) {
            if (this.items[i].item === item && this.items[i].count >= count) {
                return true;
            }
        }
        return false;
    }
    
    getItemCount(item) {
        for (let i = 0; i < this.size; i++) {
            if (this.items[i].item === item) {
                return this.items[i].count;
            }
        }
        return 0;
    }
    
    useItem(index) {
        if (index < 0 || index >= this.size || this.items[index].item === null) {
            return false;
        }
        
        const item = this.items[index].item;
        
        // Handle different item types
        switch (item) {
            case 'berry':
            case 'cooked_meat':
                // Food items
                game.player.hunger = clamp(game.player.hunger + 20, 0, game.player.maxHunger);
                this.removeItem(item, 1);
                game.ui.showMessage(`Ate ${item}`);
                return true;
                
            case 'water':
            case 'water_bottle':
                // Drink items
                game.player.thirst = clamp(game.player.thirst + 30, 0, game.player.maxThirst);
                if (item === 'water_bottle') {
                    this.removeItem('water_bottle', 1);
                    this.addItem('bottle', 1);
                }
                game.ui.showMessage(`Drank ${item}`);
                return true;
                
            case 'wooden_axe':
            case 'stone_pickaxe':
            case 'bone_spear':
                // Tools and weapons
                game.player.equippedItem = item;
                game.ui.showMessage(`Equipped ${item}`);
                return true;
                
            case 'fur_armor':
                // Armor
                game.player.armor = 10;
                game.ui.showMessage(`Wore fur armor`);
                return true;
                
            default:
                return false;
        }
    }
}
