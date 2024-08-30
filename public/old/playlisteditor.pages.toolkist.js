import {toolkist} from '/toolkist/toolkist.js';

var playlist = new toolkist.game.Playlist();

function PlaylistUploaded(fileName, contents)
{
    var pl = new toolkist.game.Playlist();
    pl.FromJSON(contents);
    playlist.Merge(pl);

    toolkist.html.RenderPlaylist(playlist, '#playlist_editor');
}

$(document).ready(function() 
{
    toolkist.html.RenderHeaderBlock('#playlist-properties', 'Playlist Properties');
    toolkist.html.RenderPlaylistProperties('#playlist-properties', PlaylistUploaded);

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