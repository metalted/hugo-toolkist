var toolkist_playlist = (function($) {
    var toolkist_playlist = {};   

    toolkist_playlist.PlaylistLevel = class {
        constructor() {
            this.UID = "";
            this.WorkshopID = "";
            this.Name = "";
            this.Author = "";
        }
    }

    toolkist_playlist.Playlist = class {
        constructor() {
            this.name = "Toolkist Playlist";
            this.amountOfLevels = 0;
            this.roundLength = 360;
            this.shufflePlaylist = false;
            this.UID = [];
            this.levels = [];
        }

        shuffle() {
            let currentIndex = this.levels.length,
                randomIndex, temporaryValue;

            // While there remain elements to shuffle...
            while (currentIndex !== 0) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                // And swap it with the current element.
                temporaryValue = this.levels[currentIndex];
                this.levels[currentIndex] = this.levels[randomIndex];
                this.levels[randomIndex] = temporaryValue;
            }
        }

        addLevel(level) {
            this.levels.push(level);
            this.amountOfLevels = this.levels.length;
        }

        fromJSON(jsonString) {
            try {
                const jsonData = JSON.parse(jsonString);
        
                // Check if the parsed data has the expected structure
                if (
                    jsonData.name &&
                    jsonData.amountOfLevels !== undefined &&
                    jsonData.roundLength !== undefined &&
                    jsonData.shufflePlaylist !== undefined &&
                    Array.isArray(jsonData.UID) &&
                    Array.isArray(jsonData.levels)
                ) {
                    // Assign values from JSON to the Playlist object
                    this.name = jsonData.name;
                    this.amountOfLevels = jsonData.amountOfLevels;
                    this.roundLength = jsonData.roundLength;
                    this.shufflePlaylist = jsonData.shufflePlaylist;
                    this.UID = jsonData.UID;
        
                    // Clear existing levels and add levels from JSON
                    this.levels = [];
                    for (const levelData of jsonData.levels) {
                        const level = new toolkist_playlist.PlaylistLevel();
                        Object.assign(level, levelData);
                        this.addLevel(level);
                    }
                } else {
                    throw new Error("Invalid JSON structure");
                }
                return this; // Return the Playlist object
            } catch (error) {
                console.error("JSON parsing failed: " + error.message);
                return undefined;
            }
        }

        toJSON() {

            this.amountOfLevels = this.levels.length;

            return JSON.stringify({
                name: this.name,
                amountOfLevels: this.amountOfLevels,
                roundLength: this.roundLength,
                shufflePlaylist: this.shufflePlaylist,
                UID: this.UID,
                levels: this.levels.map(level => ({
                    UID: level.UID,
                    WorkshopID: level.WorkshopID,
                    Name: level.Name,
                    Author: level.Author
                }))
            }, null, 2);
        }
    }

    return toolkist_playlist;

})(jQuery);