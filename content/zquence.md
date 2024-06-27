+++
title = 'Zquence'
+++

{{<rawhtml>}}

<!-- HTML Meta Tags -->
<title>Zquence | Toolkist</title>
<meta name="description" content="Zeepkist Music Sequencer">

<!-- Facebook Meta Tags -->
<meta property="og:url" content="https://toolkist.netlify.app/zquence">
<meta property="og:type" content="website">
<meta property="og:title" content="Zquence | Toolkist">
<meta property="og:description" content="Zeepkist Music Sequencer">
<meta property="og:image" content="/img/zquence_banner.png">
<meta name="theme-color" content="#C644D6">

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="toolkist.netlify.app">
<meta property="twitter:url" content="https://toolkist.netlify.app/zquence">
<meta name="twitter:title" content="Zquence | Toolkist">
<meta name="twitter:description" content="Zeepkist Music Sequencer">
<meta name="twitter:image" content="/img/zquence_banner.png">

<!--Styling-->
<link rel="stylesheet" href="/css/zquence.toolkist.css"/>

<!--Code-->
<script type="module">
    import { zquence } from '/toolkist/zquence.toolkist.js';
    const sequencer = new zquence.Sequencer();
</script>

<!--Page Content-->
<div id="content" class='flex_content'>
    <div class='standardPagePanel'>
        <div id="app-container"> 
            <div id="left-column-container">
                <div id="track-list-container">
                    <div id="track-list-toolbar">
                        <div id="add-piano-button" class="add-instrument-button"><img src="/img/piano.png"></img><span>+</span></div>
                        <div id="add-trumpet-button" class="add-instrument-button"><img src="/img//trumpet.png"></img><span>+</span></div>
                        <div id="add-flute-button" class="add-instrument-button"><img src="/img//flute.png"></img><span>+</span></div>
                        <div id="add-kazoo-button" class="add-instrument-button"><img src="/img//kazoo.png"></img><span>+</span></div>
                        <div id="add-blarghl-button" class="add-instrument-button"><img src="/img//blarghl.png"></img><span>+</span></div></div>
                    <div id="track-list"></div>
                </div>
                <div id="export-container">
                    <div class="control-button" id="save-button">Save Zquence JSON</div>
                    <div class="control-button" id="load-button">Load Zquence JSON</div>
                    <input type="file" id="load-file" style="display: none;">     
                    <div class="control-button" id="import-midi-button">Import MIDI</div>
                    <input type="file" id="load-midi" style="display: none;">           
                    <table>
                        <tr><th>Target Speed:</th><td><input id="targetspeed-input" type="number" min="20" value="60" placeholder="TargetSpeed"></td></tr>
                        <tr><th>Export Type:</th><td><select id="exportType"><option value="circle">Circle</option><option value="line">Line</option><option value="road">Road</option></select></td></tr>
                        <tr><th>Filename:</th><td><input type="text" id="exportName" value="ToolkistZquence"></td></tr>
                    </table>
                    <div class="control-button" id="export-button">Export to Zeeplevel</div>
                </div>
            </div>
             <div id="time-line-container">
                <div id="time-line-toolbar">
                    <div class="time-line-control-button" id="play-button"><img src="/img/play.png"></img></div>
                    <div class="time-line-control-button" id="pause-button"><img src="/img/stop.png"></div>
                    <label for="bpm-input"> BPM: </label>
                    <input id="bpm-input" type="number" min="30" max="300" value="120" placeholder="BPM">
                    <label for="notesPerBarSelection"> Notes/Bar: </label><select id="notesPerBarSelection"><option value="4">4</option><option value="8">8</option><option value="16">16</option><option value="32">32</option></select>                
                    <div id="remove-bar-button"class="time-line-menu-button">Bar -</div>
                    <div id="add-bar-button" class="time-line-menu-button">Bar +</div>        
                </div>
                <div id="sequencer"></div>
            </div>
        </div>
    </div>
</div>
{{</rawhtml>}}