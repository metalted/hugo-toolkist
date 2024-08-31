import {toolkist} from '/toolkist/toolkist.js';

export var ui = (function($) {
    var ui = {};   
    ui.greenCheckmark = '<i class="fa fa-check" aria-hidden="true" style="color: green"></i>';
    ui.redCross = '<i class="fa fa-times" aria-hidden="true" style="color: red"></i>';
    ui.trashCan = '<i class="fa fa-trash" aria-hidden="true"></i>';
    ui.trophy = '<i class="fa fa-trophy" aria-hidden="true"></i>';

    ui.createSidebarHeader = function(containerID, text) {
        
        let header = $('<div>')
        .addClass('sidebar_header')
        .append($('<h2>').text(text));

        $(containerID).append(header);
        return header;
    };

    ui.createSidebarControl = function(containerID, controlCfg) {
        if (!controlCfg.hasOwnProperty('type')) {
            console.error("Control configuration is missing 'type'");
            return;
        }

        const $container = $(containerID);
        if ($container.length === 0) {
            console.error("Container with ID '" + containerID + "' not found");
            return;
        }

        let $control;
        let $wrapper;
        let appended = false;

        // Create the control based on its type
        switch (controlCfg.type) {
            case 'text':
                $control = $('<input>')
                    .addClass('sidebar_text')
                    .attr({
                        type: 'text',
                        id: controlCfg.id
                    });

                    // Set value if provided
                    if (controlCfg.hasOwnProperty('value')) {
                        $control.attr('value', controlCfg.value);
                    }
                break;
                
            case 'number':
                $control = $('<input>')
                    .addClass('sidebar_number')
                    .attr({
                        type: 'number',
                        id: controlCfg.id
                    });

                // Set min if provided
                if (controlCfg.hasOwnProperty('min')) {
                    $control.attr('min', controlCfg.min);
                }

                // Set max if provided
                if (controlCfg.hasOwnProperty('max')) {
                    $control.attr('max', controlCfg.max);
                }

                // Set step if provided
                if (controlCfg.hasOwnProperty('step')) {
                    $control.attr('step', controlCfg.step);
                }

                // Set value if provided
                if (controlCfg.hasOwnProperty('value')) {
                    $control.attr('value', controlCfg.value);
                }
                else
                {
                    $control.attr('value', 0);
                }
                break;

            case 'file':
                $control = $('<input>')
                    .attr({
                        type: 'file',
                        id: controlCfg.id,
                        accept: controlCfg.accepts || '*/*'
                    })
                    .css({ 'display': 'none' });

                // Create the label that acts as the button
                const $fileLabel = $('<label>')
                    .addClass('sidebar_button')
                    .attr('for', controlCfg.id)
                    .text(controlCfg.label || 'Choose File');

                // Handle the file loading
                $control.on('change', function() {
                    if ($(this).val() !== '') {
                        let file = $(this)[0].files[0];
                        if (controlCfg.hasOwnProperty('onLoad')) {
                            window[controlCfg.onLoad](file);
                        }
                    }
                });

                // Wrap the file input and label
                $wrapper = $('<div>')
                    .addClass('sidebar_file_wrapper')
                    .append($control)
                    .append($fileLabel);

                // Append the wrapper to the container
                $container.append($wrapper);
                appended = true;
                break;
                
            case 'checkbox':
            case 'radio':
                $control = $('<input>')
                    .addClass(controlCfg.type === 'radio' ? 'sidebar_radio' : 'sidebar_checkbox')
                    .attr({
                        type: controlCfg.type,
                        id: controlCfg.id,
                        name: controlCfg.name || undefined,
                        value: controlCfg.value // Radios typically share a name to group them
                    });

                // Set checked state if provided
                if (controlCfg.hasOwnProperty('checked')) {
                    $control.prop('checked', controlCfg.checked);
                }

                // Create a wrapper div for checkbox/radio and its label
                $wrapper = $('<div>')
                    .addClass(controlCfg.type === 'radio' ? 'sidebar_radio_wrapper' : 'sidebar_checkbox_wrapper');

                // Add the input and label to the wrapper
                $wrapper.append($control);

                if (controlCfg.hasOwnProperty('label')) {
                    const $label = $('<label>')
                        .addClass('sidebar_inline_label')
                        .attr('for', controlCfg.id)
                        .text(controlCfg.label);
                    $wrapper.append($label);
                }

                // Append the wrapper to the container
                $container.append($wrapper);
                appended = true;
                break;
                
            case 'textarea':
                $control = $('<textarea>')
                    .addClass('sidebar_textarea')
                    .attr({
                        id: controlCfg.id,
                        rows: controlCfg.rows || 4, // default rows if not provided
                        cols: controlCfg.cols || 50 // default cols if not provided
                    });

                // Set default text if provided
                if (controlCfg.hasOwnProperty('value')) {
                    $control.val(controlCfg.value);
                }
                break;

            case 'select':
                $control = $('<select>')
                    .addClass('sidebar_select')
                    .attr({
                        id: controlCfg.id
                    });

                // Populate options
                if (controlCfg.hasOwnProperty('options')) {
                    controlCfg.options.forEach(function(option) {
                        const $option = $('<option>')
                            .attr('value', option.value)
                            .text(option.label);
                        
                        if (option.selected) {
                            $option.attr('selected', 'selected');
                        }

                        $control.append($option);
                    });
                }
                break;
                
            case 'date':
                $control = $('<input>')
                    .addClass('sidebar_date')
                    .attr({
                        type: 'date',
                        id: controlCfg.id
                    });

                // Set default value if provided
                if (controlCfg.hasOwnProperty('value')) {
                    $control.val(controlCfg.value);
                }
                break;

            case 'button':
                $control = $('<button>')
                    .addClass('sidebar_button')
                    .attr({
                        type: 'button',
                        id: controlCfg.id
                    })
                    .text(controlCfg.text || 'Button');
                break;

            default:
                console.error("Unsupported control type: " + controlCfg.type);
                return;
        }

        // Handle non-checkbox/radio labels
        if (controlCfg.hasOwnProperty('label') && controlCfg.type !== 'checkbox' && controlCfg.type !== 'radio' && controlCfg.type !== 'file') {
            const $label = $('<label>')
                .addClass('sidebar_label')
                .attr('for', controlCfg.id)
                .text(controlCfg.label);
            $container.append($label);
        }

        if(!appended)
        {
            // Append the control to the container
            $container.append($control);
        }       

        // Add event listeners if specified
        if (controlCfg.hasOwnProperty('change')) {
            $control.on('change', function(event) {
                try {
                    window[controlCfg.change](event);
                } catch (error) {
                    console.error('The function ' + controlCfg.change + ' isn’t specified or caused an error:', error);
                }
            });
        }

        // Add event listeners if specified
        if (controlCfg.hasOwnProperty('input')) {
            $control.on('input', function(event) {
                try {
                    window[controlCfg.change](event);
                } catch (error) {
                    console.error('The function ' + controlCfg.change + ' isn’t specified or caused an error:', error);
                }
            });
        }

        if (controlCfg.hasOwnProperty('click')) {
            $control.on('click', function(event) {
                try {
                    window[controlCfg.click](event);
                } catch (error) {
                    console.error('The function ' + controlCfg.click + ' isn’t specified or caused an error:', error);
                }
            });
        }
    };

    ui.attachDatalist = function(containerID, dataArray, datalistName)
    {
        $(containerID).attr({'list': datalistName});

        const $dataList = $('<datalist id=' + datalistName + '></datalist>');

        dataArray.forEach((entry) => {
            $dataList.append($('<option>').val(entry));
        });

        $(containerID).parent().append($dataList);
    };

    ui.createFlexPanelPaginationContainer = function(containerID, title, itemsPerPage, onChangeCallback) {
        let pc = {
            header: $('<div>').addClass('flex_panel_pagination_header'),
            headerText: $('<h2>').text(title),
            previousPageButton: $('<div>').addClass('previous_page_button').text("<"),
            nextPageButton: $('<div>').addClass('next_page_button').text(">"),
            indicator: $('<span>').addClass('page_indicator').text("1/1"),
            resultContainer: $('<div>').addClass('flex_panel_pagination_result_container'),
    
            data: [],
            pageData: [],
            currentPage: 1,
            totalPages: 1,
            itemsPerPage: itemsPerPage,
    
            setData: function(data) {
                this.data = data;
                this.currentPage = 1;
                this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
    
                this.setPageData();
            },
    
            setPageData: function() 
            {
                const startIndex = (this.currentPage - 1) * this.itemsPerPage;
                const endIndex = Math.min(startIndex + this.itemsPerPage, this.data.length);
                this.pageData = this.data.slice(startIndex, endIndex);
                this.setIndicator();
                onChangeCallback();
            },
    
            previousPage: function() {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.setPageData();
                }                
            },
    
            nextPage: function() {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.setPageData();
                }                
            },
    
            setIndicator: function(override = "") 
            {
                this.indicator.text(override == "" ? (this.currentPage + "/" + Math.max(this.totalPages,1)) : override);
            },
    
            clear: function() {
                this.resultContainer.empty();
            },
    
            add: function(el) {
                this.resultContainer.append(el);
            }
        };
    
        pc.header.append(pc.headerText, pc.previousPageButton, pc.indicator, pc.nextPageButton);
        $(containerID).append(pc.header, pc.resultContainer);
    
        pc.previousPageButton.on('click', pc.previousPage.bind(pc));
        pc.nextPageButton.on('click', pc.nextPage.bind(pc));
    
        return pc;
    };

    ui.createFlexPanelLoadingCircle = function()
    {
        let $container = $('<div>').addClass('flex_panel_loading_circle_container');
        let $circle = $('<div>').addClass('circle');
        $container.append($circle);
        return $container;
    } 

    ui.RenderDraggablePlaylist = function(playlist, containerID)
    {
        const container = $(containerID);
        container.empty();

        const table = $('<table>').addClass('playlistTable');
        const tHead = $('<thead>').append($('<th>').text("Track Name"), $('<th>').text("Creator"), $('<th>'));
        const tBody = $('<tbody>');

        const updateFunction = function() {
            const reorderedLevels = [];    
            $(tBody).find("tr").each(function() {
                const levelData = $(this).data("level");
                reorderedLevels.push(levelData);
            });    
            playlist.levels = reorderedLevels;
        };

        // Iterate through the levels in mainPlaylist and add rows to the table
        playlist.levels.forEach((level, index) => {
            const row = $("<tr>");
            row.data("level", level);
            row.append($("<td>").text(level.Name));
            row.append($("<td>").text(level.Author));

            const removeButton = $("<button>").addClass('remove-button').html(ui.trashCan).on('click', () => {row.remove(); updateFunction(); });
            row.append($("<td>").append(removeButton));
            tBody.append(row);
        });

        tBody.sortable({
            update: function(event, ui) {
                updateFunction();
            }
        });
    
        $("#playlistTable tbody").disableSelection();

        table.append(tHead, tBody);
        container.append(table);
    };

    ui.CreateLevelDataObject = function(){
        return {
            name : null,
            fileAuthor : null,
            fileUid : null,
            imageUrl : null,
            validationTimeAuthor : null,
            validationTimeBronze : null,
            validationTimeGold : null,
            validationTimeSilver : null,
            authorId : null,
            workshopId : null,
            amountBlocks : null,
            amountCheckpoints : null,
            amountFinishes : null,
            typeGround : null,
            typeSkybox : null,
            recordUser : null,
            recordTime : null,
            recordDate : null,
            hash : null
        }
    };

    ui.CreateLevelResult = function(levelData)
    {
        const $resultDiv = $("<div>").addClass("level_result_item");        

        if(levelData.imageUrl != null)
        {
            const $imageDiv = $("<div>").addClass("level_result_item_image").append($("<img>").attr("src", levelData.imageUrl));
            $resultDiv.append($imageDiv);
        }

        const $resultContainer = $("<div>").addClass("level_result_container");      
        $resultDiv.append($resultContainer);  

        if(levelData.name != null)
        {
            const $nameDiv = $("<div>").addClass("level_result_item_name").append($("<h3>").text(levelData.name));
            $resultContainer.append($nameDiv);
        }

        const $contentDiv = $("<div>").addClass("level_result_content");
        $resultContainer.append($contentDiv);

        if(levelData.fileAuthor != null || levelData.fileUid != null || levelData.validationTimeAuthor != null || levelData.hash != null)
        {
            const $primaryInfoDiv = $("<div>").addClass("level_result_primary_info");
            
            if(levelData.fileAuthor != null)
            {
                $primaryInfoDiv.append($("<p>").html("<span class='secondary_colored'>Author: </span>" + levelData.fileAuthor));
            }

            if(levelData.fileUid != null)
            {                
                $primaryInfoDiv.append($("<p>").html("<span class='secondary_colored'>UID: </span>" + levelData.fileUid));
            }

            if(levelData.validationTimeAuthor != null)
            {
                $primaryInfoDiv.append($("<p>").html("<span class='secondary_colored'>Author Time: </span>" + levelData.validationTimeAuthor));
            }

            if(levelData.hash != null)
            {
                $primaryInfoDiv.append($("<p>").html("<span class='secondary_colored'>Hash: </span>" + levelData.hash));
            }

            $contentDiv.append($primaryInfoDiv);
        }

        if(levelData.recordUser != null || levelData.recordTime != null || levelData.recordDate != null)
        {
            const $recordDiv = $("<div>").addClass("level_result_record_info");

            if(levelData.recordUser != null)
            {
                $recordDiv.append($("<p>").html("<span class='secondary_colored'>Record by: </span>" + levelData.recordUser));
            }

            if(levelData.recordTime != null)
            {
                $recordDiv.append($("<p>").html("<span class='secondary_colored'>Time: </span>" + toolkist.util.ConvertSecondsToDisplayTime(levelData.recordTime)));
            }

            if(levelData.recordDate != null)
            {
                $recordDiv.append($("<p>").html("<span class='secondary_colored'>Date: </span>" + new Date(levelData.recordDate).toLocaleString()));
            }

            $contentDiv.append($recordDiv);
        }

        if(levelData.amountBlocks != null || levelData.amountCheckpoints != null || levelData.amountFinishes != null || levelData.typeGround != null || levelData.typeSkybox != null)
        {
            const $levelDiv = $("<div>").addClass("level_result_level_info");

            if(levelData.amountBlocks != null)
            {
                $levelDiv.append($("<p>").html("<span class='secondary_colored'>Blocks: </span>" + levelData.amountBlocks));
            }

            if(levelData.amountCheckpoints != null)
            {
                $levelDiv.append($("<p>").html("<span class='secondary_colored'>Checkpoints: </span>" + levelData.amountCheckpoints));
            }

            if(levelData.amountFinishes != null)
            {
                $levelDiv.append($("<p>").html("<span class='secondary_colored'>Finishes: </span>" + levelData.amountFinishes));
            }

            if(levelData.typeGround != null)
            {
                $levelDiv.append($("<p>").html("<span class='secondary_colored'>Ground: </span>" + levelData.typeGround));
            }  
            
            if(levelData.typeSkybox != null)
            {
                $levelDiv.append($("<p>").html("<span class='secondary_colored'>Skybox: </span>" + levelData.typeSkybox));
            }

            $contentDiv.append($levelDiv);
        }

        return $resultDiv;
    }

    return ui;
})(jQuery);
