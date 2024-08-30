import {toolkist} from '/toolkist/toolkist.js';

let controls;
let useDummyData = false;

export function init()
{
    controls = constructPage();

    zst.Initialize();       
    zst.OpenPage('loader-panel');

    if(useDummyData)
    {
        $.getJSON("/data/zst.dummy.json", function(data) {
            zst.data = data;
            loadPage();
        }).fail(function() 
        {          
            console.error("An error occurred while loading the dummy JSON file.");
        }); 
    }
    else
    {
        toolkist.gist.GetZSTData(function(data)
        {
            if(data == null)
            {
                console.error("Couldnt get gist data");                       
            }
            else
            {
                zst.data = data;
                loadPage();
            }    
        });
    }
}

function loadPage()
{
    zst.SetWhatWeDo(zst.data.pageContent.home.whatWeDo);
    zst.SetRules(zst.data.pageContent.rules.rules);
    zst.GenerateRecordTable();          
    zst.FillTeamPage();
    
    const latest = zst.GetLatestRecords(3);

    latest.forEach((record, index) =>
    {
        zst.SetRecentRecordVideo(index + 1, zst.GetCategoryName(record.cat) + " " + record.key, zst.GetUserName(record.user), record.time, record.ytID );
    });

    zst.SwitchToPage('home-panel'); 
    zst.SetLinksState(true);
}

function constructPage()
{
    let ctrl = {
        toolbar: $('<div>').attr({ 'id': 'toolbar' }),
        toolbarLogo: $('<div>').attr({ 'id': 'toolbar-logo' }),
        toolbarTitle: $('<div>').attr({ 'id': 'toolbar-title' }).text('Zeepkist Speedrunning Team'),
        toolbarLinks: $('<div>').attr({ 'id': 'toolbar-links', 'class': 'hidden' })
            .append(
                $('<div>').attr({ 'id': 'link|home-panel', 'class': 'toolbar-link' }).text('Home'),
                $('<div>').attr({ 'id': 'link|records-panel', 'class': 'toolbar-link' }).text('Records'),
                $('<div>').attr({ 'id': 'link|team-panel', 'class': 'toolbar-link' }).text('Team'),
                $('<div>').attr({ 'id': 'link|rules-panel', 'class': 'toolbar-link' }).text('Rules')
            ),
    
        backgroundPanel: $('<div>').attr({ 'id': 'background-panel' }),
        loaderPanel: $('<div>').attr({ 'id': 'loader-panel', 'class': 'content-panel hidden' })
            .append(
                $('<img>').attr({ 'src': '/img/zst_loader.png', 'class': 'loader-image' })
            ),
    
        homePanel: $('<div>').attr({ 'id': 'home-panel', 'class': 'content-panel hidden' })
            .append(
                $('<div>').attr({ 'id': 'objective-title' }).text('What We Do'),
                $('<div>').attr({ 'id': 'objective-content' }),
                $('<div>').attr({ 'id': 'recent-world-records-title' }).text('Recent Records'),
                $('<div>').attr({ 'id': 'recent-world-record-videos' })
                    .append(
                        $('<div>').attr({ 'class': 'video-container', 'id': 'video-container1' })
                            .append(
                                $('<iframe>').attr({
                                    'src': '',
                                    'frameborder': '0',
                                    'allow': 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                                    'allowfullscreen': true
                                }),
                                $('<div>').attr({ 'class': 'video-info' })
                                    .append(
                                        $('<div>').attr({ 'class': 'record-track' }),
                                        $('<div>').attr({ 'class': 'record-user' }),
                                        $('<div>').attr({ 'class': 'record-time' })
                                    )
                            ),
                        $('<div>').attr({ 'class': 'video-container', 'id': 'video-container2' })
                            .append(
                                $('<iframe>').attr({
                                    'src': '',
                                    'frameborder': '0',
                                    'allow': 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                                    'allowfullscreen': true
                                }),
                                $('<div>').attr({ 'class': 'video-info' })
                                    .append(
                                        $('<div>').attr({ 'class': 'record-track' }),
                                        $('<div>').attr({ 'class': 'record-user' }),
                                        $('<div>').attr({ 'class': 'record-time' })
                                    )
                            ),
                        $('<div>').attr({ 'class': 'video-container', 'id': 'video-container3' })
                            .append(
                                $('<iframe>').attr({
                                    'src': '',
                                    'frameborder': '0',
                                    'allow': 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                                    'allowfullscreen': true
                                }),
                                $('<div>').attr({ 'class': 'video-info' })
                                    .append(
                                        $('<div>').attr({ 'class': 'record-track' }),
                                        $('<div>').attr({ 'class': 'record-user' }),
                                        $('<div>').attr({ 'class': 'record-time' })
                                    )
                            )
                    ),
                $('<div>').attr({ 'id': 'discord-section' })
                    .append(
                        $('<h2>').text('Join Our Discord Channel'),
                        $('<div>').attr({ 'class': 'discord-channel' })
                            .on('click', function() {
                                window.open('https://discord.gg/wfvRzrc8hm', '_blank');
                            })
                            .append(
                                $('<svg>').attr({
                                    'width': '800px',
                                    'height': '800px',
                                    'viewBox': '0 -28.5 256 256',
                                    'version': '1.1',
                                    'xmlns': 'http://www.w3.org/2000/svg',
                                    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                                    'preserveAspectRatio': 'xMidYMid'
                                }).append(
                                    $('<g>').append(
                                        $('<path>').attr({
                                            'd': 'M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z',
                                            'fill': '#5865F2',
                                            'fill-rule': 'nonzero'
                                        })
                                    )
                                ),
                                $('<span>').text('ZST Discord')
                            )
                    )
            ),
    
        recordsPanel: $('<div>').attr({ 'id': 'records-panel', 'class': 'content-panel hidden' })
            .append(
                $('<div>').attr({ 'id': 'objective-title' }).text('Records'),
                $('<div>').attr({ 'id': 'record-table-container' })
                    .append(
                        $('<div>').attr({ 'id': 'record-table-toolbar' })
                            .append(
                                $('<select>').attr({ 'id': 'record-type-selection' })
                                    .append(
                                        $('<option>').attr({ 'value': 'official' }).text('Official'),
                                        $('<option>').attr({ 'value': 'nocheese' }).text('No Cheese'),
                                        $('<option>').attr({ 'value': 'any' }).text('Any %'),
                                        $('<option>').attr({ 'value': 'multiplayer' }).text('Multiplayer'),
                                        $('<option>').attr({ 'value': 'other' }).text('Other')
                                    ),
                                $('<select>').attr({ 'id': 'record-level-group-selection' })
                                    .append(
                                        $('<option>').attr({ 'value': 'A' }).text('A Levels'),
                                        $('<option>').attr({ 'value': 'B' }).text('B Levels'),
                                        $('<option>').attr({ 'value': 'C' }).text('C Levels'),
                                        $('<option>').attr({ 'value': 'D' }).text('D Levels'),
                                        $('<option>').attr({ 'value': 'E' }).text('E Levels'),
                                        $('<option>').attr({ 'value': 'F' }).text('F Levels'),
                                        $('<option>').attr({ 'value': 'G' }).text('G Levels'),
                                        $('<option>').attr({ 'value': 'H' }).text('H Levels'),
                                        $('<option>').attr({ 'value': 'I' }).text('I Levels'),
                                        $('<option>').attr({ 'value': 'X' }).text('X Levels'),
                                        $('<option>').attr({ 'value': 'Y' }).text('Y Levels'),
                                        $('<option>').attr({ 'value': 'CL' }).text('CL Levels'),
                                        $('<option>').attr({ 'value': 'EZ' }).text('EZ Levels'),
                                        $('<option>').attr({ 'value': 'FL' }).text('FL Levels'),
                                        $('<option>').attr({ 'value': 'OR' }).text('OR Levels'),
                                        $('<option>').attr({ 'value': 'XG' }).text('XG Levels')
                                    )
                            ),
                        $('<div>').attr({ 'id': 'record-table-content' })
                    )
            ),
    
        teamPanel: $('<div>').attr({ 'id': 'team-panel', 'class': 'content-panel hidden' })
            .append(
                $('<div>').attr({ 'id': 'objective-title' }).text('Team'),
                $('<div>').attr({ 'id': 'team-table-container' })
            ),
    
        rulesPanel: $('<div>').attr({ 'id': 'rules-panel', 'class': 'content-panel hidden' })
            .append(
                $('<div>').attr({ 'id': 'objective-title' }).text('Rules'),
                $('<div>').attr({ 'id': 'rules-list' })
            )
    };
    
    // Assembling the toolbar
    ctrl.toolbar.append(
        ctrl.toolbarLogo,
        ctrl.toolbarTitle,
        ctrl.toolbarLinks
    );
    
    // Append everything to the document body or the desired parent element
    $('#pagepanel1').append(
        ctrl.toolbar,
        ctrl.backgroundPanel,
        ctrl.loaderPanel,
        ctrl.homePanel,
        ctrl.recordsPanel,
        ctrl.teamPanel,
        ctrl.rulesPanel
    );

    return ctrl;
}

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
        return "/img/adventure/" + levelName + ".png";
        //return "/img/adventure/A-01.png";
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