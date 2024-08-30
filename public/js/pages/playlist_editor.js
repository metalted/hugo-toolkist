import {toolkist} from '/toolkist/toolkist.js';

var playlist;

export function init()
{
    window.onZeeplistUploaded = (file) => { toolkist.fs.readTextFromFile(file, onZeeplistLoaded); }
    window.onCopyToClipboardButton = onCopyToClipboardButton;
    window.onDownloadZeeplistButton = onDownloadZeeplistButton;
    window.onRoundLengthChange = onRoundLengthChange;

    $('#pagepanel1').append($('<div>').addClass('draggable_playlist'));

    playlist = new toolkist.game.Playlist();
}

function getPlaylistProperties()
{
    let name =  $('#playlistName').val();
    if(name.trim() == "")
    {
        name = "Toolkist Playlist";
    }

    return {
        name : name,
        shuffle : $('#playlistShuffle').is(':checked'),
        roundLength : Number($('#playlistRoundTime').val())
    }
}

function onCopyToClipboardButton()
{
    playlist.SetProperties(getPlaylistProperties());
    toolkist.fs.CopyToClipboard(playlist.ToJSON());
} 

function onDownloadZeeplistButton()
{
    playlist.SetProperties(getPlaylistProperties());
    toolkist.fs.DirectDownload(playlist.name + ".zeeplist", playlist.ToJSON()); 
}

function onZeeplistLoaded(filename, contents)
{
    var pl = new toolkist.game.Playlist();
    pl.FromJSON(contents);
    playlist.Merge(pl);

    toolkist.ui.RenderDraggablePlaylist(playlist, '.draggable_playlist');
}

function onRoundLengthChange()
{
    let val = Number($('#playlistRoundTime').val());
    
    if(isNaN(val))
    {
        val = 60;
    }
    else if(val < 30)
    {
        val = 30;
    }
    else
    {
        val = Math.round(val / 30) * 30;
    }

    $('#playlistRoundTime').val(val);

    console.log(val);
}