import {toolkist} from '/toolkist/toolkist.js';

var users = null;
var selectedUser = undefined;
var trackInputValue = "";

var paginationContainer = null;

export function init()
{
    window.onUserInput = () => { selectedUser = $('#userInput').val() };
    window.onTrackInputChange = () => { trackInputValue = $('#trackInput').val(); };
    window.onSearchButton = onSearchButton;

    paginationContainer = toolkist.ui.createFlexPanelPaginationContainer("#pagepanel1", "Result", 5, updatePageResults);
    toolkist.gtr.getAllUsers().then(u => {
        users = u;
        toolkist.ui.attachDatalist('#userInput', users.map(user => user.steamName).sort(), 'userDataList');
    });    
}

function onSearchButton() 
{
    // Find the user id in the list.
    let userData = users.find(u => selectedUser === u.steamName);

    if (userData == undefined) {
        window.alert("User '" + selectedUser + "' not found, please select a user from the data list.");
        return;
    }

    if (trackInputValue.trim() == "") {
        window.alert("Track input value cannot be empty!");
        return;
    }

    paginationContainer.clear();
    paginationContainer.setIndicator("1/1");
    paginationContainer.add(toolkist.ui.createFlexPanelLoadingCircle());

    toolkist.gtr.getPersonalBests(userData.id, trackInputValue).then(result => 
    {
        paginationContainer.setData(result);
        updatePageResults();
    });
}

function updatePageResults() 
{
    paginationContainer.clear();
    paginationContainer.pageData.forEach(result => 
    {
        let $resultDiv = toolkist.ui.CreateLevelResult(result);
        paginationContainer.add($resultDiv);
    });
}