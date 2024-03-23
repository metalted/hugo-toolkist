export var util = (function($) 
{
    var util = {};   

    util.ConvertSecondsToTime = function(seconds)
	{
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
	
	util.ConvertSecondsToDisplayTime = function(seconds) {
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
	
	util.ConvertISODateToDate = function(isoDateTime) {
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

    util.ConvertMetersToKilometers = function(meters)
    {
        const kilometers = meters / 1000;
        
        // Determine the number of decimal places needed to keep three significant figures
        const decimalPlaces = kilometers < 1 ? 2 : kilometers < 10 ? 1 : 0;
        return kilometers.toFixed(decimalPlaces);
    };

    util.ConvertSecondsToDHMS = function(seconds) {
        const days = Math.floor(seconds / (3600*24));
        seconds -= days * 3600 * 24;
        const hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        
        return [days,hours,minutes,seconds];
    };

    util.SortObjectArray = function(data, property) 
    {
        return [...data].sort((a, b) => b[property] - a[property]);
    };

    return util;
})(jQuery);