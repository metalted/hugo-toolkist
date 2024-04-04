import {toolkist} from '/toolkist/toolkist.js';

var gist = 
{
    "list" : {
        "main" : [
            {
                "name" : "my corn dried up '^'",
                "hash" : "F154859E514D27715E2E9DA272158FF758909C48",
                "manualRecords" : [
                    { "user" : "Test", "time" : 1000, "splits" : "1|2|3" },
                    { "user" : "Test", "time" : 1001, "splits" : "1|2|3" },
                    { "user" : "Test", "time" : 1002, "splits" : "1|2|3" },
                    { "user" : "Test", "time" : 1003, "splits" : "1|2|3" },
                    { "user" : "Test", "time" : 1004, "splits" : "1|2|3" },
                    { "user" : "Test", "time" : 1005, "splits" : "1|2|3" },
                    { "user" : "Test", "time" : 1006, "splits" : "1|2|3" },
                    { "user" : "Test", "time" : 1007, "splits" : "1|2|3" },
                    { "user" : "Test", "time" : 1008, "splits" : "1|2|3" }
                ],
                "manualCreators" : [],
                "description" : "Some description...",
                "tier" : "S"
            },
            {
                "name" : "Jungle Jam 3",
                "hash" : "CAA57574C2381FBF78DADC87CE7FBE7C4127C659",
                "manualRecords" : [],
                "manualCreators" : [],
                "description" : "Some description...",
                "tier" : "A"
            },
            {
                "name" : "my corn thawed out -_-",
                "hash" : "C1F3FAF5061DC76796D465AD1B885A39EDF267D0",
                "manualRecords" : [],
                "manualCreators" : [],
                "description" : "Some description...",
                "tier" : "B"
            },
            {
                "name" : "Red Dread",
                "hash" : "7065C9A24467A6F1E586B820E49D2C22B120A6CD",
                "manualRecords" : [],
                "manualCreators" : [],
                "description" : "Some description...",
                "tier" : "C"
            },
            {
                "name" : "Trail Of The Original Dragon",
                "hash" : "3D920C0A60ECCF3A6CC3CBE66F84AE4B8D9C8D26",
                "manualRecords" : [],
                "manualCreators" : ["justMaki", "The Maou", "Last"],
                "description" : "Some description...",
                "tier" : "D"
            }
        ],
        "legacy" : [
            {
                "name": "Camembert",
                "hash" : "1854DDF48DFD5A7796896C589AE551C91F1131AC",
                "manualRecords" : [],
                "manualCreators" : [],
                "description" : "Some description...",
                "tier" : "S"
            },
            {
                "name": "Joining The Dark Side but Not Fully Committing",
                "hash" : "404A3E243CCE8B2653BF4FB02087EDB8B4B66AE0",
                "manualRecords" : [],
                "manualCreators" : [],
                "description" : "Some description...",
                "tier" : "A"
            },
            {
                "name": "done with dunes",
                "hash" : "7627F6A23FFCB523D617944E4E65F66BD0521133",
                "manualRecords" : [],
                "manualCreators" : [],
                "description" : "Some description...",
                "tier" : "B"
            },
            {
                "name": "Fresh Blue Fun",
                "hash" : "402AEAED0375C99142FDEBD835A5CF651F87DBB1",
                "manualRecords" : [],
                "manualCreators" : [],
                "description" : "Some description...",
                "tier" : "C"
            },
            {
                "name": "Bloody Frozen Nightmare",
                "hash" : "EBC8200BF1E5F170BA80BC48D759681A7C7EFF26",
                "manualRecords" : [],
                "manualCreators" : [],
                "description" : "Some description...",
                "tier" : "D"
            }
        ]
    }
}

var playerData = null;

$(document).ready(function()
{
    toolkist.api.GetPlayerData(data => 
    {
        playerData = data;

        GetLevelRecordData(function(levelData)
        {
            console.log(levelData);
            RenderZDLList('.standardPagePanel', levelData);
        });
    });
})

function GetLevelRecordData(onLoadedCallback)
{
    var mainLevelHashes = gist.list.main.map(l => l.hash);
    var mainLevelURL = `https://jsonapi.zworpshop.com/levels?include=metadata&page[size]=100&filter=any(fileHash,'${mainLevelHashes.join("','")}')`;
    var mainRecordURL = `https://jsonapi.zeepkist-gtr.com/personalbests?include=record&page[size]=100&filter=any(level,'${mainLevelHashes.join("','")}')`;
    
    toolkist.api.JSONAPIRequestAll(mainLevelURL, function(allResponses)
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
                var gistLevelIndex = gist.list.main.findIndex(l => {return l.hash === rd.attributes.fileHash});
                if(gistLevelIndex != -1)
                {
                    var gistLevel = gist.list.main[gistLevelIndex];
                    level.index = gistLevelIndex + 1;

                    if(gistLevel.manualCreators.length > 0)
                    {
                        level.creator = gistLevel.manualCreators.join("<span class='ampersand'> & </span>");
                    }

                    level.records = [];

                    if(gistLevel.manualRecords.length > 0)
                    {
                        gistLevel.manualRecords.forEach(f => 
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

                    level.description = gistLevel.description;
                    level.tier = gistLevel.tier;
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
        toolkist.api.JSONAPIRequestAll(mainRecordURL, function(allResponses)
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

            //Go over all the levels one more time and sort the records
            levelData.forEach(lvl => 
            {
                lvl.records.sort(function(a,b){
                    return a.time - b.time;
                });
            });

            onLoadedCallback(levelData);
        })
    })    
}

function RenderZDLList(containerID, levelData)
{
    var container = $(containerID);
    container.empty();

    levelData.forEach(level => 
    {
        var row = $('<div>').addClass('zdl-row');

        var header = $('<div>').addClass('zdl-header');
        var index = $('<div>').addClass('zdl-index').append("<span>").text("#" + level.index);
        var name = $('<div>').addClass('zdl-name').text(level.name);
        var by = $('<div>').addClass('zdl-by').text('by');
        var creator = $('<div>').addClass('zdl-creator').html(level.creator);
        header.append(index, name, by, creator);

        var body = $('<div>').addClass('zdl-body');
        var image = $('<img>').attr({src : level.image}).addClass('zdl-image');
        
        var info = $('<div>').addClass('zdl-info');
        var infoHeader = $('<span>').addClass('zdl-info-header').text("Description:");
        var infoDescription = $('<span>').addClass('zdl-info-description').text(level.description);
        info.append(infoHeader, infoDescription);

        var records = $('<div>').addClass('zdl-record-list');
        var recordsHeader = $('<div>').addClass('zdl-record-list-header').text('Records:');
        var recordsBody = $('<div>').addClass('zdl-record-list-body');

        var recordsTable = $('<table>').addClass('zdl-record-table');

        var recordCounter = 1;
        var validationAdded = false;

        function createValidationRow(time)
        {
            var row = $('<tr>').addClass('position1');
            var place = $('<td>').css({width: '20%'}).append($('<img>').attr({src : '/medal_author.png'}).css({width: '15px', height: '15px'}));
            var user = $('<td>').text("Author Time").css({width: '40%'});
            var time = $('<td>').text(toolkist.util.ConvertSecondsToDisplayTime(time)).css({width: '40%'});
            row.append(place,user,time);
            recordsTable.append(row);
        }

        if(level.records.length == 0)
        {
            createValidationRow(level.authorTime);
        }
        else
        {
            level.records.forEach(r => 
            {
                if(r.time >= level.authorTime && !validationAdded)
                {
                    createValidationRow(level.authorTime);
                    validationAdded = true;
                }
                var row = $('<tr>');
                var place = $('<td>').text(recordCounter).css({width: '20%'});
                var user = $('<td>').text(r.user).css({width: '40%'});
                var time = $('<td>').text(toolkist.util.ConvertSecondsToDisplayTime(r.time)).css({width: '40%'});

                row.append(place,user,time);
                recordsTable.append(row);
                recordCounter++;
            });
        }

        recordsBody.append(recordsTable);

        records.append(recordsHeader, recordsBody);

        body.append(image, info, records);
        row.append(header, body);
        container.append(row);
    });
}