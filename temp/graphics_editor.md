+++
title = 'Graphics Editor'
+++

{{<rawhtml>}}
<div id='content' class='flex_content'>
    <div class='standardPagePanel'>
        <div id='zgraph_editor'></div>
    </div>
</div>

<style>
    #zgraph_editor
    {
        height: 100%;
    }
</style>
<script src='/fabric.min.js'></script>

<script type='module'>

import {toolkist} from '/toolkist/toolkist.js';
import {zgraph} from '/toolkist/graphicseditor.toolkist.js';

var editor;

$(document).ready(function(){
    editor = new zgraph.Editor('zgraph_editor');
});
</script>

{{</rawhtml>}}