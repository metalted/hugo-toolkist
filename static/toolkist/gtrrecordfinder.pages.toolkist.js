import {toolkist} from '/toolkist/toolkist.js';

var users = null;
var selectedUser = undefined;
var trackInputValue = "";

function Search()
{
    toolkist.api.GetPlayerPBForLevel(selectedUser, trackInputValue, function(levelRecords)
    {
        toolkist.html.RenderPersonalBests("#results", levelRecords);
    });
}

$(document).ready(function()
{
    toolkist.api.GetPlayerData(function(playerData)
    {
        users = playerData;
        toolkist.html.RenderHeaderBlock(".standardLeftPanel", "User:");
        toolkist.html.RenderUserSelection('.standardLeftPanel', users, function(selectedName)
        {            
            selectedUser = users.find(u => u.name == selectedName);
        });

        toolkist.html.RenderHeaderBlock(".standardLeftPanel", "Track:");

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