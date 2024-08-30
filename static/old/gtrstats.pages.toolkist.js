import {toolkist} from '/toolkist/toolkist.js';
    
var statsManager;

$(document).ready(function() 
{  
    statsManager = new toolkist.api.StatsManager(function()
    {
        toolkist.html.RenderTabStructure(statsManager.tabs, '.standardPagePanel');

        for(let stat in statsManager.sortedStats)
        {
            toolkist.html.RenderLeaderboard(statsManager.GetStatList(stat), ['position', 'userName', 'displayValue'], '#' + stat + '.tab-pane');
        }

        toolkist.html.RenderLeaderboard(statsManager.GetStatList('leaderboard'),['displayName', 'userName', 'displayValue'], '#leaderboard > div');

        toolkist.html.RenderUserSelection('#user', statsManager.players, function(selectedName)
        {            
            var stats = statsManager.GetUserStats(selectedName);

            if(stats.length != 0)
            {   
                toolkist.html.RenderLeaderboard(stats, ['position', 'displayName', 'displayValue'], '#user > .tab-pane');
            }
        });

        $('#user > .tab-pane').appendTo('#user');
    });   
});