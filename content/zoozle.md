+++
title = 'Zoozle'
+++

{{<rawhtml>}}
<script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js"></script>
<!--<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.159.0/three.min.js" integrity="sha512-OviGQIoFPxWNbGybQNprasilCxjtXNGCjnaZQvDeCT0lSPwJXd5TC3usI/jsWepKW9lZLZ1ob1q/Vy4MnlTt7g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>-->
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
    #content{
        display: flex;
        flex-direction: row;
        position: relative;
        height: 100%;
    }
    #left_container{
        width: 200px;
        background-color: rgb(34,34,34);
    }
    #results_container
    {
        flex: 1;
        padding: 5px;
    }
    .filtersHeader
    {
        width: 100%;
        height: 50px;
        position: relative;
        background-color: rgb(251, 199, 25); 
    }
    .filtersHeader h2
    {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        white-space:nowrap;
        font-size: 24px;
        color: rgb(17,17,17);
        text-shadow: -2px 2px 1px rgb(239, 107, 35);
        font-weight: bold;
    }
    .filterHolder
    {
        padding: 5px;
    }
    .filterRow
    {
        margin-bottom: 5px;
    }
    .filterEnableButton
    {
        padding: 3px;
        width: 30px;
        height: 30px;
        margin-right: 5px;
    }
    #pageControls{
        display: flex;
        flex-direction: row;
        height: 35px;
    }
    #pageControls input{
        margin-left: 10px;
        margin-right: 10px;
    }
    #pageControls span
    {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    #pageNumberHolder
    {
        position:relative;
        flex: 1;
        height: 100%;
    }
    .level-row {
        display: flex;
        align-items: center;
        border-radius: 8px;
        overflow: hidden;
        background-color: rgb(34,34,34);
        margin:3px;
    }
    .level-image {
        flex-shrink: 0;
        width: 120px;
        height: 100%;
        object-fit: cover;
    }
    .level-content {
        padding: 2px;
        padding-left: 10px;
        flex-grow: 1;
        color: rgb(251, 199, 25);
    }
    .points-box {
        margin: 5px 10px;
        background-color: rgb(251, 199, 25);
        color: white;
        border-radius: 5px;
        height: 40px;
        padding: 0px 5px;
        box-sizing: border-box;
        line-height: 40px;
        color: rgb(17,17,17);
        width: 100px;
        text-align: center;
    }
    .addLevelButton
    {
        margin: 5px 10px;
        background-color: rgb(251, 199, 25);
        color: white;
        border-radius: 5px;
        width: 40px;
        font-size: 32px;
        height: 40px;
        padding: 0px 5px;
        box-sizing: border-box;
        line-height: 40px;
        color: rgb(17,17,17);
        text-align:center;    
        user-select: none;    
    }
    
    .addLevelButton:hover
    {
        background-color: rgb(239, 107, 35);
        cursor:pointer;
    }
    
    .level-name {
        margin-top: 0;
    }
    .level-author, .level-validation-time {
        height: 20px;     
    }
    .level-validation-time span{
        line-height: 20px;
        padding-bottom: 3px;
        height: 100%;
    }
    .level-validation-time img{
        height: 100%;
    }
    .byPrefix{
        color:rgb(239, 107, 35);
    }
    #results_container
    {
        overflow-y:auto;
        position:relative;
    }
    .steam-button {
        padding: 5px 10px;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width: 40px;
        height: 40px;
    }
    #imagePreviewOverlay {
        display: none; /* Hidden by default */
        position: absolute; /* Changed to absolute based on your requirement */
        width: 100%; /* Full width of the container */
        height: 100%; /* Full height of the container */
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8); /* Black background with opacity */
        z-index: 1000; /* Ensure it's above other content */
        cursor: pointer; /* Add a pointer on hover */
        justify-content: center; /* Center the image horizontally */
        align-items: center; /* Center the image vertically */
    }
    #closeBtn {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 24px;
        color: white;
        cursor: pointer;
    }
    #largeImagePreview {
        max-width: 70%; /* Makes the image take up to 70% of the overlay width */
        max-height: 70%; /* Optionally, makes the image take up to 70% of the overlay height, maintaining aspect ratio */
        object-fit: contain; /* Ensures the image is scaled properly within its dimensions */
    }
    .level-other
    {
        display: flex;
        flex-direction:row;
    }
    /*PLAYLIST*/
    #playlist_container
    {
        width: 30%;
        height: 100%;
        background-color: rgb(34,34,34);
        position: relative;
    }
    .playlistFilters
    {
        width: 100%;
        height: 120px;
    }
    .playlistFilters table
    {
        width: 100%;
    }
    .playlistFilters table td
    {
        padding: 3px;
    }
    #playlist_editor
    {
        width: 100%;
        position: absolute;
        bottom: 0;
        top: 185px;
        overflow-y: auto;
    }

    .ui-sortable td
    {
        cursor: grab;
    }

    .ui-sortable td:active
    {
        cursor: grabbing;
    }

    .ui-sortable button
    {
        display: inline-block;
        padding: 4px 4px;
        background-color: rgb(251, 59, 25);
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.1s ease-in-out;
        font-family: 'Righteous';
        font-weight: 300;
        font-size: 18px;
    }

    .ui-sortable button:hover
    {
        background-color: rgb(239, 107, 35);
    }

    #tracks
    {
        margin-top: 50px;
    }

    #playlistTable th
    {
        text-align: left;
        padding: 5px;
        border-bottom: 1px solid rgb(239, 107, 35);
        color: rgb(239, 107, 35);
    }
    #playlistTable td:nth-child(2)
    {
        border-left: 1px solid rgb(239, 107, 35);
        border-right: 1px solid rgb(239, 107, 35);
    }
    #playlistTable tbody tr:nth-child(even)
    {
        background-color: rgb(51,51,51);
    }

    #playlistTable tbody td
    {
        padding: 3px;
    }
    </style>

<div id='content'>
    <div id='left_container'>
        <div class='filtersHeader'>
            <h2>GTR Filters</h2>
        </div>
        <p style='font-size: 12px; text-align:center; padding: 2px'>(Only top active filter applies)</p>
        <div class='filterHolder' id='gtrFilters'></div>
        <div class='filtersHeader'>
            <h2>Zworp Filters</h2>
        </div>
        <div class='filterHolder' id='zworpFilters'></div>
        <div id='controls'>
            <input class='standardButton' type="button" value="Search" onclick="toolkist_apimanager.Search()"/>
            <hr>
            <div id='pageControls'>
                <input class='standardButton'  type="button" value="<<" onclick="toolkist_apimanager.PreviousPage()"/>
                <div id='pageNumberHolder'>
                    <span id="pageNumber">1/1</span>
                </div>
                <input class='standardButton'  type="button" value=">>" onclick="toolkist_apimanager.NextPage()"/>
            </div>     
            <hr>       
        </div>
    </div>
    <div id='results_container'>
       <!-- Overlay for image preview -->
        <div id="imagePreviewOverlay">
            <img id="largeImagePreview"/>
        </div>
        <div id='results'>
        </div>
    </div>
    <div id='playlist_container'>
        <div class='filtersHeader'>
            <h2>Playlist</h2>
        </div>
        <div class='playlistFilters'>
            <table>
                <tr><td>Name</td><td><input style='color:black' type='text' id='playlist_name' value='Toolkist Playlist'/></td></tr>
                <tr><td>Shuffle</td><td><input style='color:black' type='checkbox' id='playlist_shuffle'/></td></tr>
                <tr><td>Round Length</td><td><input id='playlist_roundtime' style='color:black' type='number' value='360' min='120' max='3600'/></td></tr>
                <tr><td><input class='standardButton'type='button' id='download_to_file' onclick='copyToClipboard()' value='Copy to Clipboard'></input></td><td><input class='standardButton' type='button' id='download_to_file' onclick='downloadToFile()' value='Download .zeeplist'></input></td></tr>
            </table>
        </div>
        <hr>
        <div id='playlist_editor'>
            <table id='playlistTable' style='width: 100%'>
                <thead><th>Track Name</th><th>Creator</th><th></th></thead>
                <tbody></tbody>
            </table>
        </div>        
    </div>
</div>
<script>
    
    function OnLoaded() {
        var resultsDiv = $('#results');
        resultsDiv.empty(); // Clear the results div
        if (toolkist_apimanager.pageData.levels.length > 0) {
            toolkist_apimanager.pageData.levels.forEach(function(level) {
                var extraGTRData = toolkist_apimanager.GetAdditionalGTRData(level);
                var points = extraGTRData.points !== undefined ? extraGTRData.points : null;
                var row = $('<div>').addClass('level-row');
                var image = $('<img>').addClass('level-image').attr('src', level.attributes.imageUrl).css('cursor', 'pointer');                
                // Add click event to show the image in a larger preview
                image.click(function() {
                    $('#largeImagePreview').attr('src', $(this).attr('src'));
                    $('#imagePreviewOverlay').css('display', 'flex').fadeIn();
                });
                var content = $('<div>').addClass('level-content');
                var other = $('<div>').addClass('level-other');
                var addButton = $('<div>').addClass('addLevelButton').text("+").attr('onclick', "AddLevelToPlaylist('" + level.attributes.fileHash + "')");
                other.append(addButton);
                if (points !== null) {
                    var pointsBox = $('<div>').addClass('points-box').text('Points: ' + points);
                    other.append(pointsBox);
                }
                var name = $('<h3>').addClass('level-name').text(level.attributes.name);
                var author = $('<div>').addClass('level-author').append($('<span>').addClass('byPrefix').text('By: ')).append($('<span>').text(level.attributes.fileAuthor));
                var validationTime = $('<div>').addClass('level-validation-time').append($('<img>').attr('src', '/medal_author.png')).append($('<span>').text(toolkist_apimanager.ConvertSecondsToDisplayTime(level.attributes.validation)));                
                var steamButton = $('<img>').addClass('steam-button').attr('src', '/steamIcon.png').attr('onclick', "window.open('https://steamcommunity.com/sharedfiles/filedetails/?id=" + level.attributes.workshopId + "', '_blank')");
                content.append(name, author, validationTime);
                other.append(steamButton);
                row.append(image, content, other);
                resultsDiv.append(row);
            });
        } 
        else 
        {
            resultsDiv.append('<p>No levels found.</p>');
        }
        $('#pageNumber').html(toolkist_apimanager.pageData.pageNumber + "/" + (Math.ceil(toolkist_apimanager.levelsBuffer.length / toolkist_apimanager.pageData.pageSize)));
        // Optional: Close the overlay by clicking outside the image
        $('#imagePreviewOverlay').click(function(e) {
            if (e.target.id == "imagePreviewOverlay") {
                $(this).fadeOut();
            }
        });
    }
    
    $(document).ready(function() {
        toolkist_apimanager.GetPlayerData(function(){
            toolkist_apimanager.RenderFilters('zworp', 'Filters');
            toolkist_apimanager.RenderFilters('gtr', 'Filters');
            toolkist_apimanager.OnLoadedCallback = OnLoaded;
        });        
    });

    var mainPlaylist = new toolkist_playlist.Playlist();

    function AddLevelToPlaylist(levelHash)
    {
        //Find the level in the levels buffer.
        //console.log(toolkist_apimanager.pageData.levels);
        var level = toolkist_apimanager.pageData.levels.find(l => l.attributes.fileHash == levelHash);
        //console.log(level);
        var psLevel = new toolkist_playlist.PlaylistLevel();
        
        psLevel.fromZworpData(level.attributes);
        //console.log(psLevel);
        mainPlaylist.addLevel(psLevel);
        populateTable();
    }

    function populateTable() {
        const tbody = $("#playlistTable tbody");
        tbody.empty(); // Clear existing table rows

        // Iterate through the levels in mainPlaylist and add rows to the table
        mainPlaylist.levels.forEach((level, index) => {
            const row = $("<tr>");
            row.data("level", level);
            row.append($("<td>").text(level.Name));
            row.append($("<td>").text(level.Author));
            const removeButton = $("<button>").html('<i class="fa fa-trash" aria-hidden="true"></i>').click(() => removeEntry(index));
            row.append($("<td>").append(removeButton));
            tbody.append(row);
        });
    }

    // Function to remove an entry from mainPlaylist
    function removeEntry(index) {
        mainPlaylist.levels.splice(index, 1);
        populateTable();
    }

    function copyToClipboard()
    {
        mainPlaylist.name = $('#playlist_name').val();
        mainPlaylist.shuffle = $('#playlist_shuffle').is(':checked')
        mainPlaylist.roundLength = Number($('#playlist_roundtime').val());
        toolkist_fs.copyToClipboard(mainPlaylist.toJSON()); 
    }

    function downloadToFile()
    {
        mainPlaylist.name = $('#playlist_name').val();
        mainPlaylist.shuffle = $('#playlist_shuffle').is(':checked')
        mainPlaylist.roundLength = Number($('#playlist_roundtime').val());
        toolkist_fs.directDownload(mainPlaylist.name + ".zeeplist", mainPlaylist.toJSON()); 
    }

    // Make the table sortable
    $("#playlistTable tbody").sortable({
        update: function(event, ui) {
            const reorderedLevels = [];

            $(this).find("tr").each(function() {
                const levelData = $(this).data("level");
                reorderedLevels.push(levelData);
            });

            mainPlaylist.levels = reorderedLevels;
            //console.log(mainPlaylist);
        }
    });

    $("#playlistTable tbody").disableSelection();
</script>

{{</rawhtml>}}