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