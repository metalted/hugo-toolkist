// toolkist_stats Module Definition
// Utilizes the Revealing Module Pattern for structuring and organizing code, enhancing maintainability and readability.
var toolkist_stats = (function($) {
    var toolkist_stats = {};
    //Holds all users (id and name)
    toolkist_stats.userData = null;
    //Holds all return stat data.
    toolkist_stats.userStats = null;
    toolkist_stats.processedData = null;

    /**
     * Performs an HTTP GET request.
     * @param {string} url - The URL to which the request is sent.
     * @param {string} filter - Additional URL parameters for filtering the request.
     * @param {Function} callback - The callback function to execute upon successful response.
     */
    toolkist_stats.Request = function(url, filter, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var responseJSON = JSON.parse(xhttp.responseText);
                callback(responseJSON);
            }
        };
        url = url.replace(/^http:/, 'https:'); // Ensure HTTPS is used for security
        xhttp.open("GET", url + filter, true);
        xhttp.send();
    };

    /**
     * Fetches player data, handling pagination to gather all available data.
     * @param {Function} callback - The callback function to execute with all fetched player data.
     */
    toolkist_stats.GetPlayerData = function(callback) {
        function fetchData(url) {
            toolkist_stats.Request(url, "", function(data) {
                toolkist_stats.userData = toolkist_stats.userData.concat(data.data);
                if (data.links && data.links.next) {
                    fetchData(data.links.next);
                } else {
                    var userList = toolkist_stats.userData.map(user => ({ id: user.id, name: user.attributes.steamName }));
                    callback(userList);
                }
            });
        }
        toolkist_stats.userData = [];
        fetchData('https://jsonapi.zeepkist-gtr.com/users?fields[users]=id,steamName&page[size]=100');
    };

    /**
     * Fetches player stats, handling pagination to gather all available stats.
     * @param {Function} callback - The callback function to execute with all fetched stats.
     */
    toolkist_stats.GetPlayerStats = function(callback) {
        function fetchData(url) {
            toolkist_stats.Request(url, "", function(data) {
                data.data.forEach((stat) => {
                    const userId = stat.attributes.userId;
                    toolkist_stats.userStats[userId] = toolkist_stats.userStats[userId] || [];
                    toolkist_stats.userStats[userId].push(stat.attributes);
                });

                if (data.links && data.links.next) {
                    fetchData(data.links.next);
                } else {
                    callback(toolkist_stats.userStats);
                }
            });
        }
        toolkist_stats.userStats = {};
        fetchData('https://jsonapi.zeepkist-gtr.com/stats?page[size]=100');
    };

    /**
     * Processes user stats to sum up relevant data.
     * @param {Function} callback - The callback function to execute with the processed data.
     */
    toolkist_stats.Process = function(callback) 
    {
        const processedDataArray = [];

        for (const userId in toolkist_stats.userStats) 
        {
            const userSum = {};
            toolkist_stats.userStats[userId].forEach((obj) => {
                for (const key in obj) {
                    if (!["userId", "month", "year", "dateCreated", "dateUpdated"].includes(key)) {
                        userSum[key] = (userSum[key] || 0) + obj[key];
                    }
                }
            });

            const playerName = toolkist_stats.userData.find(u => u.id === userId)?.name;
            userSum.playerName = playerName;
            processedDataArray.push(userSum);
        }
        callback(processedDataArray);
    };

    /**
     * Sorts processed data based on a specific property.
     * @param {Array} data - The array of processed data to sort.
     * @param {string} property - The property to sort the data by.
     * @returns {Array} The sorted array.
     */
    toolkist_stats.SortData = function(data, property) {
        return [...data].sort((a, b) => b[property] - a[property]);
    };

    toolkist_stats.RetreiveData = function(loadedCallback)
    {
        toolkist_stats.GetPlayerData(function(playerData) {
            toolkist_stats.userData = playerData;
            toolkist_stats.GetPlayerStats(function(stats) {
                toolkist_stats.userStats = stats;
                toolkist_stats.Process(function(processed) 
                {
                    toolkist_stats.processedData = processed;
                    loadedCallback();
                });
            });
        });
    }    

    /**
     * Displays sorted data in a table format based on the specified property.
     * @param {string} property - The property to sort by and display.
     */
    toolkist_stats.displaySortedData = function(property) 
    {
        const sortedData = toolkist_stats.SortData(toolkist_stats.processedData, property);
        let table = `<table><thead><tr><th>Player Name</th><th>${property}</th></tr></thead><tbody>`;
        sortedData.forEach(playerData => {
            let formattedValue = playerData[property];

            if (property.includes('distance')) {
                // Convert meters to kilometers
                formattedValue = (formattedValue / 1000).toFixed(2) + ' km';
            } else if (property.includes('time') && !property.includes('times')) {
                // Convert seconds to days:hours:minutes:seconds
                var days = Math.floor(formattedValue / (3600 * 24));
                var hours = Math.floor((formattedValue % (3600 * 24)) / 3600);
                var minutes = Math.floor((formattedValue % 3600) / 60);
                var seconds = Math.round(formattedValue % 60); // Round seconds to the nearest whole number
                formattedValue = days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds';
            }

            // Conversion for specific types of properties, like distances or times, could go here.
            table += `<tr><td>${playerData.playerName}</td><td>${formattedValue}</td></tr>`;
        });
        table += `</tbody></table>`;
        $('#results').html(`<h2>${property}</h2>${table}`);
    };

    /**
     * Displays highest scores for each stat in a table format.
     */
    toolkist_stats.displayHighestScores = function() {
        // Create a table to display the highest scores for each stat
        var table = '<table><thead><tr><th>Stat</th><th>Player Name</th><th>Amount</th></tr></thead><tbody>';

        // Iterate over each property in the processed data
        for (const property in toolkist_stats.processedData[0]) {
            // Skip non-numeric properties
            if (isNaN(toolkist_stats.processedData[0][property])) {
                continue;
            }

            // Find the player with the highest score for the current property
            var highestScorePlayer = '';
            var highestScore = -Infinity;
            toolkist_stats.processedData.forEach(function(playerData) {
                if (playerData[property] > highestScore) {
                    highestScore = playerData[property];
                    highestScorePlayer = playerData.playerName;
                }
            });

            // Format the value based on the property
            var formattedValue = highestScore;
            if (property.includes('distance')) {
                // Convert meters to kilometers
                formattedValue = (highestScore / 1000).toFixed(2) + ' km';
            } else if (property.includes('time') && !property.includes('times')) {
                // Convert seconds to days:hours:minutes:seconds
                var days = Math.floor(formattedValue / (3600 * 24));
                var hours = Math.floor((formattedValue % (3600 * 24)) / 3600);
                var minutes = Math.floor((formattedValue % 3600) / 60);
                var seconds = Math.round(formattedValue % 60); // Round seconds to the nearest whole number
                formattedValue = days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds';
            }

            // Add a row to the table with the highest score for the current property
            table += '<tr><td>' + property + '</td><td>' + highestScorePlayer + '</td><td>' + formattedValue + '</td></tr>';
        }

        table += '</tbody></table>';

        // Display the table in the highestScoresResult div
        $('#results').html('<h2>Highest Scores for Each Stat</h2>' + table);
    };

    toolkist_stats.createPlayerSelectionList = function(elementId) {
        // Find the container and clear it
        const $container = $('#' + elementId).empty();
    
        // Create the select element
        const $select = $('<select style="color: black !important" name="players"></select>');
    
        // Populate the select element with options
        this.userData.forEach(player => {
            $('<option></option>', {
                value: player.name,
                text: player.name
            }).appendTo($select).css({'color':'black'});
        });
    
        // Append the select element to the container
        $select.appendTo($container);
    
        // Set up an event listener to log the change and display user stats
        $select.on('change', function() {
            const selectedName = $(this).find('option:selected').text();
            console.log(selectedName);
            var selectedUserStats = toolkist_stats.processedData.find(u => u.playerName === selectedName);
            
            // Log the selected user's stats to the console
            if(selectedUserStats == undefined)
            {
                $('#results').empty();
                $('#results').html('<h3>No stats available for ' + selectedName +'</h3>');
                
            }
            else
            {

                // Display the selected user's stats in the #results div as a table
                const $results = $('#results').empty(); // Clear previous results
                if (selectedUserStats) {
                    $('#results').append('<h3>Stats for ' + selectedName + '</h3>');

                    // Create the table and the header
                    const $table = $('<table>').addClass('table table-bordered');
                    $table.append('<thead><tr><th>Property</th><th>Value</th></tr></thead>');
                    const $tbody = $('<tbody>');

                    // Fill the table body with the stats
                    Object.entries(selectedUserStats).forEach(([key, value]) => 
                    {
                        var formattedValue = value;
                        if (key.includes('distance')) {
                            // Convert meters to kilometers
                            formattedValue = (formattedValue / 1000).toFixed(2) + ' km';
                        } else if ((key).includes('time') && !key.includes('times')) {
                            // Convert seconds to days:hours:minutes:seconds
                            var days = Math.floor(formattedValue / (3600 * 24));
                            var hours = Math.floor((formattedValue % (3600 * 24)) / 3600);
                            var minutes = Math.floor((formattedValue % 3600) / 60);
                            var seconds = Math.round(formattedValue % 60); // Round seconds to the nearest whole number
                            formattedValue = days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds';
                        }

                        const $row = $('<tr>').append($('<td>').text(key), $('<td>').text(formattedValue));
                        $tbody.append($row);
                    });

                    $table.append($tbody);
                    $results.append($table); // Append the table to the results container
                }
            }
        });
    }

    

    return toolkist_stats;
})(jQuery);