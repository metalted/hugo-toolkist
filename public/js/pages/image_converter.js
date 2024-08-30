import {toolkist} from '/toolkist/toolkist.js';

let toolkistImage = null;
let zeeplevelToExport = null;
let resultDiv = null;

export function init()
{
    window.onImageUploaded = (file) => { toolkist.fs.readImageFromFile(file, onImageLoaded); };
    window.onCopyToClipboardButton = onCopyToClipboardButton;
    window.onDownloadZeeplevelButton = onDownloadZeeplevelButton;

    //Create a results div with an img element.
    resultDiv = $('<div>').attr('id', 'resultDiv').hide();
    $('#pagepanel1').append(resultDiv);
    resultDiv.append($('<img>').attr('id', 'quantizedImage').css('display', 'block'));
}

function onImageLoaded(fileName, img)
{
    toolkistImage = new toolkist.graphics.Image().SetName(fileName).ReadImage(img).GenerateBlocks();
    zeeplevelToExport = new toolkist.game.Zeeplevel().AddBlocks(toolkistImage.blocks);
    toolkist.html.RenderQuantizedImage(toolkistImage.quantized, 'quantizedImage');
    resultDiv.slideDown();
}

function onCopyToClipboardButton()
{
    if(zeeplevelToExport != null)
    {
        toolkist.fs.CopyToClipboard(zeeplevelToExport.ToCSV()); 
    }
    else
    {
        window.alert("No output available!");
    }
} 

function onDownloadZeeplevelButton()
{
    if(zeeplevelToExport != null)
    {
        toolkist.fs.DirectDownload(toolkistImage.name + ".zeeplevel", zeeplevelToExport.ToCSV()); 
    }
    else
    {
        window.alert("No output available!");
    }
}