var toolkist = (function($) {
    var toolkist = {};
    toolkist.Header = class {
        constructor() {
            this.sceneName = "";
            this.playerName = "";
            this.uniqueID = "";
            this.cameraXPos = 0;
            this.cameraYPos = 0;
            this.cameraZPos = 0;
            this.cameraXEuler = 0;
            this.cameraYEuler = 0;
            this.cameraZEuler = 0;
            this.cameraXRot = 0;
            this.cameraYRot = 0;
            this.validationTime = "";
            this.goldTime = 0;
            this.silverTime = 0;
            this.bronzeTime = 0;
            this.skybox = 0;
            this.ground = 3;
        }

        toCSV() {
            return `${this.sceneName},${this.playerName},${this.uniqueID}\n${this.cameraXPos},${this.cameraYPos},${this.cameraZPos},${this.cameraXEuler},${this.cameraYEuler},${this.cameraZEuler},${this.cameraXRot},${this.cameraYRot}\n${this.validationTime},${this.goldTime},${this.silverTime},${this.bronzeTime},${this.skybox},${this.ground}`;
        }

        fromCSV(lines) {
            const headerLine = lines[0].split(",");
            this.sceneName = headerLine[0];
            this.playerName = headerLine[1];
            this.uniqueID = headerLine[2];

            const cameraLine = lines[1].split(",");
            this.cameraXPos = parseFloat(cameraLine[0]);
            this.cameraYPos = parseFloat(cameraLine[1]);
            this.cameraZPos = parseFloat(cameraLine[2]);
            this.cameraXEuler = parseFloat(cameraLine[3]);
            this.cameraYEuler = parseFloat(cameraLine[4]);
            this.cameraZEuler = parseFloat(cameraLine[5]);
            this.cameraXRot = parseFloat(cameraLine[6]);
            this.cameraYRot = parseFloat(cameraLine[7]);

            const timingLine = lines[2].split(",");
            this.validationTime = timingLine[0];
            this.goldTime = timingLine[1];
            this.silverTime = timingLine[2];
            this.bronzeTime = timingLine[3];
            this.skybox = timingLine[4];
            this.ground = timingLine[5];

            return this;
        }

        static generateRandomId() {
            return String(Math.floor(Math.random() * 9) + 1) +
                String(Math.floor(Math.random() * 10 ** 11)).padStart(11, '0');
        }

        generateHeader(playerName, objectCount) {
            this.sceneName = "LevelEditor2";
            this.playerName = playerName;
            this.uniqueID = `${new Date().toISOString().replace(/[-:.]/g, "").replace("T", "-").substring(0, 17)}-${playerName}-${toolkist.Header.generateRandomId()}-${objectCount}`;
            this.cameraXPos = 0;
            this.cameraYPos = 0;
            this.cameraZPos = 0;
            this.cameraXEuler = 0;
            this.cameraYEuler = 0;
            this.cameraZEuler = 0;
            this.cameraXRot = 0;
            this.cameraYRot = 0;
            this.validationTime = "invalid track";
            this.goldTime = 0;
            this.silverTime = 0;
            this.bronzeTime = 0;
            this.skybox = 0;
            this.ground = 3;

            return this;
        }
    }

    toolkist.Block = class {
        constructor() {
            this.blockID = 0,
                this.position = {
                    x: 0,
                    y: 0,
                    z: 0
                },
                this.euler = {
                    x: 0,
                    y: 0,
                    z: 0
                },
                this.scale = {
                    x: 0,
                    y: 0,
                    z: 0
                },
                this.paints = new Array(17).fill(0);
            this.options = new Array(11).fill(0);
        }

        fromCSV(csvString) {
            const values = csvString.split(",").map((v) => parseFloat(v));
            this.blockID = values[0];
            this.position.x = values[1];
            this.position.y = values[2];
            this.position.z = values[3];
            this.euler.x = values[4];
            this.euler.y = values[5];
            this.euler.z = values[6];
            this.scale.x = values[7];
            this.scale.y = values[8];
            this.scale.z = values[9];
            this.paints = values.slice(10, 27);
            this.options = values.slice(27);

            return this;
        }

        toCSV() {
            const values = [
                this.blockID,
                this.position.x,
                this.position.y,
                this.position.z,
                this.euler.x,
                this.euler.y,
                this.euler.z,
                this.scale.x,
                this.scale.y,
                this.scale.z,
                ...this.paints,
                ...this.options
            ];
            return values.join(',');
        }
    }

    toolkist.Zeeplevel = class {
        constructor(filename) {
            this.filename = filename;
            this.header = new toolkist.Header().generateHeader("Bouwerman", 0);
            this.blocks = [];
        }

        addBlock(block) {
            this.blocks.push(block);
            return this;
        }

        toCSV() {
            const headerCSV = this.header.toCSV();
            const blocksCSV = this.blocks.map((block) => block.toCSV()).join('\n');
            return `${headerCSV}\n${blocksCSV}`;
        }

        fromCSV(csvFile) {
            const lines = csvFile.split('\n');

            if (lines.length < 3) {
                throw new Error('Invalid CSV format for ZeepLevel.');
            }

            this.header.fromCSV([lines[0], lines[1], lines[2]]);

            for (let i = 3; i < lines.length; i++) {
                this.blocks.push(new toolkist.Block().fromCSV(lines[i]));
            }

            return this;
        }

        setHeader(header){
            this.header = header;
            return this;
        }

        setBlocks(blocks)
        {
            this.blocks = blocks;
            return this;
        }
    }    

    return toolkist;
})(jQuery);