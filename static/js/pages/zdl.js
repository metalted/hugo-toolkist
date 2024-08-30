import {toolkist} from '/toolkist/toolkist.js';

let controls;

var useDummyData = false;
var gistData = null;
var playerData = null;

var mainLevelData = null;
var legacyLevelData = null;

var mainPlaylist = null;
var legacyPlaylist = null;

var mainPageConstructed = false;
var legacyPageConstructed = false;

var gistDataDoneLoading = false;
var playerDataDoneLoading = false;

export function init()
{
    window.onMainLevelsButton = onMainLevelsButton;
    window.onLegacyLevelsButton = onLegacyLevelsButton;
    window.onScoreboardButton = onScoreboardButton;
    window.onDownloadMainButton = onDownloadMainButton;
    window.onDownloadLegacyButton = onDownloadLegacyButton;

    controls = constructPage();    

    if(useDummyData)
    {
        //read the dummy data from the json file
        $.getJSON("/data/zdl.dummy.json", function(data) {
            gistData = data;
            gistDataDoneLoading = true;
            checkAllDataLoaded();
        }).fail(function() 
        {          
            gistDataDoneLoading = true;  
            console.error("An error occurred while loading the dummy JSON file.");
        });
    }
    else
    {
        toolkist.gist.GetZDLData(function(gdata, errorType)
        {
            if(gdata == null)
            {
                switch(errorType)
                {
                    case 'error':
                        console.error("The website was unable to fetch the data from Gist. Make sure the ID and file name are correct.");
                        break;
                    case 'parse':
                        console.error('The website was able to retreive the data from Gist, but was not able to parse the JSON file. Please check the JSON you are trying to load using a JSON validator.');
                        break;
                }
            }
            else
            {
                gistData = gdata;              
            }        

            gistDataDoneLoading = true;
            checkAllDataLoaded();
        });        
    }    

    toolkist.gtr.getAllUsers().then(u => {
        playerData = u;
        playerDataDoneLoading = true;
        checkAllDataLoaded();
    });  
}

function constructPage()
{
    let ctrl = {
        main: $('<div>').attr({'id':'zdlMainList'}),
        legacy: $('<div>').attr({'id':'zdlLegacyList'}),
        scoreboard: $('<div>').attr({'id':'zdlScoreboard'}),
        loader : toolkist.ui.createFlexPanelLoadingCircle()
    };

    $('#pagepanel1').append(ctrl.loader, ctrl.main, ctrl.legacy, ctrl.scoreboard);

    ctrl.main.hide();
    ctrl.legacy.hide();
    ctrl.scoreboard.hide();

    return ctrl;
}

function checkAllDataLoaded()
{
    if(gistDataDoneLoading && playerDataDoneLoading)
    {
        if(gistData == null || playerData == null)
        {
            //Manage error state
            controls.loader.hide();
            onMainLevelsButton();
            return;
        }    

        const mainHashes = gistData.lists.main.map(level => level.hash);
        const legacyHashes = gistData.lists.legacy.map(level => level.hash);

        toolkist.gtr.getLevelsWithMetadataAndPersonalBests(mainHashes).then(result => 
        {
            processData(result, gistData.lists.main, function(levelData){
                mainLevelData = levelData;
                console.log(mainLevelData);

                constructLevelPage('#zdlMainList', mainLevelData, 'main');

                mainPageConstructed = true;

                checkAllPagesConstructed();
            });
        });

        toolkist.gtr.getLevelsWithMetadataAndPersonalBests(legacyHashes).then(result => 
        {
            processData(result, gistData.lists.legacy, function(levelData){
                legacyLevelData = levelData;
                console.log(legacyLevelData);

                constructLevelPage('#zdlLegacyList', legacyLevelData, 'legacy');

                legacyPageConstructed = true;

                checkAllPagesConstructed();
            });
        });
    }
}

function checkAllPagesConstructed()
{
    if(mainPageConstructed && legacyPageConstructed)
    {
        constructScoreboardPage('#zdlScoreboard', mainLevelData);

        mainPlaylist = new toolkist.game.Playlist();
        mainPlaylist.SetProperties({name: "ZDL Main Levels", roundLength: 600, shuffle: false});
        mainLevelData.forEach(level =>
        {
            mainPlaylist.AddLevel(level.uid, level.workshopId, level.name, level.fileAuthor);
        });

        legacyPlaylist = new toolkist.game.Playlist();
        legacyPlaylist.SetProperties({name: "ZDL Legacy Levels", roundLength: 600, shuffle: false});
        legacyLevelData.forEach(level =>
        {
            legacyPlaylist.AddLevel(level.uid, level.workshopId, level.name, level.fileAuthor);
        });

        controls.loader.hide();
        onMainLevelsButton();
    }
}

function constructScoreboardPage(containerID, levelData)
{
    // Initialize variables
    const players = {};

    // Calculate players' scores and completions
    levelData.forEach(level => {
        level.records.forEach(record => {
            if (!players.hasOwnProperty(record.user)) {
                players[record.user] = {
                    user: record.user,
                    completed: 0,
                    score: 0
                };
            }

            players[record.user].completed++;
            players[record.user].score += level.score;
        });
    });

    // Convert players object to an array
    const playersArray = Object.values(players);

    // Sort players based on score first and then completions
    playersArray.sort((a, b) => {
        if (a.score !== b.score) {
            return b.score - a.score; // Sort by score
        } else {
            return b.completed - a.completed; // If scores are equal, sort by completions
        }
    });

    for(var i = 0; i < playersArray.length; i++)
    {
        playersArray[i].position = i + 1;
    }

    toolkist.html.RenderLeaderboard(playersArray, ['position','user','completed','score'], containerID, ["#", "Player", "Completed", "Score"]);
}

function constructLevelPage(containerID, levelData, type)
{
    var usedTracks = [];
    var usedUids = [];

    var container = $(containerID);
    container.empty();

    levelData.forEach(level => 
    {
        if(!usedTracks.includes(level.hash) && !usedUids.includes(level.uid))
        {
            usedTracks.push(level.hash);      
            usedUids.push(level.uid);  

            //Main Row
            var row = $('<div>').addClass('zdl-row');

            var color = '#000000';
            if(gistData.tiers.hasOwnProperty(level.tier))
            {
                color = gistData.tiers[level.tier];
            }

            //Left Rank Section
            var rowRank = $('<div>').addClass('zdl-rank');
            rowRank.css({backgroundColor:color});

            if(type == 'main')
            {
                var index = $('<div>').addClass('zdl-index').append("<span>").text(level.index);
                var points = $('<div>').addClass('zdl-points').append($('<i>').addClass('fa fa-star')).append($('<br>')).append($('<span>').text(level.score));
            
                rowRank.append(index, points);
            }
            
            var steam = $('<div>').addClass('zdl-steam').on('click', function(){
                var workshopUrl = 'https://steamcommunity.com/sharedfiles/filedetails/?id=' + level.workshopId;
                window.open(workshopUrl, '_blank');
            });

            rowRank.append(steam);        
            row.append(rowRank);

            //Image
            var image = $('<img>').attr({src : level.image}).addClass('zdl-image');
            row.append(image);

            //Main content container
            var rowContent = $('<div>').addClass('zdl-content');
            rowContent.css({
                backgroundColor:color
            });

            var header = $('<div>').addClass('zdl-header');        
            var name = $('<span>').text(level.name);
            
            if(level.displayName != "")
            {
                name.text(level.displayName);
            }        
            
            var by = $('<span>').addClass('orangeText').text("by");
            var creator = $('<span>').html(level.creator);
            header.append(name, by, creator);

            var authorTimeText = level.authorTime == -1 ? "Unvalidated" : toolkist.util.ConvertSecondsToDisplayTime(level.authorTime);     
            var authorTime = $('<div>').addClass('zdl-authorTime').append($('<div>').addClass('zdl-authorTime-medal')).append($('<span>').html(authorTimeText));

            if(level.youtubeUrls.hasOwnProperty("validation"))
            {
                authorTime.append(`<i class='youtubeButtonValidation' onclick='window.open("http://youtube.com/watch?v=${level.youtubeUrls.validation}")'><i class="fa fa-play" aria-hidden="true"></i></i>`);
            }

            var description = $('<div>').addClass('zdl-description').text(level.description);
            var records = $('<div>').addClass('zdl-records');     
            rowContent.append(header, authorTime, description, records);
            row.append(rowContent);

            //Record Table
            var recordsTable = $('<table>').addClass('zdl-record-table');
            records.append(recordsTable);

            var recordCounter = 1;
            var playersCurrentlyInList = [];

            level.records.forEach(r => 
            {
                var recrow = $('<tr>');
                var place = $('<td>').text(recordCounter).css({width: '20%'});
                var user = $('<td>').text(r.user).css({width: '40%'});

                var timeText = r.time == -1 ? "" : toolkist.util.ConvertSecondsToDisplayTime(r.time);

                if(level.youtubeUrls.hasOwnProperty(r.user))
                {
                    timeText += `<span class='youtubeButtonRecord' onclick='window.open("http://youtube.com/watch?v=${level.youtubeUrls[r.user]}")'><i class="fa fa-play" aria-hidden="true"></i></span>`;
                }

                var time = $('<td>').css({width: '40%', position: 'relative'}).html(timeText);

                recrow.append(place,user,time);
                recordsTable.append(recrow);
                recordCounter++;

                if(!playersCurrentlyInList.includes(r.user))
                {
                    playersCurrentlyInList.push(r.user);
                }
                else
                {
                    console.warn("Player " + r.user + " appears multiple times in the record table of " + level.name + ".");
                }                
            });       

            container.append(row);
        }
    });
}

function onMainLevelsButton()
{
    $('#zdlLegacyList').hide();
    $('#zdlScoreboard').hide();
    $('#zdlMainList').show();
}

function onLegacyLevelsButton()
{
    $('#zdlScoreboard').hide();
    $('#zdlMainList').hide();
    $('#zdlLegacyList').show();
}

function onScoreboardButton()
{
    $('#zdlMainList').hide();
    $('#zdlLegacyList').hide();
    $('#zdlScoreboard').show();
}

function onDownloadMainButton()
{
    if(mainPlaylist != null)
    {
        toolkist.fs.DirectDownload(mainPlaylist.name + ".zeeplist", mainPlaylist.ToJSON());
    }
}

function onDownloadLegacyButton()
{
    if(legacyPlaylist != null)
    {
        toolkist.fs.DirectDownload(legacyPlaylist.name + ".zeeplist", legacyPlaylist.ToJSON());
    }
}

function processData(data, gistList, callback)
{
    var levelData = [];

    data.forEach(entry => {
        let level = resultToLevel(entry, gistList);
        if(level != null)
        {
            levelData.push(level);
        }
    });

    sortLevelData(levelData);
    callback(levelData);
}

function resultToLevel(entry, list)
{
    let level = {
        name : entry.levelItemsByIdLevel.nodes[0].name,
        creator : entry.levelItemsByIdLevel.nodes[0].fileAuthor,
        fileAuthor : entry.levelItemsByIdLevel.nodes[0].fileAuthor,
        hash : entry.hash,
        file : "unknown",
        image : entry.levelItemsByIdLevel.nodes[0].imageUrl,
        workshopId : entry.levelItemsByIdLevel.nodes[0].workshopId,
        uid : entry.levelItemsByIdLevel.nodes[0].fileUid,
        authorTime : entry.levelItemsByIdLevel.nodes[0].validationTimeAuthor,
        records : []
    }

    var listLevelIndex = list.findIndex(l => {return l.hash === level.hash});
    if(listLevelIndex != -1)
    {
        let listLevel = list[listLevelIndex];
        level.index = listLevelIndex + 1;
        level.score = CalculateLevelScore(level.index);
        level.youtubeUrls = listLevel.youtubeUrls;

        if(listLevel.manualCreators.length > 0)
        {
            level.creator = listLevel.manualCreators.join(" & ");
        }        

        if(listLevel.manualRecords.length > 0)
        {
            listLevel.manualRecords.forEach(f => 
            {
                if(typeof f === 'object' && f !== null)
                {
                    var record = {};
                    record.user = f.hasOwnProperty('user') ? f.user : 'undefined';
                    record.time = f.hasOwnProperty('time') ? f.time : -1;
                    record.splits = f.hasOwnProperty('splits') ? f.splits : "";
                    level.records.push(record);
                }
            });
        }

        if(listLevel.manualValidation != 0)
        {
            if(listLevel.manualValidation < 0)
            {
                level.authorTime = -1;
            }
            else
            {
                level.authorTime = listLevel.manualValidation;
            }
        }

        level.description = listLevel.description;
        level.tier = listLevel.tier;
        level.displayName = listLevel.displayName;

        //Process the records
        entry.personalBestGlobalsByIdLevel.nodes.forEach(r => {
            var record = {};
            record.user = r.userByIdUser.steamName;
            record.time = r.recordByIdRecord.time;
            record.splits = r.recordByIdRecord.splits;
            level.records.push(record);
        });

        return level;
    }
    else
    {
        //Couldnt find level?
        return null;
    }
}

function sortLevelData(levelData)
{
    levelData.sort(function(a,b){
        return a.index - b.index;
    });

    // Go over all the levels one more time and sort the records
    levelData.forEach(lvl => {
        lvl.records.sort(function(a, b) {
            // Check if either time is -1
            if (a.time === -1 && b.time === -1) {
                // If both times are -1, sort alphabetically by user
                return a.user.localeCompare(b.user);
            } else if (a.time === -1) {
                // If only the first time is -1, place it at the bottom
                return 1;
            } else if (b.time === -1) {
                // If only the second time is -1, place it at the bottom
                return -1;
            } else {
                // Otherwise, sort by time
                return a.time - b.time;
            }
        });
    });

    return levelData;
}

function CalculateLevelScore(index)
{
    function generateY(x) {
        return x <= 25 ? 50 - 2 * (x - 1) : 2 * (x - 26);
    }

    var yPoints = generateY(index);
    return Math.round(500 / Math.pow(index, 0.2) - Math.pow(index, 1.35) + (yPoints * 2) - 99, 1);
}