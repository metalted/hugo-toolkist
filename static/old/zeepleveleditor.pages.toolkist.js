import { toolkist } from '/toolkist/toolkist.js';

var currentFileName = "";
var currentZeeplevel = null;

function OnZeeplevelUploadedCallback(fileName, contents) 
{
    currentFileName = fileName;
    currentZeeplevel = new toolkist.game.Zeeplevel();
    currentZeeplevel.FromCSV(contents);
    console.log(currentZeeplevel);

    $('#authorInput').val(currentZeeplevel.playerName);
    $('#uuidInput').val(currentZeeplevel.uniqueID);
    if(currentZeeplevel.validationTime == "invalid track")
    {
        $('#authorTimeInput').val(-1);        
    }
    else
    {
        $('#authorTimeInput').val(currentZeeplevel.validationTime);
    }

    $('#goldTimeInput').val(currentZeeplevel.goldTime);
    $('#silverTimeInput').val(currentZeeplevel.silverTime);
    $('#bronzeTimeInput').val(currentZeeplevel.bronzeTime);
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

    $('#searchColumn').val(column);
    $('#searchValue').val(cellContent);
}

let grid; // Variable to store the grid instance

function renderBlocksTable(blocks) {
    if (!blocks || blocks.length === 0) return;

    // Define the common headers and their attributes
    const baseHeaders = [
        { id: 'id', label: 'ID' },
        { id: 'position.x', label: 'Px' },
        { id: 'position.y', label: 'Py' },
        { id: 'position.z', label: 'Pz' },
        { id: 'euler.x', label: 'Rx' },
        { id: 'euler.y', label: 'Ry' },
        { id: 'euler.z', label: 'Rz' },
        { id: 'scale.x', label: 'Sx' },
        { id: 'scale.y', label: 'Sy' },
        { id: 'scale.z', label: 'Sz' }
    ];

    // Generate headers for paints and options dynamically based on block data
    const paintsHeaders = Array.from({ length: blocks[0].paints.length }, (_, i) => ({
        id: `paints.${i}`,
        label: `M${i + 1}`
    }));

    const optionsHeaders = Array.from({ length: blocks[0].options.length }, (_, i) => ({
        id: `options.${i}`,
        label: `O${i + 1}`
    }));

    // Combine all headers into one array
    const headers = [...baseHeaders, ...paintsHeaders, ...optionsHeaders].map(header => ({
        id: header.id,
        name: gridjs.html(header.label),
        attributes: (cell, row, column) => ({
            'data-cell-content': cell,
            'onclick': () => onCellClickHandler(cell, row, column)
        })
    }));

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

function updateZeeplevelData(searchColumn, searchValue, updateColumn, updateValue, operation) 
{
    if (!currentZeeplevel || !currentZeeplevel.blocks) return;

    // Parse search and update column parts once
    const searchColumnParts = searchColumn.split(".");
    const searchColumnKey = searchColumnParts[0];
    const searchColumnIndex = searchColumnParts.length > 1 ? parseInt(searchColumnParts[1], 10) : null;

    const updateColumnParts = updateColumn.split(".");
    const updateColumnKey = updateColumnParts[0];
    const updateColumnIndex = updateColumnParts.length > 1 ? parseInt(updateColumnParts[1], 10) : null;

    for (let i = 0; i < currentZeeplevel.blocks.length; i++) 
    {
        let block = currentZeeplevel.blocks[i];
        let match = false;

        // Determine the value to check
        let valueToCheck;
        if (searchColumnParts.length === 1) {
            valueToCheck = block.blockID;
        } else {
            valueToCheck = isNaN(searchColumnIndex) ? block[searchColumnKey][searchColumnParts[1]] : block[searchColumnKey][searchColumnIndex];
        }

        // Check if the value matches
        if (String(valueToCheck) === searchValue || searchValue.trim() == "") {
            match = true;
        }

        // If a match is found, update the corresponding value
        if (match) {
            if (updateColumnParts.length === 1) {
                block.blockID = updateValue;
            } else {
                if (isNaN(updateColumnIndex)) {
                    if(operation == "set")
                    {
                        block[updateColumnKey][updateColumnParts[1]] = parseFloat(updateValue);
                    }
                    else if(operation == "add")
                    {
                        block[updateColumnKey][updateColumnParts[1]] += parseFloat(updateValue);
                    }                    
                } 
                else 
                {
                    if(operation == "set")
                    {
                        block[updateColumnKey][updateColumnIndex] = parseFloat(updateValue);
                    }
                    else if(operation == "add")
                    {
                        block[updateColumnKey][updateColumnIndex] += parseFloat(updateValue);
                    }
                }
            }
        }
    }

    // Update the grid with the new data
    renderBlocksTable(currentZeeplevel.blocks);
}

function TrySetAuthor() {}

function TrySetAuthorTime(){}

$(document).ready(function() 
{

    $('#editForm').on('submit', function(event) {

        updateZeeplevelData(searchColumn, searchValue, updateColumn, updateValue,operation);
    });
});