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
        toolkist.html.RenderLevelList(zworpData[plName].data, '.standardPagePanel', AddLevelButtonPressed);
    }
    else
    {
        toolkist.api.ZworpPlaylistRequest(gistPlaylists[index], function(data){
            zworpData[plName] = data;
            toolkist.html.RenderLevelList(data.data, '.standardPagePanel', AddLevelButtonPressed, true);
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
            toolkist.html.RenderPlaylist(playlist, '#playlist_editor');
            return;
        }
    }
}

function PlaylistUploaded(fileName, contents)
{
    var pl = new toolkist.game.Playlist();
    pl.FromJSON(contents);
    playlist.Merge(pl);

    toolkist.html.RenderPlaylist(playlist, '#playlist_editor');
}

$(document).ready(function() 
{
    toolkist.html.RenderHeaderBlock('.standardLeftPanel', 'Playlists');

    toolkist.api.GetGistPlaylists(function(data)
    {
        gistPlaylists = data;
        toolkist.html.RenderIndexedSelect('.standardLeftPanel', gistPlaylists.map(pl => pl.name), PlaylistSelected);
    });

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