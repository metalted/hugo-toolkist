+++
title = 'Zeeplevel Editor'
+++

{{<rawhtml>}}
<style>
    /* Ensure table and cells use the full width available */
    .gridjs-table {
        width: 100% !important;
        background-color: rgb(34, 34, 34);
        color: rgb(251, 199, 25);
    }

    /* Style the headers to support subscript properly */
    .gridjs-th {
        white-space: nowrap; /* Prevent text from wrapping */
        text-align: center;  /* Center align header text */
        min-width: 0px !important;
    }

    /* Style for subscript elements */
    .gridjs-th sub {
        font-size: 0.8em; /* Smaller font size for subscript */
        vertical-align: sub; /* Position subscript correctly */
    }

    /* Style for table cells */
    .gridjs-tr td {
        border: 1px solid #555555;
        white-space: nowrap; /* Prevent text from wrapping */
        overflow: hidden; /* Hide overflowing content */
        min-width: 0px !important;
    }

    .gridjs-tr td:hover {
        cursor: pointer;
        background-color: #777777;
    }

    /* Specific styles for the first 10 columns */
    .gridjs-tr td:nth-child(n+2):nth-child(-n+10) {
        max-width: 30px !important; /* Constrain the width */
        width: 30px;
        text-overflow: clip; /* Clip overflow text */
        padding-left: 2px;
        padding-right: 2px;
        font-size: 12px;
    }

    /* Center align text for columns starting from the 11th */
    .gridjs-tr td:nth-child(1), .gridjs-tr td:nth-child(n+11) {
        text-align: center;
        padding-left: 1px;
        padding-right: 1px;
    }

    .form-group {
        margin-bottom: 10px;
    }

    .form-group label {
        margin-right: 5px;
    }
</style>
<script src='https://unpkg.com/gridjs/dist/gridjs.umd.js'></script>
<script type="module">
    import { toolkist } from '/toolkist/toolkist.js';

    var currentFileName = "";
    var currentZeeplevel = null;
    var headers = [];

    function OnZeeplevelUploadedCallback(fileName, contents) {
        currentFileName = fileName;
        currentZeeplevel = new toolkist.game.Zeeplevel();
        currentZeeplevel.FromCSV(contents);
        console.log(currentZeeplevel);

        // Render the currentZeeplevel.blocks array into a table
        renderBlocksTable(currentZeeplevel.blocks);
    }

    function blocksToGridData(blocks) {
        return blocks.map(block => {
            return [
                block.blockID,
                block.position.x,
                block.position.y,
                block.position.z,
                block.euler.x,
                block.euler.y,
                block.euler.z,
                block.scale.x,
                block.scale.y,
                block.scale.z,
                ...block.paints, // Include each paint as a separate column
                ...block.options // Include each option as a separate column
            ];
        });
    }

    function onCellClickHandler(content, rowData, columnData) {
        let cellContent = content;
        let column = columnData.id;

        console.log(column + "," + cellContent);
    }

    let grid; // Variable to store the grid instance

function renderBlocksTable(blocks) {
    const headers = [
        { 
            id: 'id',
            name: gridjs.html('ID'),
            width: '50px',
            attributes: (cell, row, column) => ({
                'data-cell-content': cell,
                'onclick': () => onCellClickHandler(cell, row, column)
            })
        },
        { 
            id: 'posX', 
            name: gridjs.html('P<sub>x</sub>'),
            attributes: (cell, row, column) => ({
                'data-cell-content': cell,
                'onclick': () => onCellClickHandler(cell, row, column)
            })
        },
        { 
            id: 'posY', 
            name: gridjs.html('P<sub>y</sub>'),
            attributes: (cell, row, column) => ({
                'data-cell-content': cell,
                'onclick': () => onCellClickHandler(cell, row, column)
            })
        },
        { 
            id: 'posZ', 
            name: gridjs.html('P<sub>z</sub>'),
            attributes: (cell, row, column) => ({
                'data-cell-content': cell,
                'onclick': () => onCellClickHandler(cell, row, column)
            })
        },
        { 
            id: 'eulerX', 
            name: gridjs.html('R<sub>x</sub>'),
            attributes: (cell, row, column) => ({
                'data-cell-content': cell,
                'onclick': () => onCellClickHandler(cell, row, column)
            })
        },
        { 
            id: 'eulerY', 
            name: gridjs.html('R<sub>y</sub>'),
            attributes: (cell, row, column) => ({
                'data-cell-content': cell,
                'onclick': () => onCellClickHandler(cell, row, column)
            })
        },
        { 
            id: 'eulerZ', 
            name: gridjs.html('R<sub>z</sub>'),
            attributes: (cell, row, column) => ({
                'data-cell-content': cell,
                'onclick': () => onCellClickHandler(cell, row, column)
            })
        },
        { 
            id: 'scaleX', 
            name: gridjs.html('S<sub>x</sub>'),
            attributes: (cell, row, column) => ({
                'data-cell-content': cell,
                'onclick': () => onCellClickHandler(cell, row, column)
            })
        },
        { 
            id: 'scaleY', 
            name: gridjs.html('S<sub>y</sub>'),
            attributes: (cell, row, column) => ({
                'data-cell-content': cell,
                'onclick': () => onCellClickHandler(cell, row, column)
            })
        },
        { 
            id: 'scaleZ', 
            name: gridjs.html('S<sub>z</sub>'),
            attributes: (cell, row, column) => ({
                'data-cell-content': cell,
                'onclick': () => onCellClickHandler(cell, row, column)
            })
        },
        ...Array.from({ length: blocks[0].paints.length }, (_, i) => ({
            id: `paint${i + 1}`,
            name: gridjs.html(`P<sub>${i + 1}</sub>`),
            attributes: (cell, row, column) => ({
                'data-cell-content': cell,
                'onclick': () => onCellClickHandler(cell, row, column)
            })
        })),
        ...Array.from({ length: blocks[0].options.length }, (_, i) => ({
            id: `option${i + 1}`,
            name: gridjs.html(`O<sub>${i + 1}</sub>`),
            attributes: (cell, row, column) => ({
                'data-cell-content': cell,
                'onclick': () => onCellClickHandler(cell, row, column)
            })
        }))
    ];

    const data = blocksToGridData(blocks);

    if (grid) {
        // If grid already exists, update its configuration and re-render
        grid.updateConfig({
            columns: headers,
            data: data,
        }).forceRender();
    } else {
        // Initial rendering of the grid
        grid = new gridjs.Grid({
            columns: headers,
            data: data,
            pagination: {
                limit: 25
            },
            search: false,
            sort: false,
        }).render(document.getElementById('table-container'));
    }
}
    function updateZeeplevelData(searchColumn, searchValue, updateColumn, updateValue) {
    if (!currentZeeplevel || !currentZeeplevel.blocks) return;

    for (let i = 0; i < currentZeeplevel.blocks.length; i++) {
        let block = currentZeeplevel.blocks[i];
        let match = false;

        // Determine the value to check for a match
        let valueToCheck;
        switch (searchColumn) {
            case 'id':
                valueToCheck = block.blockID;
                break;
            case 'position.x':
                valueToCheck = block.position.x;
                break;
            case 'position.y':
                valueToCheck = block.position.y;
                break;
            case 'position.z':
                valueToCheck = block.position.z;
                break;
            case 'euler.x':
                valueToCheck = block.euler.x;
                break;
            case 'euler.y':
                valueToCheck = block.euler.y;
                break;
            case 'euler.z':
                valueToCheck = block.euler.z;
                break;
            case 'scale.x':
                valueToCheck = block.scale.x;
                break;
            case 'scale.y':
                valueToCheck = block.scale.y;
                break;
            case 'scale.z':
                valueToCheck = block.scale.z;
                break;
            // Add more cases as needed
            default:
                console.error(`Unknown search column: ${searchColumn}`);
                return;
        }

        // Check if the value matches
        if (String(valueToCheck) === searchValue) {
            match = true;
        }

        // If a match is found, update the corresponding value
        if (match) {
            switch (updateColumn) {
                case 'id':
                    currentZeeplevel.blocks[i].blockID = updateValue;
                    break;
                case 'position.x':
                    currentZeeplevel.blocks[i].position.x = parseFloat(updateValue);
                    break;
                case 'position.y':
                    currentZeeplevel.blocks[i].position.y = parseFloat(updateValue);
                    break;
                case 'position.z':
                    currentZeeplevel.blocks[i].position.z = parseFloat(updateValue);
                    break;
                case 'euler.x':
                    currentZeeplevel.blocks[i].euler.x = parseFloat(updateValue);
                    break;
                case 'euler.y':
                    currentZeeplevel.blocks[i].euler.y = parseFloat(updateValue);
                    break;
                case 'euler.z':
                    currentZeeplevel.blocks[i].euler.z = parseFloat(updateValue);
                    break;
                case 'scale.x':
                    currentZeeplevel.blocks[i].scale.x = parseFloat(updateValue);
                    break;
                case 'scale.y':
                    currentZeeplevel.blocks[i].scale.y = parseFloat(updateValue);
                    break;
                case 'scale.z':
                    currentZeeplevel.blocks[i].scale.z = parseFloat(updateValue);
                    break;
                // Add more cases as needed
                default:
                    console.error(`Unknown update column: ${updateColumn}`);
                    return;
            }
        }
    }

    // Update the grid with the new data
    renderBlocksTable(currentZeeplevel.blocks);
}

    $(document).ready(function() {
        const uploadFileButton = toolkist.html.CreateTextFileInput('uploadZeepfileButton', "Upload Zeeplevel", '', OnZeeplevelUploadedCallback);
        $('.standardLeftPanel').append(uploadFileButton);

        $('#copyToClipboardButton').on('click', function() {
            toolkist.fs.CopyToClipboard(zeeplevelToExport.ToCSV());
        });

        $('#downloadToZeeplevelButton').on('click', function() {
            toolkist.fs.DirectDownload(toolkistImage.name + ".zeeplevel", zeeplevelToExport.ToCSV());
        });

        $('#editForm').on('submit', function(event) {
            event.preventDefault();
            const searchColumn = $('#searchColumn').val();
            const searchValue = $('#searchValue').val();
            const updateColumn = $('#updateColumn').val();
            const updateValue = $('#updateValue').val();

            updateZeeplevelData(searchColumn, searchValue, updateColumn, updateValue);
        });
    });
</script>

<div id='content' class='flex_content'>
    <div class='standardLeftPanel'></div>
    <div class='standardPagePanel'>
        <form id="editForm">
            <div class="form-group">
                <label for="searchColumn">Select Column to Search:</label>
                <select id="searchColumn" required>
                    <option value="id">ID</option>
                    <option value="position.x">P<sub>x</sub></option>
                    <option value="position.y">P<sub>y</sub></option>
                    <option value="position.z">P<sub>z</sub></option>
                    <option value="euler.x">R<sub>x</sub></option>
                    <option value="euler.y">R<sub>y</sub></option>
                    <option value="euler.z">R<sub>z</sub></option>
                    <option value="scale.x">S<sub>x</sub></option>
                    <option value="scale.y">S<sub>y</sub></option>
                    <option value="scale.z">S<sub>z</sub></option>
                    <!-- Add more options as needed -->
                </select>
            </div>
            <div class="form-group">
                <label for="searchValue">Search Value:</label>
                <input type="text" id="searchValue" required>
            </div>
            <div class="form-group">
                <label for="updateColumn">Select Column to Update:</label>
                <select id="updateColumn" required>
                    <option value="id">ID</option>
                    <option value="position.x">P<sub>x</sub></option>
                    <option value="position.y">P<sub>y</sub></option>
                    <option value="position.z">P<sub>z</sub></option>
                    <option value="euler.x">R<sub>x</sub></option>
                    <option value="euler.y">R<sub>y</sub></option>
                    <option value="euler.z">R<sub>z</sub></option>
                    <option value="scale.x">S<sub>x</sub></option>
                    <option value="scale.y">S<sub>y</sub></option>
                    <option value="scale.z">S<sub>z</sub></option>
                    <!-- Add more options as needed -->
                </select>
            </div>
            <div class="form-group">
                <label for="updateValue">Update Value:</label>
                <input type="text" id="updateValue" required>
            </div>
            <button type="submit">Go</button>
        </form>
        <div id='table-container'></div>
    </div>
</div>
{{</rawhtml>}}
