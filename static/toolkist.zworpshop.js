var toolkist_zs = (function($) {
    var toolkist_zs = {};   
    toolkist_zs.currentPageData = null;
    toolkist_zs.currentPage = 0;
    toolkist_zs.pageCount = 0;

    toolkist_zs.ConvertSecondsToTime = function(seconds)
    {
        // Get minutes
        var minutes = Math.floor(seconds / 60);
        // Get remaining seconds
        var remainingSeconds = seconds % 60;
        // Get milliseconds
        var milliseconds = Math.floor((remainingSeconds - Math.floor(remainingSeconds)) * 1000);
        // Convert remaining seconds to two-digit format
        remainingSeconds = Math.floor(remainingSeconds).toString().padStart(2, '0');
        // Convert milliseconds to three-digit format
        milliseconds = milliseconds.toString().padStart(3, '0');
        // Combine minutes, seconds, and milliseconds into time format
        var timeFormat = minutes.toString().padStart(2, '0') + ':' + remainingSeconds + '.' + milliseconds;
        return timeFormat;
    };

    toolkist_zs.ExtractPageNumberFromUrl = function(url)
    {
        const pageNumberRegex = /page%5Bnumber%5D=(\d+)/;
        const match = url.match(pageNumberRegex);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        } else {
            return 1;
        }
    };

    toolkist_zs.AddLevelToPlaylist = function(levelParams)
    {
        // Get the playlist container
        var $playlistContainer = $('#playlistList');    
        // Create a new div for the level in the playlist
        var $levelDiv = $('<div>').addClass('playlistLevel');    
        var levelDivAuthor = $('<span>').html('<i class="fa fa-user" aria-hidden="true"></i> ' + `${levelParams.fileAuthor}`);
        var levelDivTitle = $('<span>').html('<i class="fa fa-align-justify" aria-hidden="true"></i> ' + `${levelParams.name}`);
        // Set the text content of the level div
        $levelDiv.append(levelDivAuthor);    
        $levelDiv.append(levelDivTitle);    
        // Attach the level parameters JSON data to the level div using jQuery .data()
        $levelDiv.data('levelParams', levelParams);    
        // Create a button to delete the level from the playlist
        var $deleteButton = $('<button>').text('Delete').css({color: 'black'});    
        // Attach a click event listener to the delete button
        $deleteButton.on('click', function() {
            // Remove the level div from the playlist container
            $levelDiv.remove();
        });    
        // Append the delete button to the level div
        $levelDiv.append($deleteButton);    
        // Append the level div to the playlist container
        $playlistContainer.append($levelDiv);
    };

    toolkist_zs.ExportPlaylist = function()
    {
        var $playlistContainer = $('#playlistContainer');
        var playlist = new toolkist_playlist.Playlist();
        var playlistName = $('#playlistNameInput').val();
        if(playlistName == "")
        {
            playlistName = "Zoozle Playlist";
        }
        playlist.name = playlistName;
        playlist.shuffle = false;
        playlist.roundLength = 360;

        var empty = true;
        $playlistContainer.find('.playlistLevel').each(function() {
            // Get the level parameters JSON data attached to the div
            var levelParams = $(this).data('levelParams');
            playlist.addLevel({UID: levelParams.fileUid, WorkshopID: levelParams.workshopId, Name: levelParams.name, Author: levelParams.fileAuthor});
            empty = false;
        }); 

        if(!empty){
            toolkist_fs.directDownload(playlist.name + ".zeeplist", playlist.toJSON());  
        } 
    };

    toolkist_zs.GetDataFromUrl = function(url, callback)
    {
        // Make request
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                var responseJSON = JSON.parse(xhttp.responseText);  
                
                toolkist_zs.currentPageData = responseJSON;
                toolkist_zs.currentPage = toolkist_zs.ExtractPageNumberFromUrl(toolkist_zs.currentPageData.links.self);
                toolkist_zs.pageCount = toolkist_zs.ExtractPageNumberFromUrl(toolkist_zs.currentPageData.links.last);

                callback();
            }
        }
        // Modify the URL to use HTTPS
        url = url.replace(/^http:/, 'https:');
        xhttp.open("GET", url, true);
        xhttp.send();  
    };

    toolkist_zs.ConstructPage = function()
    {
        // Select the container div where the table/list will be contained
        var $containerDiv = $("#levelsContainer");    
        // Create an empty jQuery object to store the level cards
        var $levelCards = $();    
        // Loop through each level in the data
        toolkist_zs.currentPageData.data.forEach(function(level) {
            // Create a level card div
            var $levelCard = $('<div>').addClass('levelCard').css('background-image', `url("${level.attributes.imageUrl}")`);        
            // Create a div for level card info
            var $levelCardInfo = $('<div>').addClass('levelCardInfo').html('<i class="fa fa-user" aria-hidden="true"></i> ' + `${level.attributes.fileAuthor}` + '<br><i class="fa fa-align-justify" aria-hidden="true"></i> ' + `${level.attributes.name}`);        
            // Create a div for level times
            var $levelCardTimes = $('<div>').addClass('levelCardTimes');        
            // Add additional level data
            $levelCardTimes.append(`<img class='medal' src='/medal_author.png'/>`);
            $levelCardTimes.append(`<div class='levelTime'>${toolkist_zs.ConvertSecondsToTime(level.attributes.validation)}</div>`);
            $levelCardTimes.append(`<img class='medal' src='/medal_gold.png'/>`);
            $levelCardTimes.append(`<div class='levelTime'>${toolkist_zs.ConvertSecondsToTime(level.attributes.validation)}</div>`);
            $levelCardTimes.append(`<img class='medal' src='/medal_silver.png'/>`);
            $levelCardTimes.append(`<div class='levelTime'>${toolkist_zs.ConvertSecondsToTime(level.attributes.validation)}</div>`);
            $levelCardTimes.append(`<img class='medal' src='/medal_bronze.png'/>`); 
            $levelCardTimes.append(`<div class='levelTime'>${toolkist_zs.ConvertSecondsToTime(level.attributes.validation)}</div>`);                  
            // Append level card info and level times to the level card
            $levelCard.append($levelCardInfo, $levelCardTimes);        
            // Attach level parameters JSON data to the level card using jQuery .data()
            $levelCard.data('levelParams', level.attributes);        
            // Add a click event listener to the level card
            $levelCard.on('click', function() {
                toolkist_zs.AddLevelToPlaylist($(this).data('levelParams'));
            });        
            // Append the level card to the jQuery object containing all level cards
            $levelCards = $levelCards.add($levelCard);
        });    
        // Empty the container div and append all level cards
        $containerDiv.empty().append($levelCards);

        $('#pageNumber').text(toolkist_zs.currentPage + " / " + toolkist_zs.pageCount);
    };

    toolkist_zs.FirstPageButton = function()
    {
        if(toolkist_zs.currentPageData != null)
        {
            toolkist_zs.GetDataFromUrl(toolkist_zs.currentPageData.links.first, function()
            {                
                toolkist_zs.ConstructPage();
            });
        }
    };
    
    toolkist_zs.PreviousPageButton = function()
    {
        if(toolkist_zs.currentPageData != null)
        {
            if(toolkist_zs.currentPageData.links.hasOwnProperty('prev')){
                toolkist_zs.GetDataFromUrl(toolkist_zs.currentPageData.links.prev, function()
                {                
                    toolkist_zs.ConstructPage();
                });
            }
        }
    };

    toolkist_zs.NextPageButton = function()
    {
        if(toolkist_zs.currentPageData != null)
        {
            if(toolkist_zs.currentPageData.links.hasOwnProperty('next')){
                toolkist_zs.GetDataFromUrl(toolkist_zs.currentPageData.links.next, function()
                {                
                    toolkist_zs.ConstructPage();
                });
            }
        }
    };

    toolkist_zs.LastPageButton = function()
    {
        if(toolkist_zs.currentPageData != null)
        {
            toolkist_zs.GetDataFromUrl(toolkist_zs.currentPageData.links.last, function()
            {                
                toolkist_zs.ConstructPage();
            });
        }
    };    

    toolkist_zs.SearchQuery = function()
    {
        function isValidNumber(input) {
            // Parse the input as a number
            const number = parseFloat(input);
            
            // Check if the parsed number is a valid number and not NaN
            if (!isNaN(number)) {
              // Return true if it's a valid number
              return true;
            } else {
              // Return false if it's not a valid number
              return false;
            }
        }

        let url = `https://jsonapi.zworpshop.com/levels?`;
        const searchString = $('#searchQuery').val(); 
        if(searchString != "")
        {
            url += `filter=or(contains(name,'${searchString}'),contains(fileAuthor,'${searchString}'))`; 
        }
        let authorMin = "";
        let authorMax = "";
        if($('#enableAuthorMin').is(':checked'))
        {
            const authorMinInput = $('#authorMinInput').val();
            if(isValidNumber(authorMinInput))
            {
                authorMin = authorMinInput;
            }            
        }

        if($('#enableAuthorMax').is(':checked'))
        {
            const authorMaxInput = $('#authorMaxInput').val();
            if(isValidNumber(authorMaxInput))
            {
                authorMax = authorMaxInput;
            }
        }

        if(authorMin != "" && authorMax != "")
        {
            url += `&filter=and(greaterOrEqual(validation,'${parseFloat(authorMin)}'),lessOrEqual(validation,'${parseFloat(authorMax)}'))`;
        }
        else if(authorMin != "")
        {
            url += `&filter=greaterOrEqual(validation,'${parseFloat(authorMin)}')`;
        }
        else if(authorMax != "")
        {
            url += `&filter=lessOrEqual(validation,'${parseFloat(authorMax)}')`;
        }

        url += `&page[size]=24`;

        console.log(url);

        toolkist_zs.GetDataFromUrl(url, function()
        {
            toolkist_zs.ConstructPage();
        }); 
    }
    
    return toolkist_zs;

})(jQuery);