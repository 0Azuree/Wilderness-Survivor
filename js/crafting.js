class CraftingSystem {
    constructor() {
        this.recipes = [
            {
                name: 'Wooden Axe',
                ingredients: { wood: 3, stone: 1 },
                result: { item: 'wooden_axe', count: 1 },
                description: 'A basic tool for harvesting wood'
            },
            {
                name: 'Stone Pickaxe',
                ingredients: { wood: 2, stone: 3 },
                result: { item: 'stone_pickaxe', count: 1 },
                description: 'A tool for mining stone'
            },
            {
                name: 'Campfire',
                ingredients: { wood: 5, stone: 2 },
                result: { item: 'campfire', count: 1 },
                description: 'Provides warmth and light'
            },
            {
                name: 'Cooked Meat',
                ingredients: { meat: 1 },
                result: { item: 'cooked_meat', count: 1 },
                description: 'Restores more hunger than raw meat'
            },
            {
                name: 'Water Bottle',
                ingredients: { wood: 1, fur: 1 },
                result: { item: 'water_bottle', count: 1 },
                description: 'Allows you to carry water'
            },
            {
                name: 'Basic Shelter',
                ingredients: { wood: 10, stone: 5 },
                result: { item: 'shelter', count: 1 },
                description: 'Protects from weather and hostile creatures'
            },
            {
                name: 'Fur Armor',
                ingredients: { fur: 5 },
                result: { item: 'fur_armor', count: 1 },
                description: 'Provides protection from attacks'
            },
            {
                name: 'Bone Spear',
                ingredients: { wood: 2, bone: 2 },
                result: { item: 'bone_spear', count: 1 },
                description: 'A basic weapon for hunting'
            }
        ];
    }
    
    canCraft(recipe, inventory) {
        for (const [item, required] of Object.entries(recipe.ingredients)) {
            if (!inventory.hasItem(item, required)) {
                return false;
            }
        }
        return true;
    }
    
    craft(recipe, inventory) {
        if (!this.canCraft(recipe, inventory)) {
            return false;
        }
        
        // Remove ingredients
        for (const [item, required] of Object.entries(recipe.ingredients)) {
            inventory.removeItem(item, required);
        }
        
        // Add result
        inventory.addItem(recipe.result.item, recipe.result.count);
        
        return true;
    }
    
    getAvailableRecipes(inventory) {
        return this.recipes.filter(recipe => this.canCraft(recipe, inventory));
    }
}
