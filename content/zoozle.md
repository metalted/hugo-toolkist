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
    </div>
    <div id='mainContainer'>        
        <div id="levelsContainer"></div>
        <div id="playlistContainer">fefe</div>
    </div>
</div>
<script> 
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
    // Select the div where the table/list will be contained
    var containerDiv = $("#levelsContainer");
    // Create an empty string to store the HTML content
    var htmlContent = "";
    // Loop through each level in the data
    data.forEach(function(level) {
        // Start creating a level card div
        htmlContent += `<div class='levelCard' style='background-image: url("${level.attributes.imageUrl}")'>`;     
        htmlContent += `<div class='levelCardInfo'>Name: ${level.attributes.name}<br>Author: ${level.attributes.fileAuthor}</div>`;   
        htmlContent += `<div class='levelCardTimes'><div class='levelTime'>[ ] ${convertSecondsToTime(level.attributes.validation)}</div><div class='levelTime'>[ ] ${convertSecondsToTime(level.attributes.gold)}</div><div class='levelTime'>[ ] ${convertSecondsToTime(level.attributes.silver)}</div><div class='levelTime'>[ ] ${convertSecondsToTime(level.attributes.bronze)}</div></div>`
        htmlContent += "</div>";
        //htmlContent += `<div class='levelTitle'>${level.attributes.name}</div>`;      
        //htmlContent += `<div class='levelAuthor'>${level.attributes.fileAuthor}</div>`;
        //htmlContent += `<div class='levelImage'><img src='${level.attributes.imageUrl}'/></div>`;
        //htmlContent += `<div class='levelTimes'><div class='levelTime'>${convertSecondsToTime(level.attributes.validation)}</div><div class='levelTime'>${convertSecondsToTime(level.attributes.gold)}</div><div class='levelTime'>${convertSecondsToTime(level.attributes.silver)}</div><div class='levelTime'>${convertSecondsToTime(level.attributes.bronze)}</div></div>`
        //htmlContent += '</div>';        
        /*
        // Left section for the level image
        htmlContent += "<div class='level-image'>";
        htmlContent += "<img src='" + level.attributes.imageUrl + "' alt='" + level.attributes.name + "' />";
        htmlContent += "</div>"; // Close level-image div        
        // Middle section for the level name and author
        htmlContent += "<div class='level-info'>";
        htmlContent += "<p><strong>Name:</strong> " + level.attributes.name + "</p>";
        htmlContent += "<p><strong>Author:</strong> " + level.attributes.fileAuthor + "</p>";
        htmlContent += "</div>"; // Close level-info div        
        // Right section for the times
        htmlContent += "<div class='level-times'>";
        htmlContent += "<ul>";
        htmlContent += "<li><strong>Validation:</strong> " + level.attributes.validation + "</li>";
        htmlContent += "<li><strong>Gold:</strong> " + level.attributes.gold + "</li>";
        htmlContent += "<li><strong>Silver:</strong> " + level.attributes.silver + "</li>";
        htmlContent += "<li><strong>Bronze:</strong> " + level.attributes.bronze + "</li>";
        htmlContent += "</ul>";
        htmlContent += "</div>"; // Close level-times div                
        htmlContent += "</div>"; // Close level-card div*/
    });
    // Set the HTML content to the container div
    containerDiv.html(htmlContent);
}
function SearchQuery(){
    //Get the search input
    const searchInput = $('#searchQuery').val();
    //Make request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            var responseJSON = JSON.parse(xhttp.responseText);      
            CreateLevelsTable(responseJSON.data);              
        }
    }
    xhttp.open("GET", `https://jsonapi.zworpshop.com/levels`, true);
    xhttp.send();    
}
</script>
{{</rawhtml>}}