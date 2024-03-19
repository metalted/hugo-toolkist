+++
title = 'Zoozle'
+++

{{<rawhtml>}}
<script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

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
   
    </style>
<script type="module">

    import {toolkist} from '/toolkist/toolkist.js';

    var searchEngine = new toolkist.api.SearchEngine();
    var playlist = new toolkist.game.Playlist();

    function OnLoadedCallback()
    {
        toolkist.html.RenderLevelList(searchEngine.pageData.levels, 'results_container', AddLevelButtonPressed);
        $('#pageNumber').html(searchEngine.pageData.pageNumber + "/" + (Math.ceil(searchEngine.levelsBuffer.length / searchEngine.pageData.pageSize)));
    }

    function AddLevelButtonPressed(levelHash)
    {
        var level = searchEngine.GetLevel(levelHash);
        playlist.AddLevel(level.attributes.fileUid, level.attributes.workshopId, level.attributes.name, level.attributes.fileAuthor);
        toolkist.html.RenderPlaylist(playlist, 'playlist_editor');
    }

    function PlaylistUploaded(fileName, contents)
    {
        var pl = new toolkist.game.Playlist();
        pl.FromJSON(contents);
        playlist.Merge(pl);

        toolkist.html.RenderPlaylist(playlist, 'playlist_editor');
    }

    $(document).ready(function() 
    {
        toolkist.api.GetPlayerData(function(playerData)
        {
            searchEngine.SetPlayerData(playerData);

            toolkist.html.RenderFilters(searchEngine.filters.gtr, 'gtrFilters', searchEngine.FilterUpdated);       
            toolkist.html.RenderFilters(searchEngine.filters.zworp, 'zworpFilters', searchEngine.FilterUpdated); 
            toolkist.html.RenderPlaylistProperties('playlist-properties', PlaylistUploaded);

            $('#searchButton').on('click', searchEngine.Search);   
            $('#prevPageButton').on('click', searchEngine.PreviousPage); 
            $('#nextPageButton').on('click', searchEngine.NextPage); 
            $('#copyToClipboardButton').on('click', function()
            {
                playlist.SetProperties(toolkist.html.GetPlaylistProperties());
                toolkist.fs.CopyToClipboard(playlist.ToJSON()); 
            });
            $('#downloadToZeeplistButton').on('click', function(){
                playlist.SetProperties(toolkist.html.GetPlaylistProperties());
                toolkist.fs.DirectDownload(playlist.name + ".zeeplist", playlist.ToJSON()); 
            });

            searchEngine.OnLoadedCallback = OnLoadedCallback;
        });        
    });
</script>

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
            <input id='searchButton' class='standardButton' type="button" value="Search"/>
            <hr>
            <div id='pageControls'>
                <input id='prevPageButton' class='standardButton'  type="button" value="<<"/>
                <div id='pageNumberHolder'>
                    <span id="pageNumber">1/1</span>
                </div>
                <input id='nextPageButton' class='standardButton'  type="button" value=">>"/>
            </div>     
            <hr>       
        </div>
    </div>
    <div id='results_container'>
        <!--<div id="imagePreviewOverlay">
            <img id="largeImagePreview"/>
        </div>-->
        <div id='results'>
        </div>
    </div>
    <div id='playlist_container'>
        <div class='filtersHeader'>
            <h2>Playlist Properties</h2>
        </div>
        <div id='playlist-properties'></div>
        <hr>
        <div id='playlist_editor'>            
        </div>        
    </div>
</div>
{{</rawhtml>}}