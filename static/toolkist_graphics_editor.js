var toolkist_graphics_editor = (function($) {
    var toolkist_graphics_editor = {};
    toolkist_graphics_editor.Editor = class {        

        constructor(containerID) 
        {
            fabric.Object.prototype.shapeType = "";
            fabric.Object.prototype.paintID = 0;

            // Initialize the container
            this.container = $('#' + containerID);
            this.container.width("100%");
            this.container.height("800px");
            this.container.css({
                backgroundColor: 'black',
                position: 'relative',
            });

            //Create the menu bar
            this.menubar = $('<div>');
            this.container.append(this.menubar);
            this.menubar.css({
                backgroundColor: '#777777',
                height: '60px',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%'
            });

            //Create the side bar
            this.sidebar = $('<div>');
            this.container.append(this.sidebar);
            this.sidebar.css({
                backgroundColor: '#555555',
                height: '740px',
                width: '250px',
                position: 'absolute',
                bottom: 0,
                left: 0
            })

            //Add the paint selection
            toolkist_color.paintSelection(this.sidebar, this.paintSelected, this);

            //Create the working area
            this.worksheet = $('<div>');
            this.container.append(this.worksheet);
            this.worksheet.css({
                backgroundColor: '#000000',
                height: '740px',
                width: 'calc(100% - 250px)',
                position: 'absolute',
                right: 0,
                bottom: 0
            })

            //Initialize the canvas
            this.canvas = $('<canvas>');
            this.canvas.attr('id', 'fabric-canvas');
            this.worksheet.append(this.canvas);

            this.canvas.attr('width', this.worksheet.width());
            this.canvas.attr('height', this.worksheet.height());
            
            this.fabric = new fabric.Canvas('fabric-canvas', {
                backgroundColor: 'rgb(0,0,0)',
                selectionColor: 'rgba(1,1,1,0.1)',
                selectionLineWidth: 2
            });
            
            //Always remove skew from parts.
            this.fabric.on('before:render', () =>
            {
                var objs = this.fabric.getObjects();
                for(var i in objs)
                {
                    objs[i].set({skewX: 0, skewY: 0});
                }
            });

            this.fabric.on('mouse:wheel', (opt) => {
                var delta = opt.e.deltaY;
                var zoom = this.fabric.getZoom();
                zoom *= 0.999 ** delta;
                if (zoom > 20) zoom = 20;
                if (zoom < 0.01) zoom = 0.01;
                this.fabric.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
                opt.e.preventDefault();
                opt.e.stopPropagation();
            });        

            this.fabric.on('mouse:down', (opt) => {
                var evt = opt.e;
                if (evt.altKey === true) {
                    this.isDragging = true;
                    this.selection = false;
                    this.lastPosX = evt.clientX;
                    this.lastPosY = evt.clientY;
                }
            });

            this.fabric.on('mouse:move', (opt) => {
                if (this.isDragging) {
                    var e = opt.e;
                    var vpt = this.fabric.viewportTransform;
                    vpt[4] += e.clientX - this.lastPosX;
                    vpt[5] += e.clientY - this.lastPosY;
                    this.fabric.requestRenderAll();
                    this.lastPosX = e.clientX;
                    this.lastPosY = e.clientY;
                }              
            });
            
            this.fabric.on('mouse:up', (opt) => {
                // on mouse up we want to recalculate new interaction
                // for all objects, so we call setViewportTransform
                this.fabric.setViewportTransform(this.fabric.viewportTransform);
                this.isDragging = false;
                this.selection = true;
            });

            //Keyboard controls
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Delete' || event.code === 'Delete') {
                   this.fabric.remove(...this.fabric.getActiveObjects());
                }
    
                if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
                    //this.copy();
                }
    
                if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
                    //this.paste();
                }

                /*
                if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
                    // Ctrl+C (Cmd+C on Mac) was pressed
                    undo();
                    // Add your copy handling logic here
                }
    
                if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
                    // Ctrl+C (Cmd+C on Mac) was pressed
                    redo();
                    // Add your copy handling logic here
                }*/
            });

            //Action buttons
            this.buttons = {
                open : {
                    icon: '<i style="width: 40px; height: 40px; margin: 5px; font-size: 32px; line-height: 40px; text-align:center" class="fa fa-folder-open" aria-hidden="true"></i>',
                    action: () => {
                        var input = $('<input type="file">');
                        input.click();
                        input.on('change', () => {
                            var file = input[0].files[0];
                            var reader = new FileReader();
                            reader.onload = (e) => {
                                // Parse the file content as JSON
                                try {
                                    var jsonData = JSON.parse(e.target.result);
                                    // Now 'jsonData' contains the parsed JSON data from the selected file
                                    this.fabric.loadFromJSON(jsonData);
                                    // You can further process or use 'jsonData' as needed
                                } catch (error) {
                                    console.error('Error parsing JSON:', error);
                                    // Handle any errors during JSON parsing
                                }
                                finally{
                                    input.remove();
                                }
                            };
                            reader.readAsText(file);
                        });
                        input.appendTo('body');
                    }
                },
                save : {
                    icon: '<i style="width: 40px; height: 40px; margin: 5px; font-size: 32px; line-height: 40px; text-align:center" class="fa fa-floppy-disk" aria-hidden="true"></i>',
                    action: () => {
                        var worksheet = this.fabric.toJSON(['shapeType', 'blockID', 'paintID']);
                        toolkist_fs.directDownload('worksheet.json', JSON.stringify(worksheet));
                    }
                },
                undo : {
                    icon: '<i style="width: 40px; height: 40px; margin: 5px; font-size: 40px; line-height: 40px; text-align:center" class="fa fa-rotate-left" aria-hidden="true"></i>',
                    action: function(){
                        console.log("undo");
                    }
                },
                redo : {
                    icon: '<i style="width: 40px; height: 40px; margin: 5px; font-size: 40px; line-height: 40px; text-align:center" class="fa fa-rotate-right" aria-hidden="true"></i>',
                    action: function(){
                        console.log("redo");
                    }
                },
                backward : {
                    icon: '<i style="width: 40px; height: 40px; margin: 5px; font-size: 40px; line-height: 40px; text-align:center" class="fa fa-backward-step" aria-hidden="true"></i>',
                    action: function(){
                        console.log("backward");
                    }
                },
                forward : {
                    icon: '<i style="width: 40px; height: 40px; margin: 5px; font-size: 40px; line-height: 40px; text-align:center" class="fa fa-forward-step" aria-hidden="true"></i>',
                    action: function(){
                        console.log("forward");
                    }
                },
                export : {
                    icon: '<i style="width: 40px; height: 40px; margin: 5px; font-size: 32px; line-height: 40px; text-align:center" class="fa fa-file-export" aria-hidden="true"></i>',
                    action: () => {
                        var worksheet = this.fabric.toJSON(['shapeType', 'blockID', 'paintID']);
                        var blocks = [];
                    
                        for(const i in worksheet.objects)
                        {
                            var obj = worksheet.objects[i];
                            console.log
                            var size = {x: obj.scaleX * obj.width, y: obj.scaleY * obj.height};
                            var centerPosition = {x: obj.left + size.x / 2, y: obj.top + size.y / 2};
                            var radians = (obj.angle * Math.PI) / 180;

                            // Rotate the center point around the top-left corner
                            var rotatedCenterX = obj.left + Math.cos(radians) * (centerPosition.x - obj.left) - Math.sin(radians) * (centerPosition.y - obj.top);
                            var rotatedCenterY = obj.top + Math.sin(radians) * (centerPosition.x - obj.left) + Math.cos(radians) * (centerPosition.y - obj.top);

                            var block = new toolkist.Block();
                            block.blockID = obj.blockID;
                            block.position.x = rotatedCenterX / 10;
                            block.position.z = rotatedCenterY / 10;
                            block.euler.y = -obj.angle;
                            block.scale.x = obj.scaleX;
                            block.scale.y = 0.01;
                            block.scale.z = obj.scaleY;
                            block.options[0] = 1;
                            block.paints[0] = Number(obj.paintID);
                            //console.log(block);
                            blocks.push(block);
                        }


                        var header = new toolkist.Header().generateHeader("Toolkist", blocks.length);
                        var zeeplevel = new toolkist.Zeeplevel('Graphics_editor').setHeader(header).setBlocks(blocks);
                        //console.log(zeeplevel.toCSV());                        
                        toolkist_fs.directDownload('graphic.zeeplevel', zeeplevel.toCSV());
                    }
                }
            }

            //Shape buttons
            this.shapes = {
                circle : {
                    icon : '<svg width="50" height="50"><circle cx="25" cy="25" r="20" stroke="white" stroke-width="2" fill="white"/></svg>',
                    action: () => this.createShape('circle'),
                    create : function(){
                        return new fabric.Circle({
                            left: 0,
                            top: 0,
                            fill: 'white',
                            radius: 80,
                            lockSkewingX: true,
                            lockSkewingY: true,
                            shapeType: 'circle',
                            blockID: 1303,
                            paintID: 0
                        });
                    }
                },
                square : {
                    icon: '<svg width="50" height="50"><rect x="5" y="5" width="40" height="40" fill="white" stroke="white" stroke-width="2"/></svg>',
                    action: () => this.createShape('square'),
                    create : function(){
                        return new fabric.Rect({
                            fill: 'white',
                            width: 160,
                            height: 160,
                            lockSkewingX: true,
                            lockSkewingY: true,
                            shapeType: 'square',
                            blockID: 98,
                            paintID: 0
                        });
                    }
                },
                rightTriangle : {
                    icon: '<svg width="50" height="50"><path d="M5 5 L45 5 L5 45 L5 5" fill="white" stroke="white" stroke-width="2"/></svg>',
                    action: () => this.createShape('rightTriangle'),
                    create : function(){
                        return new fabric.Path('M0 0 L160 0 L0 160 L0 0', {
                            fill: 'white',
                            width: 160,
                            height: 160,
                            lockSkewingX: true,
                            lockSkewingY: true,
                            shapeType: 'rightTriangle',
                            blockID: 92,
                            paintID: 0
                        });
                    }
                },
                quarterCircle : {
                    icon: '<svg width="50" height="50"><path d="M5 45 L5 5 L45 5 A45 45 0 0 1 5 45" fill="white" stroke="white" stroke-width="2"/></svg>',
                    action: () => this.createShape('quarterCircle'),
                    create : function(){
                        return new fabric.Path('M0 160 L0 0 L160 0 A160 160 0 0 1 0 160', {
                            fill: 'white',
                            width: 160,
                            height: 160,
                            lockSkewingX: true,
                            lockSkewingY: true,
                            shapeType: 'quarterCircle',
                            blockID: 93,
                            paintID: 0
                        });
                    }
                },
                halfPipe : {
                    icon: '<svg width="50" height="50"><path d="M45 5 L45 45 L5 45 A45 45 0 0 0 45 5" fill="white" stroke="white" stroke-width="2"/></svg>',
                    action: () => this.createShape('halfPipe'),
                    create : function(){
                        return new fabric.Path('M160 0 L160 160 L0 160 A160 160 0 0 0 160 0', {
                            fill: 'white',
                            width: 160,
                            height: 160,
                            lockSkewingX: true,
                            lockSkewingY: true,
                            shapeType: 'halfPipe',
                            blockID: 95,
                            paintID: 0
                        });
                    }
                },
                triangle : {
                    icon: '<svg width="50" height="50"> <path d="M25 25 L45 45 L5 45 L25 25" fill="none" stroke="black" stroke-width="2"/></svg>',
                    action: () => this.createShape('triangle'),
                    create : function(){
                        return new fabric.Path('M80 80 L160 160 L0 160 L80 80', {
                            fill: 'white',
                            width: 160,
                            height: 160,
                            lockSkewingX: true,
                            lockSkewingY: true,
                            shapeType: 'triangle',
                            blockID: 1570,
                            paintID: 0
                        });
                    }
                },
                
            }

            this.addMenubarButton(this.buttons.save);
            this.addMenubarButton(this.buttons.open);
            this.addMenubarButton(this.buttons.export);
            //this.addMenubarButton(this.buttons.undo);
            //this.addMenubarButton(this.buttons.redo);
            //this.addMenubarButton(this.buttons.backward);
            //this.addMenubarButton(this.buttons.forward);

            this.addMenubarButton(this.shapes.circle);
            this.addMenubarButton(this.shapes.square);
            this.addMenubarButton(this.shapes.rightTriangle);
            this.addMenubarButton(this.shapes.quarterCircle);
            this.addMenubarButton(this.shapes.halfPipe);
            //this.addMenubarButton(this.shapes.triangle);
        }

        addMenubarButton(buttonInfo)
        {
            const buttonSize = 50;
            const button = $('<div>');
            button.css({
                width: buttonSize + 'px',
                height: buttonSize + 'px',
                backgroundColor: '#999999',
                marginLeft: '5px',
                marginTop: '5px',
                float: 'left'
            });
            button.html(buttonInfo.icon);
            button.on('click', buttonInfo.action);
            this.menubar.append(button);
        }

        createShape(shapeType)
        {
            var shapeInfo = this.shapes[shapeType];
            var shape = shapeInfo.create();            
            var center = this.getViewportCenter();
            shape.left = center.x;
            shape.top = center.y;
            shape.fill = toolkist_graphics_editor.selectedColor;
            shape.paintID = toolkist_graphics_editor.selectedId;
            this.fabric.add(shape);
        } 
        
        getViewportCenter(){
            return {
                x: fabric.util.invertTransform(this.fabric.viewportTransform)[4]+(this.fabric.width/this.fabric.getZoom())/2, 
                y: fabric.util.invertTransform(this.fabric.viewportTransform)[5]+(this.fabric.height/this.fabric.getZoom())/2
            };
        }

        copy() {
            this.fabric.getActiveObject().clone((cloned) => {
                this.clipboard = cloned;
            });
        }

        paste() {
            // clone again, so you can do multiple copies.
            this.clipboard.clone((clonedObj) => {
                this.fabric.discardActiveObject();
                clonedObj.set({
                    left: clonedObj.left + 10,
                    top: clonedObj.top + 10,
                    evented: true,
                });
                if (clonedObj.type === 'activeSelection') {
                    // active selection needs a reference to the canvas.
                    clonedObj.canvas = this.fabric;
                    clonedObj.forEachObject((obj) => {
                        this.fabric.add(obj);
                    });
                    // this should solve the unselectability
                    clonedObj.setCoords();
                } else {
                    this.fabric.add(clonedObj);
                }
                this.clipboard.top += 10;
                this.clipboard.left += 10;
                this.fabric.setActiveObject(clonedObj);
                this.fabric.requestRenderAll();
            });
        }

        paintSelected(id, color, editor)
        {
            toolkist_graphics_editor.selectedId = id;
            toolkist_graphics_editor.selectedColor = color;
            try{
                var active = editor.fabric.getActiveObject();      
                var objs = [];

                if(active.hasOwnProperty("_objects"))
                {
                    objs = active['_objects'];
                }
                else
                {
                    objs.push(active);
                }

                for(var i in objs)
                {
                    objs[i].set('fill', toolkist_graphics_editor.selectedColor);
                    objs[i].set('paintID', id);
                    console.log(id);
                    editor.fabric.requestRenderAll();
                }
                
            }
            catch{}
        }        
    }

    return toolkist_graphics_editor;
})(jQuery);
