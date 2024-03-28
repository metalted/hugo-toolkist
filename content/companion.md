+++
title = 'TK Companion'
draft = true
+++

{{<rawhtml>}}

<script>
    function fetchData(url, successCallback) {
        console.log(url);
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'text', // Change data type to 'text' for text response
            success: function(response) {
                // Call success callback with the response data
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(response);
                }
            },
            error: function(xhr, status, error) {
                // Call error callback with error details
                if (errorCallback && typeof errorCallback === 'function') {
                    console.log(xhr, status, error);
                }
            }
        });
    }

    function TKCRequest(endpoint)
    {
        var url = "http://localhost:48500/";
        fetchData(url + endpoint, function(response){
            console.log(response);
            $('#result').html(response);
        })
    }

</script>

<div id="content" class='flex_content'>
    <div class='standardPagePanel'>
    <button onclick='TKCRequest("audio/cameraFlash")'>Camera Flash</button>
    <button onclick='TKCRequest("audio/wilhelm")'>Wilhelm</button>
    <button onclick='TKCRequest("audio/fart")'>Fart</button>
    <button onclick='TKCRequest("audio/tire")'>Tire</button>
    <button onclick='TKCRequest("audio/hit")'>Hit</button>
    <button onclick='TKCRequest("audio/collision")'>Collision</button>
    <button onclick='TKCRequest("audio/blargh")'>Blargh</button>
    <button onclick='TKCRequest("blocks")'>Blocks</button>
    <button onclick='TKCRequest("paints")'>Paints</button>
    <button onclick='TKCRequest("leveleditor/folders")'>Folders</button>
    <button onclick='TKCRequest("adventure/levelData")'>Adventure Level Data</button>
    <button onclick='TKCRequest("adventure/levelNodes")'>Adventure Level Nodes</button>
    <button onclick='TKCRequest("adventure/level/10")'>Level 1</button>
    <pre id='result'></pre>
    </div>
</div>
{{</rawhtml>}}