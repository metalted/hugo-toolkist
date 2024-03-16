+++
title = 'Playlist Editor'
+++

{{<rawhtml>}}
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js"></script>
<script src='/toolkist_playlist.js'></script>
<script src='/toolkist_fs.js'></script>

<style>
    h2{
        font-size: 24px;
        color: rgb(239, 107, 35);
    }

    td{
        font-size: 18px;
        padding: 5px;
        padding-right: 10px;
        
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
    #playlistTable tr:nth-child(even)
    {
        background-color: rgb(34,34,34);
    }
</style>

<div id='content'>
    <div id='properties'>
        <h2>Playlist</h2>
        <table>
            <tr><td>Name</td><td><input style='color:black' type='text' id='playlist_name' value='Toolkist Playlist'/></td></tr>
            <tr><td>Shuffle</td><td><input style='color:black' type='checkbox' id='playlist_shuffle'/></td></tr>
            <tr><td>Round Length</td><td><input id='playlist_roundtime' style='color:black' type='number' value='360' min='120' max='3600'/></td></tr>
            <tr><td><input class='standardButton'type='button' id='download_to_file' onclick='copyToClipboard()' value='Copy to Clipboard'></input></td><td><input class='standardButton' type='button' id='download_to_file' onclick='downloadToFile()' value='Download .zeeplist'></input></td></tr>
        </table>
    </div>
    <div id='tracks'>
        <h2 style='float:left; padding-right: 50px; line-height: 40px'>Tracks</h2>
        <div class='fileInputButton' id='playlist_input_container'>
            <label class='standardButton' for='toolkist_fs_text_input'>Add Playlist</label>       
        </div>
        <hr>
        <div id='playlist_editor'>
            <table id='playlistTable' style='width: 100%'>
                <thead><th>Track Name</th><th>Creator</th><th></th></thead>
                <tbody></tbody>
            </table>
        </div>
        <hr>
    </div>    
</div>

<script>
    var mainPlaylist = new toolkist_playlist.Playlist();
    toolkist_fs.textFileInput('playlist_input_container', function(filename, content)
    {
        var ps = new toolkist_playlist.Playlist().fromJSON(content);

        if(ps != undefined)
        {
            for (const level of ps.levels) {
                mainPlaylist.addLevel(level);
            }

            populateTable();
        }
    });

    function populateTable() {
        const tbody = $("#playlistTable tbody");
        tbody.empty(); // Clear existing table rows

        // Iterate through the levels in mainPlaylist and add rows to the table
        mainPlaylist.levels.forEach((level, index) => {
            const row = $("<tr>");
            row.data("level", level);
            row.append($("<td>").text(level.Name));
            row.append($("<td>").text(level.Author));
            const removeButton = $("<button>").text("Remove").click(() => removeEntry(index));
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
            console.log(mainPlaylist);
        }
    });

    $("#playlistTable tbody").disableSelection();
</script>
{{</rawhtml>}}