+++
title = 'GTR Stats'
+++

{{<rawhtml>}}
<script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.159.0/three.min.js" integrity="sha512-OviGQIoFPxWNbGybQNprasilCxjtXNGCjnaZQvDeCT0lSPwJXd5TC3usI/jsWepKW9lZLZ1ob1q/Vy4MnlTt7g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<script src='/toolkist_stats.js'></script>

<style>

.tab-container
{
    display: flex;
    flex-direction: row;  
    color: rgb(251, 199, 25);
}

/* Style for the container of top-level tabs */
.tab-buttons {
    /*width: 150px; /* Adjust width as needed */
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

/* Style for top-level and secondary tab buttons */
.tab-button-top, .tab-button {
    background-color: rgb(251, 199, 25);
    font-family: 'Righteous';
    border: none;
    padding: 10px;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.1s;
    border-right: 1px solid rgb(17,17,17);
    border-bottom: 1px solid rgb(17,17,17);
    font-size: 18px;
    white-space: nowrap;
}

.tab-button-top:hover, .tab-button:hover {
    background-color: rgb(253, 221, 114) !important;
}

.tab-button-top.active {
    background-color:  rgb(239, 107, 35);
}

/* Specific style for secondary tab buttons */
.tab-content .tab-buttons .tab-button.active {
    background-color: rgb(239, 107, 35); /* Active secondary tab */
}

/* Style for the main content container and secondary tab content container */
.tab-content, .tab-content > .tab-container {
    display: flex; /* Ensures horizontal layout */
    height: 100%;
}

/* Style for the content associated with secondary tabs */
.tab-pane {
    display: none; /* Hide all tab panes by default */
    flex-grow: 1; /* Allows the content to fill the available space */
    padding: 20px;
    overflow-y: auto;
}

/* Active tab content */
.tab-pane.active {
    display: block; /* Show active tab content */
    flex: 1;
}

.tab-content{
    flex: 1;
}

.tab-container{
    width: 100%;
}

.leaderboardTable
{
    width: 100%;
    border: 1px solid rgb(239, 107, 35);
    margin-bottom: 20px;
}

.leaderboardTable tr
{
    font-size: 18px;
}
.leaderboardTable tr:nth-child(even)
{
    background-color: rgb(34,34,34);
    width: 100%;
}
.leaderboardTable tr:nth-child(odd)
{
    background-color: rgb(17,17,17);
    width: 100%;
}

.leaderboardTable td{
    padding: 5px;
}

</style>

<div id="content" class='flex_content'>
    <div class='standardPagePanel'>
        <div class="tab-container">
            <!-- Top-level Tabs -->
            <div class="tab-buttons">
                <button class="tab-button-top" data-tab="leaderboard">Leaderboard</button>
                <button class="tab-button-top" data-tab="user">User</button>
                <button class="tab-button-top" data-tab="general">General</button>
                <button class="tab-button-top" data-tab="crashes">Crashes</button>
                <button class="tab-button-top" data-tab="controls">Controls</button>
                <button class="tab-button-top" data-tab="state">State</button>
                <button class="tab-button-top" data-tab="surface">Surface</button>
                <button class="tab-button-top" data-tab="noWheels">No Wheels</button>
                <button class="tab-button-top" data-tab="oneWheel">One Wheel</button>
                <button class="tab-button-top" data-tab="twoWheels">Two Wheels</button>
                <button class="tab-button-top" data-tab="threeWheels">Three Wheels</button>
                <button class="tab-button-top" data-tab="fourWheels">Four Wheels</button>
            </div>        
            <!-- Leaderboard Content -->
            <div id="leaderboard" class="tab-content">
            <div style='width: 100%; padding-bottom:50px; padding: 10px'>
                    <div id='total_leaderboard'>Loading...</div>
                </div>
            </div>
            <!-- General Category -->
            <div id="general" class="tab-content">
                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button" data-tab="timesStarted">Times Started</button>
                        <button class="tab-button" data-tab="timesFinished">Times Finished</button>
                        <button class="tab-button" data-tab="checkpointsCrossed">Checkpoints Crossed</button>
                        <button class="tab-button" data-tab="wheelsBroken">Wheels Broken</button>
                    </div>
                    <div class="tab-pane" id="timesStarted">Content for Times Started tab</div>
                    <div class="tab-pane" id="timesFinished">Content for Times Finished tab</div>
                    <div class="tab-pane" id="checkpointsCrossed">Content for Checkpoints Crossed tab</div>
                    <div class="tab-pane" id="wheelsBroken">Content for Wheels Broken tab</div>
                </div>
            </div>
            <!-- User Category -->
            <div id="user" class="tab-content">
                <div style='width: 100%; padding-bottom:50px; padding: 10px'>
                    <div id='selection_user'></div>
                    <br>
                    <div id='user_leaderboard'></div>
                </div>
            </div>
            <!-- Crashes Content + Secondary Tabs -->
            <div id="crashes" class="tab-content">
                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button" data-tab="crashTotal">Total</button>
                        <button class="tab-button" data-tab="crashRegular">Regular</button>
                        <button class="tab-button" data-tab="crashEye">Eye</button>
                        <button class="tab-button" data-tab="crashGhost">Ghost</button>
                        <button class="tab-button" data-tab="crashSticky">Sticky</button>
                    </div>
                    <div class="tab-pane" id="crashTotal">Content for Total tab</div>
                    <div class="tab-pane" id="crashRegular">Content for Regular tab</div>
                    <div class="tab-pane" id="crashEye">Content for Eye tab</div>
                    <div class="tab-pane" id="crashGhost">Content for Ghost tab</div>
                    <div class="tab-pane" id="crashSticky">Content for Sticky tab</div>
                </div>
            </div>
            <!-- Controls Category -->
            <div id="controls" class="tab-content">
                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button" data-tab="distanceArmsUp">Distance Arms Up</button>
                        <button class="tab-button" data-tab="timeArmsUp">Time Arms Up</button>
                        <button class="tab-button" data-tab="distanceBraking">Distance Braking</button>
                        <button class="tab-button" data-tab="timeBraking">Time Braking</button>
                    </div>
                    <div class="tab-pane" id="distanceArmsUp">Content for Distance Arms Up tab</div>
                    <div class="tab-pane" id="timeArmsUp">Content for Time Arms Up tab</div>
                    <div class="tab-pane" id="distanceBraking">Content for Distance Braking tab</div>
                    <div class="tab-pane" id="timeBraking">Content for Time Braking tab</div>
                </div>
            </div>
            <!-- State Category -->
            <div id="state" class="tab-content">
                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button" data-tab="distanceGrounded">Distance Grounded</button>
                        <button class="tab-button" data-tab="timeGrounded">Time Grounded</button>
                        <button class="tab-button" data-tab="distanceInAir">Distance In Air</button>
                        <button class="tab-button" data-tab="timeInAir">Time In Air</button>
                        <button class="tab-button" data-tab="distanceRagdoll">Distance Ragdoll</button>
                        <button class="tab-button" data-tab="timeRagdoll">Time Ragdoll</button>
                    </div>
                    <div class="tab-pane" id="distanceGrounded">Content for Distance Grounded tab</div>
                    <div class="tab-pane" id="timeGrounded">Content for Time Grounded tab</div>
                    <div class="tab-pane" id="distanceInAir">Content for Distance In Air tab</div>
                    <div class="tab-pane" id="timeInAir">Content for Time In Air tab</div>
                    <div class="tab-pane" id="distanceRagdoll">Content for Distance Ragdoll tab</div>
                    <div class="tab-pane" id="timeRagdoll">Content for Time Ragdoll tab</div>
                </div>
            </div>
            <!-- Surface Category -->
            <div id="surface" class="tab-content">
                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button" data-tab="distanceOnRegular">Distance On Regular</button>
                        <button class="tab-button" data-tab="timeOnRegular">Time On Regular</button>
                        <button class="tab-button" data-tab="distanceOnGrass">Distance On Grass</button>
                        <button class="tab-button" data-tab="timeOnGrass">Time On Grass</button>
                        <button class="tab-button" data-tab="distanceOnIce">Distance On Ice</button>
                        <button class="tab-button" data-tab="timeOnIce">Time On Ice</button>
                    </div>
                    <div class="tab-pane" id="distanceOnRegular">Content for Distance On Regular tab</div>
                    <div class="tab-pane" id="timeOnRegular">Content for Time On Regular tab</div>
                    <div class="tab-pane" id="distanceOnGrass">Content for Distance On Grass tab</div>
                    <div class="tab-pane" id="timeOnGrass">Content for Time On Grass tab</div>
                    <div class="tab-pane" id="distanceOnIce">Content for Distance On Ice tab</div>
                    <div class="tab-pane" id="timeOnIce">Content for Time On Ice tab</div>
                </div>
            </div>
            <!-- No Wheels Category -->
            <div id="noWheels" class="tab-content">
                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button" data-tab="distanceOnNoWheels">Distance On No Wheels</button>
                        <button class="tab-button" data-tab="timeOnNoWheels">Time On No Wheels</button>
                        <button class="tab-button" data-tab="distanceWithNoWheels">Distance With No Wheels</button>
                        <button class="tab-button" data-tab="timeWithNoWheels">Time With No Wheels</button>
                    </div>
                    <div class="tab-pane" id="distanceOnNoWheels">Content for Distance On No Wheels tab</div>
                    <div class="tab-pane" id="timeOnNoWheels">Content for Time On No Wheels tab</div>
                    <div class="tab-pane" id="distanceWithNoWheels">Content for Distance With No Wheels tab</div>
                    <div class="tab-pane" id="timeWithNoWheels">Content for Time With No Wheels tab</div>
                </div>
            </div>
            <!-- One Wheel Category -->
            <div id="oneWheel" class="tab-content">
                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button" data-tab="distanceOnOneWheel">Distance On One Wheel</button>
                        <button class="tab-button" data-tab="timeOnOneWheel">Time On One Wheel</button>
                        <button class="tab-button" data-tab="distanceWithOneWheel">Distance With One Wheel</button>
                        <button class="tab-button" data-tab="timeWithOneWheel">Time With One Wheel</button>
                    </div>
                    <div class="tab-pane" id="distanceOnOneWheel">Content for Distance On One Wheel tab</div>
                    <div class="tab-pane" id="timeOnOneWheel">Content for Time On One Wheel tab</div>
                    <div class="tab-pane" id="distanceWithOneWheel">Content for Distance With One Wheel tab</div>
                    <div class="tab-pane" id="timeWithOneWheel">Content for Time With One Wheel tab</div>
                </div>
            </div>
            <!-- Two Wheels Category -->
            <div id="twoWheels" class="tab-content">
                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button" data-tab="distanceOnTwoWheels">Distance On Two Wheels</button>
                        <button class="tab-button" data-tab="timeOnTwoWheels">Time On Two Wheels</button>
                        <button class="tab-button" data-tab="distanceWithTwoWheels">Distance With Two Wheels</button>
                        <button class="tab-button" data-tab="timeWithTwoWheels">Time With Two Wheels</button>
                    </div>
                    <div class="tab-pane" id="distanceOnTwoWheels">Content for Distance On Two Wheels tab</div>
                    <div class="tab-pane" id="timeOnTwoWheels">Content for Time On Two Wheels tab</div>
                    <div class="tab-pane" id="distanceWithTwoWheels">Content for Distance With Two Wheels tab</div>
                    <div class="tab-pane" id="timeWithTwoWheels">Content for Time With Two Wheels tab</div>
                </div>
            </div>
            <!-- Three Wheels Category -->
            <div id="threeWheels" class="tab-content">
                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button" data-tab="distanceOnThreeWheels">Distance On Three Wheels</button>
                        <button class="tab-button" data-tab="timeOnThreeWheels">Time On Three Wheels</button>
                        <button class="tab-button" data-tab="distanceWithThreeWheels">Distance With Three Wheels</button>
                        <button class="tab-button" data-tab="timeWithThreeWheels">Time With Three Wheels</button>
                    </div>
                    <div class="tab-pane" id="distanceOnThreeWheels">Content for Distance On Three Wheels tab</div>
                    <div class="tab-pane" id="timeOnThreeWheels">Content for Time On Three Wheels tab</div>
                    <div class="tab-pane" id="distanceWithThreeWheels">Content for Distance With Three Wheels tab</div>
                    <div class="tab-pane" id="timeWithThreeWheels">Content for Time With Three Wheels tab</div>
                </div>
            </div>
            <!-- Four Wheels Category -->
            <div id="fourWheels" class="tab-content">
                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button" data-tab="distanceOnFourWheels">Distance On Four Wheels</button>
                        <button class="tab-button" data-tab="timeOnFourWheels">Time On Four Wheels</button>
                        <button class="tab-button" data-tab="distanceWithFourWheels">Distance With Four Wheels</button>
                        <button class="tab-button" data-tab="timeWithFourWheels">Time With Four Wheels</button>
                    </div>
                    <div class="tab-pane" id="distanceOnFourWheels">Content for Distance On Four Wheels tab</div>
                    <div class="tab-pane" id="timeOnFourWheels">Content for Time On Four Wheels tab</div>
                    <div class="tab-pane" id="distanceWithFourWheels">Content for Distance With Four Wheels tab</div>
                    <div class="tab-pane" id="timeWithFourWheels">Content for Time With Four Wheels tab</div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        // Click event for top-level tabs
        $('.tab-button-top').click(function() {
            // Remove 'active' class from all top-level tabs and hide all content
            $('.tab-button-top').removeClass('active');//.css('background-color', 'green !important');
            $('.tab-content').removeClass('active').hide();

            // Add 'active' class to clicked top-level tab and show its content
            $(this).addClass('active');//.css('background-color', 'red');
            var tabId = $(this).attr('data-tab');
            $('#' + tabId).addClass('active').show();

            // Hide all secondary tab contents and remove 'active' class
            $('#' + tabId).find('.tab-content').removeClass('active').hide();
            $('#' + tabId).find('.tab-button').removeClass('active');//.css('background-color', 'green');

            // Automatically click the first secondary tab if it exists
            var firstSecondaryTab = $('#' + tabId).find('.tab-button').first();
            if(firstSecondaryTab.length) {
                firstSecondaryTab.trigger('click');
            }
        });

        // Click event for secondary tabs within a tab-content
        $(document).on('click', '.tab-content .tab-button', function() {
            // Get the container of this secondary tab
            var container = $(this).closest('.tab-content');

            // Remove 'active' class from all secondary tabs in this container and hide their contents
            container.find('.tab-button').removeClass('active');//.css('background-color', '#ddd');
            container.find('.tab-pane').removeClass('active').hide();

            // Add 'active' class to clicked secondary tab and show its content
            $(this).addClass('active');//.css('background-color', 'rgb(239, 107, 35)');
            var tabId = $(this).attr('data-tab');
            $('#' + tabId).addClass('active').show();
        });

        // Automatically click the first top-level tab on page load
        $('.tab-button-top').first().trigger('click');
    });

    function mToKm(meters) {
        const kilometers = meters / 1000;
        // Determine the number of decimal places needed to keep three significant figures
        const decimalPlaces = kilometers < 1 ? 2 : kilometers < 10 ? 1 : 0;
        return kilometers.toFixed(decimalPlaces);
    }

    function secondsToDHMS(seconds) {
        const days = Math.floor(seconds / (3600*24));
        seconds -= days * 3600 * 24;
        const hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    const purple = '<i style="color: #7851A9; font-size: 18px" class="fa fa-trophy" aria-hidden="true"></i>';
    const gold = '<i style="color: #d4af37; font-size: 18px" class="fa fa-trophy" aria-hidden="true"></i>';
    const silver = '<i style="color: #c0c0c0; font-size: 18px" class="fa fa-trophy" aria-hidden="true"></i>';
    const bronze = '<i style="color: #cd7f32; font-size: 18px" class="fa fa-trophy" aria-hidden="true"></i>';

    const p = '#7851A9';
    const g = ' #d4af37';
    const s = '#c0c0c0';
    const b = '#cd7f32';

    function CreateLeaderboardTable(data, property)
    {
        // Create the table and the header row
        var $table = $('<table>').addClass('leaderboardTable');        

        // Populate the table rows with data
        data.forEach(function(item, index) {
            var $row = $('<tr>');

            let ind = "" + (index + 1);
            switch(index)
            {
                case 0: ind = purple;
                $row.css({'color':p});
                break;
                case 1: ind = gold;
                $row.css({'color':g});
                break;
                case 2: ind = silver;
                $row.css({'color':s});
                break;
                case 3: ind = bronze;
                $row.css({'color':b});
                break;
            }

            let val = item[property];
            if(property.includes('distance'))
            {
                val = mToKm(val) + "km";
            }
            else if(property.includes('time') && !property.includes('times'))
            {
                val = secondsToDHMS(val);
            }

            $row.append($('<td>').html(ind), $('<td>').text(item.playerName), $('<td>').text(val));
            $table.append($row);
        });

        return $table;
    }

    var allSortedData = {};

    function UserSelected(selectedUser) {

        // Create the table and the header row
        var $table = $('<table>').addClass('leaderboardTable');

        Object.keys(allSortedData).forEach(function(property) 
        {
            if(property != 'playerName'){

            // Find the index of the player in the array
            var index = allSortedData[property].findIndex(u => u.playerName == selectedUser);

            // If the player is found, index will be >= 0
            if (index >= 0) {
                var userData = allSortedData[property][index];
                var userStat = userData[property];
                var position = index;

                //console.log(`${selectedUser} is number ${position} in ${property} with value: ${userStat}`);

                var $row = $('<tr>');

                let ind = "" + (index + 1);
                switch(position)
                {
                    case 0: ind = purple;
                        $row.css({'color':p});
                        break;
                    case 1: ind = gold;
                        $row.css({'color':g});
                        break;
                    case 2: ind = silver;
                        $row.css({'color':s});
                        break;
                    case 3: ind = bronze;
                        $row.css({'color':b});
                        break;
                }

                let val = userStat;
                if(property.includes('distance'))
                {
                    val = mToKm(val) + "km";
                }
                else if(property.includes('time') && !property.includes('times'))
                {
                    val = secondsToDHMS(val);
                }

                $row.append($('<td>').html(ind), $('<td>').text(property), $('<td>').text(val));
                $table.append($row);
                } 
                else 
                {
                    var $row = $('<tr>');
                    $row.append($('<td>').html("?"), $('<td>').text(property), $('<td>').text("?"));
                    $table.append($row);
                }
            }
        });

        $('#user_leaderboard').empty().append($table);
    }

    function CreateTotalLeaderboard()
    {
        // Create the table and the header row
        var $table = $('<table>').addClass('leaderboardTable');

        Object.keys(allSortedData).forEach(function(property) 
        {
            if(property != 'playerName'){
                var $row = $('<tr>').css({'color':p});

                //Get the first person on the list.
                var first = allSortedData[property][0];
                var val = allSortedData[property][0][property];

                if(property.includes('distance'))
                {
                    val = mToKm(val) + "km";
                }
                else if(property.includes('time') && !property.includes('times'))
                {
                    val = secondsToDHMS(val);
                }

                $row.append($('<td>').html(purple), $('<td>').text(property), $('<td>').text(first.playerName), $('<td>').text(val));        
                $table.append($row);            
            }  
        });

        $('#total_leaderboard').empty().append($table);
    }

    function DataLoaded()
    {
        //console.log(toolkist_stats.processedData);
        
        //Fill Pages
        Object.keys(toolkist_stats.processedData[0]).forEach(function(property) 
        {
            var data = toolkist_stats.GetSortedData(property);
            allSortedData[property] = data;

            var table = CreateLeaderboardTable(data, property);
            $('#' + property).html(table);

            //console.log(allSortedData);
        });

        toolkist_stats.createPlayerSelectionList('selection_user', UserSelected);
        CreateTotalLeaderboard();
    }

    toolkist_stats.RetreiveData(DataLoaded);

</script>
{{</rawhtml>}}