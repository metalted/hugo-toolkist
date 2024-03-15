+++
title = 'Graphics Editor'
+++

{{<rawhtml>}}
<script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<script src='/toolkist.js'></script>
<script src='/toolkist_color.js'></script>
<script src='/toolkist_fs.js'></script>

<div id='editor_container'></div>
<script src='/fabric.min.js'></script>
<script src='/toolkist_graphics_editor.js'></script>
<style>
    .selected{
        background-color: #222222
    }
</style>
<script>
    var editor = new toolkist_graphics_editor.Editor('editor_container');    
    function adjustDivHeight() {
        var windowHeight = window.innerHeight; // Get the viewport height
        console.log(windowHeight);
        var newHeight = windowHeight - 50; // Subtract 50px
        document.getElementById('editor_container').style.height = newHeight + 'px'; // Set the new height
    }
    // Run the function on initial load
    adjustDivHeight();
    // Optionally, adjust the height whenever the window is resized
    window.addEventListener('resize', adjustDivHeight);
    
</script>
<div class='control_table'>
<table>
    <tr>
        <th>Buttons</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Open</td>
        <td>Open a graphics editor worksheet</td>
    </tr>
    <tr>
        <td>Save</td>
        <td>Save the current worksheet to a file</td>
    </tr>
    <tr>
        <td>Add</td>
        <td>Import objects of worksheet into the current worksheet</td>
    </tr>
    <tr>
        <td>Export</td>
        <td>Export the worksheet to a .zeeplevel</td>
    </tr>
    <tr>
        <td>Image</td>
        <td>Open an image to set as background image</td>
    </tr>
    <tr>
        <td>Undo</td>
        <td>Undo action</td>
    </tr>
    <tr>
        <td>Redo</td>
        <td>Redo action</td>
    </tr>
    <tr>
        <td>Backward</td>
        <td>Move an object or group back</td>
    </tr>
    <tr>
        <td>Forward</td>
        <td>Move an object or group forward</td>
    </tr>
    <tr>
        <td>Pick</td>
        <td>When an object is selected, this will set the color of that object as the selected color</td>
    </tr>
    <tr>
        <td>Paint</td>
        <td>Paints the selected objects with the selected color</td>
    </tr>
    <tr>
        <td>Shape buttons</td>
        <td>Add shape to the worksheet</td>
    </tr>
</table>

<table>
    <tr>
        <th>Keys</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>CTRL+Z</td>
        <td>Undo</td>
    </tr>
    <tr>
        <td>CTRL+Y</td>
        <td>Redo</td>
    </tr>
    <tr>
        <td>Alt+LMB Drag</td>
        <td>Drag Screen</td>
    </tr>
    <tr>
        <td>LMB Drag</td>
        <td>Select</td>
    </tr>
    <tr>
        <td>Delete</td>
        <td>Delete Object</td>
    </tr>
</table>
</div>
{{</rawhtml>}}