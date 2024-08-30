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
        $resultDiv = toolkist.ui.CreateLevelResult(result);
        paginationContainer.add($resultDiv);
    });
}