var toolkist_color = (function($) {
    var toolkist_color = {};
    
    toolkist_color.Color = class
    {
        constructor(){
            this.red = 0;
            this.green = 0;
            this.blue = 0;
            this.alpha = 0;
        }

        fromHex(hex) {
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

        fromRGB(r, g, b, a) {
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

        toHex(hasAlpha) {
            const alphaPart = hasAlpha ? this.alpha.toString(16).padStart(2, '0') : '';
            return `#${this.red.toString(16).padStart(2, '0')}${this.green.toString(16).padStart(2, '0')}${this.blue.toString(16).padStart(2, '0')}${alphaPart}`;
        }

        toRGB(floatingPoint, hasAlpha) {
            if (floatingPoint) {
                const alpha = hasAlpha ? this.alpha / 255 : 1.0;
                return [this.red / 255, this.green / 255, this.blue / 255, alpha];
            } else {
                return hasAlpha ? [this.red, this.green, this.blue, this.alpha] : [this.red, this.green, this.blue];
            }
        }
    }    
    
    toolkist_color.colorDistance = function(a,b)
    {
        const redDistance = a.red - b.red;
        const greenDistance = a.green - b.green;
        const blueDistance = a.blue - b.blue;
        return redDistance ** 2 + greenDistance ** 2 + blueDistance ** 2;
    }
    
    toolkist_color.paints = {
        "0": {
            "name": "Concrete Beige",
            "swatch": [
                "#fff3c6",
                "#ffebc0",
                "#ffe5bd",
                "#ffe4bd"
            ]
        },
        "1": {
            "name": "Concrete Dark Gray",
            "swatch": [
                "#797b7b",
                "#7b7e7b",
                "#707170",
                "#737575"
            ]
        },
        "2": {
            "name": "Concrete Gray",
            "swatch": [
                "#d8d4c8",
                "#d3cfc5",
                "#d8d3c8",
                "#dbd5cb"
            ]
        },
        "3": {
            "name": "Tarmac Dark",
            "swatch": [
                "#393c42",
                "#363e47",
                "#393c4a",
                "#3c3e47"
            ]
        },
        "4": {
            "name": "Tarmac Light",
            "swatch": [
                "#d8d5c8",
                "#dedbce",
                "#d6d3c6",
                "#ded7ce"
            ]
        },
        "5": {
            "name": "Tarmac Medium",
            "swatch": [
                "#737573",
                "#737173",
                "#737173",
                "#737573"
            ]
        },
        "6": {
            "name": "Error",
            "swatch": [
                "#ffdcff",
                "#ffdbff",
                "#ffd8f9",
                "#ffdbfc"
            ]
        },
        "7": {
            "name": "Tarmac Fietspad",
            "swatch": [
                "#ef6d73",
                "#f16e6d",
                "#ec6b70",
                "#ec6d6d"
            ]
        },
        "8": {
            "name": "Stoeptegel",
            "swatch": [
                "#dbdcd3",
                "#d8d9d0",
                "#dedbce",
                "#d6d7ce"
            ]
        },
        "9": {
            "name": "Stoeptegel Vlecht",
            "swatch": [
                "#efebde",
                "#dedbce",
                "#efe7de",
                "#c6c7bd"
            ]
        },
        "10": {
            "name": "Stoeptegel Vlecht Beige",
            "swatch": [
                "#efcfb5",
                "#efd3b5",
                "#efcfb5",
                "#ceb6a5"
            ]
        },
        "11": {
            "name": "Leaves",
            "swatch": [
                "#68d739",
                "#52ba5a",
                "#52bb5a",
                "#63d739"
            ]
        },
        "12": {
            "name": "Leaves Fresh",
            "swatch": [
                "#91ff5a",
                "#84eb52",
                "#84ec52",
                "#81eb52"
            ]
        },
        "13": {
            "name": "Leaves Red",
            "swatch": [
                "#ff595a",
                "#ff575a",
                "#ff926d",
                "#ff594a"
            ]
        },
        "14": {
            "name": "Leaves Orange",
            "swatch": [
                "#ffd96a",
                "#ffec8e",
                "#ffeb8c",
                "#ffdb6b"
            ]
        },
        "15": {
            "name": "Leaves Yellow",
            "swatch": [
                "#ffff3f",
                "#ffff42",
                "#fff042",
                "#ffff80"
            ]
        },
        "16": {
            "name": "Leaves Sakura",
            "swatch": [
                "#ffe7ff",
                "#ff93f9",
                "#ff92ff",
                "#ffb0ff"
            ]
        },
        "17": {
            "name": "Bast",
            "swatch": [
                "#ffb494",
                "#ffc3a2",
                "#ffb694",
                "#ffb294"
            ]
        },
        "18": {
            "name": "Bast Birch",
            "swatch": [
                "#fffffc",
                "#fffff7",
                "#fffff9",
                "#fff3c6"
            ]
        },
        "19": {
            "name": "Bast Dark",
            "swatch": [
                "#a56d60",
                "#845f57",
                "#a56d5a",
                "#a56b60"
            ]
        },
        "20": {
            "name": "Bast Dry",
            "swatch": [
                "#a4796a",
                "#c38b78",
                "#a5796b",
                "#a4796a"
            ]
        },
        "21": {
            "name": "Bast Gray",
            "swatch": [
                "#9f8b84",
                "#9f8a81",
                "#bda294",
                "#c0a091"
            ]
        },
        "22": {
            "name": "Bast Orange",
            "swatch": [
                "#de8063",
                "#c6735a",
                "#c6715a",
                "#c6725a"
            ]
        },
        "23": {
            "name": "Barrier Red",
            "swatch": [
                "#ff3642",
                "#ff363f",
                "#ff3542",
                "#ff353c"
            ]
        },
        "24": {
            "name": "Barrier Orange",
            "swatch": [
                "#ffc241",
                "#ffc242",
                "#ffc342",
                "#ffc142"
            ]
        },
        "25": {
            "name": "Barrier Yellow",
            "swatch": [
                "#ffff41",
                "#ffff42",
                "#ffff3f",
                "#ffff3e"
            ]
        },
        "26": {
            "name": "Barrier Green",
            "swatch": [
                "#31e039",
                "#31e03c",
                "#31e13f",
                "#31e03c"
            ]
        },
        "27": {
            "name": "Barrier Blue",
            "swatch": [
                "#316fff",
                "#316eff",
                "#316eff",
                "#3171ff"
            ]
        },
        "28": {
            "name": "Barrier Purple",
            "swatch": [
                "#c34bf7",
                "#c34bf7",
                "#c64df7",
                "#c34bf4"
            ]
        },
        "29": {
            "name": "Barrier Sandy",
            "swatch": [
                "#ffffbd",
                "#ffffba",
                "#ffffb5",
                "#ffffb7"
            ]
        },
        "30": {
            "name": "Barrier White",
            "swatch": [
                "#fff3c6",
                "#fff3c6",
                "#fff3c6",
                "#fff3c6"
            ]
        },
        "31": {
            "name": "Glass Blue",
            "swatch": [
                "#5e82ff",
                "#5f83ff",
                "#5d83ff",
                "#6183ff"
            ]
        },
        "32": {
            "name": "Glass Orange",
            "swatch": [
                "#ffc35d",
                "#ffc35e",
                "#ffc361",
                "#ffc55d"
            ]
        },
        "33": {
            "name": "Glass Pink",
            "swatch": [
                "#ff3cf2",
                "#ff3bf2",
                "#ff3bf1",
                "#ff3cf1"
            ]
        },
        "34": {
            "name": "Groove Arch 1",
            "swatch": [
                "#ffc15a",
                "#ffbf5a",
                "#ad6760",
                "#ffc35a"
            ]
        },
        "35": {
            "name": "Groove Arch 2",
            "swatch": [
                "#21b3ff",
                "#217dce",
                "#217bce",
                "#21b4ff"
            ]
        },
        "36": {
            "name": "Groove Cricle 1",
            "swatch": [
                "#ffc15a",
                "#ffff44",
                "#ffbf5a",
                "#ffc35a"
            ]
        },
        "37": {
            "name": "Groove Circle 2",
            "swatch": [
                "#217dce",
                "#3cffff",
                "#21b3ff",
                "#21b6ff"
            ]
        },
        "38": {
            "name": "Groove Stripes 1",
            "swatch": [
                "#ffff44",
                "#ffc15a",
                "#ffbf5a",
                "#ffc35a"
            ]
        },
        "39": {
            "name": "Groove Stripes 2",
            "swatch": [
                "#3cffff",
                "#21b3ff",
                "#217dce",
                "#3cffff"
            ]
        },
        "40": {
            "name": "Groove Waves 1",
            "swatch": [
                "#ffff44",
                "#ffc35a",
                "#ffc15a",
                "#ffbe5a"
            ]
        },
        "41": {
            "name": "Groove Waves 2",
            "swatch": [
                "#39ffff",
                "#3cffff",
                "#217dce",
                "#21b6ff"
            ]
        },
        "42": {
            "name": "Plastic Solid Black",
            "swatch": [
                "#1b293f",
                "#1b293f",
                "#1e293f",
                "#1b263c"
            ]
        },
        "43": {
            "name": "Plastic Solid Blue",
            "swatch": [
                "#5a63ff",
                "#5a65ff",
                "#5a62ff",
                "#5a63ff"
            ]
        },
        "44": {
            "name": "Plastic Solid Brown",
            "swatch": [
                "#ad6760",
                "#ad665d",
                "#ad665d",
                "#ad695a"
            ]
        },
        "45": {
            "name": "Plastic Solid Green",
            "swatch": [
                "#1dc481",
                "#1ec481",
                "#1dc481",
                "#1ec584"
            ]
        },
        "46": {
            "name": "Plastic Solid Groove Blue 1",
            "swatch": [
                "#1d7cce",
                "#1e7bce",
                "#1e7ace",
                "#217dce"
            ]
        },
        "47": {
            "name": "Plastic Solid Groove Blue 2",
            "swatch": [
                "#21b6ff",
                "#21b7ff",
                "#21b6ff",
                "#21b7ff"
            ]
        },
        "48": {
            "name": "Plastic Solid Groove Blue 3",
            "swatch": [
                "#3cffff",
                "#3cffff",
                "#3fffff",
                "#39ffff"
            ]
        },
        "49": {
            "name": "Plastic Solid Orange",
            "swatch": [
                "#ffc35a",
                "#ffc45a",
                "#ffc15a",
                "#ffc25a"
            ]
        },
        "50": {
            "name": "Plastic Solid Purple",
            "swatch": [
                "#a22abd",
                "#a12abd",
                "#a229bd",
                "#a529bd"
            ]
        },
        "51": {
            "name": "Plastic Solid Red",
            "swatch": [
                "#ff6573",
                "#ff6373",
                "#ff6673",
                "#ff6973"
            ]
        },
        "52": {
            "name": "Plastic Solid Trans Blue",
            "swatch": [
                "#84ffff",
                "#84ffff",
                "#86ffff",
                "#83ffff"
            ]
        },
        "53": {
            "name": "Plastic Solid Trans Pink",
            "swatch": [
                "#ffe0ef",
                "#ffe1ef",
                "#ffe0ec",
                "#ffdfef"
            ]
        },
        "54": {
            "name": "Plastic Solid Turquoise",
            "swatch": [
                "#21ffbb",
                "#21ffba",
                "#21ffbd",
                "#21ffbd"
            ]
        },
        "55": {
            "name": "Plastic Solid White",
            "swatch": [
                "#fff3c6",
                "#fff3c6",
                "#fff3c6",
                "#fff3c6"
            ]
        },
        "56": {
            "name": "Plastic Solid Yellow",
            "swatch": [
                "#ffff44",
                "#ffff47",
                "#ffff42",
                "#ffff4a"
            ]
        },
        "57": {
            "name": "Stripes Belgium",
            "swatch": [
                "#ffff44",
                "#ff6573",
                "#ff6673",
                "#262e42"
            ]
        },
        "58": {
            "name": "Stripes Ireland",
            "swatch": [
                "#ffc15a",
                "#ffbf5a",
                "#29c384",
                "#fff3c6"
            ]
        },
        "59": {
            "name": "Stripes Italy",
            "swatch": [
                "#ff6573",
                "#ff6673",
                "#29c384",
                "#fff3c6"
            ]
        },
        "60": {
            "name": "Stripes Netherlands",
            "swatch": [
                "#ff6573",
                "#ff6675",
                "#5a65ff",
                "#fff3c6"
            ]
        },
        "61": {
            "name": "Stripes Rainbow",
            "swatch": [
                "#ffff44",
                "#ff6573",
                "#ffff47",
                "#ffc35a"
            ]
        },
        "62": {
            "name": "Stripes Netherlands",
            "swatch": [
                "#ff6573",
                "#ff6575",
                "#5a65ff",
                "#fff3c6"
            ]
        },
        "63": {
            "name": "Stripes Trans",
            "swatch": [
                "#84ffff",
                "#ffdce9",
                "#84ffff",
                "#fff3c6"
            ]
        },
        "64": {
            "name": "Diamondplate Black",
            "swatch": [
                "#151e2e",
                "#182031",
                "#151e2e",
                "#182031"
            ]
        },
        "65": {
            "name": "Diamondplate Chrome",
            "swatch": [
                "#5279bd",
                "#4f77ba",
                "#5275bd",
                "#4f76ba"
            ]
        },
        "66": {
            "name": "Diamondplate Gold",
            "swatch": [
                "#6b6929",
                "#6b6a29",
                "#6a6a29",
                "#6b6929"
            ]
        },
        "67": {
            "name": "Diamondplate Grey",
            "swatch": [
                "#8c97a7",
                "#8c98aa",
                "#8c98aa",
                "#8c9aad"
            ]
        },
        "68": {
            "name": "Diamondplate Orange",
            "swatch": [
                "#ffa74a",
                "#ffa84a",
                "#ffaa4a",
                "#ffa64a"
            ]
        },
        "69": {
            "name": "Diamondplate Red",
            "swatch": [
                "#ff3031",
                "#ff2e31",
                "#ff2f33",
                "#ff2c31"
            ]
        },
        "70": {
            "name": "Diamondplate White",
            "swatch": [
                "#f9ffff",
                "#ffffff",
                "#e3f1ff",
                "#fff3c6"
            ]
        },
        "71": {
            "name": "Diamondplate Yellow",
            "swatch": [
                "#ffdc31",
                "#ffdb31",
                "#ffdc33",
                "#ffdb33"
            ]
        },
        "72": {
            "name": "Metal Panel Black",
            "swatch": [
                "#151e2e",
                "#151e2e",
                "#182031",
                "#15202e"
            ]
        },
        "73": {
            "name": "Metal Panel Chrome",
            "swatch": [
                "#4f77ba",
                "#4f76ba",
                "#4c75ba",
                "#4f77ba"
            ]
        },
        "74": {
            "name": "Metal Panel Gold",
            "swatch": [
                "#6a6929",
                "#6b6a29",
                "#6a6a29",
                "#6b6929"
            ]
        },
        "75": {
            "name": "Metal Panel Grey",
            "swatch": [
                "#8c97a7",
                "#8c98aa",
                "#8c98aa",
                "#8c96a5"
            ]
        },
        "76": {
            "name": "Metal Panel Old Navy",
            "swatch": [
                "#294086",
                "#293f86",
                "#294086",
                "#294184"
            ]
        },
        "77": {
            "name": "Metal Panel Old Green",
            "swatch": [
                "#294a4a",
                "#284a4a",
                "#29494a",
                "#294a4a"
            ]
        },
        "78": {
            "name": "Metal Panel Old Red",
            "swatch": [
                "#70282e",
                "#70282e",
                "#70262e",
                "#6e282e"
            ]
        },
        "79": {
            "name": "Metal Panel White",
            "swatch": [
                "#e9f7ff",
                "#f4fbff",
                "#ffffff",
                "#fff3c6"
            ]
        },
        "80": {
            "name": "Metal Smooth Black",
            "swatch": [
                "#0d141e",
                "#10151e",
                "#0d121d",
                "#0d1221"
            ]
        },
        "81": {
            "name": "Metal Smooth Chrome",
            "swatch": [
                "#5279ba",
                "#4c75ba",
                "#527bba",
                "#4a75ba"
            ]
        },
        "82": {
            "name": "Metal Smooth Gold",
            "swatch": [
                "#6b6929",
                "#686929",
                "#706d29",
                "#636329"
            ]
        },
        "83": {
            "name": "Metal Smooth Grey",
            "swatch": [
                "#6b809c",
                "#6b809c",
                "#6b7e9c",
                "#6a7c99"
            ]
        },
        "84": {
            "name": "Metal Smooth Old Green",
            "swatch": [
                "#1e3b3c",
                "#1e3839",
                "#1b3839",
                "#183639"
            ]
        },
        "85": {
            "name": "Metal Smooth Old Navy",
            "swatch": [
                "#1d3076",
                "#213278",
                "#1e2e73",
                "#1d3076"
            ]
        },
        "86": {
            "name": "Metal Smooth Old Red",
            "swatch": [
                "#551d1e",
                "#521c1d",
                "#521a1e",
                "#521c1e"
            ]
        },
        "87": {
            "name": "Metal Smooth White",
            "swatch": [
                "#c8e7ff",
                "#ceecff",
                "#c8e7ff",
                "#c6e4ff"
            ]
        },
        "88": {
            "name": "Grass",
            "swatch": [
                "#399e42",
                "#399b42",
                "#399a42",
                "#399e42"
            ]
        },
        "89": {
            "name": "Grass Dark",
            "swatch": [
                "#316f39",
                "#317139",
                "#316e39",
                "#317539"
            ]
        },
        "90": {
            "name": "Grass Fresh",
            "swatch": [
                "#4aba3f",
                "#4aba42",
                "#4fba3f",
                "#4abe42"
            ]
        },
        "91": {
            "name": "Grass Golf",
            "swatch": [
                "#52be42",
                "#399e42",
                "#399e3f",
                "#52ba42"
            ]
        },
        "92": {
            "name": "Metal Smooth Red",
            "swatch": [
                "#ff383f",
                "#ff3a42",
                "#ff363e",
                "#ff3c42"
            ]
        },
        "93": {
            "name": "Metal Smooth Orange",
            "swatch": [
                "#ff9f42",
                "#ffa33f",
                "#ffa23f",
                "#ff9e3e"
            ]
        },
        "94": {
            "name": "Metal Smooth Yellow",
            "swatch": [
                "#fff33f",
                "#fff73f",
                "#fff442",
                "#fff13e"
            ]
        },
        "95": {
            "name": "Glass Beige",
            "swatch": [
                "#ffdfaf",
                "#ffdfad",
                "#ffdfae",
                "#ffdfaf"
            ]
        },
        "96": {
            "name": "Glass Black",
            "swatch": [
                "#213252",
                "#213452",
                "#213251",
                "#213452"
            ]
        },
        "97": {
            "name": "Glass Dark Blue",
            "swatch": [
                "#2146c3",
                "#2147c3",
                "#2146c3",
                "#2147c4"
            ]
        },
        "98": {
            "name": "Glass Dark Brown",
            "swatch": [
                "#815152",
                "#815151",
                "#815152",
                "#815152"
            ]
        },
        "99": {
            "name": "Glass Dark Red",
            "swatch": [
                "#843252",
                "#853352",
                "#843452",
                "#833251"
            ]
        },
        "100": {
            "name": "Glass Grey",
            "swatch": [
                "#a0aec9",
                "#a2b1cb",
                "#a1b0ca",
                "#9fb0c8"
            ]
        },
        "101": {
            "name": "Glass Green",
            "swatch": [
                "#29ae64",
                "#29b068",
                "#2ab167",
                "#29b068"
            ]
        },
        "102": {
            "name": "Glass Lime",
            "swatch": [
                "#a2ff68",
                "#a3ff68",
                "#a2ff67",
                "#a6ff68"
            ]
        },
        "103": {
            "name": "Glass Purple",
            "swatch": [
                "#a642ff",
                "#a441ff",
                "#a543ff",
                "#a542ff"
            ]
        },
        "104": {
            "name": "Glass Red",
            "swatch": [
                "#ff3c5d",
                "#ff3b5d",
                "#ff3b60",
                "#ff3b5e"
            ]
        },
        "105": {
            "name": "Glass White",
            "swatch": [
                "#f8ffff",
                "#fdffff",
                "#fdffff",
                "#fdffff"
            ]
        },
        "106": {
            "name": "Glass Yellow",
            "swatch": [
                "#ffff5d",
                "#ffff5e",
                "#ffff5f",
                "#ffff61"
            ]
        },
        "107": {
            "name": "Tarmac White",
            "swatch": [
                "#fff3c6",
                "#fff3c6",
                "#fff3c6",
                "#fff3c6"
            ]
        },
        "108": {
            "name": "Ice White",
            "swatch": [
                "#fff3c6",
                "#fff3c6",
                "#fff3c6",
                "#fff3c6"
            ]
        },
        "109": {
            "name": "Ice Light Blue",
            "swatch": [
                "#adffff",
                "#afffff",
                "#b5ffff",
                "#b2ffff"
            ]
        },
        "110": {
            "name": "Ice Blue",
            "swatch": [
                "#63ffff",
                "#65ffff",
                "#6bffff",
                "#5aebff"
            ]
        },
        "111": {
            "name": "Ice Dark Blue",
            "swatch": [
                "#6b9fff",
                "#6ba2ff",
                "#6ba3ff",
                "#689eff"
            ]
        },
        "112": {
            "name": "Neon Blue",
            "swatch": [
                "#42b7ff",
                "#42b8ff",
                "#42b8ff",
                "#42b7ff"
            ]
        },
        "113": {
            "name": "Neon Cyan",
            "swatch": [
                "#42ffff",
                "#42ffff",
                "#41ffff",
                "#41ffff"
            ]
        },
        "114": {
            "name": "Neon Green",
            "swatch": [
                "#e1ff4f",
                "#e1ff52",
                "#e1ff4f",
                "#deff4f"
            ]
        },
        "115": {
            "name": "Neon Magenta",
            "swatch": [
                "#ff97ff",
                "#ff98ff",
                "#ff96ff",
                "#ff94ff"
            ]
        },
        "116": {
            "name": "Neon Orange",
            "swatch": [
                "#ffff4f",
                "#ffff4c",
                "#ffff4f",
                "#ffff4c"
            ]
        },
        "117": {
            "name": "Neon Red",
            "swatch": [
                "#ff8e4f",
                "#ff8c4f",
                "#ff8e52",
                "#ff8b4c"
            ]
        },
        "118": {
            "name": "Neon White",
            "swatch": [
                "#fff3c6",
                "#fff3c6",
                "#fff3c6",
                "#fff3c6"
            ]
        },
        "119": {
            "name": "Neon Yellow",
            "swatch": [
                "#ffff4f",
                "#ffff4c",
                "#ffff4d",
                "#ffff4f"
            ]
        },
        "120": {
            "name": "Sand",
            "swatch": [
                "#ffe5aa",
                "#ffe8ad",
                "#ffdfa5",
                "#ffe1a7"
            ]
        },
        "121": {
            "name": "Concrete White",
            "swatch": [
                "#fff3c6",
                "#fff3c6",
                "#fff3c6",
                "#fff3c6"
            ]
        },
        "122": {
            "name": "Check Black Yellow",
            "swatch": [
                "#ffff44",
                "#ffff42",
                "#212c42",
                "#293042"
            ]
        },
        "123": {
            "name": "Check Blue Orange",
            "swatch": [
                "#ffc35a",
                "#ffc45a",
                "#ffc35d",
                "#5a65ff"
            ]
        },
        "124": {
            "name": "Check Blue White",
            "swatch": [
                "#5a65ff",
                "#5d65ff",
                "#5d63ff",
                "#fff3c6"
            ]
        },
        "125": {
            "name": "Check Blue Yellow",
            "swatch": [
                "#ffff44",
                "#ffff47",
                "#5d65ff",
                "#5a65ff"
            ]
        },
        "126": {
            "name": "Check Black White",
            "swatch": [
                "#212c42",
                "#29344a",
                "#212d42",
                "#fff3c6"
            ]
        },
        "127": {
            "name": "Check Orange White",
            "swatch": [
                "#ffc45a",
                "#ffc45d",
                "#ffc35a",
                "#fff3c6"
            ]
        },
        "128": {
            "name": "Check Purple White",
            "swatch": [
                "#a534bd",
                "#a22cbd",
                "#a22dbd",
                "#fff3c6"
            ]
        },
        "129": {
            "name": "Check Red White",
            "swatch": [
                "#ff6675",
                "#ff6673",
                "#ff6973",
                "#fff3c6"
            ]
        },
        "130": {
            "name": "Check Red Yellow",
            "swatch": [
                "#ffff44",
                "#ff6673",
                "#ff6573",
                "#ff6973"
            ]
        },
        "131": {
            "name": "Check Brown Yellow",
            "swatch": [
                "#ffff44",
                "#ffff42",
                "#ad6960",
                "#ad6760"
            ]
        },
        "132": {
            "name": "Check Trans",
            "swatch": [
                "#84ffff",
                "#ffe0ef",
                "#84ffff",
                "#86ffff"
            ]
        },
        "133": {
            "name": "Snow",
            "swatch": [
                "#fff3c6",
                "#fff3c6",
                "#fff3c6",
                "#fff3c6"
            ]
        },
        "134": {
            "name": "Metal Panel Chrome Blue",
            "swatch": [
                "#429cff",
                "#3e9eff",
                "#3e9cff",
                "#429bff"
            ]
        },
        "135": {
            "name": "Metal Panel Chrome Pink",
            "swatch": [
                "#6d5dff",
                "#6b5dff",
                "#6e5dff",
                "#6d5dff"
            ]
        },
        "136": {
            "name": "Leaves Brown",
            "swatch": [
                "#c06239",
                "#bd6939",
                "#bd6739",
                "#bd6139"
            ]
        },
        "137": {
            "name": "Leaves Dark",
            "swatch": [
                "#298339",
                "#2c7639",
                "#298b39",
                "#298439"
            ]
        },
        "138": {
            "name": "Leaves Medium Dark",
            "swatch": [
                "#36b739",
                "#39c33c",
                "#36b739",
                "#39c339"
            ]
        },
        "139": {
            "name": "Leaves Warm Yellow",
            "swatch": [
                "#ffff52",
                "#ffd33f",
                "#fff53f",
                "#ffff4f"
            ]
        },
        "140": {
            "name": "Concrete Brown 1",
            "swatch": [
                "#b2523c",
                "#ad513c",
                "#b2523c",
                "#ad513c"
            ]
        },
        "141": {
            "name": "Concrete Brown 2",
            "swatch": [
                "#7e493c",
                "#76463c",
                "#79483c",
                "#6d4539"
            ]
        },
        "142": {
            "name": "Concrete Orange 1",
            "swatch": [
                "#ff9e63",
                "#ff9e65",
                "#ff9c63",
                "#f79863"
            ]
        },
        "143": {
            "name": "Concrete Orange 2",
            "swatch": [
                "#f7863f",
                "#f7863f",
                "#ec823c",
                "#e7803f"
            ]
        },
        "144": {
            "name": "Concrete Red 1",
            "swatch": [
                "#f78f7e",
                "#ef8b7b",
                "#f79081",
                "#f4907b"
            ]
        },
        "145": {
            "name": "Concrete Red 2",
            "swatch": [
                "#bd5952",
                "#bd5952",
                "#b5574f",
                "#bd594f"
            ]
        },
        "146": {
            "name": "Concrete Yellow 1",
            "swatch": [
                "#ffdf6b",
                "#ffdc6b",
                "#ffdc6a",
                "#ffd86b"
            ]
        },
        "147": {
            "name": "Concrete Yellow 2",
            "swatch": [
                "#ffd042",
                "#ffce3f",
                "#ffd142",
                "#ffd03f"
            ]
        },
        "148": {
            "name": "Bast Donker Purple",
            "swatch": [
                "#63314a",
                "#76314f",
                "#63304a",
                "#73304a"
            ]
        },
        "149": {
            "name": "Bast Donker Red",
            "swatch": [
                "#9f333c",
                "#843239",
                "#843439",
                "#9c3439"
            ]
        },
        "150": {
            "name": "Bast Donkerer",
            "swatch": [
                "#784e49",
                "#784f4a",
                "#654847",
                "#634947"
            ]
        },
        "151": {
            "name": "Bast Donkererer",
            "swatch": [
                "#5a3f42",
                "#4f3a3f",
                "#5a3f3f",
                "#523c42"
            ]
        },
        "152": {
            "name": "Bast Really Gray Dark",
            "swatch": [
                "#52555a",
                "#5a5b5f",
                "#52555a",
                "#5a5d5f"
            ]
        },
        "153": {
            "name": "Bast Really Gray Light",
            "swatch": [
                "#cecbc0",
                "#cecbbd",
                "#cecbc3",
                "#9c9e9c"
            ]
        },
        "154": {
            "name": "Bast Really Gray Medium",
            "swatch": [
                "#94938e",
                "#818180",
                "#848284",
                "#949491"
            ]
        },
        "155": {
            "name": "Bast White",
            "swatch": [
                "#fffff4",
                "#fffff7",
                "#ffffef",
                "#fff3c6"
            ]
        },
        "156": {
            "name": "Tarmac Blue",
            "swatch": [
                "#31bbff",
                "#31baff",
                "#31b8ff",
                "#31beff"
            ]
        },
        "157": {
            "name": "Tarmac Fietspad Dark",
            "swatch": [
                "#943b42",
                "#943c42",
                "#943b42",
                "#943c42"
            ]
        },
        "158": {
            "name": "Tarmac Green",
            "swatch": [
                "#52ff63",
                "#52ff60",
                "#52fc60",
                "#52ff63"
            ]
        },
        "159": {
            "name": "Tarmac Orange",
            "swatch": [
                "#ff9b52",
                "#ff9a52",
                "#ff9852",
                "#ff9a55"
            ]
        },
        "160": {
            "name": "Tarmac Sandy",
            "swatch": [
                "#ffffe7",
                "#ffffe9",
                "#ffffec",
                "#ffffef"
            ]
        },
        "161": {
            "name": "Tarmac Yellow",
            "swatch": [
                "#ffff96",
                "#ffff94",
                "#ffff99",
                "#ffff9c"
            ]
        },
        "162": {
            "name": "Stoeptegel Blue",
            "swatch": [
                "#39d3ff",
                "#39d1ff",
                "#39d3ff",
                "#39cfff"
            ]
        },
        "163": {
            "name": "Stoeptegel Fietspad",
            "swatch": [
                "#ef6973",
                "#ec6970",
                "#ec6770",
                "#ef696b"
            ]
        },
        "164": {
            "name": "Stoeptegel Green",
            "swatch": [
                "#5aff6d",
                "#5aff6b",
                "#5aff6e",
                "#5aff6d"
            ]
        },
        "165": {
            "name": "Stoeptegel Orange",
            "swatch": [
                "#ffae63",
                "#ffac63",
                "#ffab63",
                "#ffaa63"
            ]
        },
        "166": {
            "name": "Stoeptegel Sandy",
            "swatch": [
                "#fffcee",
                "#fffbee",
                "#fffff7",
                "#fff3c6"
            ]
        },
        "167": {
            "name": "Stoeptegel Vlecht Blue",
            "swatch": [
                "#39d3ff",
                "#39cfff",
                "#39d3ff",
                "#39cfff"
            ]
        },
        "168": {
            "name": "Stoeptegel Vlecht Fietspad",
            "swatch": [
                "#ef696b",
                "#ef6973",
                "#ef696b",
                "#ce616b"
            ]
        },
        "169": {
            "name": "Stoeptegel Vlecht Green",
            "swatch": [
                "#5aff6b",
                "#5aff6b",
                "#5aff6d",
                "#5aff6e"
            ]
        },
        "170": {
            "name": "Stoeptegel Vlecht Orange",
            "swatch": [
                "#ffaa63",
                "#ffae63",
                "#ff9c5d",
                "#ffa360"
            ]
        },
        "171": {
            "name": "Stoeptegel Vlecht Sandy",
            "swatch": [
                "#fffff4",
                "#ffffe9",
                "#ffffe7",
                "#fff3c6"
            ]
        },
        "172": {
            "name": "Stoeptegel Vlecht Yellow",
            "swatch": [
                "#ffffad",
                "#ffffa7",
                "#ffff9c",
                "#ffffa4"
            ]
        },
        "173": {
            "name": "Stoeptegel White",
            "swatch": [
                "#fffff9",
                "#ffffef",
                "#fffff4",
                "#fff3c6"
            ]
        },
        "174": {
            "name": "Stoeptegel Yellow",
            "swatch": [
                "#ffffad",
                "#ffffac",
                "#ffffaa",
                "#ffffa7"
            ]
        },
        "175": {
            "name": "Sand Bright",
            "swatch": [
                "#ffffd6",
                "#ffffde",
                "#ffffd8",
                "#ffffdb"
            ]
        },
        "176": {
            "name": "Sand Brownish",
            "swatch": [
                "#e1b38e",
                "#deb28c",
                "#e4b491",
                "#deaf8c"
            ]
        },
        "177": {
            "name": "Sand Orange",
            "swatch": [
                "#ffe08c",
                "#ffdc8c",
                "#ffe38c",
                "#ffdf8c"
            ]
        },
        "178": {
            "name": "Sand Rose",
            "swatch": [
                "#ffc9aa",
                "#ffccad",
                "#ffcbad",
                "#ffc8a7"
            ]
        },
        "179": {
            "name": "Sand Yellow",
            "swatch": [
                "#ffffa5",
                "#ffffa2",
                "#ffffa7",
                "#ffffa4"
            ]
        },
        "180": {
            "name": "Mud",
            "swatch": [
                "#846360",
                "#846963",
                "#846760",
                "#816660"
            ]
        },
        "181": {
            "name": "Metal Panel Blue",
            "swatch": [
                "#1852ff",
                "#1852ff",
                "#1853ff",
                "#1855ff"
            ]
        },
        "182": {
            "name": "Metal Panel Green",
            "swatch": [
                "#21c831",
                "#26c831",
                "#21c731",
                "#21c831"
            ]
        },
        "183": {
            "name": "Metal Panel Lime",
            "swatch": [
                "#a7ff33",
                "#a7ff31",
                "#a7ff33",
                "#a5ff31"
            ]
        },
        "184": {
            "name": "Metal Panel Old Brown",
            "swatch": [
                "#544c47",
                "#544c47",
                "#524d4a",
                "#524d4a"
            ]
        },
        "185": {
            "name": "Metal Panel Old Metal",
            "swatch": [
                "#4a5265",
                "#475368",
                "#4a5368",
                "#4a5265"
            ]
        },
        "186": {
            "name": "Metal Panel Orange",
            "swatch": [
                "#ff8f31",
                "#ff8e31",
                "#ff8f33",
                "#ff9031"
            ]
        },
        "187": {
            "name": "Metal Panel Pink",
            "swatch": [
                "#ffabff",
                "#ffaaff",
                "#ffacff",
                "#ffb2ff"
            ]
        },
        "188": {
            "name": "Metal Panel Purple",
            "swatch": [
                "#522073",
                "#521e73",
                "#521e73",
                "#522073"
            ]
        },
        "189": {
            "name": "Metal Panel Red",
            "swatch": [
                "#ff2e31",
                "#ff3031",
                "#ff2c31",
                "#ff2f33"
            ]
        },
        "190": {
            "name": "Metal Panel Turquoise",
            "swatch": [
                "#42fff7",
                "#42fff7",
                "#44fff7",
                "#44fff7"
            ]
        },
        "191": {
            "name": "Metal Panel Yellow",
            "swatch": [
                "#ffdc31",
                "#ffdb31",
                "#ffdc33",
                "#ffdb33"
            ]
        },
        "192": {
            "name": "Metal Smooth Blue",
            "swatch": [
                "#2161ff",
                "#1e5eff",
                "#1e5dff",
                "#2161ff"
            ]
        },
        "193": {
            "name": "Metal Smooth Chrome Blue",
            "swatch": [
                "#42a2ff",
                "#3f9cff",
                "#41a2ff",
                "#3f9bff"
            ]
        },
        "194": {
            "name": "Metal Smooth Chrome Pink",
            "swatch": [
                "#6b5bff",
                "#735fff",
                "#6b5aff",
                "#6556ff"
            ]
        },
        "195": {
            "name": "Metal Smooth Green",
            "swatch": [
                "#29dc39",
                "#31e13f",
                "#29dc39",
                "#2bdb3c"
            ]
        },
        "196": {
            "name": "Metal Smooth Lime",
            "swatch": [
                "#c0ff3f",
                "#c3ff3f",
                "#c0ff3e",
                "#c0ff3f"
            ]
        },
        "197": {
            "name": "Metal Smooth Old Brown",
            "swatch": [
                "#524b4a",
                "#574f4a",
                "#524947",
                "#524a4a"
            ]
        },
        "198": {
            "name": "Metal Smooth Old Metal",
            "swatch": [
                "#495568",
                "#475168",
                "#445165",
                "#475368"
            ]
        },
        "199": {
            "name": "Metal Smooth Pink",
            "swatch": [
                "#ffbeff",
                "#ffc1ff",
                "#ffbfff",
                "#ffbdff"
            ]
        },
        "200": {
            "name": "Metal Smooth Purple",
            "swatch": [
                "#632881",
                "#632681",
                "#632481",
                "#632681"
            ]
        },
        "201": {
            "name": "Metal Smooth Turquoise",
            "swatch": [
                "#4fffff",
                "#52ffff",
                "#4fffff",
                "#52ffff"
            ]
        },
        "202": {
            "name": "Diamondplate Blue",
            "swatch": [
                "#1852ff",
                "#1853ff",
                "#1852ff",
                "#1b53ff"
            ]
        },
        "203": {
            "name": "Diamondplate Chrome Blue",
            "swatch": [
                "#429eff",
                "#429cff",
                "#3f9eff",
                "#429eff"
            ]
        },
        "204": {
            "name": "Diamondplate Chrome Pink",
            "swatch": [
                "#6b5dff",
                "#6d5dff",
                "#705bff",
                "#6b5bff"
            ]
        },
        "205": {
            "name": "Diamondplate Green",
            "swatch": [
                "#21c831",
                "#26c831",
                "#26c931",
                "#21c731"
            ]
        },
        "206": {
            "name": "Diamondplate Lime",
            "swatch": [
                "#a7ff31",
                "#a7ff33",
                "#a7ff33",
                "#a5ff31"
            ]
        },
        "207": {
            "name": "Diamondplate Old Brown",
            "swatch": [
                "#544c47",
                "#524d4a",
                "#544c47",
                "#524d4a"
            ]
        },
        "208": {
            "name": "Diamondplate Old Green",
            "swatch": [
                "#284a4a",
                "#294a4a",
                "#29494a",
                "#284a4a"
            ]
        },
        "209": {
            "name": "Diamondplate Old Metal",
            "swatch": [
                "#475268",
                "#475268",
                "#4a556b",
                "#4a526b"
            ]
        },
        "210": {
            "name": "Diamondplate Old Navy",
            "swatch": [
                "#294086",
                "#294184",
                "#293f86",
                "#294086"
            ]
        },
        "211": {
            "name": "Diamondplate Old Red",
            "swatch": [
                "#70282e",
                "#70282e",
                "#70262e",
                "#732831"
            ]
        },
        "212": {
            "name": "Diamondplate Pink",
            "swatch": [
                "#ffabff",
                "#ffacff",
                "#ffaaff",
                "#ffaeff"
            ]
        },
        "213": {
            "name": "Diamondplate Purple",
            "swatch": [
                "#522073",
                "#521e73",
                "#521e73",
                "#522073"
            ]
        },
        "214": {
            "name": "Diamondplate Turquoise",
            "swatch": [
                "#42fff7",
                "#44fff7",
                "#42fff7",
                "#44fff7"
            ]
        },
        "215": {
            "name": "Stripes Ver BlackWhite",
            "swatch": [
                "#293247",
                "#29344a",
                "#293144",
                "#fff3c6"
            ]
        },
        "216": {
            "name": "Stripes Ver BlackYellow",
            "swatch": [
                "#ffff42",
                "#ffff44",
                "#293142",
                "#293042"
            ]
        },
        "217": {
            "name": "Stripes Ver BlueWhite",
            "swatch": [
                "#5d66ff",
                "#5a65ff",
                "#6067ff",
                "#fff3c6"
            ]
        },
        "218": {
            "name": "Stripes Ver GreenWhite",
            "swatch": [
                "#29c384",
                "#29c484",
                "#f7ffff",
                "#fff3c6"
            ]
        },
        "219": {
            "name": "Stripes Ver OrangeWhite",
            "swatch": [
                "#fffff7",
                "#ffc15a",
                "#ffc160",
                "#fff3c6"
            ]
        },
        "220": {
            "name": "Stripes Ver PinkYellow",
            "swatch": [
                "#ffff4a",
                "#ff66ff",
                "#ff67ff",
                "#ff69ff"
            ]
        },
        "221": {
            "name": "Stripes Ver RedWhite",
            "swatch": [
                "#ff5565",
                "#ff5563",
                "#fffbf7",
                "#fff3c6"
            ]
        },
        "222": {
            "name": "Stripes Hor BlackWhite",
            "swatch": [
                "#293247",
                "#29344a",
                "#293144",
                "#fff3c6"
            ]
        },
        "223": {
            "name": "Stripes Hor BlackYellow",
            "swatch": [
                "#ffff42",
                "#ffff44",
                "#293442",
                "#283141"
            ]
        },
        "224": {
            "name": "Stripes Hor BlueWhite",
            "swatch": [
                "#5d66ff",
                "#5a65ff",
                "#6369ff",
                "#fff3c6"
            ]
        },
        "225": {
            "name": "Stripes Hor GreenWhite",
            "swatch": [
                "#29c384",
                "#29c484",
                "#29c384",
                "#fff3c6"
            ]
        },
        "226": {
            "name": "Stripes Hor OrangeWhite",
            "swatch": [
                "#ffc15a",
                "#ffc363",
                "#ffc160",
                "#fff3c6"
            ]
        },
        "227": {
            "name": "Stripes Hor PinkYellow",
            "swatch": [
                "#ffff4a",
                "#ff66ff",
                "#ff67ff",
                "#ff69ff"
            ]
        },
        "228": {
            "name": "Stripes Hor RedWhite",
            "swatch": [
                "#ff5565",
                "#ff5563",
                "#ff596b",
                "#fff3c6"
            ]
        },
        "229": {
            "name": "Belgium",
            "swatch": [
                "#ffff44",
                "#ff6573",
                "#ff6673",
                "#293042"
            ]
        },
        "230": {
            "name": "BlackWhite",
            "swatch": [
                "#31384a",
                "#29344a",
                "#293247",
                "#fff3c6"
            ]
        },
        "231": {
            "name": "BlackYellow",
            "swatch": [
                "#ffff42",
                "#293442",
                "#fffb42",
                "#fff742"
            ]
        },
        "232": {
            "name": "BlueWhite",
            "swatch": [
                "#6369ff",
                "#5a65ff",
                "#6067ff",
                "#fff3c6"
            ]
        },
        "233": {
            "name": "GreenWhite",
            "swatch": [
                "#31c784",
                "#31c384",
                "#29c384",
                "#fff3c6"
            ]
        },
        "234": {
            "name": "OrangeWhite",
            "swatch": [
                "#ffc363",
                "#ffc160",
                "#ffc763",
                "#fff3c6"
            ]
        },
        "235": {
            "name": "PinkYellow",
            "swatch": [
                "#ffff4a",
                "#ffff52",
                "#ff69ff",
                "#ffff4c"
            ]
        },
        "236": {
            "name": "RedWhite",
            "swatch": [
                "#ff596b",
                "#ff5563",
                "#ff556b",
                "#fff3c6"
            ]
        },
        "237": {
            "name": "Ireland",
            "swatch": [
                "#ffc15a",
                "#ffbf5a",
                "#31c384",
                "#fff3c6"
            ]
        },
        "238": {
            "name": "Italy",
            "swatch": [
                "#ff6673",
                "#ff6573",
                "#ff6675",
                "#fff3c6"
            ]
        },
        "239": {
            "name": "Netherlands",
            "swatch": [
                "#ff6675",
                "#ff6575",
                "#5d65ff",
                "#fff3c6"
            ]
        },
        "240": {
            "name": "Rainbow",
            "swatch": [
                "#ffff4a",
                "#29c384",
                "#ff6573",
                "#ffff47"
            ]
        },
        "241": {
            "name": "Trans",
            "swatch": [
                "#84ffff",
                "#ffdce9",
                "#84ffff",
                "#fff3c6"
            ]
        },
        "242": {
            "name": "Belgium",
            "swatch": [
                "#ffff44",
                "#ff6573",
                "#ff6673",
                "#ffff47"
            ]
        },
        "243": {
            "name": "BlackWhite",
            "swatch": [
                "#293144",
                "#29344a",
                "#293042",
                "#fff3c6"
            ]
        },
        "244": {
            "name": "BlackYellow",
            "swatch": [
                "#ffff44",
                "#ffff42",
                "#293042",
                "#263141"
            ]
        },
        "245": {
            "name": "BlueWhite",
            "swatch": [
                "#5d66ff",
                "#5d65ff",
                "#6365ff",
                "#fff3c6"
            ]
        },
        "246": {
            "name": "GreenWhite",
            "swatch": [
                "#29c384",
                "#29c381",
                "#29c384",
                "#fff3c6"
            ]
        },
        "247": {
            "name": "OrangeWhite",
            "swatch": [
                "#ffc363",
                "#ffc15a",
                "#ffc35d",
                "#fff3c6"
            ]
        },
        "248": {
            "name": "PinkYellow",
            "swatch": [
                "#ffff4a",
                "#ff67ff",
                "#ff66ff",
                "#ff69ff"
            ]
        },
        "249": {
            "name": "RedWhite",
            "swatch": [
                "#ff5565",
                "#ff5563",
                "#ff5365",
                "#fff3c6"
            ]
        },
        "250": {
            "name": "Ireland",
            "swatch": [
                "#ffc15a",
                "#ffbf5a",
                "#ffc35a",
                "#fff3c6"
            ]
        },
        "251": {
            "name": "Italy",
            "swatch": [
                "#ff6573",
                "#ff6675",
                "#ff6673",
                "#fff3c6"
            ]
        },
        "252": {
            "name": "Netherlands",
            "swatch": [
                "#ff6573",
                "#ff6675",
                "#5a65ff",
                "#fff3c6"
            ]
        },
        "253": {
            "name": "Rainbow",
            "swatch": [
                "#ffff44",
                "#ff6573",
                "#ffc15a",
                "#ffff47"
            ]
        },
        "254": {
            "name": "Trans",
            "swatch": [
                "#84ffff",
                "#ffdce9",
                "#83ffff",
                "#fff3c6"
            ]
        },
        "255": {
            "name": "Metal Smooth Bronze",
            "swatch": [
                "#474947",
                "#4c4d47",
                "#4a4d47",
                "#47494a"
            ]
        },
        "256": {
            "name": "Metal Panel Bronze",
            "swatch": [
                "#474a47",
                "#474a47",
                "#4a4a4a",
                "#4a494a"
            ]
        },
        "257": {
            "name": "Diamondplate Bronze",
            "swatch": [
                "#474a47",
                "#4a4a4a",
                "#4a494a",
                "#4a4d4a"
            ]
        },
        "258": {
            "name": "Plastic Olive Dark",
            "swatch": [
                "#6b8a57",
                "#6b8957",
                "#6b8a5a",
                "#6b8857"
            ]
        },
        "259": {
            "name": "Plastic Olive Light",
            "swatch": [
                "#c0df91",
                "#bddf91",
                "#bddf8e",
                "#bddf91"
            ]
        },
        "260": {
            "name": "Plastic Pastel Blue",
            "swatch": [
                "#7bccff",
                "#7bccff",
                "#7bcbff",
                "#7bcfff"
            ]
        },
        "261": {
            "name": "Plastic Pastel Green",
            "swatch": [
                "#9cffa5",
                "#9cffa5",
                "#99ffa5",
                "#9cffa7"
            ]
        },
        "262": {
            "name": "Plastic Pastel Orange",
            "swatch": [
                "#fff4b5",
                "#fff5b5",
                "#fff3b5",
                "#fff7b5"
            ]
        },
        "263": {
            "name": "Plastic Pastel Purple",
            "swatch": [
                "#ffceff",
                "#ffcfff",
                "#ffcdff",
                "#ffcbff"
            ]
        },
        "264": {
            "name": "Plastic Pastel Red",
            "swatch": [
                "#f78f96",
                "#f48e99",
                "#f79099",
                "#f48f99"
            ]
        },
        "265": {
            "name": "Plastic Pastel Yellow",
            "swatch": [
                "#ffffa2",
                "#ffff9f",
                "#ffffa1",
                "#ffffa5"
            ]
        },
        "266": {
            "name": "Metal Smooth Chrome Rose",
            "swatch": [
                "#686689",
                "#706b8c",
                "#686689",
                "#626189"
            ]
        },
        "267": {
            "name": "Metal Panel Chrome Rose",
            "swatch": [
                "#6b678c",
                "#6a6789",
                "#6b668c",
                "#6b668c"
            ]
        },
        "268": {
            "name": "Diamondplate Chrome Rose",
            "swatch": [
                "#6b678c",
                "#6b698c",
                "#6b658c",
                "#6b668c"
            ]
        },
        "269": {
            "name": "Grille Chrome",
            "swatch": [
                "#5279bd",
                "#5279bd",
                "#424139",
                "#5279bd"
            ]
        },
        "270": {
            "name": "Grille Gold",
            "swatch": [
                "#5d3908",
                "#5a3808",
                "#736d29",
                "#736d29"
            ]
        },
        "271": {
            "name": "Grille Bronze",
            "swatch": [
                "#4a4d4a",
                "#3f2615",
                "#4a4d4a",
                "#3f2615"
            ]
        },
        "272": {
            "name": "Grille Chrome Rose",
            "swatch": [
                "#736d8c",
                "#5d3526",
                "#736d8c",
                "#5a3829"
            ]
        },
        "273": {
            "name": "Grille Black",
            "swatch": [
                "#080808",
                "#080808",
                "#080808",
                "#080808"
            ]
        },
        "274": {
            "name": "Grille Gray",
            "swatch": [
                "#6b809c",
                "#6b7d9c",
                "#6b7e9c",
                "#423f39"
            ]
        },
        "275": {
            "name": "Grille White",
            "swatch": [
                "#ffffff",
                "#ffffff",
                "#ceebff",
                "#ffffff"
            ]
        },
        "276": {
            "name": "Grille Chrome SS",
            "swatch": [
                "#ffffff",
                "#5279bd",
                "#5279bd",
                "#5279bd"
            ]
        },
        "277": {
            "name": "Grille Gold SS",
            "swatch": [
                "#6b6929",
                "#736d29",
                "#736d29",
                "#6d6a29"
            ]
        },
        "278": {
            "name": "Grille Bronze SS",
            "swatch": [
                "#4a4d4a",
                "#4a4d4a",
                "#4c4b4a",
                "#4a4d4a"
            ]
        },
        "279": {
            "name": "Grille Chrome Rose SS",
            "swatch": [
                "#736d8c",
                "#736d8c",
                "#706a8c",
                "#736d8c"
            ]
        },
        "280": {
            "name": "Grille Black SS",
            "swatch": [
                "#0f1521",
                "#101521",
                "#101521",
                "#0f1421"
            ]
        },
        "281": {
            "name": "Grille Gray SS",
            "swatch": [
                "#6b809c",
                "#52659c",
                "#6d809c",
                "#6b829c"
            ]
        },
        "282": {
            "name": "Grille White SS",
            "swatch": [
                "#ffffff",
                "#ffffff",
                "#ffffff",
                "#ffffff"
            ]
        },
        "283": {
            "name": "Dark Red",
            "swatch": [
                "#893844",
                "#893844",
                "#8c3944",
                "#863744"
            ]
        },
        "284": {
            "name": "Dark Reddish Purple",
            "swatch": [
                "#c83a5f",
                "#c83a5f",
                "#c63a60",
                "#c63860"
            ]
        },
        "285": {
            "name": "Red",
            "swatch": [
                "#ff3f4c",
                "#ff3f4a",
                "#ff3d4a",
                "#ff414a"
            ]
        },
        "286": {
            "name": "Orange Dutch",
            "swatch": [
                "#ff9e4c",
                "#ff9b4a",
                "#ff9a4a",
                "#ff9c4a"
            ]
        },
        "287": {
            "name": "Warm Yellow",
            "swatch": [
                "#ffeb4c",
                "#ffe74a",
                "#ffe84a",
                "#ffeb4a"
            ]
        },
        "288": {
            "name": "Yellow",
            "swatch": [
                "#ffff4c",
                "#ffff4a",
                "#ffff4c",
                "#ffff4a"
            ]
        },
        "289": {
            "name": "Light Yellow",
            "swatch": [
                "#ffffa2",
                "#ffff9f",
                "#ffffa1",
                "#ffffa5"
            ]
        },
        "290": {
            "name": "Dark Dark Blue",
            "swatch": [
                "#363865",
                "#363863",
                "#363865",
                "#333863"
            ]
        },
        "291": {
            "name": "Dark Blue",
            "swatch": [
                "#3e40f4",
                "#3e40f4",
                "#3f3ff7",
                "#3f3ff7"
            ]
        },
        "292": {
            "name": "Blue Dutch",
            "swatch": [
                "#3667ff",
                "#3669ff",
                "#3667ff",
                "#3669ff"
            ]
        },
        "293": {
            "name": "Blue",
            "swatch": [
                "#398cff",
                "#398bff",
                "#398eff",
                "#398cff"
            ]
        },
        "294": {
            "name": "Navy Blue",
            "swatch": [
                "#4f619f",
                "#4f619f",
                "#4f5f9c",
                "#4c619c"
            ]
        },
        "295": {
            "name": "Light Blue",
            "swatch": [
                "#cbffff",
                "#c8ffff",
                "#cbffff",
                "#c6fcff"
            ]
        },
        "296": {
            "name": "Lime Green",
            "swatch": [
                "#a5ff4a",
                "#a5ff4c",
                "#a5ff4a",
                "#a5ff4c"
            ]
        },
        "297": {
            "name": "Green",
            "swatch": [
                "#4af04a",
                "#4af14a",
                "#4af14a",
                "#47f147"
            ]
        },
        "298": {
            "name": "Olive",
            "swatch": [
                "#94b784",
                "#94b884",
                "#94b884",
                "#94b883"
            ]
        },
        "299": {
            "name": "Light Green",
            "swatch": [
                "#e1ffd6",
                "#e1ffd6",
                "#deffd3",
                "#deffd6"
            ]
        },
        "300": {
            "name": "Rev Green 1",
            "swatch": [
                "#ffffaf",
                "#ffffb2",
                "#ffffad",
                "#ffffb0"
            ]
        },
        "301": {
            "name": "Rev Green 2",
            "swatch": [
                "#f9ff94",
                "#fcff94",
                "#fcff94",
                "#f7ff8e"
            ]
        },
        "302": {
            "name": "Dark Green",
            "swatch": [
                "#31ae44",
                "#31ae44",
                "#31ae47",
                "#33ae47"
            ]
        },
        "303": {
            "name": "Purple Darker",
            "swatch": [
                "#7b39c0",
                "#7b39c0",
                "#7b3ac0",
                "#7b39bd"
            ]
        },
        "304": {
            "name": "Purple Lighter Darker",
            "swatch": [
                "#a280bd",
                "#a27dbd",
                "#a17fc0",
                "#a280bd"
            ]
        },
        "305": {
            "name": "Purple",
            "swatch": [
                "#ff3cc8",
                "#ff3ccb",
                "#ff3cc6",
                "#ff3dc8"
            ]
        },
        "306": {
            "name": "Pink",
            "swatch": [
                "#ff89ff",
                "#ff88ff",
                "#ff87ff",
                "#ff86ff"
            ]
        },
        "307": {
            "name": "HamRoze",
            "swatch": [
                "#ffb4b2",
                "#ffb5b2",
                "#ffb3af",
                "#ffb2ad"
            ]
        },
        "308": {
            "name": "Rose",
            "swatch": [
                "#f4797e",
                "#f4797e",
                "#f7797b",
                "#f4777b"
            ]
        },
        "309": {
            "name": "Brown",
            "swatch": [
                "#b57a52",
                "#b57a52",
                "#b27952",
                "#b57b52"
            ]
        },
        "310": {
            "name": "Beige",
            "swatch": [
                "#ffff94",
                "#ffff91",
                "#ffff8e",
                "#ffff8f"
            ]
        },
        "311": {
            "name": "BastBeige",
            "swatch": [
                "#ffffd3",
                "#ffffd0",
                "#ffffce",
                "#ffffcd"
            ]
        },
        "312": {
            "name": "Black",
            "swatch": [
                "#313844",
                "#313844",
                "#313744",
                "#313744"
            ]
        },
        "313": {
            "name": "Dark Gray",
            "swatch": [
                "#6b6f73",
                "#6b6e73",
                "#6b6e73",
                "#6b6f73"
            ]
        },
        "314": {
            "name": "Mid Gray",
            "swatch": [
                "#c5c3c0",
                "#c5c4c0",
                "#c5c3c0",
                "#c5c4c0"
            ]
        },
        "315": {
            "name": "Light Gray",
            "swatch": [
                "#fff3c6",
                "#fff3c6",
                "#fff3c6",
                "#fff3c6"
            ]
        },
        "316": {
            "name": "White",
            "swatch": [
                "#fff3c6",
                "#fff3c6",
                "#fff3c6",
                "#fff3c6"
            ]
        },
        "317": {
            "name": "Fly Dark Blue",
            "swatch": [
                "#31518c",
                "#31518c",
                "#31528c",
                "#31528c"
            ]
        },
        "318": {
            "name": "Blue Dutch",
            "swatch": [
                "#1d55ff",
                "#1d55ff",
                "#1e55ff",
                "#1d55ff"
            ]
        },
        "319": {
            "name": "Blue",
            "swatch": [
                "#1e79ff",
                "#1e79ff",
                "#1e79ff",
                "#2177ff"
            ]
        },
        "320": {
            "name": "Fly Blue",
            "swatch": [
                "#33c7ff",
                "#33c7ff",
                "#31c4ff",
                "#33c6ff"
            ]
        },
        "321": {
            "name": "Kosmo Blue",
            "swatch": [
                "#31ecff",
                "#31ecff",
                "#31edff",
                "#31ebff"
            ]
        },
        "322": {
            "name": "Turquoise",
            "swatch": [
                "#52ffff",
                "#52ffff",
                "#52ffff",
                "#4fffff"
            ]
        },
        "323": {
            "name": "Purple Darker",
            "swatch": [
                "#6228b5",
                "#6228b5",
                "#6028b2",
                "#6328b5"
            ]
        },
        "324": {
            "name": "Purple Lighter Darker",
            "swatch": [
                "#846bb5",
                "#846bb5",
                "#866bb5",
                "#846db5"
            ]
        },
        "325": {
            "name": "Tompoes Pink",
            "swatch": [
                "#ffbeff",
                "#ffbbff",
                "#ffbcff",
                "#ffbaff"
            ]
        },
        "326": {
            "name": "Old Red",
            "swatch": [
                "#ac2857",
                "#ad2857",
                "#ad2657",
                "#ac2857"
            ]
        },
        "327": {
            "name": "Mayflower Red",
            "swatch": [
                "#f7283c",
                "#f7283c",
                "#f72839",
                "#f72839"
            ]
        },
        "328": {
            "name": "Orange Dutch",
            "swatch": [
                "#ff8942",
                "#ff8944",
                "#ff8742",
                "#ff8842"
            ]
        },
        "329": {
            "name": "Orange",
            "swatch": [
                "#ffb342",
                "#ffb242",
                "#ffb344",
                "#ffb042"
            ]
        },
        "330": {
            "name": "Warm Yellow",
            "swatch": [
                "#ffff42",
                "#ffff44",
                "#ffff42",
                "#ffff44"
            ]
        },
        "331": {
            "name": "Wes Green",
            "swatch": [
                "#ffff5a",
                "#ffff58",
                "#ffff5a",
                "#ffff58"
            ]
        },
        "332": {
            "name": "Dark Green",
            "swatch": [
                "#1b9a3e",
                "#1b9a3e",
                "#189a3f",
                "#1b9a3e"
            ]
        },
        "333": {
            "name": "Green",
            "swatch": [
                "#2edb3f",
                "#2edb3f",
                "#2edc3f",
                "#2edc3f"
            ]
        },
        "334": {
            "name": "Light Green",
            "swatch": [
                "#c3ffcb",
                "#c3ffcb",
                "#c6ffcb",
                "#c0ffc8"
            ]
        },
        "335": {
            "name": "Black",
            "swatch": [
                "#182439",
                "#182439",
                "#182439",
                "#182239"
            ]
        },
        "336": {
            "name": "Dark Dark Gray",
            "swatch": [
                "#3c485a",
                "#3c485a",
                "#39475a",
                "#3c475a"
            ]
        },
        "337": {
            "name": "Dark Gray",
            "swatch": [
                "#545e6e",
                "#545e6e",
                "#545f6e",
                "#525e6b"
            ]
        },
        "338": {
            "name": "Mid Gray",
            "swatch": [
                "#adb0b5",
                "#adb2b5",
                "#adb2b5",
                "#adafb5"
            ]
        },
        "339": {
            "name": "Light Gray",
            "swatch": [
                "#e7e8e7",
                "#e7e8e7",
                "#e7e9e7",
                "#e6e8e7"
            ]
        },
        "340": {
            "name": "White",
            "swatch": [
                "#fff3c6",
                "#fff3c6",
                "#fff3c6",
                "#fff3c6"
            ]
        },
        "341": {
            "name": "Red Bricks",
            "swatch": [
                "#ff8284",
                "#ff8286",
                "#e4767b",
                "#e7757b"
            ]
        },
        "342": {
            "name": "Dark Red Bricks",
            "swatch": [
                "#bd6d73",
                "#d3767b",
                "#bd6d73",
                "#a5656b"
            ]
        },
        "343": {
            "name": "Yellow Bricks",
            "swatch": [
                "#ffffa2",
                "#ffffc6",
                "#ffffc3",
                "#fffff1"
            ]
        },
        "344": {
            "name": "Desert Bricks",
            "swatch": [
                "#e7cbad",
                "#ffe3bd",
                "#fff7ce",
                "#ffebc6"
            ]
        },
        "345": {
            "name": "Transparent Ice White",
            "swatch": [
                "#cef0ff",
                "#dcfdff",
                "#d9fcff",
                "#dbfdff"
            ]
        },
        "346": {
            "name": "Transparent Ice Light Blue",
            "swatch": [
                "#b5f0ff",
                "#e0f3ff",
                "#c0fcff",
                "#c0faff"
            ]
        },
        "347": {
            "name": "Transparent Ice Blue",
            "swatch": [
                "#93e3ff",
                "#8de0ff",
                "#90e0ff",
                "#91e1ff"
            ]
        },
        "348": {
            "name": "Transparent Ice Dark Blue",
            "swatch": [
                "#b5ccff",
                "#b5ccff",
                "#b4ccff",
                "#b5cbff"
            ]
        },
        "349": {
            "name": "Flesh",
            "swatch": [
                "#ff2439",
                "#ff2839",
                "#f72439",
                "#ef2439"
            ]
        },
        "350": {
            "name": "Ice Black",
            "swatch": [
                "#213963",
                "#213a63",
                "#213c63",
                "#233d63"
            ]
        },
        "351": {
            "name": "Ice Green",
            "swatch": [
                "#368c63",
                "#338b63",
                "#368f63",
                "#368c63"
            ]
        },
        "352": {
            "name": "Ice Purple",
            "swatch": [
                "#8652bd",
                "#7b52bd",
                "#7b51bd",
                "#7b53bd"
            ]
        },
        "353": {
            "name": "Ice Red",
            "swatch": [
                "#9c3042",
                "#a2303f",
                "#9c313f",
                "#993042"
            ]
        },
        "354": {
            "name": "Transparent Ice Black",
            "swatch": [
                "#78808c",
                "#757e8c",
                "#737e89",
                "#79808c"
            ]
        },
        "355": {
            "name": "Transparent Ice Green",
            "swatch": [
                "#80ba94",
                "#7cba94",
                "#83c396",
                "#81bb95"
            ]
        },
        "356": {
            "name": "Transparent Ice Purple",
            "swatch": [
                "#ad7dce",
                "#ad7fce",
                "#ad83d0",
                "#a27dce"
            ]
        },
        "357": {
            "name": "Transparent Ice Red",
            "swatch": [
                "#dd666f",
                "#d76973",
                "#ce666f",
                "#df686f"
            ]
        },
        "358": {
            "name": "v11 Grass Brown",
            "swatch": [
                "#c6964a",
                "#c6964a",
                "#c6964d",
                "#c6944a"
            ]
        },
        "359": {
            "name": "v11 Grass Browner",
            "swatch": [
                "#946641",
                "#946542",
                "#996742",
                "#9c6942"
            ]
        },
        "360": {
            "name": "v11 Grass Dark Olive",
            "swatch": [
                "#7e793f",
                "#847d42",
                "#817a42",
                "#7e7742"
            ]
        },
        "361": {
            "name": "v11 Grass Haybale",
            "swatch": [
                "#ffdb5d",
                "#ffdb5a",
                "#ffd95a",
                "#ffd85a"
            ]
        },
        "362": {
            "name": "v11 Grass Light Olive",
            "swatch": [
                "#b5bc63",
                "#b5bb63",
                "#b5ba63",
                "#b5be63"
            ]
        },
        "363": {
            "name": "v11 Grass Olive",
            "swatch": [
                "#94b23f",
                "#94b242",
                "#94b23f",
                "#94b242"
            ]
        },
        "364": {
            "name": "v11 Grass Purplish",
            "swatch": [
                "#d05d52",
                "#ce5d52",
                "#d65d52",
                "#d35d52"
            ]
        },
        "365": {
            "name": "v11 Grass Reddish",
            "swatch": [
                "#d86d42",
                "#d66d42",
                "#db6e44",
                "#de7142"
            ]
        },
        "366": {
            "name": "Brick Light Gray",
            "swatch": [
                "#fffff7",
                "#fff8ef",
                "#fffbef",
                "#fff3c6"
            ]
        },
        "367": {
            "name": "Brick Light Gray Shiny",
            "swatch": [
                "#fffff7",
                "#f7fbf7",
                "#fffcf9",
                "#fff3c6"
            ]
        },
        "368": {
            "name": "Brick Gray",
            "swatch": [
                "#a5a6a5",
                "#a4a6a2",
                "#868989",
                "#848684"
            ]
        },
        "369": {
            "name": "Brick Orange",
            "swatch": [
                "#ffe375",
                "#ffe373",
                "#fff599",
                "#ffca6d"
            ]
        },
        "370": {
            "name": "Brick Dark Green Shiny",
            "swatch": [
                "#3f7a5d",
                "#3f715d",
                "#42795a",
                "#42715a"
            ]
        },
        "371": {
            "name": "Brick Purple Shiny",
            "swatch": [
                "#6b4a8c",
                "#6b498c",
                "#795197",
                "#7b5194"
            ]
        },
        "372": {
            "name": "Brick Turquoise Shiny",
            "swatch": [
                "#42d7c6",
                "#39beb5",
                "#42dbc6",
                "#31beb5"
            ]
        },
        "373": {
            "name": "Cobble Browngray",
            "swatch": [
                "#c6af9a",
                "#c6ae9c",
                "#a5928c",
                "#d6b6a5"
            ]
        },
        "374": {
            "name": "Cobble Gray",
            "swatch": [
                "#a4a6a2",
                "#a5a6a5",
                "#a4a6a2",
                "#a5a6a5"
            ]
        },
        "375": {
            "name": "Cobble Yellow",
            "swatch": [
                "#ffffc3",
                "#ffffa2",
                "#fffff1",
                "#ffffc6"
            ]
        },
        "376": {
            "name": "Cobble Green",
            "swatch": [
                "#42715a",
                "#3f715d",
                "#3f7a5d",
                "#3f6f5a"
            ]
        },
        "377": {
            "name": "Cobble Blue",
            "swatch": [
                "#3f529f",
                "#3c5294",
                "#42529c",
                "#42519c"
            ]
        },
        "378": {
            "name": "Cobble Black Shiny",
            "swatch": [
                "#525d6b",
                "#525d6b",
                "#636e7b",
                "#636d7b"
            ]
        },
        "379": {
            "name": "Cobble Black",
            "swatch": [
                "#6a6e73",
                "#6b6d73",
                "#6a6e73",
                "#7b8084"
            ]
        },
        "380": {
            "name": "Cobble Dark Black",
            "swatch": [
                "#4a4f57",
                "#494e57",
                "#52565d",
                "#4a515a"
            ]
        },
        "381": {
            "name": "Brick Dark Gray",
            "swatch": [
                "#6b6d73",
                "#707173",
                "#6b7173",
                "#6a6d73"
            ]
        },
        "382": {
            "name": "Brick Black",
            "swatch": [
                "#4a515a",
                "#4c515a",
                "#424952",
                "#444a52"
            ]
        }
    }

    toolkist_color.colorPalette = function(paintIds)
    {
        const palette = {};
        for(const key in toolkist_color.paints)
        {
            if(paintIds == undefined || paintIds.length == 0 || paintIds.includes(Number(key)))
            {
                palette[key] = new toolkist_color.Color().fromHex(toolkist_color.paints[key].swatch[0]);                
            }
        }
        return palette;
    }

    toolkist_color.getColor = function(paintId)
    {
        var id = toolkist_color.paints.hasOwnProperty(paintId) ? paintId : 6;
        return new toolkist_color.Color().fromHex(toolkist_color.paints[id].swatch[0]);
    }

    toolkist_color.paintSelection = function($container, callback, theClass)
    {
        var selectionBox = $('<div>').addClass('selection-box').css({
            'width': '250px',
            'height': '30px',
            'position': 'relative'
        });
        $container.append(selectionBox);

        var selectionBoxPreview = $('<div>').addClass('selection-box-preview').css({
                "background-color": '#000000',
                "width": '30px',
                "height": '30px',
                'top': 0,
                'left': 0,
                'position': 'absolute'
        });
        selectionBox.append(selectionBoxPreview);

        var selectionBoxText = $('<div>').addClass('selection-box-text').css({
            'top': 0,
            'left': 40,
            'position': 'absolute'
        });
        selectionBox.append(selectionBoxText);

        var selectionWindow = $('<div>').addClass('selection-window').css({
            'width': '250px',
            'height': '400px',
            'overflow-y': 'scroll',
            'position': 'absolute',
            'top': '30px'
        });
        selectionBox.append(selectionWindow);

        var scrollableList = $('<div>').addClass('scrollable-list');
        selectionWindow.append(scrollableList);

        for(const id in toolkist_color.paints)
        {
            var listItem = $('<div>').addClass('list-item').css({
                'width': '250px',
                'height': '30px',
                'position': 'relative'
            });
            listItem.data({"id" : id});
            
            var colorBox = $('<div>').addClass('color-box').css({
                "background-color": toolkist_color.paints[id].swatch[0],
                "width": '30px',
                "height": '30px',
                'top': 0,
                'left': 0,
                'position': 'absolute'
            });
            listItem.append(colorBox);
            
            var itemText = $("<span>").addClass("item-text").text(toolkist_color.paints[id].name).css({
                'top': 0,
                'left': 40,
                'position': 'absolute'
            });
            listItem.append(itemText);

            scrollableList.append(listItem);

            listItem.click(function () {
                $(".list-item").removeClass("selected");
                $(this).addClass("selected");
    
                // Get the selected color and text
                var selectedColor = $(this).find(".color-box").css("background-color");
                var selectedItemText = $(this).find(".item-text").text();
    
                // Update the button text and close the window
                selectionBoxPreview.css("background-color", selectedColor);
                selectionBoxText.text(selectedItemText);
                selectionBox.data('id', $(this).data('id'));
                $('.selectionWindow').hide();
                callback(selectionBox.data('id'), selectedColor, theClass);
            });

            // Toggle the selection window on button click
            selectionBox.click(function () {
                selectionWindow.toggle();
            });

            if(id == 0){
                listItem.click();
            }
        }

        selectionWindow.hide();
    }

    return toolkist_color;
})(jQuery)