import {util} from '/toolkist/util.toolkist.js';
import {game} from '/toolkist/game.toolkist.js';

export var html = (function($) {
    var html = {};   
    html.greenCheckmark = '<i class="fa fa-check" aria-hidden="true" style="color: green"></i>';
    html.redCross = '<i class="fa fa-times" aria-hidden="true" style="color: red"></i>';
    html.trashCan = '<i class="fa fa-trash" aria-hidden="true"></i>';
    html.trophy = '<i class="fa fa-trophy" aria-hidden="true"></i>';

    html.RenderFilters = function(filters, containerID, onChangeCallback)
    {
        const filterDiv = $(containerID);
        filterDiv.empty();

        Object.entries(filters).forEach(([key, filter]) =>
        {
            var filterRow = $('<div>').addClass('filterRow');

            var activationButton = $('<button>').addClass('standardCheckbox');
            activationButton.html(filter.active ? html.greenCheckmark : html.redCross);
            activationButton.on('click', function()
            {
                filter.active = !filter.active;
                html.RenderFilters(filters, containerID, onChangeCallback);
            });
            filterRow.append(activationButton);

            var title = $('<span>').text(filter.displayName);
            filterRow.append(title);

            if (filter.active) 
            {
                console.log(filter);
                var inputContainer = $('<span>').addClass('filterInput');
                var inputElement;

                switch (filter.type) {
                    case 'text':
                        inputElement = $('<input>', {
                            type: 'text',
                            id: `${filter.context}filter_${filter.elementId}`,
                            value: filter.values[0],
                            change: function() {
                                onChangeCallback(filter.context, filter.elementId, 'text', 0);
                            }
                        });
                        break;
                    case 'number':
                        inputElement = $('<input>', {
                            type: 'number',
                            id: `${filter.context}filter_${filter.elementId}_start`,
                            value: filter.values[0],
                            change: function() {
                                onChangeCallback(filter.context, filter.elementId, 'number', 0);
                            }
                        }).add($('<input>', {
                            type: 'number',
                            id: `${filter.context}filter_${filter.elementId}_end`,
                            value: filter.values[1],
                            change: function() {
                                onChangeCallback(filter.context, filter.elementId, 'number', 1);
                            }
                        }));
                        break;
                    case 'time':
                        inputElement = $('<input>', {
                            type: 'number',
                            id: `${filter.context}filter_${filter.elementId}_start`,
                            value: filter.values[0],
                            change: function() {
                                onChangeCallback(filter.context, filter.elementId, 'time', 0);
                            }
                        }).add($('<input>', {
                            type: 'number',
                            id: `${filter.context}filter_${filter.elementId}_end`,
                            value: filter.values[1],
                            change: function() {
                                onChangeCallback(filter.context, filter.elementId, 'time', 1);
                            }
                        }));
                        break;
                    case 'date':
                        inputElement = $('<input>', {
                            type: 'date',
                            id: `${filter.context}filter_${filter.elementId}_start`,
                            value: util.ConvertISODateToDate(filter.values[0]),
                            change: function() {
                                onChangeCallback(filter.context, filter.elementId, 'date', 0);
                            }
                        }).add($('<input>', {
                            type: 'date',
                            id: `${filter.context}filter_${filter.elementId}_end`,
                            value: util.ConvertISODateToDate(filter.values[1]),
                            change: function() {
                                onChangeCallback(filter.context, filter.elementId, 'date', 1);
                            }
                        }));
                        break;
                    case 'user':
                        let options = '';
                        for (let user of filter.userList) {
                            options += `<option value='${user.name}'>`;
                        }
                        inputElement = $('<input>', {
                            type: 'text',
                            list: `userList_${filter.elementId}`,
                            id: `${filter.context}filter_${filter.elementId}`,
                            change: function() {
                                onChangeCallback(filter.context, filter.elementId, 'user');
                            }
                        }).add($('<datalist>', {
                            id: `userList_${filter.elementId}`,
                            html: options
                        }));
                        break;
                }

                inputContainer.html(inputElement);

                // Append the input element to the filterRow
                filterRow.append(inputContainer);
            }

            filterDiv.append(filterRow);
        });
    }

    html.RenderLevelList = function(levels, containerID, addLevelButtonCallback, removeDuplicates = false)
    {
        var container = $(containerID);
        container.empty();

        function AddRowToContainer(level)
        {
            var row = $('<div>').addClass('level-row');
            
            var image = $('<img>').addClass('level-image').attr('src', level.attributes.imageUrl);
            var content = $('<div>').addClass('level-content');
            var other = $('<div>').addClass('level-other');  

            var name = $('<h3>').addClass('level-name').text(level.attributes.name);
            var author = $('<div>').addClass('level-author').append($('<span>').addClass('byPrefix').text('By: ')).append($('<span>').text(level.attributes.fileAuthor));
            var validationTime = $('<div>').addClass('level-validation-time').append($('<img>').attr('src', '/medal_author.png')).append($('<span>').text(util.ConvertSecondsToDisplayTime(level.attributes.validation)));    
            content.append(name, author, validationTime);
                                  
            var addButton = $('<div>').addClass('addLevelButton').text("+").on('click', () => addLevelButtonCallback(level.attributes.fileHash));
            var steamButton = $('<img>').addClass('steam-button').attr('src', '/steamIcon.png').attr('onclick', "window.open('https://steamcommunity.com/sharedfiles/filedetails/?id=" + level.attributes.workshopId + "', '_blank')"); 
            other.append(addButton, steamButton);

            row.append(image, content, other);
            container.append(row);
        }

        var dupes = [];

        levels.forEach((level) => 
        {
            if(removeDuplicates)
            {
                if(!dupes.includes(level.attributes.fileHash))
                {
                    dupes.push(level.attributes.fileHash);
                    AddRowToContainer(level);
                }
            }
            else
            {
                AddRowToContainer(level);
            }
        });
    }

    html.RenderPlaylist = function(playlist, containerID)
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

            const removeButton = $("<button>").addClass('remove-button').html(html.trashCan).on('click', () => {row.remove(); updateFunction(); });
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

    html.RenderPlaylistProperties = function(containerID, onPlaylistUploadedCallback)
    {
        const container = $(containerID);

        // Create elements
        const table = $('<table>');
        const tbody = $('<tbody>');
        const tr1 = $('<tr>').append($('<td>').text('Name'), $('<td>').append($('<input>').attr({type: 'text', id: 'playlist_name', value: 'Toolkist Playlist', style: 'color:black'})));
        const tr2 = $('<tr>').append($('<td>').text('Shuffle'), $('<td>').append($('<input>').attr({type: 'checkbox', id: 'playlist_shuffle', style: 'color:black'})));
        const tr3 = $('<tr>').append($('<td>').text('Round Length'), $('<td>').append($('<input>').attr({type: 'number', id: 'playlist_roundtime', value: '360', min: '120', max: '3600', style: 'color:black'})));
        const tr4 = $('<tr>').append($('<td>'));
        
        const addPlaylistButtonCell = $('<td>');
        const addPlaylistButton = html.CreateTextFileInput('addPlaylistButton', "Add Playlist", '.zeeplist', onPlaylistUploadedCallback);
        addPlaylistButtonCell.append(addPlaylistButton);
        tr4.append(addPlaylistButtonCell);

        const tr5 = $('<tr>').append($('<td>').append($('<input>').attr({type: 'button', id: 'copyToClipboardButton', class: 'standardButton', value: 'Copy to Clipboard'})), $('<td>').append($('<input>').attr({type: 'button', id: 'downloadToZeeplistButton', class: 'standardButton', value: 'Download .zeeplist'})));

        // Append elements to tbody
        tbody.append(tr1, tr2, tr3, tr4, tr5);

        // Append tbody to table
        table.append(tbody);

        // Append elements to container
        container.append(table);
    };

    html.GetPlaylistProperties = function()
    {
        return {
            name : $('#playlist_name').val(),
            shuffle : $('#playlist_shuffle').is(':checked'),
            roundLength : Number($('#playlist_roundtime').val())
        }
    }

    html.CreateTextFileInput = function(elementID, labelText, accepts, onLoadCallback)
    {
        const container = $(`<div>`);

        var fileInput = $('<input>', {
            type: 'file',
            id: elementID,
            accept: accepts
        }).css({'display': 'none'});

        var label = $('<label>').addClass('standardButton').attr({'for':elementID}).html(labelText);

        fileInput.on('change', function()
        {
            if ($(this).val() !== '') 
            {
                let file = $(this)[0].files[0];

                var reader = new FileReader();
                reader.onload = function(){
                    let contents = reader.result;
                    onLoadCallback(file.name, contents);
                }
                reader.readAsText(file);
            }
        });

        container.append(fileInput, label);
        return container;
    }

    html.CreateImageFileInput = function(elementID, labelText, accepts, onLoadCallback)
    {
        const container = $(`<div>`);

        var fileInput = $('<input>', {
            type: 'file',
            id: elementID,
            accept: accepts
        }).css({'display': 'none'});
        
        var label = $('<label>').addClass('standardButton').attr({'for':elementID}).html(labelText);
            
        fileInput.on('change', function()
        {
            if ($(this).val() !== '') 
            {
                let file = $(this)[0].files[0];

                var reader = new FileReader();
                reader.onload = function(){
                    var img = new Image();
                    img.onload = function(){
                        onLoadCallback(file.name, img);
                    }
                    img.src = reader.result;
                }
                reader.readAsDataURL(file);
            }
        });

        container.append(fileInput, label);
        return container;        
    }

    html.RenderIndexedSelect = function(containerID, options, onChangeCallback)
    {
         // Create the select element
        const select = $("<select>");

        // Add an empty option at the top
        select.append($("<option>").attr("value", "-1").text("Select a playlist..."));

        // Add options from the string array
        options.forEach(function(optionText, index) {
            select.append($("<option>").attr("value", index).text(optionText));
        });

        // Add change event listener
        select.on("change", function() {
            // Call the callback function with the selected index
            const selectedIndex = $(this).val();
            onChangeCallback(selectedIndex);
        });

        // Append the select element to the container
        $(containerID).append(select);
    };

    html.RenderHeaderBlock = function(containerID, text)
    {
        $(containerID).append($('<div>').addClass('headerBlock').append($('<h2>').text(text)));
    };

    html.RenderButton = function(containerID, elementId, text)
    {
        var $button = $('<input/>', {
            id: elementId,
            class: 'standardButton',
            type: 'button',
            value: text
        });

        $(containerID).append($button);
    }

    html.RenderPagination = function(containerID)
    {
        // Create the page controls container
        var $pageControls = $('<div/>').addClass('pagination');

        // Create the previous page button
        var $prevPageButton = $('<input/>', {
            id: 'prevPageButton',
            class: 'standardButton',
            type: 'button',
            value: '<<'
        });

        // Create the page number holder
        var $pageNumberHolder = $('<div/>', { id: 'pageNumberHolder' });
        // Create the page number span inside the holder
        var $pageNumber = $('<span/>', {
            id: 'pageNumber',
            text: '1/1' // Assuming initial page number and total
        });
        // Append the page number span to its holder
        $pageNumberHolder.append($pageNumber);

        // Create the next page button
        var $nextPageButton = $('<input/>', {
            id: 'nextPageButton',
            class: 'standardButton',
            type: 'button',
            value: '>>'
        });

        $pageControls.append($prevPageButton, $pageNumberHolder, $nextPageButton);

        $(containerID).append($pageControls);
    }

    html.CreateCanvas = function(elementId) {

        var canvas = $('<canvas></canvas>');
        canvas.attr('id', elementId);
        return canvas;
    };

    html.RenderQuantizedImage = function(quantized, imageId)
    {
        // Create a canvas dynamically
        var canvas = $('<canvas></canvas>')[0];
        var ctx = canvas.getContext('2d');

        // Set canvas dimensions based on the size of the 2D array
        canvas.width = quantized[0].length;
        canvas.height = quantized.length;

        // Draw pixels on the canvas
        quantized.forEach((row, y) => {
            row.forEach((q, x) => {
                ctx.fillStyle = `rgba(${q.color.red}, ${q.color.green}, ${q.color.blue}, ${q.color.alpha})`;
                ctx.fillRect(x, y, 1, 1);
            });
        });

        // Convert canvas content to base64 image
        var base64Image = canvas.toDataURL();

        // Set the base64 image as the source of the provided image tag
        $('#' + imageId).attr('src', base64Image);

        // Remove the canvas from the DOM to destroy it
        $(canvas).remove();
    }

    html.RenderTabStructure = function(tabData, containerID)
    {
        // Create the main tab container
        var tabContainer = $("<div>").addClass("tab-container");

        // Create top-level tabs
        var tabButtons = $("<div>").addClass("tab-buttons");
        $.each(tabData, function(tabId, tabContent) {
            var button = $("<button>").addClass("tab-button-top").attr("data-tab", tabId).text(tabContent.label);
            tabButtons.append(button);
        });
        tabContainer.append(tabButtons);

        // Create tab content sections
        $.each(tabData, function(tabId, tabContent) {
            var tabContentDiv = $("<div>").addClass("tab-content").attr("id", tabId);
            if (tabContent.children) {
                // If the tab has children, create nested tabs
                var nestedTabContainer = $("<div>").addClass("tab-container");
                var nestedTabButtons = $("<div>").addClass("tab-buttons");
                $.each(tabContent.children, function(childId, childContent) {
                    var button = $("<button>").addClass("tab-button").attr("data-tab", childId).text(childContent);
                    nestedTabButtons.append(button);
                });
                nestedTabContainer.append(nestedTabButtons);
                $.each(tabContent.children, function(childId, childContent) {
                    var tabPane = $("<div>").addClass("tab-pane").attr("id", childId);
                    nestedTabContainer.append(tabPane);
                });
                tabContentDiv.append(nestedTabContainer);
            } else {
                // If the tab has no children, create a single content section
                var tabPane = $("<div>").addClass("tab-pane");
                tabContentDiv.append(tabPane);
            }
            tabContainer.append(tabContentDiv);
        });

        // Click event for top-level tabs
        tabContainer.on('click', '.tab-button-top', function() {
            var tabId = $(this).attr('data-tab');
            // Remove 'active' class from all top-level tabs and hide all content
            $('.tab-button-top').removeClass('active');
            $('.tab-content').removeClass('active').hide();

            // Add 'active' class to clicked top-level tab and show its content
            $(this).addClass('active');
            $('#' + tabId).addClass('active').show();

            // Hide all secondary tab contents and remove 'active' class
            $('#' + tabId).find('.tab-content').removeClass('active').hide();
            $('#' + tabId).find('.tab-button').removeClass('active');

            // Automatically click the first secondary tab if it exists
            var firstSecondaryTab = $('#' + tabId).find('.tab-button').first();
            if(firstSecondaryTab.length) {
                firstSecondaryTab.trigger('click');
            }
            else
            {
                $('#' + tabId + " > .tab-pane").show();
            }
        });

        // Click event for secondary tabs within a tab-content
        tabContainer.on('click', '.tab-content .tab-button', function() {
            // Get the container of this secondary tab
            var container = $(this).closest('.tab-content');

            // Remove 'active' class from all secondary tabs in this container and hide their contents
            container.find('.tab-button').removeClass('active');
            container.find('.tab-pane').removeClass('active').hide();

            // Add 'active' class to clicked secondary tab and show its content
            $(this).addClass('active');
            var tabId = $(this).attr('data-tab');
            $('#' + tabId).addClass('active').show();
        });        

        $(containerID).append(tabContainer);

        // Automatically click the first top-level tab on page load
        tabContainer.find('.tab-button-top').first().trigger('click');
    };

    html.RenderLeaderboard = function(data, headers, containerID, visualHeaders = [])
    {
        const container = $(containerID);

        var table = $('<table>').addClass('leaderboardTable');

        if(visualHeaders.length > 0)
        {
            var tHeader = $('<thead>');
            var tHeaderRow = $('<tr>');

            visualHeaders.forEach(h => {
                tHeaderRow.append($('<th>').text(h));
            });
            tHeader.append(tHeaderRow);
            table.append(tHeader);
        }
        
        var tBody = $('<tbody>');

        data.forEach(d => {
            var row = $('<tr>');

            headers.forEach(h => {

                if(h == 'position')
                {
                    if(d.position <= 4)
                    {
                        row.append($('<td>').html(html.trophy));
                    }
                    else
                    {
                        row.append($('<td>').text(d.position));
                    }
                }
                else
                {
                    row.append($('<td>').text(d[h]));
                }
            });

            if(d.position <= 4)
            {
                row.addClass('position' + d.position);
            }           

            tBody.append(row);
        });

        table.append(tBody);
        container.html(table);
    };

    html.RenderUserSelection = function(containerID, userList, onSelectCallback)
    {
        var container = $(containerID);

        // Create the input element linked to a datalist
        const $input = $(`<input type="text" list="userListData" style="color: black !important"/>`);
        const $datalist = $(`<datalist id="userListData"></datalist>`);

        // Populate the datalist with options
        userList.forEach(player => {
            $('<option></option>', {
                value: player.name
            }).appendTo($datalist);
        });

        // Set up an event listener on the input to handle changes and call the callback
        $input.on('input', function() {
            const selectedName = $(this).val();    
            onSelectCallback(selectedName);           
        });

        container.append($input, $datalist);
    }

    html.RenderPaintSelection = function(containerID, onSelectCallback)
    {
        var $container = $(containerID);

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

        for(const id in game.painting.paints)
        {
            var listItem = $('<div>').addClass('list-item').css({
                'width': '250px',
                'height': '30px',
                'position': 'relative'
            });
            listItem.data({"id" : id});
            
            var colorBox = $('<div>').addClass('color-box').css({
                "background-color": game.painting.paints[id].swatch[0],
                "width": '30px',
                "height": '30px',
                'top': 0,
                'left': 0,
                'position': 'absolute'
            });
            listItem.append(colorBox);
            
            var itemText = $("<span>").addClass("item-text").text(game.painting.paints[id].name).css({
                'top': 0,
                'left': 40,
                'position': 'absolute'
            });
            listItem.append(itemText);

            scrollableList.append(listItem);

            listItem.on('click',function () 
            {
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
                onSelectCallback(selectionBox.data('id'), selectedColor);
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

    html.RenderPersonalBests = function(containerID, pbs) {
        var container = $(containerID);
        container.empty();
    
        pbs.forEach(pb => {
            var row = $("<tr>").addClass("pb-row");
    
            var image = $("<img>").attr('src', pb.image);
            var imageCell = $("<td>").append(image);
            row.append(imageCell);
    
            var infoCell = $("<td>").addClass("pb-row-info");
            var table = $("<table>");
    
            // Append each piece of information with its corresponding formatting
            table.append($("<tr>").html(`<th class="label">Level:</th><td>${pb.name}</td>`));
            table.append($("<tr>").html(`<th class="label">Creator:</th><td>${pb.creator}</td>`));
            table.append($("<tr>").html(`<td colspan="2"><br></td>`));
            table.append($("<tr>").html(`<th class="label">Player:</th><td>${pb.player}</td>`));
            table.append($("<tr>").html(`<th class="label">Time:</th><td>${util.ConvertSecondsToDisplayTime(pb.time)}</td>`));
            table.append($("<tr>").html(`<th class="label">Splits:</th><td>${pb.splits}</td>`));
            table.append($("<tr>").html(`<th class="label">Record ID:</th><td>${pb.recordId}</td>`));
            table.append($("<tr>").html(`<th class="label">Date:</th><td>${util.ConvertISODateToDate(pb.date)}</td>`));
    
            infoCell.append(table);
            row.append(infoCell);
            container.append(row);
        });
    };

    return html;
})(jQuery);