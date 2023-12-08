+++
title = 'Playlist Editor'
+++

{{<rawhtml>}}
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js"></script>
<script src='http://localhost:1313/toolkist_playlist.js'></script>
<script src='http://localhost:1313/toolkist_fs.js'></script>

<div id='playlist_input_container'></div>
<label for='playlist_name'>Name</label><input style='color:black' type='text' id='playlist_name' value='Toolkist Playlist'></input>
<br>
<label for='playlist_shuffle'>Shuffle</label><input style='color:black' type='checkbox' id='playlist_shuffle'></input>
<br>
<label for='playlist_roundtime'>Roundtime</label><input id='playlist_roundtime' style='color:black' type='number' value='360' min='120' max='3600'></input>
<br>
<input style='color:black' type='button' id='download_to_file' onclick='copyToClipboard()' value='Copy to Clipboard'></input>
<input style='color:black' type='button' id='download_to_file' onclick='downloadToFile()' value='Download .zeeplist'></input>
<hr>
<div id='playlist_editor'>
    <table id='playlistTable' style='width: 100%'>
        <tbody></tbody>
    </table>
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
            const removeButton = $("<button>").text("Remove").css({color: 'black'}).click(() => removeEntry(index));
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