var toolkist_apimanager = (function($) 
{
    var toolkist_apimanager = {};
    toolkist_apimanager.levelsBuffer = [];
    toolkist_apimanager.userList = [];
	
    toolkist_apimanager.gtrParams = {
        pageNumber: 1,
        pageSize: 100,
        endpoint: 'records',
        filters: [],
        total: 0
    };

    toolkist_apimanager.zworpParams = {
        filters: []
    };    

    toolkist_apimanager.pageData = {
        pageNumber: 1,
        pageSize: 10,
        levels: [],
        start: 0,
        end: 0
    };
	
	toolkist_apimanager.ConvertSecondsToTime = function(seconds) {
        // Calculate hours, minutes, and whole seconds
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const wholeSeconds = Math.floor(seconds % 60);
    
        // Calculate milliseconds from the decimal part of seconds
        const milliseconds = Math.round((seconds - Math.floor(seconds)) * 1000);
    
        // Format the time components to have leading zeros if necessary
        const formattedHours = hours < 10 ? '0' + hours : hours;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = wholeSeconds < 10 ? '0' + wholeSeconds : wholeSeconds;
        const formattedMilliseconds = milliseconds < 100 ? (milliseconds < 10 ? '00' + milliseconds : '0' + milliseconds) : milliseconds;
    
        // Concatenate the formatted time components
        return `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s ${formattedMilliseconds}ms`;
    };
    
	
	toolkist_apimanager.ConvertISODateToDate = function(isoDateTime) {
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

    toolkist_apimanager.CreateFilter = function(context, elementId, field, displayName, type, filter = "equals", endpoint = "levels")
    {
      var newFilter = {
        active: false,
        field: field,
        displayName: displayName,
        type: type,
        filter: filter,
        elementId: elementId,
        elementIds: [],
        values: [],
		endpoint: endpoint,
        GetHTML : function()
        {
            switch(this.type)
            {
                case 'text':
                    return `<input type='text' id='${context}filter_${elementId}' value='${this.values[0]}' onChange='toolkist_apimanager.FilterUpdated("${context}","${elementId}","${this.type}",0)'/>`;
                case 'time':
                    return `<input type='time' id='${context}filter_${elementId}_start' value='${toolkist_apimanager.ConvertSecondsToTime(this.values[0])}' onChange='toolkist_apimanager.FilterUpdated("${context}","${elementId}", "${this.type}", 0)'/><input type='time' id='${context}filter_${elementId}_end' value='${toolkist_apimanager.ConvertSecondsToTime(this.values[1])}' onChange='toolkist_apimanager.FilterUpdated("${context}","${elementId}", "${this.type}", 1)' />`;
                case 'date':
                    return `<input type='date' id='${context}filter_${elementId}_start' value='${toolkist_apimanager.ConvertISODateToDate(this.values[0])}' onChange='toolkist_apimanager.FilterUpdated("${context}","${elementId}", "${this.type}", 0)'/><input type='date' id='${context}filter_${elementId}_end' value='${toolkist_apimanager.ConvertISODateToDate(this.values[1])}' onChange='toolkist_apimanager.FilterUpdated("${context}","${elementId}", "${this.type}", 1)' />`;
                case 'user':
                    let options = '';
                    for (let user of toolkist_apimanager.userList) {
                        options += `<option value='${user.name}'>`;
                    }
                    
                    return `<input type='text' list='userList_${elementId}' id='${context}filter_${elementId}' onchange='toolkist_apimanager.FilterUpdated("${context}","${elementId}","${this.type}")'/>
                            <datalist id='userList_${elementId}'>
                                ${options}
                            </datalist>`;
            }
        },
        GetFilter : function()
        {
            switch(this.type)
            {
                case 'text':
                case 'user':
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
        case 'user':
            newFilter.values = [""];
            newFilter.elementIds.push(`${context}filter_${elementId}`);
            break;
        case 'time':
            newFilter.values = [0,84600];
            newFilter.elementIds.push(`${context}filter_${elementId}_start`);
            newFilter.elementIds.push(`${context}filter_${elementId}_end`);
            break;
        case 'date':
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            newFilter.values = [new Date("2021-01-01T00:00:00Z").toISOString(), tomorrow.toISOString()];
            newFilter.elementIds.push(`${context}filter_${elementId}_start`);
            newFilter.elementIds.push(`${context}filter_${elementId}_end`);
            break;
      }

      return newFilter;
    };    

    toolkist_apimanager.RenderFilters = function(context, activeContainerID, nonActiveContainerID)
    {
		var self = this;
		
        const nonActiveDiv = $('#' + nonActiveContainerID).html("");
        const activeDiv = $('#' + activeContainerID).html("");

        Object.entries(this.filters[context]).forEach(([key, filter]) => 
        {
            var filterRow = $('<div>').addClass(`${context}FilterRow`);
            var moveButton = $('<button>').text(filter.active ? 'Deactivate' : 'Activate');
            var title = $('<span>').text(filter.displayName);

            moveButton.on('click', function()
            {
                filter.active = !filter.active;
                self.RenderFilters(context, activeContainerID, nonActiveContainerID);
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
	
	toolkist_apimanager.GetFiltersFromPage = function(context)
	{
		toolkist_apimanager[`${context}Params`].filters = [];
        var activeFilters = [];
		
		Object.entries(toolkist_apimanager.filters[context]).forEach(([key, filter]) =>
		{
			if(filter.active)
			{
				toolkist_apimanager[`${context}Params`].filters.push(filter.GetFilter());
                activeFilters.push(filter);
			}
		});
		
		return activeFilters;
	};
	
	toolkist_apimanager.filters = {
        zworp: {
			//id: toolkist_apimanager.CreateZworpFilter("id", "ID", "text", "equals"),
			//workshopId: toolkist_apimanager.CreateZworpFilter("workshopId", "Workshop ID", "text"),
			//authorId: toolkist_apimanager.CreateZworpFilter("authorId", "Author ID", "text"),
			name: toolkist_apimanager.CreateFilter("zworp", "name", "name", "Name", "text", "contains"),
			createdAt: toolkist_apimanager.CreateFilter("zworp", "createdAt", "createdAt", "Created At", "date"),
			updatedAt: toolkist_apimanager.CreateFilter("zworp", "updatedAt", "updatedAt", "Updated At", "date"),
			//fileUid: toolkist_apimanager.CreateZworpFilter("fileUid", "File UID", "text"),
			fileAuthor: toolkist_apimanager.CreateFilter("zworp", "fileAuthor", "fileAuthor", "Creator", "text", "contains"),
			//validation: toolkist_apimanager.CreateFilter("zworp", "validation", "validation", "Author Time", "time"),
			//gold: toolkist_apimanager.CreateZworpFilter("gold", "Gold Time", "time"),
			//silver: toolkist_apimanager.CreateZworpFilter("silver", "Silver Time", "time"),
			//bronze: toolkist_apimanager.CreateZworpFilter("bronze", "Bronze Time", "time")
		},
        gtr: {
			userId: toolkist_apimanager.CreateFilter("gtr", "userId", "userId", "WR By User", "user", "equals", "worldrecords"),
            favorites: toolkist_apimanager.CreateFilter("gtr", "favorites", "userId", "Favorites Of User", "user", "equals", "favorites")
		}
    };

    toolkist_apimanager.FilterUpdated = function(context, elementId, type, index)
    {
        //console.log(context);
        var filter = this.filters[context][elementId];
        switch(type)
        {
            case 'text': 
                filter.values[0] = $(`#${filter.elementIds[0]}`).val();
                break;
            case 'time':
                filter.values[0] = $(`#${filter.elementIds[0]}`).val();
                filter.values[1] = $(`#${filter.elementIds[1]}`).val();
                break;
            case 'date':
                var start = filter.values[0];
                var end = filter.values[1];
                try
                {    
                    start = new Date($(`#${filter.elementIds[0]}`).val()).toISOString();
                    end = new Date($(`#${filter.elementIds[1]}`).val()).toISOString();
                }
                catch{ console.log("Date not valid yet..");}

                filter.values[0] = start;
                filter.values[1] = end;
                break;
            case 'user':
                var val = $(`#${filter.elementIds[0]}`).val();
                let userId = this.userList.find(user => user.name === val);              
                if(userId) {
                    filter.values[0] = userId.id;
                } else {
                    filter.values[0] = 0;
                }
                break;
        }
    };

    toolkist_apimanager.GTRRequest = function()
    {
        var self = this;
		var filters = [];
		var data = 
		{
			'page[size]': self.gtrParams.pageSize,
			'page[number]': self.gtrParams.pageNumber
		};
		
		//Any filters applied?
        if(self.gtrParams.filters.length > 0)
        {
            filters = filters.concat(self.gtrParams.filters);
        }
		
		//Create the filter data for the request.
        if(filters.length == 1)
        {
            data.filter = filters[0];
        }
        else if(filters.length > 1)
        {
            data.filter = `and(${filters.join()})`;
        }	

		//console.log(`https://jsonapi.zeepkist-gtr.com/${self.gtrParams.endpoint}`);		
        //console.log(data);
        $.ajax({
            url: `https://jsonapi.zeepkist-gtr.com/${self.gtrParams.endpoint}`,
            method: 'GET',
            data: data,
            success: function(response) {
				//console.log(response);
                var levelHashes = response.data.map(record => record.attributes.level);
                self.gtrParams.total = response.meta.total;
                self.ZworpRequest(levelHashes);
            },
            error: function(xhr, status, error) {
                console.error(status, error);
            }
        });
    };

    toolkist_apimanager.ZworpRequest = function(levelHashes) {
        var self = this;
        var filters = [];
        var data = {'page[size]': self.gtrParams.pageSize};
        var zworpOnly = false;
    
        // Check if any levels were provided
        if (Array.isArray(levelHashes)) {
            if (levelHashes.length > 0) {
                filters.push("any(fileHash,'" + levelHashes.join("','") + "')");
            } else {
                // An empty array means no results
                self.Loaded();
                return;
            }
        } else {
            zworpOnly = true;
            data['page[number]'] = self.gtrParams.pageNumber;
        }
    
        // Check if any filters were applied
        if (self.zworpParams.filters.length > 0) {
            filters = filters.concat(self.zworpParams.filters);
        }
    
        // Create the filter data for the request
        if (filters.length === 1) {
            data.filter = filters[0];
        } else if (filters.length > 1) {
            data.filter = `and(${filters.join()})`;
        }
    
        $.ajax({
            url: 'https://jsonapi.zworpshop.com/levels',
            method: 'GET',
            data: data,
            success: function(response) {
                //console.log(zworpOnly);
                self.levelsBuffer = self.levelsBuffer.concat(response.data);
                //console.log(self.levelsBuffer);
    
                // Update logic to properly handle the display of results regardless of page size
                if (response.data.length < self.gtrParams.pageSize || self.levelsBuffer.length >= response.meta.total) {
                    // No more pages to load or all results have been loaded
                    self.Loaded();
                } else {
                    // There are more pages or items to load
                    self.gtrParams.pageNumber++;
                    if (zworpOnly) {
                        self.ZworpRequest();
                    } else {
                        // If you have a different method for non-zworp requests
                        self.GTRRequest();
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error(status, error);
            }
        });
    };
    

    toolkist_apimanager.OnLoadedCallback = function(){
        console.log(this.pageData.levels);
    };

    toolkist_apimanager.Loaded = function()
    {
        this.pageData.start = (this.pageData.pageNumber - 1) * this.pageData.pageSize;
        this.pageData.end = this.pageData.start + this.pageData.pageSize;
        this.pageData.levels = this.levelsBuffer.slice(this.pageData.start, this.pageData.end);
        this.OnLoadedCallback();
    };

    toolkist_apimanager.Reset = function(){
        this.levelsBuffer = [];
		
        this.gtrParams.pageNumber = 1;
        this.gtrParams.endpoint= 'records';
        this.gtrParams.filters = [];
        this.gtrParams.total = 0;
		
        this.zworpParams.filters = [];
		
        this.pageData.pageNumber = 1;
        this.pageData.levels = [];
        this.pageData.start = 0;
        this.pageData.end = 0;
    };

    toolkist_apimanager.PreviousPage = function()
    {
        if(this.pageData.pageNumber > 1)
        {
            this.pageData.pageNumber--;
            this.Loaded();
        }
    }

    toolkist_apimanager.NextPage = function() {
        // Check if there are more items in the buffer than have been displayed
        var itemsDisplayed = this.pageData.pageNumber * this.pageData.pageSize;
        var remainingItems = this.levelsBuffer.length - itemsDisplayed;
    
        // If there are remaining items in the buffer, simply increment the page number and call Loaded
        if (remainingItems > 0) {
            this.pageData.pageNumber++;
            this.Loaded();
        } else {
            // Check if there are potentially more items to load from the server
            if (itemsDisplayed < this.gtrParams.total) {
                this.pageData.pageNumber++;
                this.gtrParams.pageNumber++;
                this.GTRRequest();
            }
        }
    };
    

	toolkist_apimanager.Search = function()
	{
		this.Reset();		
		
        var activeGTRFilters = this.GetFiltersFromPage('gtr');
        this.GetFiltersFromPage('zworp');
		
        if(activeGTRFilters.length > 0)
		{
            this.gtrParams.filters = [this.gtrParams.filters[0]];
			this.gtrParams.endpoint = activeGTRFilters[0].endpoint;
            this.GTRRequest();
		}
        else
        {
            this.ZworpRequest();
        }
	};

    toolkist_apimanager.Request = function(url, filter, callback)
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

    toolkist_apimanager.GetPlayerData = function(callback) {
        
        var self = this;
        var allUsers = [];
        
        // Define a recursive function to fetch data from all pages
        function fetchData(url) {
            self.Request(url, "", function(data) {
                allUsers = allUsers.concat(data.data);
                // Check if there's a next page
                if (data.links && data.links.next) {
                    // If there's a next page, recursively call fetchData with the next URL
                    fetchData(data.links.next);
                } else {
                    // If there's no next page, invoke the callback with allUsers
                    self.userList = allUsers.map(user => {
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
	
	 return toolkist_apimanager;
	
})(jQuery);