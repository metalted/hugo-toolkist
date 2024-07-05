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

    zst.GetLatestRecords = function(amount) {
        const allRecords = [];
    
        // Flatten the records into a single array
        for (const category in zst.data.records) {
            for (const recordKey in zst.data.records[category]) {
                const record = zst.data.records[category][recordKey];
                if (record.ytID != "") {
                    allRecords.push({ ...record, key: recordKey, cat: category });
                }
            }
        }
    
        // Filter out records with empty dates and sort by date in descending order
        const filteredAndSortedRecords = allRecords
            .filter(record => record.date)
            .sort((a, b) => b.date.localeCompare(a.date));
    
        // Remove duplicate ytID records, keeping only the latest one
        const uniqueRecordsMap = new Map();
        for (const record of filteredAndSortedRecords) {
            if (!uniqueRecordsMap.has(record.ytID)) {
                uniqueRecordsMap.set(record.ytID, record);
            }
        }
    
        const uniqueRecords = Array.from(uniqueRecordsMap.values());
    
        return uniqueRecords.slice(0, amount);
    }

    zst.GetUserName = function(userID) 
    {
        if (zst.data.users && zst.data.users[userID] && zst.data.users[userID].displayName) {
            return zst.data.users[userID].displayName;
        }
        return "-";
    }

    zst.GetCategoryName = function(category)
    {
        switch(category){
            case "official": return "Official";
            case "any": return "Any %";
            case "nocheese": return "No Cheese";
            case "multiplayer": return "Multiplayer";
            case "other": return "Other";
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

    zst.GenerateRecordTable = function() 
    {
        const category = $('#record-type-selection').val();
        const levelGroup = $('#record-level-group-selection').val();

        if(category == "other")
        {
            $('#record-level-group-selection').hide();
            const otherRecords = zst.data.records.other;
        
            const recordsContainer = $('#record-table-content');
            recordsContainer.empty(); // Clear previous records
        
            // Create table
            const $table = $('<table>').addClass('record-table');
            const $tbody = $('<tbody>');
        
            for (const key in otherRecords) {
                const $recordRow = zst.CreateRecordRow(otherRecords[key], key);
                $tbody.append($recordRow);
            }
        
            $table.append($tbody);
            recordsContainer.append($table);
        }
        else
        {   
            $('#record-level-group-selection').show();

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
        }
    };
    
    zst.CreateRecordRow = function(record, key) {
        const $row = $('<tr>').addClass('record-row');
    
        const $levelImage = $('<td>').addClass('level-image').css('background-image', `url("${zst.GetLevelImage(key)}")`);
        const $levelName = $('<td>').addClass('record-level').text(key);
        const $recordTime = $('<td>').addClass('record-time').text(record.time || '-');
    
        const $profilePicTd = $('<td>').addClass('profile-pic');
        const $recordUser = $('<td>').addClass('record-user');
        if (Array.isArray(record.user)) {
            record.user.forEach(user => {
                const $profilePicImg = $('<img>').attr('src', zst.GetUserImage(user)).addClass('profile-pic-img');
                $profilePicTd.append($profilePicImg);
                $recordUser.append($('<div>').text(zst.GetUserName(user)));
            });
        } else {
            const $profilePicImg = $('<img>').attr('src', zst.GetUserImage(record.user)).addClass('profile-pic-img');
            $profilePicTd.append($profilePicImg);
            $recordUser.append($('<div>').text(zst.GetUserName(record.user)));
        }
    
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
        const $gtrIcon = $('<i>').addClass('fa fa-picture-o').attr('aria-hidden', 'true');
        if(record.screenshotUrl) 
        {
            const $gtrLink = $('<a>').attr('href', record.screenshotUrl).attr('target', '_blank').css('color', '#CB6BE6');
            $gtrLink.append($gtrIcon);
            $gtrTd.append($gtrLink);
        }
        else if (record.gtrID) {
            const $gtrLink = $('<a>').attr('href', `https://www.gtrwebsite.com/${record.gtrID}`).attr('target', '_blank').css('color', '#CB6BE6');
            $gtrLink.append($gtrIcon);
            $gtrTd.append($gtrLink);
        } 
        else
        {
            $gtrIcon.css('color', 'grey');
            $gtrTd.append($gtrIcon);
        }
    
        $row.append($levelImage, $levelName, $recordTime, $profilePicTd, $recordUser, $recordDate, $ytTd, $gtrTd);
        
        return $row;
    };    

    zst.FillTeamPage = function() {
        const teamContainer = $('#team-table-container');
        teamContainer.empty(); // Clear previous content
    
        const userTable = $('<table>').addClass('team-table');
        const userTableBody = $('<tbody>');
    
        const headerRow = $('<tr>').addClass('team-header-row');
        headerRow.append(
            $('<th>').text(''),
            $('<th>').text(''),
            $('<th>').text('Official'),
            $('<th>').text('No Cheese'),
            $('<th>').text('Any %'),
            $('<th>').text('Multiplayer'),
            $('<th>').text('Other'),
            $('<th>').text('Score')
        );
        userTableBody.append(headerRow);
    
        zst.userpoint = {}; // Initialize user points
        const userData = [];
    
        for (const userID in zst.data.users) {
            const user = zst.data.users[userID];
            const userRecords = {};
            let totalScore = 0;
    
            const categories = ['official', 'nocheese', 'any', 'multiplayer', 'other'];
            categories.forEach(category => {
                const recordCount = Object.keys(zst.data.records[category] || {}).filter(record => {
                    const recordData = zst.data.records[category][record];
                    return Array.isArray(recordData.user) ? recordData.user.includes(userID) : recordData.user === userID;
                }).length;
                userRecords[category] = recordCount;
                const categoryScore = zst.data.pointsPerCategory[category] || 0;
                totalScore += recordCount * categoryScore;
            });
    
            zst.userpoint[userID] = totalScore;
            userData.push({ userID, user, userRecords, totalScore });
        }
    
        // Sort users by score in descending order
        userData.sort((a, b) => b.totalScore - a.totalScore);
    
        userData.forEach(({ userID, user, userRecords, totalScore }) => {
            const userRow = $('<tr>').addClass('team-row').attr('data-user-id', userID);
    
            const userPic = $('<td>').addClass('team-pic').append(
                $('<img>').attr('src', zst.GetUserImage(userID)).addClass('team-pic-img')
            );
    
            const userName = $('<td>').addClass('team-name').text(zst.GetUserName(userID));
    
            userRow.append(
                userPic,
                userName,
                $('<td>').addClass('team-record-info').text(userRecords.official),
                $('<td>').addClass('team-record-info').text(userRecords.nocheese),
                $('<td>').addClass('team-record-info').text(userRecords.any),
                $('<td>').addClass('team-record-info').text(userRecords.multiplayer),
                $('<td>').addClass('team-record-info').text(userRecords.other),
                $('<td>').addClass('team-record-info').text(totalScore)
            );
    
            const detailRow = $('<tr>').addClass('detail-row hidden').attr('data-user-id', userID);
            const detailCell = $('<td>').attr('colspan', 7).append($('<div>').addClass('detail-container'));
            detailRow.append(detailCell);
    
            userTableBody.append(userRow);
            userTableBody.append(detailRow);
    
            userRow.on('click', function() {
                const userID = $(this).attr('data-user-id');
                const detailRow = $(`.detail-row[data-user-id="${userID}"]`);
                const detailContainer = detailRow.find('.detail-container');
    
                if (detailRow.hasClass('hidden')) {
                    if (detailContainer.is(':empty')) {
                        zst.FillUserDetails(userID, detailContainer);
                    }
                    detailRow.removeClass('hidden');
                } else {
                    detailRow.addClass('hidden');
                }
            });
        });
    
        userTable.append(userTableBody);
        teamContainer.append(userTable);
    };
    
    zst.FillUserDetails = function(userID, container) {
        const categories = ['official', 'nocheese', 'any', 'multiplayer', 'other'];
    
        categories.forEach(category => {
            const records = zst.data.records[category] || {};
            const userRecords = Object.keys(records).filter(record => {
                const recordData = records[record];
                return Array.isArray(recordData.user) ? recordData.user.includes(userID) : recordData.user === userID;
            });
    
            if (userRecords.length > 0) {
                const categoryTitle = $('<h3>').text(zst.GetCategoryName(category));
                container.append(categoryTitle);
    
                const recordTable = $('<table>').addClass('record-table');
                const recordTableBody = $('<tbody>');
                
                userRecords.forEach(recordKey => {
                    const record = records[recordKey];
                    const recordRow = $('<tr>').addClass('record-row');
    
                    const levelImage = $('<td>').addClass('level-image').css('background-image', `url("${zst.GetLevelImage(recordKey)}")`);
                    const levelName = $('<td>').addClass('record-level').text(recordKey);
                    const recordTime = $('<td>').addClass('record-time').text(record.time || 'N/A');
                    const recordDate = $('<td>').addClass('record-date').text(zst.CalculateDaysSince(record.date) + " days");
    
                    const ytTd = $('<td>').addClass('record-links');
                    const ytIcon = $('<i>').addClass('fa fa-youtube-play').attr('aria-hidden', 'true');
                    if (record.ytID) {
                        const ytLink = $('<a>').attr('href', `https://www.youtube.com/watch?v=${record.ytID}`).attr('target', '_blank').css('color', 'red');
                        ytLink.append(ytIcon);
                        ytTd.append(ytLink);
                    } else {
                        ytIcon.css('color', 'grey');
                        ytTd.append(ytIcon);
                    }
    
                    const gtrTd = $('<td>').addClass('record-links');
                    const gtrIcon = $('<i>').addClass('fa fa-picture-o').attr('aria-hidden', 'true');
                    
                    if(record.screenshotUrl) 
                    {
                        const gtrLink = $('<a>').attr('href', record.screenshotUrl).attr('target', '_blank').css('color', '#CB6BE6');
                        gtrLink.append(gtrIcon);
                        gtrTd.append(gtrLink);
                    }
                    else if (record.gtrID) 
                    {
                        const gtrLink = $('<a>').attr('href', `https://www.gtrwebsite.com/${record.gtrID}`).attr('target', '_blank').css('color', '#CB6BE6');
                        gtrLink.append(gtrIcon);
                        gtrTd.append(gtrLink);
                    } 
                    else
                    {
                        gtrIcon.css('color', 'grey');
                        gtrTd.append(gtrIcon);
                    }
    
                    recordRow.append(levelImage, levelName, recordTime, recordDate, ytTd, gtrTd);
    
                    if (category === 'multiplayer') {
                        const $profilePicTd = $('<td>').addClass('profile-pic');
                        const $recordUser = $('<td>').addClass('record-user');
                        if (Array.isArray(record.user)) {
                            record.user.forEach(user => {
                                const $profilePicImg = $('<img>').attr('src', zst.GetUserImage(user)).addClass('profile-pic-img');
                                $profilePicTd.append($profilePicImg);
                                $recordUser.append($('<div>').text(zst.GetUserName(user)));
                            });
                        } else {
                            const $profilePicImg = $('<img>').attr('src', zst.GetUserImage(record.user)).addClass('profile-pic-img');
                            $profilePicTd.append($profilePicImg);
                            $recordUser.append($('<div>').text(zst.GetUserName(record.user)));
                        }
                        recordRow.append($profilePicTd, $recordUser);
                    }
    
                    recordTableBody.append(recordRow);
                });
    
                recordTable.append(recordTableBody);
                container.append(recordTable);
            }
        });
    };

    return zst;
})(jQuery); 
