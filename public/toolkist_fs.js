var toolkist_fs = (function($) {
    var toolkist_fs = {};   

    toolkist_fs.textFileInput = function(containerID, onLoadCallback)
    {
        var fileInput = $('<input>', {
            type: 'file',
            id: 'toolkist_fs_text_input',
            accept: ''
        });

        fileInput.on('change', function()
        {
            if ($(this).val() !== '') 
            {
                let file = $(this)[0].files[0];

                var reader = new FileReader();
                reader.onload = function(){
                    let contents = reader.result;
                    onLoadCallback(file.name, contents);
                }
                reader.readAsText(file);
            }
        })

        $('#' + containerID).append(fileInput);
    }

    toolkist_fs.imageFileInput = function(containerID, onLoadCallback)
    {
        var fileInput = $('<input>', {
            type: 'file',
            id: 'toolkist_fs_image_input',
            accept: ''
        });

        fileInput.on('change', function()
        {
            if ($(this).val() !== '') 
            {
                let file = $(this)[0].files[0];

                var reader = new FileReader();
                reader.onload = function(){
                    var img = new Image();
                    img.onload = function(){
                        onLoadCallback(new toolkist_image_converter.Image().readImage(img).setName(file.name));
                    }
                    img.src = reader.result;
                }
                reader.readAsDataURL(file);
            }
        })

        $('#' + containerID).append(fileInput);
    }

    toolkist_fs.directDownload = function(fileName, fileContent)
    {
        // Create a blob with the file content
        let blob = new Blob([fileContent], { type: "text/plain" });

        // Create a temporary download link and click it to download the file.
        let link = document.createElement("a");
        link.download = fileName;
        link.href = window.URL.createObjectURL(blob);
        link.click();
    }

    toolkist_fs.copyToClipboard = function(clipboardContent)
    {
        navigator.clipboard.writeText(clipboardContent);
    }

    toolkist_fs.addSuffixToFileName = function(fileName, suffix)
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
    }

    toolkist_fs.fileNameFromPath = function(filePath, extension = false)
    {
        var fileName = filePath.split('\\').pop();
        if (!extension) {
            fileName = fileName.split('.')[0];
        }
        return fileName;
    }

    toolkist_fs.removeExtension = function(fileName)
    {
        // Find the last occurrence of a period (.) in the filename
        const lastDotIndex = fileName.lastIndexOf('.');
        
        // If a period is found, remove the extension
        if (lastDotIndex !== -1) {
            return fileName.substring(0, lastDotIndex);
        }
        
        // If no period is found, return the original filename
        return fileName;
    }

    return toolkist_fs;

})(jQuery);