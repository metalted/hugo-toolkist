+++
title = 'Zoozle'
+++

{{<rawhtml>}}
<script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.159.0/three.min.js" integrity="sha512-OviGQIoFPxWNbGybQNprasilCxjtXNGCjnaZQvDeCT0lSPwJXd5TC3usI/jsWepKW9lZLZ1ob1q/Vy4MnlTt7g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<script src='/toolkist.js'></script>
<script src='/toolkist_color.js'></script>
<script src='/toolkist_fs.js'></script>
<script src='/toolkist_playlist.js'></script>
<script src='/toolkist.zworpshop.js'></script>
<script src='/toolkist.zoozle.js'></script>
<script src='/toolkist.apisearch.js'></script>
<script src='/toolkist.apimanager.js'></script>
<style>
    input,button{
        color: black !important;
    }
    </style>
<hr>
<h3>GTR Filters (Only top active filter applies)</h3>
<h4>Available</h4>
<div id="nonActiveGTRFilters"></div>
<h4>Active</h4>
<div id="activeGTRFilters"></div>
<hr>
<h3>Zworp Filters</h3>
<h4>Available</h4>
<div id="nonActiveZworpFilters"></div>
<h4>Active</h4>
<div id="activeZworpFilters"></div>
<hr>
<input type="button" value="Previous" onclick="toolkist_apimanager.PreviousPage()"/>
<span id="pageNumber">1/1</span>
<input type="button" value="Next" onclick="toolkist_apimanager.NextPage()"/>
<input type="button" value="Search" onclick="toolkist_apimanager.Search()"/>
<hr>
<div id="results"></div>

<script>
    function OnLoaded() {
        var resultsDiv = $('#results');
        resultsDiv.empty();

        console.log(toolkist_apimanager.levelsBuffer);

        if (toolkist_apimanager.pageData.levels.length > 0) {
            resultsDiv.append('<h2>Levels:</h2>');
            var grid = $('<div style="display: flex; flex-wrap: wrap; gap: 20px;"></div>'); // Create a grid layout
            toolkist_apimanager.pageData.levels.forEach(function(level) {
                var card = $('<div style="position: relative; border: 1px solid #ccc; border-radius: 8px; overflow: hidden; width: 360px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"></div>');

                var steamButton = $('<button onclick="window.open(\'https://steamcommunity.com/sharedfiles/filedetails/?id=' + level.attributes.workshopId + '\', \'_blank\')" style="position: absolute; top: 10px; right: 10px; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; z-index: 10;">Steam</button>');

                var image = $('<img style="width: 100%; height: 180px; object-fit: cover;" src="' + level.attributes.imageUrl + '">');
                var content = $('<div style="padding: 16px;"></div>');

                var name = $('<h3 style="margin: 0 0 10px 0;">' + level.attributes.name + '</h3>');
                var author = $('<p style="margin: 0; color: #666;">By: ' + level.attributes.fileAuthor + '</p>');
                var validationTime = $('<p style="margin: 0; color: #666;">Validation Time: ' + toolkist_apimanager.ConvertSecondsToTime(level.attributes.validation) + '</p>');

                content.append(name, author, validationTime);
                card.append(steamButton, image, content);
                grid.append(card);
            });
            resultsDiv.append(grid);
        } else {
            resultsDiv.append('<p>No levels found.</p>');
        }

        $('#pageNumber').html(toolkist_apimanager.pageData.pageNumber + "/" + (Math.ceil(toolkist_apimanager.levelsBuffer.length / toolkist_apimanager.pageData.pageSize)));
    }


    $(document).ready(function() {
        toolkist_apimanager.GetPlayerData(function(){
            toolkist_apimanager.RenderFilters('zworp', 'activeZworpFilters', 'nonActiveZworpFilters');
            toolkist_apimanager.RenderFilters('gtr', 'activeGTRFilters', 'nonActiveGTRFilters');
            toolkist_apimanager.OnLoadedCallback = OnLoaded;
        });        
    });
</script>

{{</rawhtml>}}