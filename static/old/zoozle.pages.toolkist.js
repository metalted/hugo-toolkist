import {toolkist} from '/toolkist/toolkist.js';

var searchEngine = new toolkist.api.SearchEngine();
var playlist = new toolkist.game.Playlist();

function OnLoadedCallback()
{
    toolkist.html.RenderLevelList(searchEngine.pageData.levels, '.standardPagePanel', AddLevelButtonPressed);
    $('#pageNumber').html(searchEngine.pageData.pageNumber + "/" + (Math.ceil(searchEngine.levelsBuffer.length / searchEngine.pageData.pageSize)));
}

function AddLevelButtonPressed(levelHash)
{
    var level = searchEngine.GetLevel(levelHash);
    playlist.AddLevel(level.attributes.fileUid, level.attributes.workshopId, level.attributes.name, level.attributes.fileAuthor);
    toolkist.html.RenderPlaylist(playlist, '#playlist_editor');
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
    toolkist.api.GetPlayerData(function(playerData)
    {
        searchEngine.SetPlayerData(playerData);

        toolkist.html.RenderHeaderBlock('.standardLeftPanel', "GTR Filters");
        $('.standardLeftPanel').append($('<div>').attr({id: 'gtrFilters'}).addClass('filterHolder'));
        toolkist.html.RenderFilters(searchEngine.filters.gtr, '#gtrFilters', searchEngine.FilterUpdated);     
        
        toolkist.html.RenderHeaderBlock('.standardLeftPanel', "Zworp Filters");
        $('.standardLeftPanel').append($('<div>').attr({id: 'zworpFilters'}).addClass('filterHolder'));  
        toolkist.html.RenderFilters(searchEngine.filters.zworp, '#zworpFilters', searchEngine.FilterUpdated);
        
        toolkist.html.RenderButton('.standardLeftPanel', 'searchButton', 'Search');
        toolkist.html.RenderPagination('.standardLeftPanel');

        toolkist.html.RenderHeaderBlock('#playlist-properties', 'Playlist Properties');
        toolkist.html.RenderPlaylistProperties('#playlist-properties', PlaylistUploaded);

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