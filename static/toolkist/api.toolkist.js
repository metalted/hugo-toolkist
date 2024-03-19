export var api = (function($) {
    var api = {};   
    api.userList = [];
    api.userStats = {};
    api.statsLeaderboard = {};

    api.GetPlayerData = function(callback)
    {
        if(api.userList.length == 0)
        {
            api.RetreivePlayerData(function(){
                callback(api.userList);
            })
        }
        else
        {
            callback(api.userList);
        }
    }

    api.GetPlayerStats = function(callback)
    {

    }

    api.RetreivePlayerStats = function(callback)
    {
        var allStats = [];
        var self = this;

        function fetchData(url)
        {
            api.JSONAPIRequest(url, "", function(data)
            {
                allStats = allStats.concat(data.data);

                // Check if there's a next page
                if (data.links && data.links.next) {
                    // If there's a next page, recursively call fetchData with the next URL
                    fetchData(data.links.next);
                } else {
                    //Sum all user stats in the this.userStats object.
                    allStats.forEach((stat) => {
                        const userId = stat.attributes.userId;
                        if(!self.userStats.hasOwnProperty(userId))
                        {
                            self.userStats[userId] = stat;
                        }
                        else
                        {
                            //Sum
                            for (const key in stat) 
                            {
                                if (!["userId", "month", "year", "dateCreated", "dateUpdated"].includes(key)) {
                                    self.userStats[userId][key] = (self.userStats[userId][key] || 0) + stat[key];
                                }
                            }
                        }
                    });








                    callback();
                }
            });
        }

        fetchData('https://jsonapi.zeepkist-gtr.com/users?fields[users]=id,steamName&page[size]=100');
    }

    api.RetreivePlayerData = function(callback)
    {
        var allUsers = [];
        var self = this;

        function fetchData(url)
        {
            api.JSONAPIRequest(url, "", function(data)
            {
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

        fetchData('https://jsonapi.zeepkist-gtr.com/users?fields[users]=id,steamName&page[size]=100');
    };

    api.JSONAPIRequest = function(url, filter, callback)
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
    };

    api.Filter = class
    {
        constructor()
        {
            this.active = false;
            this.context = '';
            this.field = '';
            this.displayName = '';
            this.type = '';
            this.filter = '';
            this.elementId = '';
            this.elementIds = [];
            this.values = [];
            this.endpoint = '';
            this.userList = [];
            return this;
        }

        Set(context, elementId, field, displayName, type, filter = "equals", endpoint = "levels")
        {
            this.context = context;
            this.elementId = elementId;
            this.field = field;
            this.displayName = displayName;
            this.type = type;
            this.filter = filter;
            this.endpoint = endpoint;

            switch(type)
            {
                case 'text': 
                case 'user':
                    this.values = [""];
                    this.elementIds.push(`${context}filter_${elementId}`);
                    break;
                case 'time':
                    this.values = [0,84600];
                    this.elementIds.push(`${context}filter_${elementId}_start`);
                    this.elementIds.push(`${context}filter_${elementId}_end`);
                    break;
                case 'date':
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    this.values = [new Date("2021-01-01T00:00:00Z").toISOString(), tomorrow.toISOString()];
                    this.elementIds.push(`${context}filter_${elementId}_start`);
                    this.elementIds.push(`${context}filter_${elementId}_end`);
                    break;
            }

            return this;
        }

        GetFilterParameter()
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

        UpdateValue()
        {
            switch(this.type)
            {
                case 'text': 
                    this.values[0] = $(`#${this.elementIds[0]}`).val();
                    break;
                case 'time':
                    this.values[0] = $(`#${this.elementIds[0]}`).val();
                    this.values[1] = $(`#${this.elementIds[1]}`).val();
                    break;
                case 'date':
                    var start = this.values[0];
                    var end = this.values[1];
                    try
                    {    
                        start = new Date($(`#${this.elementIds[0]}`).val()).toISOString();
                        end = new Date($(`#${this.elementIds[1]}`).val()).toISOString();
                    }
                    catch{ console.log("Date not valid yet..");}

                    this.values[0] = start;
                    this.values[1] = end;
                    break;
                case 'user':
                    var val = $(`#${this.elementIds[0]}`).val();
                    let userId = this.userList.find(user => user.name === val);           
                    if(userId) {
                        this.values[0] = userId.id;
                    } else {
                        this.values[0] = 0;
                    }
                    break;
            }
        }
    }

    api.SearchEngine = class 
    {
        constructor()
        {
            this.levelsBuffer = [];
            this.gtrParams = {
                pageNumber: 1,
                pageSize: 100,
                endpoint: 'records',
                filter: null,
                response: null,
                data: []
            };

            this.zworpParams = {
                filters: [],
                pageSize: 100,
                pageNumber: 1,
                response: null,
                only: false
            }; 

            this.pageData = {
                pageNumber: 1,
                pageSize: 10,
                levels: [],
                start: 0,
                end: 0
            };

            this.filters = {
                zworp: {
                    name: new api.Filter().Set("zworp", "name", "name", "Track Name", "text", "contains"),
                    createdAt: new api.Filter().Set("zworp", "createdAt", "createdAt", "Created At", "date"),
                    updatedAt: new api.Filter().Set("zworp", "updatedAt", "updatedAt", "Updated At", "date"),
                    fileAuthor: new api.Filter().Set("zworp", "fileAuthor", "fileAuthor", "Creator Name", "text", "contains"),
                    validation: new api.Filter().Set("zworp", "validation", "validation", "Author Time (s)", "time"),
                },
                gtr: {
                    userId: new api.Filter().Set("gtr", "userId", "userId", "WR By User", "user", "equals", "worldrecords"),
                    favorites: new api.Filter().Set("gtr", "favorites", "userId", "Favorites Of User", "user", "equals", "favorites"),
                    levelpoints: new api.Filter().Set("gtr", "levelpoints", "points", "Min Level Points", "text", "greaterOrEqual", "levelpoints")
                }
            };

            this.OnLoadedCallback = function(){
                console.log('OnLoadedCallback');
            }
        }

        SetPlayerData(users)
        {
            this.filters.gtr.favorites.userList = users;
            this.filters.gtr.userId.userList = users;
        }

        Reset()
        {
            this.levelsBuffer = [];
            
            this.gtrParams.pageNumber = 1;
            this.gtrParams.endpoint = 'records';
            this.gtrParams.filter = null;
            this.gtrParams.response = null;
            this.gtrParams.data = [];
            
            this.zworpParams.filters = [];
            this.zworpParams.response = null;
            this.zworpParams.pageNumber = 1;
            
            this.pageData.pageNumber = 1;
            this.pageData.levels = [];
            this.pageData.start = 0;
            this.pageData.end = 0;
        }

        GetActiveFilters(context)
        {
            var filters = [];

            for(let f in this.filters[context])
            {
                let filter = this.filters[context][f];
                if(filter.active)
                {
                    filters.push(filter);

                    if(context == 'gtr')
                    {
                        return filters[0];
                    }
                }
            }

            if(context == 'gtr')
            {
                return null;
            }

            return filters;
        }

        FilterUpdated = () =>
        {
            for(let z in this.filters.zworp)
            {
                this.filters.zworp[z].UpdateValue();
            }

            for(let g in this.filters.gtr)
            {
                this.filters.gtr[g].UpdateValue();
            }
        }

        Search = () =>
        {
            this.Reset();     
            this.gtrParams.filter = this.GetActiveFilters('gtr');
            this.zworpParams.filters = this.GetActiveFilters('zworp');
            if(this.gtrParams.filter != null)
            {
                this.GTRRequest();
            }  
            else
            {
                this.ZworpRequest(false, []);
            }
        }

        GetLevel = (levelHash) =>
        {
            var level = this.levelsBuffer.find(l => l.attributes.fileHash == levelHash);
            return level;
        }

        SearchCompleted()
        {
            this.pageData.start = (this.pageData.pageNumber - 1) * this.pageData.pageSize;
            this.pageData.end = this.pageData.start + this.pageData.pageSize;
            this.pageData.levels = this.levelsBuffer.slice(this.pageData.start, this.pageData.end);
            this.OnLoadedCallback();
        }

        ZworpRequest(fromGTRRequest, levelHashes = [])
        {
            var data = {};
            var filters = [];
            var self = this;

            if(fromGTRRequest)
            {
                if(levelHashes.length > 0)
                {
                    //A filled array means result from GTR.
				    data['page[size]'] = this.zworpParams.pageSize;
                    filters.push("any(fileHash,'" + levelHashes.join("','") + "')");
                }
                else 
			    {
                    this.SearchCompleted();
                    return;
                }
            }
            else
            {
                this.zworpParams.only = true;
                data['page[size]'] = this.zworpParams.pageSize;
                data['page[number]'] = this.zworpParams.pageNumber;
            }

            filters = filters.concat(this.zworpParams.filters.map(f => f.GetFilterParameter()));

            if(filters.length == 1)
            {
                data.filter = filters[0];
            }
            else if(filters.length > 1)
            {
                data.filter = `and(${filters.join()})`;
            }

            $.ajax({
                url: 'https://jsonapi.zworpshop.com/levels',
                method: 'GET',
                data: data,
                success: function(response) 
                {
                    self.zworpParams.response = response;
                    self.levelsBuffer = self.levelsBuffer.concat(response.data);     
                    if(self.zworpParams.only)
                    {
                        //Are there more pages available and is there more room on the page?
                        if(response.links.hasOwnProperty('next') && (self.levelsBuffer.length < self.zworpParams.pageNumber * self.pageData.pageSize))
                        {
                            //Load the next page.
                            self.zworpParams.pageNumber++;
                            self.ZworpRequest(false, []);
                        }
                        else
                        {
                            self.SearchCompleted();
                        }                       
                    }
                    else
                    {
                        //Are there more pages available and is there more room on the page?
                        if(self.gtrParams.response.links.hasOwnProperty('next') && (self.levelsBuffer.length < self.gtrParams.pageNumber * self.pageData.pageSize))
                        {
                            //Load the next page.
                            self.gtrParams.pageNumber++;
                            self.GTRRequest();
                        }
                        else
                        {
                            self.SearchCompleted();
                        }      
                    }
                },
                error: function(xhr, status, error) {
                    console.error(status, error);
                }
            });
        }

        GTRRequest()
        {
            var self = this;
            var data = 
            {
                'page[size]': this.gtrParams.pageSize,
                'page[number]': this.gtrParams.pageNumber,
                'filter': this.gtrParams.filter.GetFilterParameter()
            };

            $.ajax({
                url: `https://jsonapi.zeepkist-gtr.com/${this.gtrParams.filter.endpoint}`,
                method: 'GET',
                data: data,
                success: function(response) 
                {
                    var levelHashes = response.data.map(record => record.attributes.level);                
                    self.gtrParams.response = response;
                    self.gtrParams.data = self.gtrParams.data.concat(response.data);
                    self.ZworpRequest(true, levelHashes);
                },
                error: function(xhr, status, error) {
                    console.error(status, error);
                }
            });
        }

        NextPage = () =>
        {
            let endingIndexOfCurrentPage = (this.pageData.pageNumber) * this.pageData.pageSize - 1;            
            let endingIndexOfNextPage = (this.pageData.pageNumber + 1) * this.pageData.pageSize - 1;
            if(this.levelsBuffer.length >= endingIndexOfNextPage)
            {
                //Enough for a next full page
                this.pageData.pageNumber++;
                this.SearchCompleted();
                return;
            }
            else
            {
                //There is not enough to fill the page.
                if(this.zworpParams.only)
                {
                    //Are there more results to fetch?
                    if(this.zworpParams.response.links.hasOwnProperty('next'))
                    {
                        //Load the next page.
                        this.zworpParams.pageNumber++;
                        this.pageData.pageNumber++;
                        this.ZworpRequest(false, []);
                        return;
                    }                    
                }
                else
                {
                    //Are there more results to fetch?
                    if(this.gtrParams.response.links.hasOwnProperty('next'))
                    {
                        //Load the next page.
                        this.gtrParams.pageNumber++;
                        this.pageData.pageNumber++;
                        this.GTRRequest();
                        return;
                    }                   
                }
            }
            
            //No results to fetch. Are there any results after the current page?
            if(this.levelsBuffer.length - 1 > endingIndexOfCurrentPage)
            {
                //Display the remainder.
                
                this.pageData.pageNumber++;
                this.SearchCompleted();
            }
            else
            {
                //There is no next page.
            }   
        }

        PreviousPage = () =>
        {
            if(this.pageData.pageNumber > 1)
            {
                this.pageData.pageNumber--;
                this.SearchCompleted();
            }
        }
    }

    api.ZworpPlaylistRequest = function(playlist, onLoadedCallback)
    {
        let levelUids = playlist.levels.map(l => l.UID);

        var data = 
        {
            'page[size]': 100,
            'page[number]': 1,
            'filter' : "any(fileUid,'" + levelUids.join("','") + "')"
        };

        $.ajax({
            url: 'https://jsonapi.zworpshop.com/levels',
            method: 'GET',
            data: data,
            success: function(response) 
            {
                onLoadedCallback(response);
                
            },
            error: function(xhr, status, error) {
                console.error(status, error);
            }
        });
    }

    api.GetGistPlaylists = function(onLoadedCallback)
    {
        var linkGist = '5edf3fe1fffc25eeaa4b878b4ea2850f';
        var linkGistData;
        var gistPlaylists = [];        

        $.ajax({
            url: `https://api.github.com/gists/${linkGist}`,
            type: 'GET',
            dataType: 'json',
            success: function(data2) 
            {
                const fileContent = data2.files['zeepkistGistLinks.json'].content;
                linkGistData = JSON.parse(fileContent);
                var requestCount = Object.keys(linkGistData).length;
                var requestCounter = 0;
                
                for(let link in linkGistData)
                {
                    $.ajax({
                        url: `https://api.github.com/gists/${linkGistData[link]}`,
                        type: 'GET',
                        dataType: 'json',
                        success: function(data) 
                        {
                            for(let file in data.files)
                            {
                                const fileContent = data.files[file].content;
                                const jsonData = JSON.parse(fileContent);
                                gistPlaylists.push(jsonData);
                            };
                            requestCounter++;

                            if(requestCounter == requestCount)
                            {
                                onLoadedCallback(gistPlaylists);
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.error('Error fetching Gist:', textStatus, errorThrown);
                        }
                    });
                };
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error fetching Gist:', textStatus, errorThrown);
            }
        });
    };

    return api;
})(jQuery);