import {toolkist} from '/toolkist/toolkist.js';

var users = null;
var selectedUser = undefined;
var trackInputValue = "";

function DisplayResults(records)
{
    $("#results").empty();
    records.forEach(r => {
        var container = $("<div>").addClass("pb-container");
        var levelName = $("<span>").text(r.name);
        var levelImage = $("<img>").attr({'src' : r.imageUrl}).css({"width": "360px", "height" : "180px"});
        var levelTime = $("<span>").text(r.time);
        var levelSplits = $("<span>").text(r.splits);
        container.append(levelName,levelImage,levelTime,levelSplits);
        $('#results').append(container);
    });
}
function Search()
{
    if(selectedUser != undefined && trackInputValue != "")
    {
        var url = `https://jsonapi.zworpshop.com/levels?page[size]=10&page[number]=1&filter=contains(name,'${trackInputValue}')`
        toolkist.api.JSONAPIRequest(url, "", function(zdata)
        {
            //Get all the hashes of the levels
            var levelHashes = zdata.data.map(zd => zd.attributes.fileHash).slice(0, 10);

            if(levelHashes.length == 0)
            {
                console.log("No results");
            }
            else
            {
                console.log(zdata);

                var gtrURL = `https://jsonapi.zeepkist-gtr.com/personalbests?include=record&page[size]=100&page[number]=1&filter=and(equals(userId,'2'),any(level,'${levelHashes.join("','")}'))`;
                toolkist.api.JSONAPIRequest(gtrURL, "", function(gdata)
                {
                    console.log(gdata);

                    if(gdata.data.length == 0)
                    {
                        console.log("No results");
                    }
                    else
                    {
                        var allResults = [];
                        //Collect levels
                        gdata.data.forEach(pb => 
                            {
                            var recordId = pb.attributes.recordId;
                            var recordData = gdata.included.find(inc => (inc.id + "") === (recordId + ""));
                            var levelData = zdata.data.find(zd => zd.attributes.fileHash === pb.attributes.level);

                            var collectedData = {};

                            if(recordData != undefined && levelData != undefined)
                            {
                                for(let att in recordData.attributes)
                                {
                                    collectedData[att] = recordData.attributes[att];
                                }

                                for(let att in levelData.attributes)
                                {
                                    collectedData[att] = levelData.attributes[att];
                                }
                            }

                            allResults.push(collectedData);
                        });

                        DisplayResults(allResults);
                    }
                });
            }
        });
    }
}

$(document).ready(function()
{
    toolkist.api.GetPlayerData(function(playerData)
    {
        users = playerData;
        toolkist.html.RenderHeaderBlock(".standardLeftPanel", "Select User:");
        toolkist.html.RenderUserSelection('.standardLeftPanel', users, function(selectedName)
        {            
            selectedUser = users.find(u => u.name == selectedName);
        });

        toolkist.html.RenderHeaderBlock(".standardLeftPanel", "Track Name:");

        const trackInput = $('<input>').attr({
            type: "text",
            id: "trackInput"
        });

        $('.standardLeftPanel').append(trackInput);
        trackInput.on('input', function(){
            trackInputValue = $(this).val();
        })

        toolkist.html.RenderButton('.standardLeftPanel', 'searchButton', 'Search');

        $('#searchButton').on('click', Search); 
    });
})