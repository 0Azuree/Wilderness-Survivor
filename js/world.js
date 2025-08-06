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
            const hostileChance = isNight ?
