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

</script>
{{</rawhtml>}}

|Buttons|Description|
|-|-|
|Open|Open a graphics editor worksheet|
|Save|Save the current worksheet to a file|
|Add|Import objects of worksheet into the current worksheet|
|Export|Export the worksheet to a .zeeplevel|
|Image|Open an image to set as background image|
|Undo|Undo action|
|Redo|Redo action|
|Backward|Move an object or group back|
|Forward|Move an object or group forward|
|Pick|When an object is selected, this will set the color of that object as the selected color|
|Paint|Paints the selected objects with the selected color|
|Shape buttons|Add shape to the worksheet|