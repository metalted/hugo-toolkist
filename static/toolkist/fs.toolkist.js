export var fs = (function($) {
    var fs = {};   

    fs.DirectDownload = function(fileName, fileContent)
    {
        // Create a blob with the file content
        let blob = new Blob([fileContent], { type: "text/plain" });

        // Create a temporary download link and click it to download the file.
        let link = document.createElement("a");
        link.download = fileName;
        link.href = window.URL.createObjectURL(blob);
        link.click();
    };

    fs.CopyToClipboard = function(clipboardContent)
    {
        navigator.clipboard.writeText(clipboardContent);
    };

    fs.AddFileNameSuffix = function(fileName, suffix)
    {
        const lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1) {
            return fileName + suffix;
        } 
        else {
            const extension = fileName.slice(lastDotIndex);
            const nameWithoutExtension = fileName.slice(0, lastDotIndex);
            return nameWithoutExtension + suffix + extension;
        }
    };

    fs.FileNameFromPath = function(filePath, extension = false)
    {
        var fileName = filePath.split('\\').pop();
        if (!extension) {
            fileName = fileName.split('.')[0];
        }
        return fileName;
    };

    fs.RemoveExtension = function(fileName)
    {
        // Find the last occurrence of a period (.) in the filename
        const lastDotIndex = fileName.lastIndexOf('.');
        
        // If a period is found, remove the extension
        if (lastDotIndex !== -1) {
            return fileName.substring(0, lastDotIndex);
        }
        
        // If no period is found, return the original filename
        return fileName;
    };
    
    return fs;
})(jQuery);