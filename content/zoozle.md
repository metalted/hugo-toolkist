+++
title = 'Zoozle'
+++

{{<rawhtml>}}
<script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.159.0/three.min.js" integrity="sha512-OviGQIoFPxWNbGybQNprasilCxjtXNGCjnaZQvDeCT0lSPwJXd5TC3usI/jsWepKW9lZLZ1ob1q/Vy4MnlTt7g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<script src='/toolkist.js'></script>
<script src='/toolkist_color.js'></script>
<script src='/toolkist_fs.js'></script>
<script src='/toolkist_playlist.js'></script>
<script src='/toolkist.zworpshop.dummy.js'></script>
<style>
#container{
    width: 100%;
    height: 750px;
    margin: 0;
    background-color: #00000000;
    box-sizing: border-box;
    border: 1px solid black;
}
#searchContainer
{
    width: 100%;
    height: 5%;
}
#mainContainer{
    width: 100%;
    height: 95%;
    margin: 0;
    box-sizing: border-box;
    border: 1px solid black;
    flex: 1;
}
#levelsContainer{
    width: 75%;
    overflow-x: hidden;
    overflow-y: scroll;
    box-sizing: border-box;
    border: 1px solid black;
    height: 100%;
    float: left;
}
#playlistContainer
{
    flex: 1;
    box-sizing: border-box;
    border: 1px solid black;
}
#playlistLevel
{
    border: 1px solid black;
    width: 100%;
}
.levelCard {
    width: 32%; /* Adjust the width as needed */
    height: 0; /* Set initial height to 0 */
    padding-bottom: 18%; /* Set padding bottom to maintain 16:9 aspect ratio (9 / 16 * 100%) */
    margin-right: 1%;
    margin-bottom: 1%;
    background-size: cover; /* Optional: Ensure background image covers the entire element */
    background-position: center; /* Optional: Center the background image */
    float: left;
    position: relative;
}
.levelCard:hover{
    filter: drop-shadow(0px 0px 5px #99a1ff);
}
.levelCardInfo
{
  position:  absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: left;
  font-size: 16px;
  color: white;
  background-color: #000000aa;
  overflow: hidden;
}
.levelCardTimes
{
    position: absolute;
    bottom: 0;
    right: 0;
    text-align: left;
    font-size: 16px;
    color: white;
    background-color: #000000aa;
    overflow: hidden;
}
</style>
<div id='container'>
    <div id="searchContainer">
        <label for='searchQuery'>Search:</label><input style='color:black' type='text' id='searchQuery'></input>
        <input style='color:black' type='button' id='searchQueryButton' onclick='SearchQuery()' value='Search'></input>
        <input style='color:black' type='button' id='firstPageButton' onclick='FirstPage()' value=' |< '></input>
        <input style='color:black' type='button' id='prevPageButton' onclick='PrevPage()' value=' << '></input>
        <span id='pageNumber'></span>
        <input style='color:black' type='button' id='nextPageButton' onclick='NextPage()' value=' >> '></input>
        <input style='color:black' type='button' id='lastPageButton' onclick='LastPage()' value=' >| '></input>
        <label for='playlistNameInput'>Playlist Name:</label><input style='color:black' type='text' id='playlistNameInput'/>
        <input style='color:black' type='button' id='exportPlaylist' onclick='ExportPlaylist()' value='Export Playlist'></input>
    </div>
    <div id='mainContainer'>        
        <div id="levelsContainer"></div>
        <div id="playlistContainer"></div>
    </div>
</div>
<script> 
var currentData = null;

function convertSecondsToTime(seconds) {
    // Get minutes
    var minutes = Math.floor(seconds / 60);
    // Get remaining seconds
    var remainingSeconds = seconds % 60;
    // Get milliseconds
    var milliseconds = Math.floor((remainingSeconds - Math.floor(remainingSeconds)) * 1000);
    // Convert remaining seconds to two-digit format
    remainingSeconds = Math.floor(remainingSeconds).toString().padStart(2, '0');
    // Convert milliseconds to three-digit format
    milliseconds = milliseconds.toString().padStart(3, '0');
    // Combine minutes, seconds, and milliseconds into time format
    var timeFormat = minutes.toString().padStart(2, '0') + ':' + remainingSeconds + '.' + milliseconds;
    return timeFormat;
}
function CreateLevelsTable(data) {
    // Select the container div where the table/list will be contained
    var $containerDiv = $("#levelsContainer");    
    // Create an empty jQuery object to store the level cards
    var $levelCards = $();    
    // Loop through each level in the data
    data.forEach(function(level) {
        // Create a level card div
        var $levelCard = $('<div>').addClass('levelCard').css('background-image', `url("${level.attributes.imageUrl}")`);        
        // Create a div for level card info
        var $levelCardInfo = $('<div>').addClass('levelCardInfo').html(`Name: ${level.attributes.name}<br>Author: ${level.attributes.fileAuthor}`);        
        // Create a div for level times
        var $levelCardTimes = $('<div>').addClass('levelCardTimes');        
        // Add additional level data
        $levelCardTimes.append(`<div class='levelTime'>Validation: ${convertSecondsToTime(level.attributes.validation)}</div>`);
        $levelCardTimes.append(`<div class='levelTime'>Gold: ${convertSecondsToTime(level.attributes.gold)}</div>`);
        $levelCardTimes.append(`<div class='levelTime'>Silver: ${convertSecondsToTime(level.attributes.silver)}</div>`);
        $levelCardTimes.append(`<div class='levelTime'>Bronze: ${convertSecondsToTime(level.attributes.bronze)}</div>`);        
        // Append level card info and level times to the level card
        $levelCard.append($levelCardInfo, $levelCardTimes);        
        // Attach level parameters JSON data to the level card using jQuery .data()
        $levelCard.data('levelParams', level.attributes);        
        // Add a click event listener to the level card
        $levelCard.on('click', function() {
            AddLevelToPlaylist($(this).data('levelParams'));
        });        
        // Append the level card to the jQuery object containing all level cards
        $levelCards = $levelCards.add($levelCard);
    });    
    // Empty the container div and append all level cards
    $containerDiv.empty().append($levelCards);
}

function FirstPage()
{
    if(currentData != null)
    {
        RetreiveAndSetData(currentData.links.first);
    }
}

function LastPage()
{
    if(currentData != null)
    {
        RetreiveAndSetData(currentData.links.last);
    }
}

function PrevPage()
{
    if(currentData != null)
    {
        if(currentData.links.hasOwnProperty('prev'))
        {
            RetreiveAndSetData(currentData.links.prev);
        }
    }
}

function NextPage()
{
    if(currentData != null)
    {
        if(currentData.links.hasOwnProperty('next'))
        {
            RetreiveAndSetData(currentData.links.next);
        }
    }
}

function RetreiveAndSetData(url)
{
    //Make request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            var responseJSON = JSON.parse(xhttp.responseText);      
            CreateLevelsTable(responseJSON.data);      
            currentData = responseJSON; 
            //console.log(currentData);
            var currentPage = extractPageNumber(currentData.links.self);       
            var lastPage = extractPageNumber(currentData.links.last);       
            $('#pageNumber').text(currentPage + "/" + lastPage);
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();  
}

function SearchQuery(){
    //Get the search input
    const searchString = $('#searchQuery').val();  
    const url = `https://jsonapi.zworpshop.com/levels?filter=or(contains(name,'${searchString}'),contains(fileAuthor,'${searchString}'))&page[size]=24`;
    RetreiveAndSetData(url);    
}

function extractPageNumber(url) {
  const pageNumberRegex = /page%5Bnumber%5D=(\d+)/;
  const match = url.match(pageNumberRegex);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  } else {
    return 1;
  }
}

function AddLevelToPlaylist(levelParams) {
    // Get the playlist container
    var $playlistContainer = $('#playlistContainer');    
    // Create a new div for the level in the playlist
    var $levelDiv = $('<div>').addClass('playlistLevel');    
    // Set the text content of the level div
    $levelDiv.text(`Name: ${levelParams.name}, Author: ${levelParams.fileAuthor}`);    
    // Attach the level parameters JSON data to the level div using jQuery .data()
    $levelDiv.data('levelParams', levelParams);    
    // Create a button to delete the level from the playlist
    var $deleteButton = $('<button>').text('Delete').css({color: 'black'});    
    // Attach a click event listener to the delete button
    $deleteButton.on('click', function() {
        // Remove the level div from the playlist container
        $levelDiv.remove();
    });    
    // Append the delete button to the level div
    $levelDiv.append($deleteButton);    
    // Append the level div to the playlist container
    $playlistContainer.append($levelDiv);
}
function ExportPlaylist() {
    var $playlistContainer = $('#playlistContainer');
    var playlist = new toolkist_playlist.Playlist();
    var playlistName = $('#playlistNameInput').val();
    if(playlistName == "")
    {
        playlistName = "Zoozle Playlist";
    }
    playlist.name = playlistName;
    playlist.shuffle = false;
    playlist.roundLength = 360;

    var empty = true;
    // Iterate over each playlistLevel div
    $playlistContainer.find('.playlistLevel').each(function() {
        // Get the level parameters JSON data attached to the div
        var levelParams = $(this).data('levelParams');
        //console.log(levelParams);
        // Push the level data to the playlistData array
        //playlistData.push(levelParams);
        playlist.addLevel({UID: levelParams.fileUid, WorkshopID: levelParams.workshopId, Name: levelParams.name, Author: levelParams.fileAuthor});
        empty = false;
    });      

    if(!empty){
        toolkist_fs.directDownload(playlist.name + ".zeeplist", playlist.toJSON());  
    } 
}
</script>
{{</rawhtml>}}