import {toolkist} from '/toolkist/toolkist.js';

var users = null;
var selectedUser = undefined;
var searchInputValue = "";
var searchOption = 'track';

var paginationContainer = null;

export function init()
{
    window.onSearchInputChange = () => { searchInputValue = $('#searchInput').val(); };
    window.onSearchButton = onSearchButton;
    window.onSearchSelectChange = () => { searchOption = $('input[name="searchSelect"]:checked').val(); };
    paginationContainer = toolkist.ui.createFlexPanelPaginationContainer("#pagepanel1", "Result", 5, updatePageResults);  
}

function onSearchButton() 
{
    if (searchInputValue.trim() == "") {
        window.alert("Search input value cannot be empty!");
        return;
    }

    paginationContainer.clear();
    paginationContainer.setIndicator("1/1");
    paginationContainer.add(toolkist.ui.createFlexPanelLoadingCircle());

    switch(searchOption)
    {
        case 'track':
            toolkist.gtr.searchLevelByName(searchInputValue).then(result => 
            {
                paginationContainer.setData(result);
                updatePageResults();
            });
            break;
        case 'workshop':
            toolkist.gtr.searchLevelByWorkshopID(searchInputValue).then(result => 
            {
                paginationContainer.setData(result);
                updatePageResults();
            });
            break;
    }    
}

function updatePageResults() 
{
    paginationContainer.clear();

    paginationContainer.pageData.forEach(result => 
    {
        const level = result.levelItemsByIdLevel.nodes[0];
        const $resultDiv = $("<div>").addClass("level-item");
        const $imageDiv = $("<div>").addClass("result-image").append($("<img>").attr("src", level.imageUrl));
        const $infoDiv = $("<div>").addClass("result-info");
        const $levelName = $("<h3>").text(level.name);
        const $author = $("<p>").text("Author: " + level.fileAuthor);
        const $workshopId = $("<p>").text("Workshop ID: " + level.workshopId);
        const $hash = $("<p>").text("Hash: " + result.hash);
        $infoDiv.append($levelName, $author, $workshopId, $hash);
        $resultDiv.append($imageDiv, $infoDiv);
        paginationContainer.add($resultDiv);
    });
}