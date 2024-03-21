import {util} from '/toolkist/util.toolkist.js';

export var html = (function($) {
    var html = {};   
    html.greenCheckmark = '<i class="fa fa-check" aria-hidden="true" style="color: green"></i>';
    html.redCross = '<i class="fa fa-times" aria-hidden="true" style="color: red"></i>';
    html.trashCan = '<i class="fa fa-trash" aria-hidden="true"></i>';

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
        console.log('hallo?');
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

    return html;
})(jQuery);