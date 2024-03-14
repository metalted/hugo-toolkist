var toolkist_zoozle = (function($) 
{
    var toolkist_zoozle = {};
    toolkist_zoozle.filters = {
        id: {
            active: false,
            field: "id",
            html: ["<input type='text' id='filter_id' value='", "'/>"],
            value: "",
            GetHTML: function(){
                return `${this.html[0]}${this.value}${this.html[1]}`;
            }
        },
        workshopId: {
            active: false,
            field: "workshopId",
            html: ["<input type='text' id='filter_workshopId' value='", "'/>"],
            value: "",
            GetHTML: function(){
                return `${this.html[0]}${this.value}${this.html[1]}`;
            }
        },
        authorId: {
            active: false,
            field: "authorId",
            html: ["<input type='text' id='filter_authorId' value='", "'/>"],
            value: "",
            GetHTML: function(){
                return `${this.html[0]}${this.value}${this.html[1]}`;
            }
        },
        name: {
            active: false,
            field: "name",
            html: ["<input type='text' id='filter_name' value='", "'/>"],
            value: "",
            GetHTML: function(){
                return `${this.html[0]}${this.value}${this.html[1]}`;
            }
        },
        createdAt: {
            active: false,
            field: "createdAt",
            html: ["<label for='filter_createdAt_start'>Start:</label><input type='date' id='filter_createdAt_start' value='", "'/><label for='filter_createdAt_end'>End:</label><input type='date' id='filter_createdAt_end' value='", "'/>"],
            startValue: "",
            endValue: "",
            GetHTML: function(){
                return `${this.html[0]}${toolkist_zoozle.ExtractDateFromISODateTime(this.startValue)}${this.html[1]}${toolkist_zoozle.ExtractDateFromISODateTime(this.endValue)}${this.html[2]}`;
            }
        },
        updatedAt: {
            active: false,
            field: "updatedAt",
            html: ["<label for='filter_updatedAt_start'>Start:</label><input type='date' id='filter_updatedAt_start' value='", "'/><label for='filter_updatedAt_end'>End:</label><input type='date' id='filter_updatedAt_end'value='", "'/>"],
            startValue: "",
            endValue: "",
            GetHTML: function(){
                return `${this.html[0]}${toolkist_zoozle.ExtractDateFromISODateTime(this.startValue)}${this.html[1]}${toolkist_zoozle.ExtractDateFromISODateTime(this.endValue)}${this.html[2]}`;
            }
        },
        fileUid: {
            active: false,
            field: "fileUid",
            html: ["<input type='text' id='filter_fileUid' value='", "'/>"],
            value: "",
            GetHTML: function(){
                return `${this.html[0]}${this.value}${this.html[1]}`;
            }
        },
        fileHash: {
            active: false,
            field: "fileHash",
            html: ["<input type='text' id='filter_fileHash' value='", "'/>"],
            value: "",
            GetHTML: function(){
                return `${this.html[0]}${this.value}${this.html[1]}`;
            }
        },
        fileAuthor: {
            active: false,
            field: "fileAuthor",
            html: ["<input type='text' id='filter_fileAuthor' value='", "' />"],
            value: "",
            GetHTML: function(){
                return `${this.html[0]}${this.value}${this.html[1]}`;
            }
        },
        validation: {
            active: false,
            field: "validation",
            html: ["<label for='filter_validation_start'>Start:</label><input type='time' id='filter_validation_start' step='1' value='", "'/><label for='filter_validation_end'>End:</label><input type='time' id='filter_validation_end' step='1' value='", "'/>"],
            startValue: 0,
            endValue: 0,
            GetHTML: function(){
                return `${this.html[0]}${toolkist_zoozle.ConvertSecondsToTime(this.startValue)}${this.html[1]}${toolkist_zoozle.ConvertSecondsToTime(this.endValue)}${this.html[2]}`;
            }
        },
        gold: {
            active: false,
            field: "gold",
            html: ["<label for='filter_gold_start'>Start:</label><input type='time' id='filter_gold_start' step='1' value='", "'/><label for='filter_gold_end'>End:</label><input type='time' id='filter_gold_end' step='1' value='", "'/>"],
            startValue: 0,
            endValue: 0,
            GetHTML: function(){
                return `${this.html[0]}${toolkist_zoozle.ConvertSecondsToTime(this.startValue)}${this.html[1]}${toolkist_zoozle.ConvertSecondsToTime(this.endValue)}${this.html[2]}`;
            }
        },
        silver: {
            active: false,
            field: "silver",
            html: ["<label for='filter_silver_start'>Start:</label><input type='time' id='filter_silver_start' step='1' value='", "'/><label for='filter_silver_end'>End:</label><input type='time' id='filter_silver_end' step='1' value='", "'/>"],
            startValue: 0,
            endValue: 0,
            GetHTML: function(){
                return `${this.html[0]}${toolkist_zoozle.ConvertSecondsToTime(this.startValue)}${this.html[1]}${toolkist_zoozle.ConvertSecondsToTime(this.endValue)}${this.html[2]}`;
            }
        },
        bronze: {
            active: false,
            field: "bronze",
            html: ["<label for='filter_bronze_start'>Start:</label><input type='time' id='filter_bronze_start' step='1' value='", "'/><label for='filter_bronze_end'>End:</label><input type='time' id='filter_bronze_end' step='1' value='", "'/>"],
            startValue: 0,
            endValue: 0,
            GetHTML: function(){
                return `${this.html[0]}${toolkist_zoozle.ConvertSecondsToTime(this.startValue)}${this.html[1]}${toolkist_zoozle.ConvertSecondsToTime(this.endValue)}${this.html[2]}`;
            }
        }
    };

    toolkist_zoozle.CreatePartialFilter = function(filter, value, before = false)
    {
        switch(filter)
        {
            case "id":
                return `equals(id,'${value}')`;
            case "workshopId":
                return `equals(workshopId,'${value}')`;
            case "authorId":
                return `equals(authorId,'${value}')`;
            case "name":
                return `contains(name,'${value}')`;
            case "createdAt":
                if(before){
                    return `lessOrEqual(createdAt,'${value}')`;
                }
                else
                {
                    return `greaterOrEqual(createdAt,'${value}')`;
                }
            case "updatedAt":
                if(before){
                    return `lessOrEqual(updatedAt,'${value}')`;
                }
                else
                {
                    return `greaterOrEqual(updatedAt,'${value}')`;
                }
            case "fileUid":
                return `equals(fileUid,'${value}')`;
            case "fileAuthor":
                return `contains(fileAuthor,'${value}')`;
            case "validation":
                if(before){
                    return `lessOrEqual(validation,'${value}')`;
                }
                else
                {
                    return `greaterOrEqual(validation,'${value}')`;
                }
            case "gold":
                if(before){
                    return `lessOrEqual(gold,'${value}')`;
                }
                else
                {
                    return `greaterOrEqual(gold,'${value}')`;
                }
            case "silver":
                if(before){
                    return `lessOrEqual(silver,'${value}')`;
                }
                else
                {
                    return `greaterOrEqual(silver,'${value}')`;
                }
            case "bronze":
                if(before){
                    return `lessOrEqual(bronze,'${value}')`;
                }
                else
                {
                    return `greaterOrEqual(bronze,'${value}')`;
                }
        }

        return "";
    };

    toolkist_zoozle.RenderFilters = function() {
        const nonActiveDiv = $('#nonActiveFilters').html("");
        const activeDiv = $('#activeFilters').html("");
    
        Object.entries(toolkist_zoozle.filters).forEach(([key, filter]) => 
        {
            var add = true;
            var text = "";
            switch(filter.field)
            {
                case "name":
                    text = "Name |";
                    break;
                case "createdAt":
                    text = "Created At |";
                    break;
                case "updatedAt":
                    text = "Updated At |";
                    break;
                case "fileAuthor":
                    text = "Creator |";
                    break;
                case "validation":
                    text = "Author Time |";
                    break;
                default: add = false;
            }

            if(add)
            {
                var filterDiv = $('<div>').addClass('filterDiv');
                var moveButton = $('<button>').text(filter.active ? 'Deactivate' : 'Activate');   
                var title = $('<span>').text(text);        
                            
                moveButton.on('click', function()
                {
                    filter.active = !filter.active; // Toggle the active state
                    toolkist_zoozle.RenderFilters(); // Re-render filters
                });
                
                filterDiv.append(moveButton);
                filterDiv.append(title);
                
                if (filter.active) {
                    activeDiv.append(filterDiv);
                    var h = filter.GetHTML();
                    console.log(h);
                    var htmlInput = $('<span>').addClass('filterInput').html(h);                
                    filterDiv.append(htmlInput);
                } else {
                    nonActiveDiv.append(filterDiv);
                }
            }
        });
    }

    toolkist_zoozle.Filter = function()
    {
        var filter = {
            params : [],
            SetId : function(val){
                this.params.push(toolkist_zoozle.CreatePartialFilter('id', val));
            },
            SetWorkshopId : function(val){
                this.params.push(toolkist_zoozle.CreatePartialFilter('workshopId', val));
            },
            SetAuthorId : function(val){
                this.params.push(toolkist_zoozle.CreatePartialFilter('authorId', val));
            },
            SetName : function(val){
                this.params.push(toolkist_zoozle.CreatePartialFilter('name', val));
            },
            SetCreatedAt : function(val, before = false){
                this.params.push(toolkist_zoozle.CreatePartialFilter('createdAt', val, before));
            },
            SetUpdatedAt : function(val, before = false){
                this.params.push(toolkist_zoozle.CreatePartialFilter('updatedAt', val, before));
            },
            SetFileUid : function(val){
                this.params.push(toolkist_zoozle.CreatePartialFilter('fileUid', val));
            },
            SetFileAuthor : function(val){
                this.params.push(toolkist_zoozle.CreatePartialFilter('fileAuthor', val));
            },
            SetValidation : function(val, before = false){
                this.params.push(toolkist_zoozle.CreatePartialFilter('validation', val, before));
            },
            SetGold : function(val, before = false){
                this.params.push(toolkist_zoozle.CreatePartialFilter('gold', val, before));
            },
            SetSilver : function(val, before = false){
                this.params.push(toolkist_zoozle.CreatePartialFilter('silver', val, before));
            },
            SetBronze : function(val, before = false){
                this.params.push(toolkist_zoozle.CreatePartialFilter('bronze', val, before));
            },
            GenerateFilter : function()
            {
                if(this.params.length == 0)
                {
                    return "";
                }
                else if(this.params.length == 1)
                {
                    return `?filter=${this.params[0]}`;
                }
                else
                {
                    return `?filter=and(${this.params.join()})`;
                }
            },
            ClearParams : function()
            {
                this.params = [];
            }                    
        }

        return filter;
    };

    toolkist_zoozle.ConvertTimeToSeconds = function(time) {
        const parts = time.split(':'); // Split the time string into its components
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);
    
        // Convert each part into seconds and sum them
        return (hours * 3600) + (minutes * 60) + seconds;
    }

    toolkist_zoozle.ConvertSecondsToTime = function(seconds) {
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

    toolkist_zoozle.ExtractDateFromISODateTime = function(isoDateTime) {
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

    toolkist_zoozle.Request = function(url, filter, callback)
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
        xhttp.open("GET", url + filter.GenerateFilter() + "&page[size]=9", true);
        xhttp.send(); 
    };

    // Helper function to set filter values and add them to the filter parameters array
    toolkist_zoozle.SetFilterValue = function(filterName, value, before = false) {
        toolkist_zoozle.zfilter.params.push(toolkist_zoozle.CreatePartialFilter(filterName, value, before));

        switch (filterName) {
            case "id":
            case "workshopId":
            case "authorId":
            case "name":
            case "fileUid":
            case "fileAuthor":
                toolkist_zoozle.filters[filterName].value = value;
                break;
            case "createdAt":
            case "updatedAt":
            case "validation":
            case "gold":
            case "silver":
            case "bronze":
                if(!before)
                {
                    toolkist_zoozle.filters[filterName].startValue = value;
                }
                else
                {
                    toolkist_zoozle.filters[filterName].endValue = value;
                }
                break;
        }

        console.log(toolkist_zoozle.filters);

        
    }

    // Helper function to handle time-related filters
    toolkist_zoozle.SetTimeFilter = function(filterName, startValue, endValue) {
        let startTime = startValue || 0;
        let endTime = endValue || 84600;

        if (startValue) startTime = toolkist_zoozle.ConvertTimeToSeconds(startValue);
        if (endValue) endTime = toolkist_zoozle.ConvertTimeToSeconds(endValue);

        toolkist_zoozle.SetFilterValue(filterName, startTime);
        toolkist_zoozle.SetFilterValue(filterName, endTime, true);
    }

    // Helper function to set default date values if input is null or empty
toolkist_zoozle.SetDefaultDateValues = function(startValue, endValue) {
    const startDate = startValue ? new Date(startValue) : new Date("2021-01-01T00:00:00Z");
    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const endDate = endValue ? new Date(endValue) : tomorrow;

    // Format date strings as 'YYYY-MM-DDTHH:MM:SSZ'
    const startDateString = startDate.toISOString();
    const endDateString = endDate.toISOString();

    return [startDateString, endDateString];
}

    // Helper function to handle date filters
    toolkist_zoozle.SetDateFilter = function(filterName, startValue, endValue) {
        const [startDate, endDate] = toolkist_zoozle.SetDefaultDateValues(startValue, endValue);
        toolkist_zoozle.SetFilterValue(filterName, startDate);
        toolkist_zoozle.SetFilterValue(filterName, endDate, true);
    }
    toolkist_zoozle.zfilter = null;

    toolkist_zoozle.Run = function(callback) {
        toolkist_zoozle.zfilter = toolkist_zoozle.Filter();

        Object.entries(toolkist_zoozle.filters).forEach(([key, filter]) => {
            if (filter.active) {
                switch (filter.field) {
                    case "id":
                    case "workshopId":
                    case "authorId":
                    case "name":
                    case "fileUid":
                    case "fileAuthor":
                        toolkist_zoozle.SetFilterValue(filter.field, $(`#filter_${filter.field}`).val());
                        break;
                    case "createdAt":
                    case "updatedAt":
                        toolkist_zoozle.SetDateFilter(filter.field, $(`#filter_${filter.field}_start`).val(), $(`#filter_${filter.field}_end`).val());
                        break;
                    case "validation":
                    case "gold":
                    case "silver":
                    case "bronze":
                        toolkist_zoozle.SetTimeFilter(filter.field, $(`#filter_${filter.field}_start`).val(), $(`#filter_${filter.field}_end`).val());
                        break;
                }
            }
        });

        toolkist_zoozle.Request(`https://jsonapi.zworpshop.com/levels`, toolkist_zoozle.zfilter, callback);
    };

    return toolkist_zoozle;
})(jQuery);