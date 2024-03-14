var toolkist_apisearch = (function($) 
{
    var toolkist_apisearch = {};
    toolkist_apisearch.gtrPlayers = [];

    toolkist_apisearch.ConvertSecondsToTime = function(seconds) {
        // Calculate hours, minutes, and remaining seconds
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
    
        // Format the time components to have leading zeros if necessary
        const formattedHours = hours < 10 ? '0' + hours : hours;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    
        // Concatenate the formatted time components with colons
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };
    toolkist_apisearch.ConvertISODateToDate = function(isoDateTime) {
        // Create a new Date object from the ISO datetime string
        const date = new Date(isoDateTime);
    
        // Extract the year, month, and day components from the date object
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if necessary
    
        // Concatenate the components to form the date string in the format yyyy-MM-dd
        const dateString = `${year}-${month}-${day}`;
    
        return dateString;
    };

    toolkist_apisearch.CreateFilter = function(field, displayName, type, filter = "equals")
    {
      var filterObj = {
        active: false,
        field: field,
        displayName: displayName,
        type: type,
        filter: filter,
        elementIds: [],
        values: [],
        GetHTML : function()
        {
            switch(this.type)
            {
                case 'text':
                    return `<input type='text' id='filter_${this.field}' value='${this.values[0]}' onChange='toolkist_apisearch.FilterUpdated("${this.field}", "${this.type}", 0)'/>`;
                case 'time':
                    return `<input type='time' id='filter_${this.field}_start' value='${toolkist_apisearch.ConvertSecondsToTime(this.values[0])}' onChange='toolkist_apisearch.FilterUpdated("${this.field}", "${this.type}", 0)'/><input type='time' id='filter_${this.field}_end' value='${toolkist_apisearch.ConvertSecondsToTime(this.values[1])}' onChange='toolkist_apisearch.FilterUpdated("${this.field}", "${this.type}", 1)' />`;
                case 'date':
                    return `<input type='date' id='filter_${this.field}_start' value='${toolkist_apisearch.ConvertISODateToDate(this.values[0])}' onChange='toolkist_apisearch.FilterUpdated("${this.field}", "${this.type}", 0)'/><input type='date' id='filter_${this.field}_end' value='${toolkist_apisearch.ConvertISODateToDate(this.values[1])}' onChange='toolkist_apisearch.FilterUpdated("${this.field}", "${this.type}", 1)' />`;
            }
        },
        GetFilter : function()
        {
            switch(this.type)
            {
                case 'text':
                    return `${this.filter}(${this.field},'${this.values[0]}')`;
                case 'time':
                case 'date':
                    return `and(greaterOrEqual(${this.field},'${this.values[0]}'),lessOrEqual(${this.field},'${this.values[1]}'))`;
            }
        }
      };  

      switch(type)
      {
        case 'text': 
            filterObj.values = [""];
            filterObj.elementIds.push(`filter_${filterObj.field}`);
            break;
        case 'time':
            filterObj.values = [0,84600];
            filterObj.elementIds.push(`filter_${filterObj.field}_start`);
            filterObj.elementIds.push(`filter_${filterObj.field}_end`);
            break;
        case 'date':
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            filterObj.values = [new Date("2021-01-01T00:00:00Z").toISOString(), tomorrow.toISOString()];
            filterObj.elementIds.push(`filter_${filterObj.field}_start`);
            filterObj.elementIds.push(`filter_${filterObj.field}_end`);
            break;
      }

      return filterObj;
    };

    toolkist_apisearch.filters = {
        //id: toolkist_apisearch.CreateFilter("id", "ID", "text", "equals"),
        //workshopId: toolkist_apisearch.CreateFilter("workshopId", "Workshop ID", "text"),
        //authorId: toolkist_apisearch.CreateFilter("authorId", "Author ID", "text"),
        name: toolkist_apisearch.CreateFilter("name", "Name", "text", "contains"),
        createdAt: toolkist_apisearch.CreateFilter("createdAt", "Created At", "date"),
        updatedAt: toolkist_apisearch.CreateFilter("updatedAt", "Updated At", "date"),
        //fileUid: toolkist_apisearch.CreateFilter("fileUid", "File UID", "text"),
        fileAuthor: toolkist_apisearch.CreateFilter("fileAuthor", "Creator", "text", "contains"),
        validation: toolkist_apisearch.CreateFilter("validation", "Author Time", "time"),
        //gold: toolkist_apisearch.CreateFilter("gold", "Gold Time", "time"),
        //silver: toolkist_apisearch.CreateFilter("silver", "Silver Time", "time"),
        //bronze: toolkist_apisearch.CreateFilter("bronze", "Bronze Time", "time")
    };

    toolkist_apisearch.FilterUpdated = function(field, type, index)
    {
        var filter = toolkist_apisearch.filters[field];
        switch(type)
        {
            case 'text': 
            toolkist_apisearch.filters[field].values[0] = $(`#${filter.elementIds[0]}`).val();
                break;
            case 'time':
                toolkist_apisearch.filters[field].values[0] = $(`#${filter.elementIds[0]}`).val();
                toolkist_apisearch.filters[field].values[1] = $(`#${filter.elementIds[1]}`).val();
                break;
            case 'date':
                toolkist_apisearch.filters[field].values[0] = $(`#${filter.elementIds[0]}`).val();
                toolkist_apisearch.filters[field].values[1] = $(`#${filter.elementIds[1]}`).val();
                break;
        }

        toolkist_apisearch.filters[field].values[index]
    };

    toolkist_apisearch.RenderFilters = function()
    {
        const nonActiveDiv = $('#nonActiveFilters').html("");
        const activeDiv = $('#activeFilters').html("");

        Object.entries(toolkist_apisearch.filters).forEach(([key, filter]) => 
        {
            var filterRow = $('<div>').addClass('filterRow');
            var moveButton = $('<button>').text(filter.active ? 'Deactivate' : 'Activate');
            var title = $('<span>').text(filter.displayName);

            moveButton.on('click', function()
            {
                filter.active = !filter.active;
                toolkist_apisearch.RenderFilters();
            });

            filterRow.append(moveButton);
            filterRow.append(title);

            if(filter.active)
            {
                filterRow.append($('<span>').addClass('filterInput').html(filter.GetHTML()));
                activeDiv.append(filterRow);
            }
            else
            {
                nonActiveDiv.append(filterRow);
            }
        });
    };

    toolkist_apisearch.Request = function(url, filter, callback)
    {
        // Make request
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                var responseJSON = JSON.parse(xhttp.responseText);  
                callback(responseJSON);
            }
        }
        // Modify the URL to use HTTPS
        url = url.replace(/^http:/, 'https:');
        xhttp.open("GET", url + filter, true);
        xhttp.send(); 
    }

    toolkist_apisearch.currentSearchType = "";
    toolkist_apisearch.ConstructPage = function(data, searchType)
    {
        toolkist_apisearch.currentSearchType = searchType;

        // Select the container div where the table/list will be contained
        var $containerDiv = $("#levelsContainer");    
        // Create an empty jQuery object to store the level cards
        var $levelCards = $();    
        // Loop through each level in the data
        data.data.forEach(function(level) {
            // Create a level card div
            var $levelCard = $('<div>').addClass('levelCard').css('background-image', `url("${level.attributes.imageUrl}")`);        
            // Create a div for level card info
            var $levelCardInfo = $('<div>').addClass('levelCardInfo').html('<i class="fa fa-user" aria-hidden="true"></i> ' + `${level.attributes.fileAuthor}` + '<br><i class="fa fa-align-justify" aria-hidden="true"></i> ' + `${level.attributes.name}`);        
            // Create a div for level times
            var $levelCardTimes = $('<div>').addClass('levelCardTimes');        
            // Add additional level data
            $levelCardTimes.append(`<img class='medal' src='/medal_author.png'/>`);
            $levelCardTimes.append(`<div class='levelTime'>${toolkist_apisearch.ConvertSecondsToTime(level.attributes.validation)}</div>`);
            $levelCardTimes.append(`<img class='medal' src='/medal_gold.png'/>`);
            $levelCardTimes.append(`<div class='levelTime'>${toolkist_apisearch.ConvertSecondsToTime(level.attributes.gold)}</div>`);
            $levelCardTimes.append(`<img class='medal' src='/medal_silver.png'/>`);
            $levelCardTimes.append(`<div class='levelTime'>${toolkist_apisearch.ConvertSecondsToTime(level.attributes.silver)}</div>`);
            $levelCardTimes.append(`<img class='medal' src='/medal_bronze.png'/>`); 
            $levelCardTimes.append(`<div class='levelTime'>${toolkist_apisearch.ConvertSecondsToTime(level.attributes.bronze)}</div>`);                  
            // Append level card info and level times to the level card
            $levelCard.append($levelCardInfo, $levelCardTimes);        
            // Attach level parameters JSON data to the level card using jQuery .data()
            $levelCard.data('levelParams', level.attributes);        
            // Add a click event listener to the level card
            $levelCard.on('click', function() {
                //toolkist_apisearch.AddLevelToPlaylist($(this).data('levelParams'));
            });        
            // Append the level card to the jQuery object containing all level cards
            $levelCards = $levelCards.add($levelCard);
        });    
        // Empty the container div and append all level cards
        $containerDiv.empty().append($levelCards);        
    };

    toolkist_apisearch.FirstPageButton = function()
    {
        
    };
    
    toolkist_apisearch.PreviousPageButton = function()
    {
        
    };

    toolkist_apisearch.NextPageButton = function()
    {
        switch(toolkist_apisearch.currentSearchType)
        {
            case 'search':
                if(this.searchResult != null)
                {
                    if(this.searchResult.links.hasOwnProperty('next'))
                    {
                        toolkist_apisearch.Request(this.searchResult.links.next,"", function(data){
                            toolkist_apisearch.searchResult = data;
                            toolkist_apisearch.ConstructPage(data, 'search');
                        });
                    }                    
                }
                break;
            case 'userRecord':
                if(this.gtrUserRecordResult != null)
                {
                    if(this.gtrUserRecordResult.links.hasOwnProperty('next'))
                    {
                        toolkist_apisearch.Request(this.gtrUserRecordResult.links.next, "", function(data){
                            toolkist_apisearch.gtrUserRecordResult = data;

                            let levels = data.data.map(wr => "'" + wr.attributes.level + "'");
                            let filter = "?filter=any(fileHash," + levels.join() + ")";

                            toolkist_apisearch.Request(`https://jsonapi.zworpshop.com/levels`, filter, function(data2){
                                toolkist_apisearch.gtrUserRecordLevelResult = data2;
                                toolkist_apisearch.ConstructPage(data2, 'userRecord');
                            });
                        });
                    }
                }
                break;
        }
    };

    toolkist_apisearch.LastPageButton = function()
    {
        
    };    

    toolkist_apisearch.searchResult = null;
    toolkist_apisearch.Search = function(callback)
    {
        //Get all the active filters.
        var activeFilters = [];

        Object.entries(toolkist_apisearch.filters).forEach(([key, filter]) => 
        {
            if(filter.active)
            {
                activeFilters.push(filter);
            }
        });

        var filterUrl = "";
        if(activeFilters.length == 1)
        {
            filterUrl = `?filter=${activeFilters[0].GetFilter()}`; 
        }
        else if(activeFilters.length > 1)
        {
            filterUrl = `?filter=and(${activeFilters.map(filter => filter.GetFilter()).join()})`;
        }
        toolkist_apisearch.Request(`https://jsonapi.zworpshop.com/levels`, filterUrl + "&page[size]=9", function(data){
            toolkist_apisearch.searchResult = data;
            callback(data);
        });
    };

    toolkist_apisearch.GetPlayerData = function(callback) {
        var allUsers = [];
    
        // Define a recursive function to fetch data from all pages
        function fetchData(url) {
            toolkist_apisearch.Request(url, "", function(data) {
                allUsers = allUsers.concat(data.data);
                // Check if there's a next page
                if (data.links && data.links.next) {
                    // If there's a next page, recursively call fetchData with the next URL
                    fetchData(data.links.next);
                } else {
                    // If there's no next page, invoke the callback with allUsers
                    toolkist_apisearch.gtrPlayers = allUsers.map(user => {
                        return {
                            id: user.id,
                            name: user.attributes.steamName
                        };
                    });
                    callback();
                }
            });
        }
    
        // Start fetching data from the first page
        fetchData('https://jsonapi.zeepkist-gtr.com/users?fields[users]=id,steamName&page[size]=100');
    };

    toolkist_apisearch.gtrUserRecordResult = null;
    toolkist_apisearch.gtrUserRecordLevelResult = null;

    toolkist_apisearch.GetWRTracks = function(userId, callback)
    {
        var url = `https://jsonapi.zeepkist-gtr.com/worldrecords?fields[worldRecords]=level&filter=equals(userId,'${userId}')&page[size]=9`;
        toolkist_apisearch.Request(url, "", function(data){

            toolkist_apisearch.gtrUserRecordResult = data;

            let levels = data.data.map(wr => "'" + wr.attributes.level + "'");
            let filter = "?filter=any(fileHash," + levels.join() + ")";

            toolkist_apisearch.Request(`https://jsonapi.zworpshop.com/levels`, filter, function(data2){
                toolkist_apisearch.gtrUserRecordLevelResult = data2;
                callback(data2);
            });
        });
    }

    return toolkist_apisearch;
})(jQuery);