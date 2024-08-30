import {toolkist} from '/toolkist/toolkist.js';

//List of player objects from GTR.
var playerData = null;
var mainPlaylist = null;
var legacyPlaylist = null;
var gist = null;
var useDummyData = false;

$(document).ready(function()
{
    toolkist.api.GetZDLGist(function(gistData, errorType)
    {
        if(useDummyData)
        {
            gistData = gistDummy;
            console.log("Skipping Gist request and using dummy data instead.");
        }

        if(gistData == null)
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
            gist = gistData;

            //First get the player data.
            toolkist.api.GetPlayerData(data => 
            {
                playerData = data;

                //Get the level and record data for the main list.
                GetLevelRecords(gist.lists.main, function(mainData)
                {     
                    //Get the level and record data for the legacy list.
                    GetLevelRecords(gist.lists.legacy, function(legacyData)
                    {
                        RenderZDLList('#zdlMainList', mainData, 'main');
                        RenderZDLList('#zdlLegacyList', legacyData, 'legacy');
                        RenderZDLScoreboard('#zdlScoreboard', mainData);

                        mainPlaylist = new toolkist.game.Playlist();
                        mainPlaylist.SetProperties({name: "ZDL Main Levels", roundLength: 600, shuffle: false});
                        mainData.forEach(level =>
                        {
                            mainPlaylist.AddLevel(level.uid, level.workshopId, level.name, level.fileAuthor);
                        });

                        legacyPlaylist = new toolkist.game.Playlist();
                        legacyPlaylist.SetProperties({name: "ZDL Legacy Levels", roundLength: 600, shuffle: false});
                        legacyData.forEach(level =>
                        {
                            legacyPlaylist.AddLevel(level.uid, level.workshopId, level.name, level.fileAuthor);
                        })

                        /*
                        $('#mainLevelsButton').on('click', function()
                        {
                            $('#zdlLegacyList').hide();
                            $('#zdlScoreboard').hide();
                            $('#zdlMainList').show();
                        });

                        $('#legacyLevelsButton').on('click', function()
                        {                    
                            $('#zdlScoreboard').hide();
                            $('#zdlMainList').hide();
                            $('#zdlLegacyList').show();
                        });

                        $('#scoreboardButton').on('click', function()
                        {     
                            $('#zdlMainList').hide();
                            $('#zdlLegacyList').hide();
                            $('#zdlScoreboard').show();
                        });  

                        $('#mainLevelsPlaylistButton').on('click', function()
                        {
                            toolkist.fs.DirectDownload(mainPlaylist.name + ".zeeplist", mainPlaylist.ToJSON());
                        });

                        $('#legacyLevelsPlaylistButton').on('click', function()
                        {
                            toolkist.fs.DirectDownload(legacyPlaylist.name + ".zeeplist", legacyPlaylist.ToJSON());
                        });
                        
                        $('#zdlLoadingPage').hide();
                        $('#zdlMainList').show();*/
                    });
                });        
            });
        }
    }, useDummyData);
})

function GetScore(index)
{
    function generateY(x) {
        return x <= 25 ? 50 - 2 * (x - 1) : 2 * (x - 26);
    }

    var yPoints = generateY(index);
    return Math.round(500 / Math.pow(index, 0.2) - Math.pow(index, 1.35) + (yPoints * 2) - 99, 1);
}

function GetLevelRecords(list, onLoadedCallback)
{
    const hashes = list.map(level => level.hash);
    const levelURL = `https://jsonapi.zworpshop.com/levels?include=metadata&page[size]=100&filter=any(fileHash,'${hashes.join("','")}')`;
    const recordURL = `https://jsonapi.zeepkist-gtr.com/personalbests?include=record&page[size]=100&filter=any(level,'${hashes.join("','")}')`;

    toolkist.api.JSONAPIRequestAll(levelURL, function(allResponses)
    {
        var levelData = [];

        //Go over each response and extract all the levels.
        allResponses.forEach(response => 
        {
            //Go over each entry in the data array
            response.data.forEach(rd => 
            {
                //Get the data from the attributes.
                var level = {
                    name : rd.attributes.name,
                    creator: rd.attributes.fileAuthor,
                    fileAuthor: rd.attributes.fileAuthor,
                    hash: rd.attributes.fileHash,
                    file: rd.attributes.fileUrl,
                    image: rd.attributes.imageUrl,
                    workshopId: rd.attributes.workshopId,
                    uid: rd.attributes.fileUid
                };

                //Get the data from the the metadata.
                if(rd.attributes.hasOwnProperty('metadataId'))
                {
                    var metadata = response.included.find(inc => inc.id == rd.attributes.metadataId);
                    if(metadata != undefined)
                    {
                        level.blocks = metadata.attributes.blocks;
                        level.checkpoints = metadata.attributes.checkpoints;
                        level.authorTime = metadata.attributes.validation;
                    }
                }

                //Combine it with the data defined in the gists.
                var listLevelIndex = list.findIndex(l => {return l.hash === rd.attributes.fileHash});
                if(listLevelIndex != -1)
                {
                    var listLevel = list[listLevelIndex];
                    level.index = listLevelIndex + 1;
                    level.score = GetScore(level.index);
                    level.youtubeUrls = listLevel.youtubeUrls;

                    if(listLevel.manualCreators.length > 0)
                    {
                        level.creator = listLevel.manualCreators.join("<span class='orangeText'> & </span>");
                    }

                    level.records = [];

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
                    levelData.push(level);
                }
                else
                {
                    console.logError("Can't find level in gist data...", "Hash: " + rd.attributes.fileHash);
                }                
            });
        });

        levelData.sort(function(a,b){
            return a.index - b.index;
        });

        //Now that all the level data is collected, get all records for the levels.
        toolkist.api.JSONAPIRequestAll(recordURL, function(allResponses)
        {
            //Go over each response
            allResponses.forEach(response =>
            {
                //Go over each record entry
                response.data.forEach(pb => 
                {
                    //Find the index of the level that this record belongs to.
                    var levelIndex = levelData.findIndex(l => { return l.hash == pb.attributes.level; })

                    //Level found
                    if(levelIndex != -1)
                    {
                        //Get the included record data for this personal best.
                        var record = response.included.find(inc => inc.id == pb.attributes.recordId);
                        if(record != undefined)
                        {
                            var playerName = playerData.find(p => p.id == pb.attributes.userId);
                            if(playerName != undefined)
                            {
                                playerName = playerName.name;
                            }

                            var recordData = {
                                user : playerName,
                                time: record.attributes.time,
                                splits: record.attributes.splits
                            };

                            levelData[levelIndex].records.push(recordData);
                        }                        
                    }
                });
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

            onLoadedCallback(levelData);
        })
    });
}

function RenderZDLList(containerID, levelData, type)
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
            if(gist.tiers.hasOwnProperty(level.tier))
            {
                color = gist.tiers[level.tier];
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

function RenderZDLScoreboard(containerID, levelData) 
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
