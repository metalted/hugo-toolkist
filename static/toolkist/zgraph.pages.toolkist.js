import { zgraph } from '/toolkist/zgraph.toolkist.js';

var editor = null;

$(document).ready(function() {  
    editor = new zgraph.Editor('.standardPagePanel');

    // Add information to the header bar
    var headerbar = $('.zgraph-menubar');

    // Add a span for the button
    var buttonSpan = $('<div id="controlsButton">Controls</div>');
    headerbar.append(buttonSpan);

    // Add a table to show controls
    var controlsTable = $('<table id="controlsTable" style="display: none;"></table>');
    headerbar.append(controlsTable);

    // Define control keys and descriptions
    var controls = [
        { key: 'CTRL+Z', description: 'Undo' },
        { key: 'CTRL+Y', description: 'Redo' },
        { key: 'Alt+LMB Drag', description: 'Drag Screen' },
        { key: 'LMB Drag', description: 'Select' },
        { key: 'Delete', description: 'Delete Object' }
    ];

    // Populate controls in the table
    for (var i = 0; i < controls.length; i++) {
        controlsTable.append('<tr><td>' + controls[i].key + '</td><td>' + controls[i].description + '</td></tr>');
    }

    // Show controls when hovering over the button
    buttonSpan.hover(function() {
        controlsTable.show();
    }, function() {
        controlsTable.hide();
    });
});

$(window).resize(function() {
    if (editor != null) {
        editor.OnResize();
    }
});