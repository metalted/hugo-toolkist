//Requires toolkist.js
//Requires toolkist_color.js
var toolkist_image_converter = (function($) {
    var toolkist_image_converter = {};    

    toolkist_image_converter.paintIDs = [0,1,2,3,4,5,7,8,9,10,17,19,20,21,22,23,24,25,26,27,28,29,30,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,64,67,68,69,70,71,76,77,78,80,83,84,85,86,87,88,89,90,92,93,94,107,120,121,133,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,195,196,197,198,199,200,201,202,205,206,207,208,209,210,211,212,213,214,258,259,260,261,262,263,264,265,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,349,350,351,352,353,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,384,385,386,387,388,389];

    toolkist_image_converter.quantize = function(image, palette)
    {
        const quantized = Array.from({ length: image.height }, () => Array(image.width).fill(0));
        const paletteKeys = Object.keys(palette);

        for(let y = 0; y < image.height; y++)
        {
            for(let x = 0; x < image.width; x++)
            {
                const pixel = image.pixels[y][x];
                if(pixel.alpha == 0)
                {
                    quantized[y][x] = 105;
                }
                else
                {
                    //Get the closest color.
                    let closestID = paletteKeys[0];
                    let closestDistance = toolkist_color.colorDistance(pixel, palette[closestID]);

                    for(let c = 1; c < paletteKeys.length; c++)
                    {
                        const color = palette[paletteKeys[c]];
                        const distance = toolkist_color.colorDistance(pixel, color);
                        if(distance < closestDistance)
                        {
                            closestID = paletteKeys[c];
                            closestDistance = distance;
                        }
                    }

                    quantized[y][x] = closestID;
                }
            }
        }

        return quantized;
    }    

    toolkist_image_converter.Image = class
    {
        constructor(){
            this.width = 0;
            this.height = 0;
            this.pixels = [[]];
            this.name = "Toolkist Image"
        }

        readImage(image)
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
                    this.pixels[y][x] = new toolkist_color.Color();
                    this.pixels[y][x].red = imageData[index];
                    this.pixels[y][x].green = imageData[index + 1];
                    this.pixels[y][x].blue = imageData[index + 2];
                    this.pixels[y][x].alpha = imageData[index + 3];
                }               
            }

            canvas.remove();
            return this;
        }

        convertToBlocks(palette)
        {
            this.quantized = toolkist_image_converter.quantize(this, palette);
            var blocks = [];
            
            //As each block contains 2 rows, loop over them by 2.
            for(let y = 0; y < this.quantized.length; y+=2)
            {
                const row = this.quantized[y];
                const nextRow = this.quantized[y + 1] || [];

                 // Iterate over every fourth pixel in the current row
                for (let x = 0; x < row.length; x += 4) {
                    const blockPixels = [row[x] || 0, row[x + 1] || 0, row[x + 2] || 0, row[x + 3] || 0, nextRow[x] || 0, nextRow[x + 1] || 0, nextRow[x + 2] || 0, nextRow[x + 3] || 0];
                    var block = new toolkist.Block().fromCSV(`395,${x * 4},${y * -4},0,0,0,0,1,1,1,${blockPixels[4]},${blockPixels[0]},${blockPixels[7]},${blockPixels[6]},${blockPixels[5]},${blockPixels[3]},${blockPixels[2]},${blockPixels[1]},0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0`);
                    blocks.push(block);
                }
            }

            return blocks;
        }

        setName(name)
        {
            this.name = name;
            return this;
        }
    }  

    toolkist_image_converter.drawOnCanvas = function(canvasID, quantizedImage, callback)
    {
        const canvas = $('#' + canvasID);
        const ctx = canvas[0].getContext('2d');
        const h = quantizedImage.length;
        const w = quantizedImage[0].length;
        ctx.canvas.width = w;
        ctx.canvas.height = h;

        for(let y = 0; y < h; y++)
        {
            for(let x = 0; x < w; x++)
            {
                var hex = toolkist_color.getColor(quantizedImage[y][x]).toHex();
                ctx.fillStyle = hex;
                ctx.fillRect(x, y, 1, 1);
            }
        }

        callback();
    }
    
    return toolkist_image_converter;
})(jQuery);