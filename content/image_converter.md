+++
title = 'Image Converter'
+++

{{<rawhtml>}}
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src='/toolkist.js'></script>
<script src='/toolkist_color.js'></script>
<script src='/toolkist_image_converter.js'></script>
<script src='/toolkist_fs.js'></script>
<br>
<h2>Select your image using the button below. After uploading it will automatically be converted.
<br>
<div id='image_input_container'></div>
<hr>
<input style='color:black' type='button' id='copy_to_clipboard' onclick='copyToClipboard()' value='Copy To Clipboard' hidden></input>
<input style='color:black' type='button' id='download_to_file' onclick='downloadToFile()' value='Download .zeeplevel' hidden></input>
<br>
<canvas id='image_out_preview'></canvas>

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
            $('#copy_to_clipboard').show();
            $('#download_to_file').show();
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