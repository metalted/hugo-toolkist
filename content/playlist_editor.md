+++
title = 'Playlist Editor'
+++

{{<rawhtml>}}
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<style>
    h2{
        font-size: 24px;
        color: rgb(239, 107, 35);
    }
    #tracks
    {
        margin-top: 50px;
    }
</style>

<div id='content'>
    <div id='playlist-properties'></div>   
    <div id='tracks'>
        <h2>Tracks</h2>        
        <div id='playlist_editor'></div>
    </div>    
</div>

<script type="module">
    import {toolkist} from '/toolkist/toolkist.js';

    var playlist = new toolkist.game.Playlist();

     function PlaylistUploaded(fileName, contents)
    {
        var pl = new toolkist.game.Playlist();
        pl.FromJSON(contents);
        playlist.Merge(pl);

        toolkist.html.RenderPlaylist(playlist, 'playlist_editor');
    }

    $(document).ready(function() 
    {
        toolkist.html.RenderPlaylistProperties('playlist-properties', PlaylistUploaded);
        $('#copyToClipboardButton').on('click', function()
        {
            playlist.SetProperties(toolkist.html.GetPlaylistProperties());
            toolkist.fs.CopyToClipboard(playlist.ToJSON());
            console.log(playlist); 
        });

        $('#downloadToZeeplistButton').on('click', function(){
            playlist.SetProperties(toolkist.html.GetPlaylistProperties());
            toolkist.fs.DirectDownload(playlist.name + ".zeeplist", playlist.ToJSON()); 
        });      
    });
</script>
{{</rawhtml>}}