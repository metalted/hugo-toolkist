+++
title = 'Playlists'
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


<script type="module">
    import {toolkist} from '/toolkist/toolkist.js';

    var playlist = new toolkist.game.Playlist();
    var gistPlaylists;
    var zworpData = {};

    function PlaylistSelected(index)
    {
        if(index === '-1'){return;}
        var plName = gistPlaylists[index].name;

        if(zworpData.hasOwnProperty(plName))
        {
            toolkist.html.RenderLevelList(zworpData[plName].data, 'results_container', AddLevelButtonPressed);
        }
        else
        {
            toolkist.api.ZworpPlaylistRequest(gistPlaylists[index], function(data){
                zworpData[plName] = data;
                console.log(data);
                toolkist.html.RenderLevelList(data.data, 'results_container', AddLevelButtonPressed);
            })
        }        
    }

    function AddLevelButtonPressed(levelHash)
    {
        for(let list in zworpData)
        {
            let level = zworpData[list].data.find(l => l.attributes.fileHash == levelHash);
            if(level != undefined)
            {
                playlist.AddLevel(level.attributes.fileUid, level.attributes.workshopId, level.attributes.name, level.attributes.fileAuthor);
                toolkist.html.RenderPlaylist(playlist, 'playlist_editor');
                return;
            }
        }
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
        toolkist.api.GetGistPlaylists(function(data)
        {
            gistPlaylists = data;
            toolkist.html.RenderIndexedSelect('playlistSelect', gistPlaylists.map(pl => pl.name), PlaylistSelected);
        });

        toolkist.html.RenderPlaylistProperties('playlist-properties', PlaylistUploaded);
        
        $('#copyToClipboardButton').on('click', function()
        {
            playlist.SetProperties(toolkist.html.GetPlaylistProperties());
            toolkist.fs.CopyToClipboard(playlist.ToJSON()); 
        });
        $('#downloadToZeeplistButton').on('click', function(){
            playlist.SetProperties(toolkist.html.GetPlaylistProperties());
            toolkist.fs.DirectDownload(playlist.name + ".zeeplist", playlist.ToJSON()); 
        });
    });  
</script>

<div id='content'>
    <div id='left_container'>
        <div class='filtersHeader'>
            <h2>Playlists</h2>            
        </div>
        <div id='playlistSelect'></div>
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
            <h2>Playlist Properties</h2>
        </div>
        <div id='playlist-properties'></div>
        <hr>
        <div id='playlist_editor'>            
        </div>        
    </div>
</div>
{{</rawhtml>}}