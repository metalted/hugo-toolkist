import {toolkist} from '/toolkist/toolkist.js';

let currentFileName;
let currentZeeplevel = null;
let unchangedZeeplevel = null;
let controls = null;
let grid;

const columnData = [
    { value: 'id', text: 'ID' },
    { value: 'position.x', text: 'Px' },
    { value: 'position.y', text: 'Py' },
    { value: 'position.z', text: 'Pz' },
    { value: 'euler.x', text: 'Rx' },
    { value: 'euler.y', text: 'Ry' },
    { value: 'euler.z', text: 'Rz' },
    { value: 'scale.x', text: 'Sx' },
    { value: 'scale.y', text: 'Sy' },
    { value: 'scale.z', text: 'Sz' },
    { value: 'paints.0', text: 'M1' },
    { value: 'paints.1', text: 'M2' },
    { value: 'paints.2', text: 'M3' },
    { value: 'paints.3', text: 'M4' },
    { value: 'paints.4', text: 'M5' },
    { value: 'paints.5', text: 'M6' },
    { value: 'paints.6', text: 'M7' },
    { value: 'paints.7', text: 'M8' },
    { value: 'paints.8', text: 'M9' },
    { value: 'paints.9', text: 'M10' },
    { value: 'paints.10', text: 'M11' },
    { value: 'paints.11', text: 'M12' },
    { value: 'paints.12', text: 'M13' },
    { value: 'paints.13', text: 'M14' },
    { value: 'paints.14', text: 'M15' },
    { value: 'paints.15', text: 'M16' },
    { value: 'paints.16', text: 'M17' },
    { value: 'options.0', text: 'O1' },
    { value: 'options.1', text: 'O2' },
    { value: 'options.2', text: 'O3' },
    { value: 'options.3', text: 'O4' },
    { value: 'options.4', text: 'O5' },
    { value: 'options.5', text: 'O6' },
    { value: 'options.6', text: 'O7' },
    { value: 'options.7', text: 'O8' },
    { value: 'options.8', text: 'O9' },
    { value: 'options.9', text: 'O10' },
    { value: 'options.10', text: 'O11' }
];

export function init()
{
    window.onZeeplevelUploaded = (file) => { toolkist.fs.readTextFromFile(file, onZeeplevelLoaded); }
    window.onCopyToClipboardButton = onCopyToClipboardButton;
    window.onDownloadZeeplevelButton = onDownloadZeeplevelButton;

    controls = constructPage();
    controls.authors.on('input', onAuthorInputChange);    
    controls.authorTime.on('input', onAuthorTimeInputChange);
    controls.apply.on('click', onApplyButton);
}

function constructPage()
{
    let page = $('#pagepanel1');
    page.empty();

    let ctrl = {
        mainContainer : $('<div>').addClass('form_container_holder'),
        headerContainer : $('<div>').addClass('form_container'),
        authors : $('<input>').attr({'type':'text', 'id':'authorInput'}),
        uuid : $('<input>').attr({'type':'text', 'id':'uuidInput'}).prop('readonly', true),
        authorTime : $('<input>').attr({'type':'number', 'id':'authorTimeInput'}),
        goldTime: $('<input>').attr({'type':'number', 'id':'goldTimeInput'}).prop('readonly', true),
        silverTime: $('<input>').attr({'type':'number', 'id':'silverTimeInput'}).prop('readonly', true),
        bronzeTime: $('<input>').attr({'type':'number', 'id':'bronzeTimeInput'}).prop('readonly', true),

        blocksContainer : $('<div>').addClass('form_container'),
        searchColumn : $('<select>').attr({'id':'searchColumnSelect'}),
        searchValue : $('<input>').attr({'type':'number', 'id':'searchValueInput', 'placeholder': 'All'}),
        updateColumn : $('<select>').attr({'id':'updateColumnSelect'}),
        updateValue : $('<input>').attr({'type':'number', 'id':'updateValueInput'}),
        operation : $('<select>').attr({'id':'operationSelect'}),
        apply: $('<button>').text("Apply")
    };

    ctrl.mainContainer.append(ctrl.headerContainer, ctrl.blocksContainer, $('<br>'));

    ctrl.headerContainer.append(
        $("<h2>").text("Header"),
        $('<label>').attr({'for':'authorInput'}).text('Author(s)'), ctrl.authors, $('<br>'),
        $('<label>').attr({'for':'uuidInput'}).text('UUID'), ctrl.uuid, $('<br>'),
        $('<label>').attr({'for':'authorTimeInput'}).text('Author Time (s)'), ctrl.authorTime, $('<br>'),
        $('<label>').attr({'for':'goldTimeInput'}).text('Gold Time'), ctrl.goldTime, $('<br>'),
        $('<label>').attr({'for':'silverTimeInput'}).text('Silver Time'), ctrl.silverTime, $('<br>'),
        $('<label>').attr({'for':'bronzeTimeInput'}).text('Bronze Time'), ctrl.bronzeTime, $('<br>'),
        ctrl.apply
    );

    ctrl.blocksContainer.append(
        $("<h2>").text("Blocks"),
        $('<label>').attr({'for':'searchColumnSelect'}).text('Select Column to Search'), ctrl.searchColumn, $('<br>'),
        $('<label>').attr({'for':'searchValueInput'}).text('Search Value'), ctrl.searchValue, $('<br>'),
        $('<label>').attr({'for':'updateColumnSelect'}).text('Select Column to Update'), ctrl.updateColumn, $('<br>'),
        $('<label>').attr({'for':'updateValueInput'}).text('Update Value'), ctrl.updateValue, $('<br>'),
        $('<label>').attr({'for':'operationSelect'}).text('Operation'), ctrl.operation
    );

    //Add options
    columnData.forEach(c => {
        ctrl.searchColumn.append($('<option>').attr({'value': c.value}).text(c.text));
        ctrl.updateColumn.append($('<option>').attr({'value': c.value}).text(c.text));
    });

    ctrl.operation.append($('<option>').attr({ 'value': 'set'}).text('Set'));
    ctrl.operation.append($('<option>').attr({ 'value': 'add'}).text('Add'));

    page.append(ctrl.mainContainer, $('<div>').attr({'id':'table-container'}));

    return ctrl;
}

function onZeeplevelLoaded(fileName, contents)
{
    currentFileName = fileName;
    currentZeeplevel = new toolkist.game.Zeeplevel();
    currentZeeplevel.FromCSV(contents);

    unchangedZeeplevel = JSON.parse(JSON.stringify(currentZeeplevel));

    controls.authors.val(currentZeeplevel.playerName);
    controls.uuid.val(currentZeeplevel.uniqueID);
    
    if(currentZeeplevel.validationTime == "invalid track")
    {
        controls.authorTime.val(-1);    
    }
    else
    {
        controls.authorTime.val(currentZeeplevel.validationTime);
    }

    controls.goldTime.val(currentZeeplevel.goldTime);
    controls.silverTime.val(currentZeeplevel.silverTime);
    controls.bronzeTime.val(currentZeeplevel.bronzeTime);
    
    renderBlocksTable(currentZeeplevel.blocks);
}

function onCopyToClipboardButton()
{
    if(currentZeeplevel != null)
    {
        var csvOutput = currentZeeplevel.ToCSV();
        toolkist.fs.CopyToClipboard(csvOutput);
    }     
}

function onDownloadZeeplevelButton()
{
    if(currentZeeplevel != null)
    {
        toolkist.fs.DirectDownload(currentFileName, currentZeeplevel.ToCSV());
    } 
}

function onAuthorInputChange()
{
    if (!currentZeeplevel){return;}

    const authorInput = controls.authors.val().trim();
    const uuidAuthorInput = authorInput.replace(/[^a-zA-Z0-9]/g, '');

    if(authorInput.length == 0)
    {
        currentZeeplevel.playerName = unchangedZeeplevel.playerName;
        currentZeeplevel.uniqueID = unchangedZeeplevel.uniqueID;
        controls.uuid.val(unchangedZeeplevel.uniqueID);
    }
    else
    {
        currentZeeplevel.playerName = authorInput;
        currentZeeplevel.uniqueID = currentZeeplevel.GenerateUniqueID(uuidAuthorInput, currentZeeplevel.blocks.length);
        controls.uuid.val(currentZeeplevel.uniqueID);
    }
}

function onAuthorTimeInputChange()
{
    if (!currentZeeplevel){return;}

    const timeInput = controls.authorTime.val();
    const parsedFloat = parseFloat(timeInput);

    const isValid = !isNaN(parsedFloat) && parsedFloat > 0;

    if(isValid)
    {
        currentZeeplevel.validationTime = parsedFloat;
        currentZeeplevel.goldTime = (parsedFloat * 1.1).toFixed(3);
        currentZeeplevel.silverTime = (parsedFloat * 1.2).toFixed(3);
        currentZeeplevel.bronzeTime = (parsedFloat * 1.35).toFixed(3);

        controls.goldTime.val(currentZeeplevel.goldTime);
        controls.silverTime.val(currentZeeplevel.silverTime);
        controls.bronzeTime.val(currentZeeplevel.bronzeTime);
    }
    else
    {
        currentZeeplevel.validationTime = unchangedZeeplevel.validationTime;
        currentZeeplevel.goldTime = unchangedZeeplevel.goldTime;
        currentZeeplevel.silverTime = unchangedZeeplevel.silverTime;
        currentZeeplevel.bronzeTime = unchangedZeeplevel.bronzeTime;

        controls.goldTime.val(currentZeeplevel.goldTime);
        controls.silverTime.val(currentZeeplevel.silverTime);
        controls.bronzeTime.val(currentZeeplevel.bronzeTime);
    }  
}

function onApplyButton()
{
    if (!currentZeeplevel){return;}

    if(controls.updateValue.val().trim() == "")
    {
        window.alert("Please fill in an update value!");
        return;
    }

    updateZeeplevelData(controls.searchColumn.val(), controls.searchValue.val(), controls.updateColumn.val(), controls.updateValue.val(), controls.operation.val());
}

function renderBlocksTable(blocks) 
{
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

    const data = blocks.map(block => {
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
            ...block.paints,
            ...block.options
        ];
    });

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
                limit: 20
            },
            search: false,
            sort: false,
        }).render(document.getElementById('table-container'));
    }
}

function onCellClickHandler(content, rowData, columnData) {
    let cellContent = content;
    let column = columnData.id;
    controls.searchColumn.val(column);
    controls.searchValue.val(cellContent);
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