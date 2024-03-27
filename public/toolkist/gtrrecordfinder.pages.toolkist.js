import {toolkist} from '/toolkist/toolkist.js';

var users = null;
var selectedUser = undefined;
var trackInputValue = "";

function Search()
{
    if(selectedUser != undefined && trackInputValue != "")
    {
        console.log(selectedUser, trackInputValue);

        var url = `https://jsonapi.zworpshop.com/levels?page[size]=10&page[number]=1&filter=contains(name,'${trackInputValue}')`
        toolkist.api.JSONAPIRequest(url, "", function(zdata)
        {
            //Get all the hashes of the levels
            var levelHashes = zdata.data.map(zd => zd.attributes.fileHash).slice(0, 10);

            if(levelHashes.length == 0)
            {
                console.log("No results");
            }
            

            var gtrURL = `https://jsonapi.zeepkist-gtr.com/personalbests?include=record&page[size]=100&page[number]=1&filter=and(equals(userId,'2'),any(level,'${levelHashes.join("','")}'))`;
            toolkist.api.JSONAPIRequest(gtrURL, "", function(gdata){
                console.log(gdata);
            });
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