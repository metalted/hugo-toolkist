export var gist = (function($) 
{    
    var gist = {};      
    gist.GetZDLData = function(onLoadedCallback)
    {
        //var linkGist = '37abb529a2be73ac6ba4ec45d7ccf7fd';
        var linkGist = '95a475e2b24720e315e6586ff951b740';
        $.ajax({
            url: `https://api.github.com/gists/${linkGist}`,
            type: 'GET',
            dataType: 'json',
            success: function(data) 
            {   
                try {
                    const fileContent = data.files['gistfile1.txt'].content;
                    var json = JSON.parse(fileContent);
                    console.log('Fetched Gist Data:', json);
                    onLoadedCallback(json, 'ok');
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    onLoadedCallback(null, 'parse');
                }                
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                console.error("AJAX Error:", textStatus, errorThrown);
                onLoadedCallback(null, 'error');
            }
        });
    }

    gist.GetZSTData = function(onLoadedCallback)
    {
        //var linkGist = '4ec13c65cd193612f0dfdb5cdae73791';
        var linkGist = '5203e9e7bcd3724d0d211c087d9103d1';
        $.ajax({
            url: `https://api.github.com/gists/${linkGist}`,
            type: 'GET',
            dataType: 'json',
            success: function(data) 
            {   
                try{
                    const fileContent = data.files['zstData.json'].content;
                    var json = JSON.parse(fileContent);
                    console.log('Fetched Gist Data:', json);
                    onLoadedCallback(json, 'ok');
                }
                catch
                {
                    onLoadedCallback(null, 'parse');
                }                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //console.log(jqXHR);
                //console.error('Error fetching Gist:', textStatus, errorThrown);
                onLoadedCallback(null, 'error')
            }
        });        
    }

    return gist;
})(jQuery);
