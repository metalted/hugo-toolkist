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

    .gridjs-tr td:active {
        background-color: #999999;
    }

    /* Specific styles for the first 10 columns */
    .gridjs-tr td:nth-child(n+2):nth-child(-n+10) {
        max-width: 60px !important; /* Constrain the width */
        width: 60px;
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
        margin-bottom: 3px;
    }

    .form-group label {
        width: 250px;
        display: inline-block;
    }

    .form-group input {
        width: 250px;
        display: inline-block;
        box-sizing: border-box;
    }

    .form-group select {
        width: 250px;
        display: inline-block;
    }

    .standardButton {
        width: calc(100% - 12px);
        margin-left: 6px;
        margin-right: 6px;
        margin-bottom: 6px;
        box-sizing: border-box;
        text-align: center;
    }

    .formButton {
        display: inline-block;
        padding: 8px 12px;
        background-color: rgb(251, 199, 25);
        color: rgb(17, 17, 17);
        border: none;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.1s ease-in-out;
        font-family: 'Righteous';
        font-weight: 300;
        font-size: 18px;
    }`

    .formButton:hover
    {
        background-color: rgb(239, 107, 35) !important;
        cursor: pointer;
    }

    .form{
        background-color: #222222;
        color: rgb(251,199,25);
        padding: 6px;
    }

    h1{
        font-size: 28px;
        padding: 6px;
        color: rgb(251, 199, 25);
    }

    #uuidInput, #authorInput{
        width: 500px;
    }
</style>
<script src='https://unpkg.com/gridjs/dist/gridjs.umd.js'></script>
<script type="module" src='/toolkist/zeepleveleditor.pages.toolkist.js'></script>

<div id='content' class='flex_content'>
    <div class='standardLeftPanel'></div>
    <div class='standardPagePanel'>
        <h1>Header</h1>
        <div id="headerContainer" class='form'>
            <div class="form-group">
                <label for="authorInput">Author(s)</label>
                <input type='text' id='authorInput'></input>
                <button id='trySetAuthorButton'>Set</button>
            </div>
            <div class="form-group">
                <label for="uuidInput">UUID</label>
                <input type='text' id='uuidInput' readonly></input>
            </div>
            <br>
            <div class="form-group">
                <label for="authorTimeInput">Author Time (s)</label>
                <input type='number' id='authorTimeInput'></input>
                <button id='trySetAuthorTimeButton'>Set</button>
            </div>
            <div class="form-group">
                <label for="goldTimeInput">Gold Time</label>
                <input type='text' id='goldTimeInput' readonly></input>
            </div>
            <div class="form-group">
                <label for="silverTimeInput">Silver Time</label>
                <input type='text' id='silverTimeInput' readonly></input>
            </div>
            <div class="form-group">
                <label for="bronzeTimeInput">Bronze Time</label>
                <input type='text' id='bronzeTimeInput' readonly></input>
            </div>            
        </div>
        <h1>Blocks</h1>
        <form id="editForm" class='form'>
            <div class="form-group">
                <label for="searchColumn">Select Column to Search:</label>
                <select id="searchColumn" required>
                    <option value="id">ID</option>
                    <option value="position.x">Px</option>
                    <option value="position.y">Py</option>
                    <option value="position.z">Pz</option>
                    <option value="euler.x">Rx</option>
                    <option value="euler.y">Ry</option>
                    <option value="euler.z">Rz</option>
                    <option value="scale.x">Sx</option>
                    <option value="scale.y">Sy</option>
                    <option value="scale.z">Sz</option>
                    <option value="paints.0">M1</option>
                    <option value="paints.1">M2</option>
                    <option value="paints.2">M3</option>
                    <option value="paints.3">M4</option>
                    <option value="paints.4">M5</option>
                    <option value="paints.5">M6</option>
                    <option value="paints.6">M7</option>
                    <option value="paints.7">M8</option>
                    <option value="paints.8">M9</option>
                    <option value="paints.9">M10</option>
                    <option value="paints.10">M11</option>
                    <option value="paints.11">M12</option>
                    <option value="paints.12">M13</option>
                    <option value="paints.13">M14</option>
                    <option value="paints.14">M15</option>
                    <option value="paints.15">M16</option>
                    <option value="paints.16">M17</option>
                    <option value="options.0">O1</option>
                    <option value="options.1">O2</option>
                    <option value="options.2">O3</option>
                    <option value="options.3">O4</option>
                    <option value="options.4">O5</option>
                    <option value="options.5">O6</option>
                    <option value="options.6">O7</option>
                    <option value="options.7">O8</option>
                    <option value="options.8">O9</option>
                    <option value="options.9">O10</option>
                    <option value="options.10">O11</option>
                </select>
            </div>
            <div class="form-group">
                <label for="searchValue">Search Value:</label>
                <input type="number" id="searchValue" placeholder="All">
            </div>
            <br>
            <div class="form-group">
                <label for="updateColumn">Select Column to Update:</label>
                <select id="updateColumn" required>
                    <option value="id">ID</option>
                    <option value="position.x">Px</option>
                    <option value="position.y">Py</option>
                    <option value="position.z">Pz</option>
                    <option value="euler.x">Rx</option>
                    <option value="euler.y">Ry</option>
                    <option value="euler.z">Rz</option>
                    <option value="scale.x">Sx</option>
                    <option value="scale.y">Sy</option>
                    <option value="scale.z">Sz</option>
                    <option value="paints.0">M1</option>
                    <option value="paints.1">M2</option>
                    <option value="paints.2">M3</option>
                    <option value="paints.3">M4</option>
                    <option value="paints.4">M5</option>
                    <option value="paints.5">M6</option>
                    <option value="paints.6">M7</option>
                    <option value="paints.7">M8</option>
                    <option value="paints.8">M9</option>
                    <option value="paints.9">M10</option>
                    <option value="paints.10">M11</option>
                    <option value="paints.11">M12</option>
                    <option value="paints.12">M13</option>
                    <option value="paints.13">M14</option>
                    <option value="paints.14">M15</option>
                    <option value="paints.15">M16</option>
                    <option value="paints.16">M17</option>
                    <option value="options.0">O1</option>
                    <option value="options.1">O2</option>
                    <option value="options.2">O3</option>
                    <option value="options.3">O4</option>
                    <option value="options.4">O5</option>
                    <option value="options.5">O6</option>
                    <option value="options.6">O7</option>
                    <option value="options.7">O8</option>
                    <option value="options.8">O9</option>
                    <option value="options.9">O10</option>
                    <option value="options.10">O11</option>
                </select>
            </div>
            <div class="form-group">
                <label for="updateValue">Update Value:</label>
                <input type="number" id="updateValue" required>
            </div>
            <br>
            <div class="form-group">
                <label for="updateOperation">Operation:</label>
                <select id="updateOperation" required>
                    <option value="set">Set</option>  
                    <option value="add">Add</option>                                      
                </select>
            </div>
            <button class='formButton' type="submit">Apply</button>
        </form>
        <br>
        <div id='table-container'></div>
    </div>
</div>
{{</rawhtml>}}
