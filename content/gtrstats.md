+++
title = 'GTR Stats'
+++

{{<rawhtml>}}
<script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.159.0/three.min.js" integrity="sha512-OviGQIoFPxWNbGybQNprasilCxjtXNGCjnaZQvDeCT0lSPwJXd5TC3usI/jsWepKW9lZLZ1ob1q/Vy4MnlTt7g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<style>
    button{
        color: black !important;
        width: 10%;
    }
</style>
<script src='/toolkist_stats.js'></script>

<h3>Leaderboard</h3>
<div id='button_leaderboard'></div>
<h3>User</h3>
<div id='selection_user'></div>
<h3>Crashes</h3>
<div id='buttons_crash'></div>
<h3>Distances</h3>
<div id='buttons_distance'></div>
<h3>Time</h3>
<div id='buttons_time'></div>
<h3>Others</h3>
<div id='buttons_others'></div>
<h3>Results</h3>
<div id='results'></div>

<script>
    function DataLoaded()
    {
        console.log(toolkist_stats.processedData);
        // Create buttons for each stat
        Object.keys(toolkist_stats.processedData[0]).forEach(function(property) {

            if (property.includes('distance')) 
            {
                $('#buttons_distance').append('<button onclick="toolkist_stats.displaySortedData(\'' + property + '\')">' + property + '</button>');
            } 
            else if (property.includes('time') && !property.includes('times')) 
            {
                $('#buttons_time').append('<button onclick="toolkist_stats.displaySortedData(\'' + property + '\')">' + property + '</button>');
            } 
            else if (property.includes('crash')) 
            {
                $('#buttons_crash').append('<button onclick="toolkist_stats.displaySortedData(\'' + property + '\')">' + property + '</button>');
            }
            else
            {
                $('#buttons_others').append('<button onclick="toolkist_stats.displaySortedData(\'' + property + '\')">' + property + '</button>');
            }
        });

        $('#button_leaderboard').append('<button onclick="toolkist_stats.displayHighestScores()">Leaderboard</button>');

        toolkist_stats.createPlayerSelectionList('selection_user');
    }

    toolkist_stats.RetreiveData(DataLoaded);

</script>
{{</rawhtml>}}