+++
title = 'Image Converter'
+++

{{<rawhtml>}}
<script src='/toolkist.js'></script>
<script src='/toolkist_color.js'></script>
<script src='/toolkist_image_converter.js'></script>
<script src='/toolkist_fs.js'></script>
<style>
    #result{
        margin-top: 20px;
        border: 1px solid rgb(251, 199, 25);
        padding: 25px;
    }
    h2{
        font-size: 24px;    
        color: rgb(239, 107, 35);
    }
    h3{
        font-size: 18px;
    }
    canvas
    {
        margin-top:25px;
        margin-bottom: 25px;
        display: block;
    }
</style>

<div id='content'>
    <div class='fileInputButton' id='image_input_container'>
        <label class='standardButton' for='toolkist_fs_image_input'>Upload Image</label>
    </div>
    <div id='result' hidden>
        <h2>Result:</h2>
        <h3 id='blockCount'></h3>
        <canvas id='image_out_preview'></canvas>
        <input class='standardButton' type='button' id='copy_to_clipboard' onclick='copyToClipboard()' value='Copy To Clipboard'></input>
        <input class='standardButton' type='button' id='download_to_file' onclick='downloadToFile()' value='Download .zeeplevel'></input>
    </div>
</div>

<script>
    var zeeplevel = null;
    var tkImage = null;

    toolkist_fs.imageFileInput('image_input_container', function(img)
    {
        tkImage = img;
        var palette = toolkist_color.colorPalette(toolkist_image_converter.paintIDs);
        var blocks = img.convertToBlocks(palette);
        var header = new toolkist.Header().generateHeader("Toolkist", blocks.length);
        zeeplevel = new toolkist.Zeeplevel('ImageTest').setHeader(header).setBlocks(blocks);
        toolkist_image_converter.drawOnCanvas('image_out_preview', img.quantized, function()
        {
            $('#blockCount').html("Block count: " + blocks.length);
            $('#result').slideDown(500, "swing");
        });
    });

    function copyToClipboard()
    {
        if(zeeplevel == null)
        {
            alert("Nothing to copy!");
        }
        else
        {
            toolkist_fs.copyToClipboard(zeeplevel.toCSV()); 
        }
    }

    function downloadToFile()
    {
        if(zeeplevel == null)
        {
            alert("Nothing to save!");
        }
        else
        {
            toolkist_fs.directDownload(toolkist_fs.removeExtension(tkImage.name) + ".zeeplevel", zeeplevel.toCSV()); 
        }
    }
</script>
{{</rawhtml>}}