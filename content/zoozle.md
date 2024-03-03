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
<script src='/toolkist.zworpshop.js'></script>

<style>
#container{
    width: 100%;
    height: 750px;
    margin: 0;
    background-color: #00000000;
    box-sizing: border-box;
    border: 1px solid black;
}
#headerContainer
{
    width: 100%;
    height: 5%;
}
#pageContainer{
    width: 100%;
    height: 95%;
    margin: 0;
    box-sizing: border-box;
    border: 1px solid black;
    flex: 1;
}
#resultsContainer
{
    width: 75%;
    overflow-x: hidden;
    overflow-y: hidden;
    box-sizing: border-box;
    border: 1px solid black;
    height: 100%;
    float: left;
}
#playlistContainer
{
    width:25%;
    box-sizing: border-box;
    border: 1px solid black;
    float:left;
}
#paginationContainer{
    width: 100%;
    height: 5%;
}
#pageNumber{
    width: 100px;
    display: inline-block;
    text-align: center;
}
#levelsContainer{
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    box-sizing: border-box;
    border: 1px solid black;
    height: 100%;
    padding-top: 10px;
    padding-left: 10px;
    padding-bottom: 40px;
}
#playlistList
{
    width: 100%;
    height: 100%;
}
.playlistLevel
{
    border: 1px solid black;
    width: 100%;
    display: flex;
    flex-direction: row;
}
.playlistLevel span
{
    flex: 1;
    white-space: nowrap;
    overflow:hidden;
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
    background-color: #00000000;
}
.levelCard:hover{
    filter: drop-shadow(0px 0px 5px #99a1ff);
    cursor: pointer;
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
  white-space: nowrap;
}
.levelCardTimes
{
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 16px;
    color: white;
    background-color: #000000aa;
    overflow: hidden;
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: row;
}
.levelTime
{
    flex: 1;
    font-size: 12px;
    text-align: center;
    line-height: 30px;
}
.medal
{
    max-width: 30px;
    max-height: 30px;
}
.levelTime span
{
    background-color: red;
}

input{
    color:black !important;
}

</style>
<div id='container'>
    <div id="headerContainer">
        <label for='searchQuery'>Search:</label><input style='color:black' type='text' id='searchQuery'></input>
        <input style='color:black' type='button' id='searchQueryButton' onclick='toolkist_zs.SearchQuery()' value='Search'></input>
        <label for='enableAuthorMin'>Author Min:</label><input id='enableAuthorMin' type='checkbox'/><input id='authorMinInput' type='number'/>     
        <label for='enableAuthorMax'>Author Max:</label><input id='enableAuthorMax' type='checkbox'/><input id='authorMaxInput' type='number'/>        
    </div>
    <div id='pageContainer'>        
        <div id="resultsContainer">
            <div id="paginationContainer">
                <input style='color:black' type='button' id='firstPageButton' onclick='toolkist_zs.FirstPageButton()' value=' |< '></input>
                <input style='color:black' type='button' id='prevPageButton' onclick='toolkist_zs.PreviousPageButton()' value=' << '></input>
                <span id='pageNumber'>...</span>
                <input style='color:black' type='button' id='nextPageButton' onclick='toolkist_zs.NextPageButton()' value=' >> '></input>
                <input style='color:black' type='button' id='lastPageButton' onclick='toolkist_zs.LastPageButton()' value=' >| '></input></div>
            <div id="levelsContainer"></div>
        </div>
        <div id="playlistContainer">
            <div id="playlistHeader">
                <label for='playlistNameInput'>Playlist Name:</label><input style='color:black' type='text' id='playlistNameInput'/>
                <input style='color:black' type='button' id='exportPlaylist' onclick='toolkist_zs.ExportPlaylist()' value='Export Playlist'></input>
            </div>
            <div id="playlistList"></div>
        </div>
    </div>
</div>
{{</rawhtml>}}