+++
title = 'Zquence WIP'
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

<style>
        #app-container {
            background-color: #333333;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }

        #top-bar {
            background-color: #333333;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            box-sizing: border-box;
            border-bottom: 4px solid #555555;
            display:flex;
            flex-direction:row;
        }

        .top-bar-section
        {
            display:flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            border-right: 4px solid #555555;
            padding-right: 10px;
            color: white;    
        }

        .top-bar-section label{
            padding-left: 10px;
        }

        .sq_toolbar_menuButton
        {
            height: 40px;
            box-sizing: border-box;
            line-height: 40px;
            font-size: 20px;
            width: 100px;
            background-color: #555555;
            text-align: center;
            color: white;
            border-radius: 4px;
            margin-left: 10px;
            user-select: none;
        }

        .sq_toolbar_menuButton:hover
        {
            background-color: #777777;
            cursor: pointer;
        }

        .sq_toolbar_instrumentButton
        {
            height: 40px;
            width: 40px;
            margin-left: 10px;
            box-sizing: border-box;
            background-color: #555555;
            user-select: none;
            position: relative;
        }

        .sq_toolbar_instrumentButton:hover
        {
            cursor:pointer;
            background-color: #777777;
        }

        .sq_toolbar_instrumentButton_image
        {
            width: 36px;
            height: 36px;
            padding: 2px;
        }

        .sq_toolbar_instrumentButton_plus
        {
            position: absolute;
            width: 24px;
            height: 24px;
            font-size: 32px;
            line-height: 24px;
            text-align:center;
            font-weight: 600;
            bottom: 0;
            right: 0;
            color: white;
        }

        .sq_toolbar_controlButton
        {
            height: 40px;
            width: 40px;
            margin-left: 10px;
            box-sizing: border-box;
            background-color: #555555;
            user-select: none;
            position: relative;
            border-radius: 4px;
            user-select: none;
        }

        .sq_toolbar_controlButton:hover
        {
            background-color: #777777;
            cursor: pointer;
        }

        .sq_toolbar_controlButton_image
        {
            width: 36px;
            height: 36px;
            padding: 2px;
        }

        /* Main container to hold the track list and sequencer */
        #main-container {
            position: absolute;
            top: 60px;
            bottom: 0;
            left: 0;
            right: 0;
        }

        /* Track list on the left */
        #track-list {
            background-color: #333333;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 20%;
            box-sizing: border-box;
            border-right: 4px solid #555555;
            padding: 8px;
        }

        .sq_tracklist_entry
        {
            border-radius: 4px;
            box-sizing: border-box;
            background-color: #555555;
            color: white;
            padding: 8px;
            user-select: none;
            line-height: 30px;
            display: flex;
            flex-direction: row;
            margin-bottom: 8px;
        }

        .sq_tracklist_entry:hover
        {
            background-color: #777777;
            cursor: pointer;    
        }

        .sq_tracklist_entry_image
        {
            width: 30px;
            height: 30px;
        }

        .sq_tracklist_entry_name
        {
            line-height: 30px;
            font-size: 30px;
            padding-left: 16px;
            flex: 1;
        }

        .sq_tracklist_entry_closeButton
        {
            width: 30px;
            height: 30px;
            line-height: 30px;
            background-color: red;
            color: white;
            font-size: 30px;
            border-radius: 4px;
            text-align: center;
        }

        .sq_tracklist_entry_closeButton:hover
        {
            background-color: orange;
        }


        /* Sequencer container on the right */
        #sequencer {     
            position: absolute;
            top: 0px;
            left: 20%;
            right: 0px;
            bottom: 0px;
        }

        /* Table styles */
        table {
            border-collapse: collapse; /* Remove space between cells */
            table-layout: fixed; /* Enforce fixed size for cells */
            width: max-content; /* Allow the table to expand naturally based on its content */
        }

        /* Table cells */
        th, td {
            width: 30px; /* Fixed width for each cell */
            height: 30px; /* Fixed height for each cell */
            border: 1px solid #444; /* Light grey grid lines */
            text-align: center;
            box-sizing: border-box; /* Include padding and border in the element's total width and height */
            background-color: #3c3c3c; /* Darker background for cells */
            transition: background-color 0.2s; /* Smooth transition for background changes */
        }

        td.active {
            background-color: rgb(251,199,25); /* Green for active note cells */
            /*border-radius: 10px; *//* Rounded corners for note cells */
        }

        /* Instrument list items */
        .instrument-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            margin: 5px 0;
            background-color: #444; /* Dark background for list items */
            cursor: pointer;
            border-radius: 5px; /* Rounded corners for track list items */
            color: #ddd; /* Light grey text */
        }

        .instrument-item:hover {
            background-color: #555; /* Lighter background on hover */
        }

        .instrument-item.active {
            background-color: #666; /* Highlight the selected track */
        }

        .keyboard {
            position: absolute;
            top: 0;
            left: 0;
        }

        .keyboardKey {
            width: 60px;
            height: 30px;
            border: 1px solid grey;
            box-sizing: border-box;
        }

        .keyboardKey:hover {
            background-color: grey !important;
            color: white !important;
            cursor: pointer;
        }

        .trackView {
            position: absolute;
            left: 60px;
            right: 0px;
            top: 0;
            overflow-x: scroll;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            #top-bar button,
            #top-bar input,
            #top-bar select {
                padding: 3px;
                font-size: 0.8rem;
            }

            th, td {
                width: 30px;
                height: 30px;
            }
        }
    </style>

<script type="module">
        import { Soundfont, getSoundfontNames } from "https://unpkg.com/smplr/dist/index.mjs"; // needs to be a url
        import { toolkist } from "/toolkist/toolkist.js";
        console.log(getSoundfontNames());
        const context = new AudioContext(); // create the audio context

        const piano = new Soundfont(context, { instrument: "electric_grand_piano", decayTime: 0.1  });
        const flute = new Soundfont(context, {instrument: "flute"});
        const trumpet = new Soundfont(context, {instrument: "muted_trumpet"});
        const kazoo = new Soundfont(context, {instrument: "oboe"});
        const blarghl = new Soundfont(context, {instrument: "choir_aahs"});

        class StepSequencer {
            constructor() {
                this.tracks = [];
                this.selectedTrack = -1;
                this.bars = 1;
                this.notesPerBar = 4;
                this.cells = [];
                this.keyboardKeys = [
                    { name: "B3", note: 24 }, { name: "A3#", note: 23 }, { name: "A3", note: 22 }, { name: "G3#", note: 21 },
                    { name: "G3", note: 20 }, { name: "F3#", note: 19 }, { name: "F3", note: 18 }, { name: "E3", note: 17 },
                    { name: "D3#", note: 16 }, { name: "D3", note: 15 }, { name: "C3#", note: 14 }, { name: "C3", note: 13 },
                    { name: "B2", note: 12 }, { name: "A2#", note: 11 }, { name: "A2", note: 10 }, { name: "G2#", note: 9 },
                    { name: "G2", note: 8 }, { name: "F2#", note: 7 }, { name: "F2", note: 6 }, { name: "E2", note: 5 },
                    { name: "D2#", note: 4 }, { name: "D2", note: 3 }, { name: "C2#", note: 2 }, { name: "C2", note: 1 }
                ];
                this.isPlaying = false; // To keep track of playback state
                this.currentStep = 0; // To track the current step being played
                this.intervalId = null; // To store the interval ID for playback

                this.initialize();
            }

            initialize() {
                $('#play-button').on('click', () => this.play());
                $('#pause-button').on('click', () => this.pause());
                $('#add-bar-button').on('click', () => this.addBar());
                $('#remove-bar-button').on('click', () => this.removeBar());

                $('#add-piano-button').on('click', () => this.addInstrumentTrack('Piano'));
                $('#add-trumpet-button').on('click', () => this.addInstrumentTrack('Trumpet'));
                $('#add-flute-button').on('click', () => this.addInstrumentTrack('Flute'));
                $('#add-kazoo-button').on('click', () => this.addInstrumentTrack('Kazoo'));
                $('#add-blarghl-button').on('click', () => this.addInstrumentTrack('Blarghl'));

                $('#notesPerBarSelection').on('change', () => this.setNotesPerBar($('#notesPerBarSelection').val()));

                $('#save-button').on('click', () => this.save());
                $('#load-button').on('click', () => $('#load-file').click());
                $('#load-file').on('change', (event) => this.load(event));
                $('#export-button').on('click', () => this.exportToZeeplevel());
            }

            setNotesPerBar(amount) {
                this.notesPerBar = amount;
                this.updateTracks();
            }

            createBar() {
                let bar = [];
                for (let i = 0; i < 32; i++) {
                    bar[i] = [];
                }
                return bar;
            }

            addInstrumentTrack(instrumentType) {
                const trackIndex = this.tracks.length;

                const listItem = $('<div>').addClass('sq_tracklist_entry').on('click', () => this.selectTrack(trackIndex));
                const icon = $('<img>').addClass('sq_tracklist_entry_image').attr({src: "/" + instrumentType.toLowerCase() + ".png"});
                const name = $("<span>").addClass('sq_tracklist_entry_name').text(instrumentType.toUpperCase());
                const remove = $("<div>").addClass('sq_tracklist_entry_closeButton').text("X").on('click', (e) => { 
                    e.stopPropagation(); 
                    this.removeTrack(trackIndex); 
                });
                listItem.append(icon, name, remove); 

                $('#track-list').append(listItem);

                const track = {
                    instrument: instrumentType,
                    element: listItem,
                    bars: []
                };

                for (let i = 0; i < this.bars; i++) {
                    track.bars.push(this.createBar());
                }
                this.tracks.push(track);

                this.selectTrack(trackIndex);
            }

            removeTrack(index) {
                if (index >= 0 && index < this.tracks.length) {
                    // Check if the track has any notes
                    let trackHasNotes = false;
                    const track = this.tracks[index];
                    for (let bar of track.bars) {
                        for (let column of bar) {
                            if (column.length > 0) {
                                trackHasNotes = true;
                                break;
                            }
                        }
                        if (trackHasNotes) break;
                    }

                    // If track has notes, show a confirmation message
                    if (trackHasNotes) {
                        const confirmDelete = window.confirm("This track contains notes. Are you sure you want to delete it?");
                        if (!confirmDelete) return;
                    }

                    // Proceed with removing the track
                    track.element.remove();
                    this.tracks.splice(index, 1);
                    
                    // Update the indices for the remaining tracks
                    this.tracks.forEach((track, i) => {
                        track.element.off('click').on('click', () => this.selectTrack(i));
                        track.element.find('.sq_tracklist_entry_closeButton').off('click').on('click', (e) => {
                            e.stopPropagation();
                            this.removeTrack(i);
                        });
                    });

                    if (this.selectedTrack === index) {
                        this.selectedTrack = -1;
                    } else if (this.selectedTrack > index) {
                        this.selectedTrack--;
                    }

                    this.updateTracks();
                }
            }


            addBar() {
                this.bars++;
                for (let i = 0; i < this.tracks.length; i++) {
                    if (this.tracks[i].bars.length < this.bars) {
                        this.tracks[i].bars.push(this.createBar());
                    }
                }
                this.updateTracks();
            }

            removeBar() {
                if (this.bars <= 1) {
                    return;
                }

                let barContainsNotes = false;

                for (let i = 0; i < this.tracks.length; i++) {
                    let lastBarIndex = this.bars - 1;
                    if (this.tracks[i].bars.length > lastBarIndex) {
                        for (let c = 0; c < 32; c++) {
                            if (this.tracks[i].bars[lastBarIndex][c].length > 0) {
                                barContainsNotes = true;
                                break;
                            }
                        }
                    }
                    if (barContainsNotes) {
                        break;
                    }
                }

                let removeBar = true;

                if (barContainsNotes) {
                    removeBar = window.confirm("There are bars containing notes, are you sure you want to continue?");
                }

                if (removeBar) {
                    for (let i = 0; i < this.tracks.length; i++) {
                        if (this.tracks[i].bars.length > 0) {
                            this.tracks[i].bars.pop();
                        }
                    }
                    this.bars--;
                }
                this.updateTracks();
            }

            selectTrack(index) {
                if (this.selectedTrack !== -1) {
                    this.tracks[this.selectedTrack].element.removeClass('active');
                }

                this.selectedTrack = index;
                this.tracks[this.selectedTrack].element.addClass('active');
                this.updateTracks();
            }

            setTrackNote(trackIndex, bar, column, note) {
                let noteIndex = this.tracks[trackIndex].bars[bar][column].indexOf(note);

                if (noteIndex !== -1) {
                    this.tracks[trackIndex].bars[bar][column].splice(noteIndex, 1);
                } else {
                    this.tracks[trackIndex].bars[bar][column].push(note);
                }

                this.updateCell(trackIndex, bar, column, note);
            }

            updateCell(trackIndex, bar, column, note) {
                const cell = this.cells[trackIndex][bar][column][note];
                if (!cell) return;

                if (this.tracks[trackIndex].bars[bar][column].includes(note)) {
                    cell.removeClass('inactive').addClass('active');
                    this.playSound(this.tracks[trackIndex].instrument, note + 1);
                } else {
                    cell.removeClass('active').addClass('inactive');
                }
            }

            createKeyboard(instrument) {
                const keyboard = $('<div>').addClass('keyboard');
                
                for(let i = 0; i < 24; i++) {
                    const keyboardKey = $('<div>').addClass("keyboardKey").text(this.keyboardKeys[i].name);
                    if(this.keyboardKeys[i].name.includes("#")) {
                        keyboardKey.css({backgroundColor: 'black', color: 'white'});
                    } else {
                        keyboardKey.css({backgroundColor: 'white', color: 'black'});
                    }

                    keyboardKey.on('click', () => {
                        this.playSound(instrument, this.keyboardKeys[i].note)
                    })
                    keyboard.append(keyboardKey);                    
                }

                return keyboard;
            }

            playSound(instrument, note) {
                context.resume(); // enable audio context after a user interaction
                const now = context.currentTime;

                switch(instrument) {
                    case "Piano":
                        piano.start({ note: (note + 35), time: now, duration: 0.5 });
                        break;
                    case "Trumpet":
                        trumpet.start({ note: (note + 35), time: now, duration: 0.5 });
                        break;
                    case "Flute":
                        flute.start({ note: (note + 35), time: now, duration: 0.5 });
                        break;
                    case "Kazoo":
                        kazoo.start({ note: (note + 35), time: now, duration: 0.5 });
                        break;
                    case "Blarghl":
                        blarghl.start({ note: (note + 35), time: now, duration: 0.5 });
                        break;
                }
            }

            updateTracks() {
                $('#sequencer').html(""); // Clear the existing content
                if (this.selectedTrack !== -1) {
                    $('#sequencer').append(this.createKeyboard(this.tracks[this.selectedTrack].instrument));
                }
                const trackView = $('<div>').addClass('trackView');
                $('#sequencer').append(trackView);

                this.cells = [];

                if (this.selectedTrack !== -1) {
                    const openedTrack = this.tracks[this.selectedTrack];

                    const table = $('<table>');
                    for (let n = 23; n >= 0; n--) {
                        const row = $('<tr>');
                        for (let b = 0; b < this.bars; b++) {
                            const iterationStep = 32 / this.notesPerBar;
                            for (let c = 0; c < 32; c += iterationStep) {
                                const cell = $('<td>')
                                    .addClass(openedTrack.bars[b][c].includes(n) ? 'active' : 'inactive')
                                    .on('click', () => this.setTrackNote(this.selectedTrack, b, c, n));

                                if ((c / iterationStep) % this.notesPerBar === this.notesPerBar - 1) {
                                    cell.css('border-right', '2px solid #888');
                                }

                                if (!this.cells[this.selectedTrack]) {
                                    this.cells[this.selectedTrack] = [];
                                }
                                if (!this.cells[this.selectedTrack][b]) {
                                    this.cells[this.selectedTrack][b] = [];
                                }
                                if (!this.cells[this.selectedTrack][b][c]) {
                                    this.cells[this.selectedTrack][b][c] = [];
                                }
                                this.cells[this.selectedTrack][b][c][n] = cell;

                                row.append(cell);
                            }
                        }
                        table.append(row);
                    }
                    trackView.append(table);
                }
            }

            play() {
                if (this.isPlaying) return; // Prevent multiple play triggers

                this.isPlaying = true;
                this.currentStep = 0;

                // Calculate the interval based on BPM and notes per bar
                const bpm = parseInt($('#bpm-input').val()) || 120;
                const notesPerBar = this.notesPerBar;
                const intervalDuration = (60 / bpm) / (notesPerBar / 4) * 1000; // milliseconds

                this.intervalId = setInterval(() => {
                    this.playCurrentStep();
                    this.currentStep++;

                    if (this.currentStep >= this.bars * this.notesPerBar) {
                        this.currentStep = 0; // Loop back to the start
                    }
                }, intervalDuration);
            }

            playCurrentStep() {
                const step = this.currentStep;
                const barIndex = Math.floor(step / this.notesPerBar);
                const columnIndex = (step % this.notesPerBar) * (32 / this.notesPerBar);

                for (let track of this.tracks) {
                    if (track.bars[barIndex] && track.bars[barIndex][columnIndex]) {
                        for (let note of track.bars[barIndex][columnIndex]) {
                            this.playSound(track.instrument, note + 1);
                        }
                    }
                }
            }

            pause() {
                this.isPlaying = false;
                clearInterval(this.intervalId);
            }

            exportData() {
                return {
                    bpm: parseInt($('#bpm-input').val()) || 120,
                    bars: this.bars,
                    notesPerBar: this.notesPerBar,
                    tracks: this.tracks.map(track => ({
                        instrument: track.instrument,
                        bars: track.bars
                    }))
                };
            }

            save() {
                const data = this.exportData();
                const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'sequencer_data.json';
                a.click();
                URL.revokeObjectURL(url);
            }

            load(event) {
                const file = event.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = JSON.parse(e.target.result);
                    this.bars = data.bars;
                    this.notesPerBar = data.notesPerBar;
                    $('#bpm-input').val(data.bpm);
                    
                    this.tracks = data.tracks.map((track, index) => {

                            const listItem = $('<div>').addClass('sq_tracklist_entry').on('click', () => this.selectTrack(index));
                            const icon = $('<img>').addClass('sq_tracklist_entry_image').attr({src: "/" + track.instrument.toLowerCase() + ".png"});
                            const name = $("<span>").addClass('sq_tracklist_entry_name').text(track.instrument.toUpperCase());
                            const remove = $("<div>").addClass('sq_tracklist_entry_closeButton').text("X").on('click', (e) => { 
                                e.stopPropagation(); 
                                this.removeTrack(index); 
                            });
                            listItem.append(icon, name, remove); 

                        $('#track-list').append(listItem);
                        
                        return {
                            instrument: track.instrument,
                            element: listItem,
                            bars: track.bars
                        };
                    });

                    this.updateTracks();
                };
                reader.readAsText(file);
            }

            exportCircleZeeplevel()
            {
                // Get the target speed (units per second)
                let targetSpeed = parseFloat($('#targetspeed-input').val()) / 3.6;

                // Get the data from the bars
                let trackData = this.exportData();

                // Calculate the required sections
                let sections = trackData.bars * trackData.notesPerBar;

                // Calculate the time per beat (seconds per beat)
                let bpm = trackData.bpm;
                let secondsPerBeat = 60 / bpm;

                // Calculate the total time for one revolution (one full loop of the ring)
                let totalRevolutionTime = secondsPerBeat * sections;

                // Calculate the circumference of the ring
                let circumference = targetSpeed * totalRevolutionTime;

                // Calculate the radius of the ring (C = 2πr)
                let radius = circumference / (2 * Math.PI);

                // Calculate the angle per section
                let anglePerSection = 360 / sections;

                // Array to hold the notes with their positions and angles
                let notesWithPositions = [];

                // Iterate through the tracks and calculate positions for each note
                trackData.tracks.forEach(track => {
                    track.bars.forEach((bar, barIndex) => {
                        for (let columnIndex = 0; columnIndex < 32; columnIndex += (32 / trackData.notesPerBar)) {
                            const noteColumnIndex = columnIndex / (32 / trackData.notesPerBar);
                            const column = bar[columnIndex];
                            column.forEach(note => {
                                console.log(track, barIndex, noteColumnIndex);
                                let sectionIndex = barIndex * trackData.notesPerBar + noteColumnIndex;
                                let angle = sectionIndex * anglePerSection;
                                let radians = angle * (Math.PI / 180);
                                let x = radius * Math.cos(radians);
                                let y = radius * Math.sin(radians);

                                // Euler rotation (assuming 2D, only around Z-axis)
                                let eulerRotation = radians * 57.2957795;

                                notesWithPositions.push({
                                    instrument: track.instrument,
                                    note: note,
                                    position: { x: x, y: y },
                                    angle: angle, // Angle in degrees
                                    eulerRotation: eulerRotation  // Rotation in radians
                                });
                            });
                        }
                    });
                });

                console.log(radius)
                console.log(notesWithPositions);

                let zeeplevel = new toolkist.game.Zeeplevel();
                
                notesWithPositions.forEach((nwp) => {
                    let block = new toolkist.game.Block();
                    block.blockID = 2279;
                    block.scale.x = radius / 32;
                    block.scale.y = 1;
                    block.scale.z = 0.002;
                    block.position.x = nwp.position.x;
                    block.position.z = nwp.position.y;
                    block.position.y = 0;
                    block.euler.y = -nwp.eulerRotation;
                    block.options[0] = 1;
                    switch(nwp.instrument)
                    {
                        case "Piano":  block.options[6] = 0; break;
                        case "Trumpet":  block.options[6] = 1; break;
                        case "Flute":  block.options[6] = 2; break;
                        case "Kazoo":  block.options[6] = 3; break;
                        case "Blarghl":  block.options[6] = 4; break;
                    }
                   
                    block.options[8] = nwp.note;
                    zeeplevel.AddBlock(block);
                });

                for(let i = 0; i < 4; i++)
                {
                    let block = new toolkist.game.Block();
                    block.blockID = 377;

                    block.position.x = radius / 1.75;
                    block.position.z = radius / 1.75;
                    block.euler.y = i * 90;

                    switch(i)
                    {
                        case 1: 
                            block.position.z *= -1;
                            break;
                        case 2: 
                            block.position.x *= -1;
                            block.position.z *= -1;
                            break;
                        case 3: 
                            block.position.x *= -1;
                            break;
                    }

                    block.scale.x = radius / 14;
                    block.scale.y = radius / 14;
                    block.scale.z = radius / 14;

                    block.paints[0] = 350;
                    block.paints[1] = 350;
                    block.paints[2] = 350;
                    block.options[0] = 1;
                    zeeplevel.AddBlock(block);
                }

                let omni = new toolkist.game.Block();
                omni.blockID = 1545;
                let omniScaleValue = (radius / 14) * 2 + 0.5;
                omni.scale.x = omniScaleValue;
                omni.scale.y = omniScaleValue;
                omni.scale.z = omniScaleValue;
                omni.position.y = omniScaleValue * 2;
                omni.options[9] = parseFloat($('#targetspeed-input').val());
                omni.options[7] = 5;

                zeeplevel.AddBlock(omni);

                console.log(zeeplevel.ToCSV());      
                
                toolkist.fs.DirectDownload("zquence_circle.zeeplevel", zeeplevel.ToCSV());
            }

            exportLineZeeplevel()
            {
                // Get the target speed (units per second)
                let targetSpeed = parseFloat($('#targetspeed-input').val()) / 3.6;

                // Get the data from the bars
                let trackData = this.exportData();

                // Calculate the time per beat (seconds per beat)
                let bpm = trackData.bpm;
                let secondsPerBeat = 60 / bpm;

                // Calculate the distance per beat (units per beat)
                let distancePerBeat = targetSpeed * secondsPerBeat;

                // Array to hold the notes with their positions and angles
                let notesWithPositions = [];

                // Iterate through the tracks and calculate positions for each note
                trackData.tracks.forEach(track => {
                    track.bars.forEach((bar, barIndex) => {
                        for (let columnIndex = 0; columnIndex < 32; columnIndex += (32 / trackData.notesPerBar)) {
                            const noteColumnIndex = columnIndex / (32 / trackData.notesPerBar);
                            const column = bar[columnIndex];
                            column.forEach(note => {
                                console.log(track, barIndex, noteColumnIndex);
                                let sectionIndex = barIndex * trackData.notesPerBar + noteColumnIndex;
                                let x = sectionIndex * distancePerBeat;
                                let y = 0; // All notes on the same line (y = 0)

                                notesWithPositions.push({
                                    instrument: track.instrument,
                                    note: note,
                                    position: { x: x, y: y },
                                    sectionIndex: sectionIndex,
                                    distanceFromStart: x
                                });
                            });
                        }
                    });
                });

                console.log(notesWithPositions);

                let zeeplevel = new toolkist.game.Zeeplevel();
                
                notesWithPositions.forEach((nwp) => {
                    let block = new toolkist.game.Block();
                    block.blockID = 2279;
                    block.scale.x = 1
                    block.scale.y = 1;
                    block.scale.z = 0.002;
                    block.position.z = nwp.position.x;
                    block.options[0] = 1;
                    switch(nwp.instrument)
                    {
                        case "Piano":  block.options[6] = 0; break;
                        case "Trumpet":  block.options[6] = 1; break;
                        case "Flute":  block.options[6] = 2; break;
                        case "Kazoo":  block.options[6] = 3; break;
                        case "Blarghl":  block.options[6] = 4; break;
                    }
                   
                    block.options[8] = nwp.note;
                    zeeplevel.AddBlock(block);
                });                

                console.log(zeeplevel.ToCSV());    
                
                toolkist.fs.DirectDownload("zquence_line.zeeplevel", zeeplevel.ToCSV());
            }

            exportToZeeplevel() 
            {
                let exportType = $("#exportType").val();               

                if(exportType == "circle"){
                    this.exportCircleZeeplevel();
                }
                else
                {
                    this.exportLineZeeplevel();                    
                }
            }
        }

        $(document).ready(() => {
            const sequencer = new StepSequencer();
        });
    </script>

<div id="content" class='flex_content'>
    <div class='standardPagePanel'>
        <div id="app-container">    
            <div id="top-bar">
                <div class="top-bar-section">
                    <div class="sq_toolbar_menuButton" id="save-button">Save</div>
                    <div class="sq_toolbar_menuButton" id="load-button">Load</div>
                    <input type="file" id="load-file" style="display: none;">
                </div>

                <div class="top-bar-section">
                    <div id="add-piano-button" class="sq_toolbar_instrumentButton"><img class="sq_toolbar_instrumentButton_image" src="/piano.png"></img><span class="sq_toolbar_instrumentButton_plus">+</span></div>
                    <div id="add-trumpet-button" class="sq_toolbar_instrumentButton"><img class="sq_toolbar_instrumentButton_image" src="/trumpet.png"></img><span class="sq_toolbar_instrumentButton_plus">+</span></div>
                    <div id="add-flute-button" class="sq_toolbar_instrumentButton"><img class="sq_toolbar_instrumentButton_image" src="/flute.png"></img><span class="sq_toolbar_instrumentButton_plus">+</span></div>
                    <div id="add-kazoo-button" class="sq_toolbar_instrumentButton"><img class="sq_toolbar_instrumentButton_image" src="/kazoo.png"></img><span class="sq_toolbar_instrumentButton_plus">+</span></div>
                    <div id="add-blarghl-button" class="sq_toolbar_instrumentButton"><img class="sq_toolbar_instrumentButton_image" src="/blarghl.png"></img><span class="sq_toolbar_instrumentButton_plus">+</span></div>
                </div>

                <div class="top-bar-section">
                    <div class="sq_toolbar_controlButton" id="play-button"><img class="sq_toolbar_controlButton_image" src="/play.png"></img></div>
                    <div class="sq_toolbar_controlButton" id="pause-button"><img class="sq_toolbar_controlButton_image" src="/stop.png"></div>
                    <label for="bpm-input"> BPM: </label>
                    <input id="bpm-input" type="number" min="30" max="300" value="120" placeholder="BPM">
                    <label for="notesPerBarSelection"> Notes/Bar: </label><select id="notesPerBarSelection"><option value="4">4</option><option value="8">8</option><option value="16">16</option><option value="32">32</option></select>                
                    <div id="remove-bar-button"class="sq_toolbar_menuButton">Bar -</div>
                    <div id="add-bar-button" class="sq_toolbar_menuButton">Bar +</div>
                </div>   
                <div class="top-bar-section">
                    <label for="targetspeed-input"> Target Speed: </label>
                    <input id="targetspeed-input" type="number" min="20" value="60" placeholder="TargetSpeed">
                    <label for="exportType"> Export Type: </label><select id="exportType"><option value="circle">Circle</option><option value="line">Line</option></select> 
                    <div class="sq_toolbar_menuButton" id="export-button">Export</div>
                </div>
                
            </div>
            <div id="main-container">
                <div id="track-list"></div>
                <div id="sequencer"></div>
            </div>
        </div>
    </div>
</div>
{{</rawhtml>}}
