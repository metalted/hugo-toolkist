var zst = (function($) 
{
    var zst = {}; 
    zst.data = null;

    zst.Initialize = function()
    {
        const links = $('.toolbar-link');
        links.each(function() {
            const link = $(this);
            const id = link.attr("id").split("|")[1];
            link.on('click', () => zst.SwitchToPage(id));
        });

        $('#record-type-selection').on("change", () => {
            zst.GenerateRecordTable();
        });

        $('#record-level-group-selection').on("change", () => {
            zst.GenerateRecordTable();
        });
    }

    zst.RetreiveData = function(onLoadedCallback)
    {
        zst.data = zstDummy;
        onLoadedCallback();
    }

    zst.SetLinksState = function(state)
    {
        const el = $("#toolbar-links");
        if(state)
        {            
            el.hide();
            el.removeClass('hidden');
            el.fadeIn(500);
        }
        else
        {
            el.addClass('hidden');
        }
    }

    zst.ClosesAllPages = function(callback) {
        const panels = $('.content-panel');
        let completedAnimations = 0;
    
        panels.each(function() {
            const panel = $(this);
            panel.fadeOut(500, function() {
                panel.addClass('hidden');
                completedAnimations++;
    
                // Check if all animations are completed
                if (completedAnimations === panels.length) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            });
        });
    };
    
    zst.OpenPage = function(pageID) {
        const panels = $('.content-panel');
        panels.each(function() {
            const panel = $(this);
            if (panel.attr('id') == pageID) {
                panel.hide();
                panel.removeClass('hidden');
                panel.fadeIn(500);
            }
        });
    };
    
    zst.SwitchToPage = function(pageID) 
    {
        zst.ClosesAllPages(function() {
            zst.OpenPage(pageID);
        });
    };

    zst.SetWhatWeDo = function(text)
    {
        $('#objective-content').text(text);
    }

    zst.SetRules = function(rulesArray)
    {
        let rulesTable = $('<table>').addClass('rules-table');

        // Loop through the rules and create table rows
        rulesArray.forEach((r, index) => {
            let row = $('<tr>');
            let ruleID = $('<th>').addClass('ruleID').text((index + 1) + ")");
            let rule = $('<td>').text(r);
            row.append(ruleID, rule);
            rulesTable.append(row);
        });
    
        // Add the table to the page
        $('#rules-list').html(rulesTable);
    }

    zst.SetRecentRecordVideo = function(index, trackName, user, time, ytID)
    {
        $('#video-container' + index).find('.record-track').text(trackName);
        $('#video-container' + index).find('.record-user').text(user);
        $('#video-container' + index).find('.record-time').text(time);

        if(ytID != "")
        {
            $('#video-container' + index).find('iframe').attr({src:"https://www.youtube.com/embed/" + ytID});
        }
    }   

    zst.GetLatestRecords = function(amount)
    {
        const allRecords = [];
    
        // Flatten the records into a single array
        for (const category in zst.data.records) {
            for (const recordKey in zst.data.records[category]) {
                const record = zst.data.records[category][recordKey];
                allRecords.push({ ...record, key: recordKey, cat: category });
            }
        }
        
        // Filter out records with empty dates and sort by date in descending order
        const filteredAndSortedRecords = allRecords
            .filter(record => record.date)
            .sort((a, b) => b.date.localeCompare(a.date));
    
        return filteredAndSortedRecords.slice(0, amount);
    }

    zst.GetUserName = function(userID) 
    {
        if (zst.data.users && zst.data.users[userID] && zst.data.users[userID].displayName) {
            return zst.data.users[userID].displayName;
        }
        return "unknown";
    }

    zst.GetCategoryName = function(category)
    {
        switch(category){
            case "official": return "Official";
            case "any": return "Any %";
            case "nocheese": return "No Cheese";
            case "multiplayer": return "Multiplayer";
            default: return "Unknown";
        }
    }

    zst.GetLevelImage = function(levelName)
    {
        //return "/img/adventure/" + levelName + ".png";
        return "/img/adventure/A-01.png";
    }

    zst.GetUserImage = function(user)
    {
        if(zst.data.users.hasOwnProperty(user))
        {
            if(zst.data.users[user].hasOwnProperty("profilePicUrl"))
            {
                return zst.data.users[user].profilePicUrl;
            }
        }

        return "/img/avatar.png";
    }

    zst.GetUserName = function(user)
    {
        if(zst.data.users.hasOwnProperty(user))
        {
            return zst.data.users[user].displayName;
        }

        return "-";
    }

    zst.CalculateDaysSince = function(dateString)
    {
         // Check if the dateString is in the correct format YYYYMMDD
        if (!/^\d{8}$/.test(dateString)) {
            return "-";
        }

        // Parse the dateString into a year, month, and day
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1; // Months are zero-based in JS Date
        const day = parseInt(dateString.substring(6, 8), 10);
        
        // Validate the parsed date components
        const date = new Date(year, month, day);
        if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
            return "-";
        }

        // Get the current date
        const now = new Date();
        
        // Calculate the difference in time (milliseconds) and convert to days
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    }

    zst.GenerateRecordTable = function() {
        const category = $('#record-type-selection').val();
        const levelGroup = $('#record-level-group-selection').val();
        
        const recordsOfCategory = zst.data.records[category];
        const recordsOfCategoryAndLevelGroup = Object.keys(recordsOfCategory).filter(key => key.startsWith(levelGroup + "-"));
        const recordsOfCategoryAndLevelGroupSorted = recordsOfCategoryAndLevelGroup.sort();
        
        const resultingRecords = {};
        recordsOfCategoryAndLevelGroupSorted.forEach(key => {
            resultingRecords[key] = recordsOfCategory[key];
        });
    
        const recordsContainer = $('#record-table-content');
        recordsContainer.empty(); // Clear previous records
    
        // Create table
        const $table = $('<table>').addClass('record-table');
        const $tbody = $('<tbody>');
    
        for (const key in resultingRecords) {
            const $recordRow = zst.CreateRecordRow(resultingRecords[key], key);
            $tbody.append($recordRow);
        }
    
        $table.append($tbody);
        recordsContainer.append($table);
    };
    
    zst.CreateRecordRow = function(record, key) {
        const $row = $('<tr>').addClass('record-row');
    
        const $levelImage = $('<td>').addClass('level-image').css('background-image', `url("${zst.GetLevelImage(key)}")`);
        const $levelName = $('<td>').addClass('record-level').text(key);
        const $recordTime = $('<td>').addClass('record-time').text(record.time || 'N/A');
    
        const $profilePicTd = $('<td>').addClass('profile-pic');
        const $profilePicImg = $('<img>').attr('src', zst.GetUserImage(record.user)).addClass('profile-pic-img');
        $profilePicTd.append($profilePicImg);
    
        const $recordUser = $('<td>').addClass('record-user').text(zst.GetUserName(record.user));
        const $recordDate = $('<td>').addClass('record-date').text(zst.CalculateDaysSince(record.date) + " days");
    
        // YouTube link
        const $ytTd = $('<td>').addClass('record-links');
        const $ytIcon = $('<i>').addClass('fa fa-youtube-play').attr('aria-hidden', 'true');
        if (record.ytID) {
            const $ytLink = $('<a>').attr('href', `https://www.youtube.com/watch?v=${record.ytID}`).attr('target', '_blank').css('color', 'red');
            $ytLink.append($ytIcon);
            $ytTd.append($ytLink);
        } else {
            $ytIcon.css('color', 'grey');
            $ytTd.append($ytIcon);
        }
    
        // GTR link
        const $gtrTd = $('<td>').addClass('record-links');
        const $gtrIcon = $('<i>').addClass('fa fa-ghost').attr('aria-hidden', 'true');
        if (record.gtrID) {
            const $gtrLink = $('<a>').attr('href', `https://www.gtrwebsite.com/${record.gtrID}`).attr('target', '_blank').css('color', '#CB6BE6');
            $gtrLink.append($gtrIcon);
            $gtrTd.append($gtrLink);
        } else {
            $gtrIcon.css('color', 'grey');
            $gtrTd.append($gtrIcon);
        }
    
        $row.append($levelImage, $levelName, $recordTime, $profilePicTd, $recordUser, $recordDate, $ytTd, $gtrTd);
        
        return $row;
    };
    

    return zst;
})(jQuery); 

/*




function UpdateRecordTable()
{
    const recordType = $('#record-type-selection').val();
    const recordGroup = $('#record-level-group-selection').val();
    

    console.log(JSON.stringify(sortedRecords));

    
}    

    function getLevelImage(level) {
    // Placeholder function to get level image
    return 'path/to/level-image.png';
}

function getProfilePicture(user) {
    // Placeholder function to get user profile picture
    return 'path/to/profile-pic.png';
}

function daysSince(date) {
    const now = new Date();
    const recordDate = new Date(date);
    const diffTime = Math.abs(now - recordDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function createRecordDiv(record, key) {
    const $container = $('<div>').addClass('record-container');

    const $levelImage = $('<div>').addClass('level-image').css('background-image', `url("")`);//`url(${getLevelImage(key)})`);
    const $profilePic = $('<div>').addClass('profile-pic').css('background-image', `url("")`);//${getProfilePicture(record.user)})`);

    const $details = $('<div>').addClass('record-details');
    const $levelName = $('<div>').addClass('record-level').text(key);
    const $recordTime = $('<div>').addClass('record-time').text((record.time || "--:--:--"));
    const $recordUser = $('<div>').addClass('record-user').text(record.user || "-");
    const $recordDate = $('<div>').addClass('record-date').text(`${daysSince(record.date)} days ago` || "");

    $details.append($levelName, $recordTime, $profilePic, $recordUser, $recordDate);

    const $links = $('<div>').addClass('record-links');
    if (record.ytID) {
        const $ytLink = $('<a>').attr('href', `https://www.youtube.com/watch?v=${record.ytID}`).attr('target', '_blank').text('YouTube');
        $links.append($ytLink);
    }
    if (record.gtrID) {
        const $gtrLink = $('<a>').attr('href', `https://www.gtrwebsite.com/${record.gtrID}`).attr('target', '_blank').text('GTR');
        $links.append($gtrLink);
    }

    $container.append($levelImage, $details, $links);
    return $container;
}



$('#toolbar-links').hide();
$('#loader').hide();

$(document).ready(function() {
    const links = $('.toolbar-link');
    const sections = $('.content-section');
    const homeSection = $('#home');
    const loader = $('#loader');

    // Show loader initially
    loader.fadeIn(500);

    // Function to trigger the transition from the loader to the home section
    function loadHomePage() {
        loader.fadeOut(500, function() {
            homeSection.addClass('visible').fadeIn(500);
            $('#toolbar-links').fadeIn(500);
        });
    }

    // You can call this function whenever you are ready to load the home page
    setTimeout(loadHomePage, 500); // For example, after 0.5 seconds

    links.on('click', function(e) {
        e.preventDefault();
        const targetId = $(this).attr('id').split('-')[0];
        const targetSection = $('#' + targetId);

        sections.each(function() {
            const section = $(this);
            if (section.attr('id') !== targetId) {
                section.fadeOut(500, function() {
                    section.removeClass('visible');
                });
            }
        });

        setTimeout(function() {
            targetSection.addClass('visible').fadeIn(500);
        }, 500); // 500ms delay
    });
});*/