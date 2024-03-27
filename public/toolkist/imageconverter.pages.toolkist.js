import {toolkist} from '/toolkist/toolkist.js';

let toolkistImage = null;
let zeeplevelToExport = null;
let resultDiv = null;

function OnImageUploadedCallback(fileName, img)
{
    toolkistImage = new toolkist.graphics.Image().SetName(fileName).ReadImage(img).GenerateBlocks();
    zeeplevelToExport = new toolkist.game.Zeeplevel().AddBlocks(toolkistImage.blocks);
    toolkist.html.RenderQuantizedImage(toolkistImage.quantized, 'quantizedImage');
    resultDiv.slideDown();
}

$(document).ready(function()
{
    const uploadImageButton = toolkist.html.CreateImageFileInput('uploadImageButton', "Upload Image", '', OnImageUploadedCallback);
    $('.standardLeftPanel').append(uploadImageButton);
    resultDiv = $('<div>').attr('id', 'resultDiv').hide();
    $('.standardPagePanel').append(resultDiv);
    toolkist.html.RenderButton('#resultDiv', 'copyToClipboardButton', 'Copy To Clipboard');
    toolkist.html.RenderButton('#resultDiv', 'downloadToZeeplevelButton', 'Download .zeeplevel');
    resultDiv.append($('<img>').attr('id', 'quantizedImage').css('display', 'block'));

    $('#copyToClipboardButton').on('click', function()
    {
        toolkist.fs.CopyToClipboard(zeeplevelToExport.ToCSV()); 
    });

    $('#downloadToZeeplevelButton').on('click', function()
    {
        toolkist.fs.DirectDownload(toolkistImage.name + ".zeeplevel", zeeplevelToExport.ToCSV()); 
    });
});