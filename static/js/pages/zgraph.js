import {toolkist} from '/toolkist/toolkist.js';

var editor = null;

export function init()
{
    $("#pagepanel1").append($("<div>").addClass("zgraph-container"));

    editor = new zgraph.Editor('.standardPagePanel');

    // Add information to the header bar
    var headerbar = $('.zgraph-menubar');

    // Add a span for the button
    var buttonSpan = $('<div id="controlsButton">Controls</div>');
    headerbar.append(buttonSpan);

    // Add a table to show controls
    var controlsTable = $('<table id="controlsTable" style="display: none;"></table>');
    headerbar.append(controlsTable);

    // Define control keys and descriptions
    var controls = [
        { key: 'CTRL+Z', description: 'Undo' },
        { key: 'CTRL+Y', description: 'Redo' },
        { key: 'Alt+LMB Drag', description: 'Drag Screen' },
        { key: 'LMB Drag', description: 'Select' },
        { key: 'Delete', description: 'Delete Object' }
    ];

    // Populate controls in the table
    for (var i = 0; i < controls.length; i++) {
        controlsTable.append('<tr><td>' + controls[i].key + '</td><td>' + controls[i].description + '</td></tr>');
    }

    // Show controls when hovering over the button
    buttonSpan.hover(function() {
        controlsTable.show();
    }, function() {
        controlsTable.hide();
    });

    $(window).resize(function() {
        if (editor != null) {
            editor.OnResize();
        }
    });
}

var zgraph = (function($) {
    var zgraph = {};    
    zgraph.Editor = class 
    {
        constructor(containerID)
        {
            this.history = [];
            this.historyIndex = -1;

            this.selectedId = null;
            this.selectedColor = null;

            this.InitButtons();
            this.InitShapeButtons();

            //Main layout
            this.container = $(containerID);
            this.menubar = $('<div>').addClass('zgraph-menubar');
            this.sidebar = $('<div>').addClass('zgraph-sidebar');
            this.worksheet = $('<div>').addClass('zgraph-worksheet');
            this.canvas = $('<canvas>').addClass('zgraph-canvas').attr({id: 'zgraph-canvas'});
            
            this.worksheet.append(this.canvas);
            this.container.append(this.menubar, this.sidebar, this.worksheet);

            toolkist.html.RenderPaintSelection('.zgraph-sidebar', this.PaintSelected);

            this.InitFabric();
            this.InitControls();

            this.AddMenubarButton(this.buttons.save);
            this.AddMenubarButton(this.buttons.open);
            this.AddMenubarButton(this.buttons.add);
            this.AddMenubarButton(this.buttons.export);
            this.AddMenubarButton(this.buttons.image);
            this.AddMenubarButton(this.buttons.undo);
            this.AddMenubarButton(this.buttons.redo);
            this.AddMenubarButton(this.buttons.backward);
            this.AddMenubarButton(this.buttons.forward);
            this.AddMenubarButton(this.buttons.dropper);
            this.AddMenubarButton(this.buttons.paint);

            this.AddMenubarButton(this.shapes.circle);
            this.AddMenubarButton(this.shapes.square);
            this.AddMenubarButton(this.shapes.rightTriangle);
            this.AddMenubarButton(this.shapes.quarterCircle);
            this.AddMenubarButton(this.shapes.halfPipe);

            this.Change('initial');
        }

        InitButtons()
        {
            this.buttons = {
                open : {
                    icon: '<i class="zgraph-menubar-button-icon fa fa-folder-open" aria-hidden="true"></i>',
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
                                    this.history = [];
                                    this.historyIndex = -1;
                                    this.Change('initial');
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
                    },
                    tooltipText: 'Open'
                },
                save : {
                    icon: '<i class="zgraph-menubar-button-icon fa fa-floppy-disk" aria-hidden="true"></i>',
                    action: () => {
                        var worksheet = this.fabric.toJSON(['shapeType', 'blockID', 'paintID']);
                        toolkist.fs.DirectDownload('worksheet.json', JSON.stringify(worksheet));
                    },
                    tooltipText: 'Save'
                },
                add: {
                    icon: '<i class="zgraph-menubar-button-icon fa fa-plus" aria-hidden="true"></i>',
                    action: () => {
                        var input = $('<input type="file">');
                        input.click();
                        input.on('change', () => {
                            var file = input[0].files[0];
                            var reader = new FileReader();
                            reader.onload = (e) => {
                                // Parse the file content as JSON
                                try {
                                    this.fabric.discardActiveObject();
                                    var jsonData = JSON.parse(e.target.result);
                                    var objects = jsonData.objects;
                                    if (objects && objects.length > 0) {
                                        var selection = [];
                                        objects.forEach((objData) => {
                                            fabric.util.enlivenObjects([objData], (enlivenedObjects) => {
                                                var obj = enlivenedObjects[0];
                                                if (obj) {
                                                    this.fabric.add(obj);
                                                    selection.push(obj);
                                                }
                                                if (selection.length === objects.length) {
                                                    this.fabric.setActiveObject(new fabric.ActiveSelection(selection, {
                                                        canvas: this.fabric
                                                    }));
                                                    this.fabric.renderAll();
                                                }
                                            });
                                        });
                                    }
                                } catch (error) {
                                    console.error('Error parsing JSON:', error);
                                    // Handle any errors during JSON parsing
                                } finally {
                                    input.remove();
                                }
                            };
                            reader.readAsText(file);
                        });
                        input.appendTo('body');
                    },
                    tooltipText: 'Add'
                },
                                
                undo : {
                    icon: '<i class="zgraph-menubar-button-icon fa fa-rotate-left" aria-hidden="true"></i>',
                    action: () => {
                        this.Undo();
                    },
                    tooltipText: 'Undo'
                },
                redo : {
                    icon: '<i class="zgraph-menubar-button-icon fa fa-rotate-right" aria-hidden="true"></i>',
                    action: () => {
                        this.Redo();
                    },
                    tooltipText: 'Redo'
                },
                backward : {
                    icon: '<i class="zgraph-menubar-button-icon fa fa-backward-step" aria-hidden="true"></i>',
                    action: () =>{
                        this.Backward();
                    },
                    tooltipText: 'Backward'
                },
                forward : {
                    icon: '<i class="zgraph-menubar-button-icon fa fa-forward-step" aria-hidden="true"></i>',
                    action: ()=>{
                        this.Forward();
                    },
                    tooltipText: 'Forward'
                },
                export : {
                    icon: '<i class="zgraph-menubar-button-icon fa fa-file-export" aria-hidden="true"></i>',
                    action: () => {
                        var worksheet = this.fabric.toJSON(['shapeType', 'blockID', 'paintID']);
                        var zeeplevel = new toolkist.game.Zeeplevel();
                    
                        for(const i in worksheet.objects)
                        {
                            var obj = worksheet.objects[i];
                            var size = {x: obj.scaleX * obj.width, y: obj.scaleY * obj.height};
                            var centerPosition = {x: obj.left + size.x / 2, y: obj.top + size.y / 2};
                            var radians = (obj.angle * Math.PI) / 180;
                            var shapeInfo = this.shapes[obj.shapeType];                           

                            // Rotate the center point around the top-left corner
                            var rotatedCenterX = obj.left + Math.cos(radians) * (centerPosition.x - obj.left) - Math.sin(radians) * (centerPosition.y - obj.top);
                            var rotatedCenterY = obj.top + Math.sin(radians) * (centerPosition.x - obj.left) + Math.cos(radians) * (centerPosition.y - obj.top);

                            var block = new toolkist.game.Block();
                            block.blockID = obj.blockID;
                            block.position.x = rotatedCenterX / 10;
                            block.position.y = i * 0.001 + shapeInfo.yShift;
                            block.position.z = rotatedCenterY / 10;
                            block.euler.y = -obj.angle;
                            block.scale.x = obj.flipX ? -obj.scaleX : obj.scaleX;
                            block.scale.y = shapeInfo.yScale;
                            block.scale.z = obj.flipY ? -obj.scaleY: obj.scaleY;
                            block.options[0] = 1;
                            block.paints[0] = Number(obj.paintID);
                            zeeplevel.AddBlock(block);
                        }
                                          
                        toolkist.fs.DirectDownload('graphic.zeeplevel', zeeplevel.ToCSV());
                    },
                    tooltipText: 'Export'
                },
                dropper : {
                    icon: '<i class="zgraph-menubar-button-icon fa fa-eye-dropper" aria-hidden="true"></i>',
                    action: () => {
                        var objs = this.fabric.getActiveObject();
                        var paintID = 0;
                        if(objs == null)
                        {
                            return;
                        }
                        else if(objs.type == 'activeSelection')
                        {
                            paintID = objs['_objects'][0].paintID;
                        }
                        else{
                            paintID = objs.paintID;
                        }

                        $('.list-item').each(function(){
                            if($(this).data('id') === paintID)
                            {
                                $(this).click();
                            }
                        });
                        $('.selection-window').hide();
                    },
                    tooltipText: 'Pick'
                },
                paint : {
                    icon: '<i class="zgraph-menubar-button-icon fa fa-paint-roller" aria-hidden="true"></i>',
                    action: () => {
                        this.Paint();
                    },
                    tooltipText: 'Paint'
                },
                image : {
                    icon: '<i class="zgraph-menubar-button-icon fa fa-image" aria-hidden="true"></i>',
                    action: () => {
                        var input = $('<input type="file">');
                        input.click();
                        input.on('change', () => {
                            var file = input[0].files[0];
                            var reader = new FileReader();
                            reader.onload = (e) => {
                                // Parse the file content as JSON
                                try {
                                    var data = e.target.result;
                                    fabric.Image.fromURL(data, (img)=>
                                    {
                                        var s = this.fabric.width / img.width;
                                        this.fabric.setBackgroundImage(img, this.fabric.renderAll.bind(this.fabric), {
                                            scaleX: s,
                                            scaleY: s
                                        })
                                    })
                                } catch (error) {
                                    console.error('Error parsing JSON:', error);
                                    // Handle any errors during JSON parsing
                                }
                                finally{                                    
                                    input.remove();
                                }
                            };
                            reader.readAsDataURL(file);
                        });
                        input.appendTo('body');
                    },
                    tooltipText: 'Image'
                }
            }
        }

        InitShapeButtons()
        {
            this.shapes = {
                circle : {
                    icon : '<svg width="40" height="40"><circle cx="20" cy="20" r="19" stroke="black" stroke-width="2" fill="black"/></svg>',
                    action: () => this.CreateShape('circle'),
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
                    },
                    tooltipText: 'Circle',
                    yScale: 0.0625,
                    yShift: -3.2
                },
                square : {
                    icon: '<svg width="40" height="40"><rect x="0" y="0" width="40" height="40" fill="black" stroke="black" stroke-width="2"/></svg>',
                    action: () => this.CreateShape('square'),
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
                    },
                    tooltipText: 'Square',
                    yScale: 1,
                    yShift: 0
                    
                },
                rightTriangle : {
                    icon: '<svg width="40" height="40"><path d="M0 0 L40 0 L0 40 L0 0" fill="black" stroke="black" stroke-width="2"/></svg>',
                    action: () => this.CreateShape('rightTriangle'),
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
                    },
                    tooltipText: 'Triangle',
                    yScale: 1,
                    yShift: 0
                },
                quarterCircle : {
                    icon: '<svg width="40" height="40"><path d="M0 40 L0 0 L40 0 A40 40 0 0 1 0 40" fill="black" stroke="black" stroke-width="2"/></svg>',
                    action: () => this.CreateShape('quarterCircle'),
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
                    },
                    tooltipText: 'Curve',
                    yScale: 1,
                    yShift: 0
                },
                halfPipe : {
                    icon: '<svg width="40" height="40"><path d="M40 0 L40 40 L0 40 A40 40 0 0 0 40 0" fill="black" stroke="black" stroke-width="2"/></svg>',
                    action: () => this.CreateShape('halfPipe'),
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
                    },
                    tooltipText: 'Slope',
                    yScale: 1,
                    yShift: 0
                },
                triangle : {
                    icon: '<svg width="50" height="50"> <path d="M25 25 L45 45 L5 45 L25 25" fill="none" stroke="black" stroke-width="2"/></svg>',
                    action: () => this.CreateShape('triangle'),
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
                    },
                    tooltipText: 'Eq-Tri',
                    yScale: 1,
                    yShift: 0
                },
                
            }
        }

        InitFabric()
        {
            this.fabric = new fabric.Canvas('zgraph-canvas', {
                backgroundColor: 'rgb(0,0,0)',
                selectionColor: 'rgba(1,1,1,0.1)',
                selectionLineWidth: 2
            });

            this.OnResize();

            //Always remove skew from parts.
            this.fabric.on('before:render', () =>
            {
                var objs = this.fabric.getObjects();
                for(var i in objs)
                {
                    objs[i].set({skewX: 0, skewY: 0});
                }
            });

            //Zoom with mousewheel
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

            //Selection and screen drag (+ alt)
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

            this.fabric.on('object:modified', (opt) => {
                this.Change('modified');
            });
        }

        InitControls()
        {
            //Keyboard controls
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Delete' || event.code === 'Delete') {
                   this.fabric.remove(...this.fabric.getActiveObjects());
                   this.Change('delete');
                }
    
                if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
                    this.Copy();
                }
    
                if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
                    this.Paste();
                }

                
                if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
                    // Ctrl+C (Cmd+C on Mac) was pressed
                    this.Undo();
                }
    
                if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
                    // Ctrl+C (Cmd+C on Mac) was pressed
                    this.Redo();
                }
            });
        }

        AddMenubarButton(buttonInfo)
        {
            const button = $('<div>').addClass('zgraph-menubar-button');
            const tooltip = $('<div>').addClass('zgraph-menubar-button-tooltip').text(buttonInfo.tooltipText);
            button.html(buttonInfo.icon);
            button.on('click', buttonInfo.action);
            button.append(tooltip);

            button.hover(
                function () {
                    tooltip.css('display', 'block');
                },
                function () {
                    tooltip.css('display', 'none');
                }
            );

            this.menubar.append(button);
        }

        CreateShape = (shapeType) =>
        {
            var shapeInfo = this.shapes[shapeType];
            var shape = shapeInfo.create();            
            var center = this.GetViewportCenter();
            shape.left = center.x;
            shape.top = center.y;
            shape.fill = this.selectedColor;
            shape.paintID = this.selectedId;
            shape.opacity = 0.8;
            this.fabric.add(shape);
            this.Change('create');
        } 

        GetViewportCenter(){
            return {
                x: fabric.util.invertTransform(this.fabric.viewportTransform)[4]+(this.fabric.width/this.fabric.getZoom())/2, 
                y: fabric.util.invertTransform(this.fabric.viewportTransform)[5]+(this.fabric.height/this.fabric.getZoom())/2
            };
        }

        Copy() {
            this.fabric.getActiveObject().clone((cloned) => {
                this.clipboard = cloned;
            }, ['shapeType', 'blockID', 'paintID']);
        }

        Paste() {
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
            }, ['shapeType', 'blockID', 'paintID']);

            this.Change('paste');
        }  
        
        PaintSelected = (id, color) =>
        {
            this.selectedId = id;
            this.selectedColor = color;

            try{
                var active = this.fabric.getActiveObject();
                if(active == null)
                {
                    return;
                }

                var objs = [];

                if(active.hasOwnProperty("_objects"))
                {
                    objs = active['_objects'];
                }
                else
                {
                    objs.push(active);
                }

                if(objs.length == 0)
                {
                    return;
                }

                for(var i in objs)
                {
                    objs[i].set('fill', this.selectedColor);
                    objs[i].set('paintID', id);
                    this.fabric.requestRenderAll();
                }

                this.Change('paint');      
            }
            catch{}
        }

        Change(source)
        {
            console.log('change: ' + source);
            var canvasState = this.fabric.toJSON(['shapeType', 'blockID', 'paintID']);
            //Last history so append
            if(this.historyIndex == this.history.length - 1){
                this.history.push(canvasState);
                this.historyIndex++;
            }
            else
            {
                //Remove everything after the current index, then append
                this.history.splice(this.historyIndex + 1);
                this.history.push(canvasState);
                this.historyIndex++;
            }            
        }

        Undo(){
            if(this.historyIndex == 0)
            {
                console.log('start of history');
                return;
            }
            else
            {
                this.historyIndex--;
                this.ReloadHistory();
            }
        }

        Redo()
        {
            if(this.historyIndex == this.history.length - 1)
            {
                console.log('end of history');
                return;
            }
            else
            {
                this.historyIndex++;
                this.ReloadHistory();
            }
        }

        ReloadHistory()
        {
            this.fabric.loadFromJSON(this.history[this.historyIndex]);
        }

        Forward()
        {
            var active = this.fabric.getActiveObject();      
            if(active == null)
            {
                return;
            }

            var objs = [];

            if(active.hasOwnProperty("_objects"))
            {
                objs = active['_objects'];
            }
            else
            {
                objs.push(active);
            }

            
            if(objs.length == 0)
            {
                return;
            }

            for(var i in objs)
            {
                this.fabric.bringForward(objs[i]);                
            }

            this.fabric.requestRenderAll();
            this.Change('forward');    
        }

        Backward()
        {
            var active = this.fabric.getActiveObject();      
            if(active == null)
            {
                return;
            }

            var objs = [];

            if(active.hasOwnProperty("_objects"))
            {
                objs = active['_objects'];
            }
            else
            {
                objs.push(active);
            }

            
            if(objs.length == 0)
            {
                return;
            }

            for(var i in objs)
            {
                this.fabric.sendBackwards(objs[i]);                
            }

            this.fabric.requestRenderAll();
            this.Change('backward');    
        }

        Paint()
        {
            var active = this.fabric.getActiveObject();      
            if(active == null)
            {
                return;
            }

            var objs = [];

            if(active.hasOwnProperty("_objects"))
            {
                objs = active['_objects'];
            }
            else
            {
                objs.push(active);
            }

            
            if(objs.length == 0)
            {
                return;
            }

            for(var i in objs)
            {
                objs[i].set('fill', this.selectedColor);
                objs[i].set('paintID', this.selectedId);           
            }

            this.fabric.requestRenderAll();
            this.Change('paint'); 
        }

        OnResize()
        {
            this.fabric.setWidth(this.worksheet.width());
            this.fabric.setHeight(this.worksheet.height());
        }
    }
    return zgraph;
})(jQuery);