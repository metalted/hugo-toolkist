import {game} from '/toolkist/game.toolkist.js';

export var graphics = (function($) {
    var graphics = {};   
    graphics.quantizerPaintIDs = [0,1,2,3,4,5,7,8,9,10,17,19,20,21,22,23,24,25,26,27,28,29,30,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,64,67,68,69,70,71,76,77,78,80,83,84,85,86,87,88,89,90,92,93,94,107,120,121,133,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,195,196,197,198,199,200,201,202,205,206,207,208,209,210,211,212,213,214,258,259,260,261,262,263,264,265,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,349,350,351,352,353,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,384,385,386,387,388,389];
    
    graphics.ColorDistance = function(a, b)
    {
        const redDistance = a.red - b.red;
        const greenDistance = a.green - b.green;
        const blueDistance = a.blue - b.blue;
        return redDistance ** 2 + greenDistance ** 2 + blueDistance ** 2;
    };

    graphics.PaintIDsToColors = function(paintIDs)
    {
        let colors = {};

        paintIDs.forEach(p => {
            let paint = game.painting.GetPaint(p);
            if(paint.name != "Error"){
                colors[p] = new graphics.Color().FromHex(paint.swatch[0]);
            }
        });

        return colors;
    };

    graphics.Color = class
    {
        constructor(){
            this.red = 0;
            this.green = 0;
            this.blue = 0;
            this.alpha = 0;
            this.paintID = 6;
        }

        FromHex(hex) {
            hex = hex.replace(/^#/, '');
            if (hex.length === 6) {
                this.red = parseInt(hex.substring(0, 2), 16);
                this.green = parseInt(hex.substring(2, 4), 16);
                this.blue = parseInt(hex.substring(4, 6), 16);
                this.alpha = 255;
                return this;
            } else if (hex.length === 8) {
                this.red = parseInt(hex.substring(0, 2), 16);
                this.green = parseInt(hex.substring(2, 4), 16);
                this.blue = parseInt(hex.substring(4, 6), 16);
                this.alpha = parseInt(hex.substring(6, 8), 16);
                return this;
            } else {
                throw new Error('Invalid hex color format');
            }
        }

        FromRGB(r, g, b, a) {
            if (r <= 1.0 && g <= 1.0 && b <= 1.0) {
                // Values are in the 0-1 range, scale to 0-255
                this.red = Math.round(r * 255);
                this.green = Math.round(g * 255);
                this.blue = Math.round(b * 255);
                this.alpha = Math.round(a * 255);
            } else {
                // Values are already in the 0-255 range
                this.red = Math.round(r);
                this.green = Math.round(g);
                this.blue = Math.round(b);
                this.alpha = Math.round(a);
            }   
            return this;         
        }

        ToHex(hasAlpha) {
            const alphaPart = hasAlpha ? this.alpha.toString(16).padStart(2, '0') : '';
            return `#${this.red.toString(16).padStart(2, '0')}${this.green.toString(16).padStart(2, '0')}${this.blue.toString(16).padStart(2, '0')}${alphaPart}`;
        }

        ToRGB(floatingPoint, hasAlpha) {
            if (floatingPoint) {
                const alpha = hasAlpha ? this.alpha / 255 : 1.0;
                return [this.red / 255, this.green / 255, this.blue / 255, alpha];
            } else {
                return hasAlpha ? [this.red, this.green, this.blue, this.alpha] : [this.red, this.green, this.blue];
            }
        }
    }    

    graphics.Image = class
    {
        constructor(){
            this.width = 0;
            this.height = 0;
            this.pixels = [[]];
            this.name = "Toolkist Image";
            this.blocks = [];
            this.quantized = null;
        }

        ReadImage(image)
        {
            //Create a temporary canvas.
            const canvas = $('<canvas>').appendTo('body');
            const ctx = canvas[0].getContext('2d');

            //Set the width and height of the canvas to match the image.
            this.width = (image.width - (image.width % 4));
            this.height = (image.height - (image.height % 2));
            ctx.canvas.width = this.width;
            ctx.canvas.height = this.height;

            //Draw the image onto the canvas.
            ctx.drawImage(image, 0, 0, this.width, this.height);

            //Get the image data from the canvas
            var imageData = ctx.getImageData(0, 0, this.width, this.height).data;
           
            //Create a 2D array to store the pixel data.
            this.pixels = new Array(this.height);

            //Iterate over each row of pixels
            for(let y = 0; y < this.height; y++)
            {
                this.pixels[y] = new Array(this.width);

                for(let x = 0; x < this.width; x++)
                {
                    //Calculate the index in the data array for the current pixel.
                    const index = (y * this.width + x) * 4;

                    //Create a new pixel color.
                    this.pixels[y][x] = new graphics.Color();
                    this.pixels[y][x].red = imageData[index];
                    this.pixels[y][x].green = imageData[index + 1];
                    this.pixels[y][x].blue = imageData[index + 2];
                    this.pixels[y][x].alpha = imageData[index + 3];
                }               
            }

            canvas.remove();
            return this;
        }

        SetName(name)
        {
            this.name = name;
            return this;
        }

        GenerateBlocks()
        {
            this.quantized = graphics.QuantizeImage(this);
            this.blocks = [];
            
            //As each block contains 2 rows, loop over them by 2.
            for(let y = 0; y < this.quantized.length; y+=2)
            {
                const row = this.quantized[y];
                const nextRow = this.quantized[y + 1] || [];

                 // Iterate over every fourth pixel in the current row
                for (let x = 0; x < row.length; x += 4) {
                    const blockPixels = [row[x].id || 0, row[x + 1].id || 0, row[x + 2].id || 0, row[x + 3].id || 0, nextRow[x].id || 0, nextRow[x + 1].id || 0, nextRow[x + 2].id || 0, nextRow[x + 3].id || 0];
                    var block = new game.Block().FromCSV(`395,${x * 4},${y * -4},0,0,0,0,1,1,1,${blockPixels[4]},${blockPixels[0]},${blockPixels[7]},${blockPixels[6]},${blockPixels[5]},${blockPixels[3]},${blockPixels[2]},${blockPixels[1]},0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0`);
                    this.blocks.push(block);
                }
            }

            return this;
        }
    }  

    graphics.QuantizeImage = function(image)
    {
        const quantized = Array.from({ length: image.height }, () => Array(image.width).fill(0));
        const paintColors = graphics.PaintIDsToColors(graphics.quantizerPaintIDs);

        for(let y = 0; y < image.height; y++)
        {
            for(let x = 0; x < image.width; x++)
            {
                const pixel = image.pixels[y][x];
                if(pixel.alpha == 0)
                {
                    quantized[y][x] = {id: 105, color: new graphics.Color()};
                }
                else
                {
                    //Get the closest color.
                    let closestID = graphics.quantizerPaintIDs[0];
                    let closestDistance = graphics.ColorDistance(pixel, paintColors[closestID]);

                    for(let paintID in paintColors)
                    {
                        const distance = graphics.ColorDistance(pixel, paintColors[paintID]);
                        if(distance < closestDistance)
                        {
                            closestID = paintID;
                            closestDistance = distance;
                        }
                    }

                    quantized[y][x] = {id: closestID, color: paintColors[closestID]};
                }
            }
        }

        return quantized;
    }    

   return graphics;
})(jQuery);