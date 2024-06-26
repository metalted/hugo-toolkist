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
                const icon = $('<img>').addClass('sq_tracklist_entry_image').attr({src: "/" + instrumentType.toLowerCase() + ".png"}).on('click', (e) => {
                    e.stopPropagation();
                    this.showInstrumentPicker(trackIndex);
                });
                const name = $("<span>").addClass('sq_tracklist_entry_name').text(instrumentType.toUpperCase());
                const remove = $("<div>").addClass('sq_tracklist_entry_closeButton').text("X").on('click', (e) => { 
                    e.stopPropagation(); 
                    this.removeTrack(trackIndex); 
                });
                const mute = $("<div>").addClass('sq_tracklist_entry_muteButton').html($('<img>').attr({src: '/volume.png'})).on('click', (e) => {
                    e.stopPropagation();
                    this.toggleMuteTrack(trackIndex);
                });
                listItem.append(icon, name, mute, remove);

                $('#track-list').append(listItem);

                const track = {
                    instrument: instrumentType,
                    element: listItem,
                    bars: [],
                    muted: false
                };

                for (let i = 0; i < this.bars; i++) {
                    track.bars.push(this.createBar());
                }
                this.tracks.push(track);

                this.selectTrack(trackIndex);
            }

            toggleMuteTrack(index) {
                if (index >= 0 && index < this.tracks.length) 
                {
                    this.tracks[index].muted = !this.tracks[index].muted;
                    if(!this.tracks[index].muted)
                    {
                        this.tracks[index].element.find('.sq_tracklist_entry_muteButton').html($('<img>').attr({src: '/volume.png'}));
                    }
                    else
                    {
                        this.tracks[index].element.find('.sq_tracklist_entry_muteButton').html($('<img>').attr({src: '/mute.png'}));
                    }                   
                }
            }

            showInstrumentPicker(trackIndex) {
                // Create and show an overlay with instrument options
                const overlay = $('<div>').addClass('instrument-picker-overlay');
                const instrumentList = ['Piano', 'Trumpet', 'Flute', 'Kazoo', 'Blarghl']; // Add your instrument options here

                instrumentList.forEach(instrument => {
                    const instrumentOption = $('<div>').addClass('instrument-option').text(instrument).on('click', () => {
                        this.changeInstrument(trackIndex, instrument);
                        overlay.remove();
                    });
                    overlay.append(instrumentOption);
                });

                $('body').append(overlay);

                // Close the overlay when clicking outside of it
                overlay.on('click', (e) => {
                    if (e.target === overlay[0]) {
                        overlay.remove();
                    }
                });
            }

            changeInstrument(trackIndex, newInstrument) {
                if (trackIndex >= 0 && trackIndex < this.tracks.length) {
                    const track = this.tracks[trackIndex];
                    track.instrument = newInstrument;
                    track.element.find('.sq_tracklist_entry_image').attr({ src: "/" + newInstrument.toLowerCase() + ".png" });
                    track.element.find('.sq_tracklist_entry_name').text(newInstrument.toUpperCase());

                    // Check if the element has the 'active' class
                    if (track.element.hasClass('active')) {
                        this.selectTrack(trackIndex);
                    }
                }
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
                    if(!track.muted)
                    {
                        if (track.bars[barIndex] && track.bars[barIndex][columnIndex]) {
                            for (let note of track.bars[barIndex][columnIndex]) {
                                this.playSound(track.instrument, note + 1);
                            }
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

                let exportFileName = $('#exportName').val();
                if(exportFileName.trim() == "")
                {
                    exportFileName = "zquenceData.json";
                }
                else
                {
                    exportFileName += ".json";
                }

                a.download = exportFileName;
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
                            const icon = $('<img>').addClass('sq_tracklist_entry_image').attr({src: "/" + track.instrument.toLowerCase() + ".png"}).on('click', (e) => {
                                e.stopPropagation();
                                this.showInstrumentPicker(index);
                            });
                            const name = $("<span>").addClass('sq_tracklist_entry_name').text(track.instrument.toUpperCase());
                            const remove = $("<div>").addClass('sq_tracklist_entry_closeButton').text("X").on('click', (e) => { 
                                e.stopPropagation(); 
                                this.removeTrack(index); 
                            });
                            const mute = $("<div>").addClass('sq_tracklist_entry_muteButton').html($('<img>').attr({src: '/volume.png'})).on('click', (e) => {
                                e.stopPropagation();
                                this.toggleMuteTrack(index);
                            });
                            listItem.append(icon, name, mute, remove); 

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
                //Get the trackData
                let trackData = this.exportData();

                //Get the target speed from the input
                let targetSpeedInKph = parseFloat($('#targetspeed-input').val());

                //Convert the target speed into meters per second
                let targetSpeedInMs = targetSpeedInKph / 3.6;

                //Calculate the time required for 1 bar (60s/min time 4/4 time signature = 240)
                let secondsPerBar = 240 / trackData.bpm;

                //Calculate the distance required for 1 bar
                let metersPerBar = secondsPerBar * targetSpeedInMs;

                //Calculate the circumference of the circle by multiplying the required meters per bar by the amount of bars.
                let circumference = metersPerBar * trackData.bars;

                //Calculate the radius
                let radius = circumference / (2 * Math.PI);

                //Calculate the total amount of sectors in the circle (1 sector is 1 note)
                let sectors = trackData.bars * trackData.notesPerBar;

                //Calculate the angle between sectors
                let sectorAngle = 360 / sectors;

                //Variable for storing noteblockInfo
                let noteBlockInfo = [];

                //Iterate through the tracks and calculate positions for each note
                trackData.tracks.forEach(track => {
                    //Go over the bars of this track
                    track.bars.forEach((bar, barIndex) => {
                        //Iterate over the amount of notes per bar.
                        for(let npb = 0; npb < trackData.notesPerBar; npb++)
                        {
                            //We are only interested in every nth column, depending on how many notes per bar.
                            let columnIndex = npb * (32 / trackData.notesPerBar);
                            let column = bar[columnIndex];
                            column.forEach(note => {
                                //The index of the note on the circle.
                                let sectorIndex = barIndex * trackData.notesPerBar + npb;
                                //The angle this note makes
                                let angle = sectorIndex * sectorAngle;
                                //Calculate the radians of the angle.
                                let radians = angle * (Math.PI / 180);
                                //Calculate the position of this note
                                let x = (radius - 2) * Math.cos(radians);
                                let y = (radius - 2) * Math.sin(radians);
                                //Store the info
                                noteBlockInfo.push({
                                    instrument : track.instrument,
                                    note: note,
                                    position: {x:x, y:y},
                                    rotation: radians * 57.2957795
                                });
                            });
                        }
                    });
                });

                //Create a zeeplevel
                let zeeplevel = new toolkist.game.Zeeplevel();

                //Go over all the noteblocks info
                noteBlockInfo.forEach(nb => {
                    //Create a block
                    let block = new toolkist.game.Block();
                    //Set required info
                    block.blockID = 2279;
                    block.options[0] = 1;
                    //Set the position
                    block.position.x = nb.position.x;
                    block.position.z = nb.position.y;
                    //Set the rotation
                    block.euler.y = -nb.rotation;
                    //Set the scale
                    block.scale.x = 0.25;
                    block.scale.z = 0.01;
                    block.scale.y = 1;

                    //Set the instrument data
                    block.options[8] = nb.note;
                    switch(nb.instrument)
                    {
                        case "Piano":  block.options[6] = 0; break;
                        case "Trumpet":  block.options[6] = 1; break;
                        case "Flute":  block.options[6] = 2; break;
                        case "Kazoo":  block.options[6] = 3; break;
                        case "Blarghl":  block.options[6] = 4; break;
                    }

                    //Add the block to the zeeplevel
                    zeeplevel.AddBlock(block);                    
                });

                //Inner circumference of 4 quarter walls
                let innerCircumferenceWall = 2 * Math.PI * 14.4;
                //Required scale
                let requiredWallScale = circumference / innerCircumferenceWall;

                //Add the border of the circle
                for(let i = 0; i < 4; i++)
                {
                    //Create a new block
                    let block = new toolkist.game.Block();

                    //Set required info
                    block.blockID = 377;
                    block.paints[0] = 350;
                    block.paints[1] = 350;
                    block.paints[2] = 350;
                    block.options[0] = 1;

                    //Set the scale
                    block.scale.x = requiredWallScale;
                    block.scale.z = requiredWallScale;
                    block.scale.y = 1;
                    //Calculate the position based on the scale. Scale of 1 means the center point is at 8,8
                    let positionFromOrigin = requiredWallScale * 8;
                    block.position.x = positionFromOrigin;
                    block.position.z = positionFromOrigin;
                    //Set the rotation based on the index
                    block.euler.y = i * 90;
                    //Flip positions based on the index
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
                    
                    //Add the block to the level.
                    zeeplevel.AddBlock(block);
                }   

                //Create the omni booster
                let omni = new toolkist.game.Block();
                omni.blockID = 1545;
                omni.scale.x = requiredWallScale * 2 * (1 / 0.9);
                omni.scale.y = 1;
                omni.scale.z = requiredWallScale * 2 * (1 / 0.9);
                omni.position.y = -1.6;
                omni.options[9] = targetSpeedInKph;
                omni.options[7] = 5;
                zeeplevel.AddBlock(omni);

                //Create the base plate
                let basePlate = new toolkist.game.Block();
                basePlate.blockID = 1303;
                basePlate.scale.x = requiredWallScale * 2;
                basePlate.scale.z = requiredWallScale * 2;
                basePlate.scale.y = 0.001;
                basePlate.position.y = -4;
                basePlate.paints[0] = 350;
                zeeplevel.AddBlock(basePlate);

                console.log(zeeplevel.ToCSV());      
                
                let exportFileName = $('#exportName').val();
                if(exportFileName.trim() == "")
                {
                    exportFileName = "zquence.zeeplevel";
                }
                else
                {
                    exportFileName += ".zeeplevel";
                }

                toolkist.fs.DirectDownload(exportFileName, zeeplevel.ToCSV());
            }

            exportLineZeeplevel()
            {
                //Get the trackData
                let trackData = this.exportData();

                //Get the target speed from the input
                let targetSpeedInKph = parseFloat($('#targetspeed-input').val());

                //Convert the target speed into meters per second
                let targetSpeedInMs = targetSpeedInKph / 3.6;

                //Calculate the time required for 1 bar (60s/min time 4/4 time signature = 240)
                let secondsPerBar = 240 / trackData.bpm;

                //Calculate the distance required for 1 bar
                let metersPerBar = secondsPerBar * targetSpeedInMs;

                //Calculate the distance required for each note
                let metersPerNote = metersPerBar / trackData.notesPerBar;

                //Variable for storing noteblockInfo
                let noteBlockInfo = [];

                //Iterate through the tracks and calculate positions for each note
                trackData.tracks.forEach(track => {
                    //Go over the bars of this track
                    track.bars.forEach((bar, barIndex) => {
                        //Iterate over the amount of notes per bar.
                        for(let npb = 0; npb < trackData.notesPerBar; npb++)
                        {
                            //We are only interested in every nth column, depending on how many notes per bar.
                            let columnIndex = npb * (32 / trackData.notesPerBar);
                            let column = bar[columnIndex];
                            column.forEach(note => {
                                
                                //The index of the note on the circle.
                                let noteIndex = barIndex * trackData.notesPerBar + npb;

                                //Calculate the position of this note.
                                let z = noteIndex * metersPerNote;
                                
                                //Store the info
                                noteBlockInfo.push({
                                    instrument : track.instrument,
                                    note: note,
                                    position: z
                                });
                            });
                        }
                    });
                });

                let zeeplevel = new toolkist.game.Zeeplevel();
                
                noteBlockInfo.forEach((nb) => 
                {
                    let block = new toolkist.game.Block();
                    block.blockID = 2279;
                    block.scale.x = 1
                    block.scale.y = 1;
                    block.scale.z = 0.01;
                    block.position.z = nb.position;
                    block.options[0] = 1;
                    switch(nb.instrument)
                    {
                        case "Piano":  block.options[6] = 0; break;
                        case "Trumpet":  block.options[6] = 1; break;
                        case "Flute":  block.options[6] = 2; break;
                        case "Kazoo":  block.options[6] = 3; break;
                        case "Blarghl":  block.options[6] = 4; break;
                    }
                   
                    block.options[8] = nb.note;
                    zeeplevel.AddBlock(block);
                });     
                
                let totalDistance = metersPerBar * trackData.bars;

                let booster = new toolkist.game.Block();
                booster.blockID = 69;
                booster.scale.x = 1;
                booster.scale.y = 1;
                booster.scale.z = totalDistance / 16;
                booster.position.z = totalDistance / 2;
                booster.options[0] = 1;
                booster.options[1] = 1;
                booster.options[2] = 1;                
                booster.options[7] = 5;
                booster.options[9] = targetSpeedInKph;
                booster.paints[1] = 5;
                booster.paints[2] = 24;
                booster.paints[3] = 30;
                booster.paints[4] = 24;
                booster.paints[5] = 30;
                zeeplevel.AddBlock(booster);

                console.log(zeeplevel.ToCSV());    
                
                let exportFileName = $('#exportName').val();
                if(exportFileName.trim() == "")
                {
                    exportFileName = "zquence.zeeplevel";
                }
                else
                {
                    exportFileName += ".zeeplevel";
                }

                toolkist.fs.DirectDownload(exportFileName, zeeplevel.ToCSV());
            }
                
            exportRoadZeeplevel()
            {
                //Get the trackData
                let trackData = this.exportData();

                //Get the target speed from the input
                let targetSpeedInKph = parseFloat($('#targetspeed-input').val());

                //Convert the target speed into meters per second
                let targetSpeedInMs = targetSpeedInKph / 3.6;

                //Calculate the time required for 1 bar (60s/min time 4/4 time signature = 240)
                let secondsPerBar = 240 / trackData.bpm;

                //Calculate the distance required for 1 bar
                let metersPerBar = secondsPerBar * targetSpeedInMs;

                //Calculate the distance required for each note
                let metersPerNote = metersPerBar / trackData.notesPerBar;

                //Variable for storing noteblockInfo
                let noteBlockInfo = [];

                //Iterate through the tracks and calculate positions for each note
                trackData.tracks.forEach(track => {
                        //Go over the bars of this track
                        track.bars.forEach((bar, barIndex) => {
                            //Iterate over the amount of notes per bar.
                            for(let npb = 0; npb < trackData.notesPerBar; npb++)
                            {
                                //We are only interested in every nth column, depending on how many notes per bar.
                                let columnIndex = npb * (32 / trackData.notesPerBar);
                                let column = bar[columnIndex];
                                column.forEach(note => {
                                    
                                    //The index of the note on the circle.
                                    let noteIndex = barIndex * trackData.notesPerBar + npb;

                                    //Calculate the position of this note.
                                    let z = noteIndex * metersPerNote;
                                    
                                    //Store the info
                                    noteBlockInfo.push({
                                        instrument : track.instrument,
                                        note: note,
                                        position: z + 0.5 * metersPerNote
                                    });
                                });
                            }
                        });
                });

                let zeeplevel = new toolkist.game.Zeeplevel();
                
                noteBlockInfo.forEach((nb) => 
                {
                    let block = new toolkist.game.Block();
                    block.blockID = 2280;
                    block.scale.x = 1
                    block.scale.y = 1;
                    block.scale.z = metersPerNote / 16;
                    block.position.z = nb.position;
                    block.options[0] = 1;
                    block.paints[1] = 3;
                    block.paints[2] = 156;
                    block.paints[3] = 24;
                    block.paints[4] = 30;
                    block.paints[5] = 24;
                    block.paints[6] = 30;

                    switch(nb.instrument)
                    {
                        case "Piano":  block.options[6] = 0; break;
                        case "Trumpet":  block.options[6] = 1; break;
                        case "Flute":  block.options[6] = 2; break;
                        case "Kazoo":  block.options[6] = 3; break;
                        case "Blarghl":  block.options[6] = 4; break;
                    }
                   
                    block.options[8] = nb.note;
                    zeeplevel.AddBlock(block);
                });     
                
                let totalDistance = metersPerBar * trackData.bars;

                let booster = new toolkist.game.Block();
                booster.blockID = 69;
                booster.scale.x = 1;
                booster.scale.y = 1;
                booster.scale.z = totalDistance / 16;
                booster.position.z = totalDistance / 2;
                booster.position.y = 0.001;
                booster.options[0] = 1;
                booster.options[1] = 1;
                booster.options[2] = 1;                
                booster.options[7] = 5;
                booster.options[9] = targetSpeedInKph;
                booster.paints[1] = 5;
                booster.paints[2] = 24;
                booster.paints[3] = 30;
                booster.paints[4] = 24;
                booster.paints[5] = 30;
                zeeplevel.AddBlock(booster);

                console.log(zeeplevel.ToCSV());    
                
                let exportFileName = $('#exportName').val();
                if(exportFileName.trim() == "")
                {
                    exportFileName = "zquence.zeeplevel";
                }
                else
                {
                    exportFileName += ".zeeplevel";
                }

                toolkist.fs.DirectDownload(exportFileName, zeeplevel.ToCSV());
            }

            exportToZeeplevel() 
            {
                let exportType = $("#exportType").val();               

                if(exportType == "circle"){
                    this.exportCircleZeeplevel();
                }
                else if(exportType == "line")
                {
                    this.exportLineZeeplevel();                    
                }
                else if(exportType == "road")
                {
                    this.exportRoadZeeplevel();                    
                }
            }
        }

        $(document).ready(() => {
            const sequencer = new StepSequencer();
        });
    </script>

<style>
    /*Layout*/
    #app-container 
    {
        background-color: #333333;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: row;
    }

    #left-column-container
    {
        height: 100%;
        width: 25%;  
        display: flex;
        flex-direction: column;
    }

    #track-list-container
    {
        flex: 1;
        background-color: blue;

        display: flex;
        flex-direction: column;
    }

    #track-list-toolbar
    {
        height: 60px;
        background-color: #333333;
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        border: 1px solid white;
    }

    .add-instrument-button
    {
        height: 52px;
        width: 52px;
        margin: 4px;
        box-sizing: border-box;
        background-color: #555555;
        user-select: none;
        position: relative;
        border-radius: 4px;
    }

    .add-instrument-button:hover
    {
        cursor: pointer;
        background-color: #777777;
    }

    .add-instrument-button img
    {
        width: 48px;
        height: 48px;
        padding: 2px;
    }

    .add-instrument-button span
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

    #track-list {
        flex: 1;
        background-color: #333333;
        box-sizing: border-box;
        border: 1px solid white;
    }

     .sq_tracklist_entry
    {
        border-radius: 4px;
        box-sizing: border-box;
        background-color: #555555;
        color: white;
        margin: 4px;
        user-select: none;
        line-height: 30px;
        display: flex;
        flex-direction: row;
    }

    .sq_tracklist_entry:hover
    {
        background-color: #777777 !important;
        cursor: pointer;    
    }

    .sq_tracklist_entry.active
    {
        background-color: rgb(251,199,25);
        color: #111111;
    }

    .sq_tracklist_entry_image
    {
        margin: 4px;
        width: 32px;
        height: 32px;
    }

    .sq_tracklist_entry_name
    {
        line-height: 32px;
        font-size: 24px;
        margin: 4px;
        flex: 1;
    }

    .sq_tracklist_entry_muteButton
    {
        width: 32px;
        height: 32px;
        background-color: #777777;
        color: white;
        border-radius: 4px;
        margin: 4px;
    }

    .sq_tracklist_entry_closeButton
    {
        width: 32px;
        height: 32px;
        line-height: 32px;
        background-color: #777777;
        color: white;
        border-radius: 4px;
        margin: 4px;
        font-size: 32px;
        text-align: center;
    }

    .sq_tracklist_entry_muteButton:hover
    {
        background-color: #999999;
    }

    .sq_tracklist_entry_closeButton:hover
    {
        background-color: red;
    }

    .sq_tracklist_entry_muteButton img
    {
        width: 30px;
        height: 30px;
    }

    #export-container
    {
        height: 300px;
        background-color: #333333;
        box-sizing: border-box;
        border: 1px solid white;
        color:white;
    }

    .control-button
    {
        height: 40px;
        box-sizing: border-box;
        line-height: 40px;
        font-size: 20px;
        margin: 4px;
        
        background-color: #555555;
        text-align: center;
        color: white;
        border-radius: 4px;
        user-select: none;
    }

    .control-button:hover
    {
        cursor:pointer;
        background-color: #777777;
    }

    #export-container
    {
        color: white;
    }

    #export-container table
    {
        width: 100%;
    }

    #export-container table th, #export-container table td
    {
        padding-left: 8px;
        margin: 0;
        text-align: left;
        height: 30px;
        line-height: 30px;
    }

    #time-line-container
    {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    #time-line-toolbar
    {
        height: 60px;
        background-color: #333333;
        box-sizing: border-box;
        border: 1px solid white;
        display: flex;
        flex-direction: row;
        color: white;
    }

    .time-line-control-button
    {
        height: 52px;
        width: 52px;
        margin: 4px;
        box-sizing: border-box;
        background-color: #555555;
        user-select: none;
        border-radius: 4px;
    }

    .time-line-control-button:hover
    {
        cursor: pointer;
        background-color: #777777;
    }

    .time-line-control-button img
    {
        width: 48px;
        height: 48px;
        padding: 2px;
    }

    #time-line-toolbar label
    {
        font-size: 26px;
        margin: 4px;
        height: 52px;
        line-height: 52px;
    }

    #time-line-toolbar select, #time-line-toolbar input
    {
        height: 32px;
        margin: 4px;
        margin-top: 12px;
    }

    .time-line-menu-button
    {
        height: 52px;
        box-sizing: border-box;
        line-height: 52px;
        font-size: 20px;
        margin: 4px;
        padding-left: 4px;
        padding-right: 4px;
        
        background-color: #555555;
        text-align: center;
        color: white;
        border-radius: 4px;
        user-select: none;
    }

    
    .time-line-menu-button:hover
    {
        background-color: #777777;
        cursor: pointer;
    }

    .instrument-picker-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .instrument-option {
        background-color: #555;
        color: #ddd;
        padding: 10px 20px;
        margin: 5px;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
    }

    .instrument-option:hover {
        background-color: #777;
    }

    #sequencer
    {
        position: relative;
        height: 100%;
        width: 100%;
    }

    .keyboard 
    {
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

    .trackView > table {
        border-collapse: collapse;
        table-layout: fixed;
        width: max-content;
    }

    .trackView > table th,
    .trackView > table td {
        width: 30px;
        height: 30px;
        border: 1px solid #444;
        text-align: center;
        box-sizing: border-box;
        background-color: #3c3c3c;
    }

    .trackView > table th:hover,
    .trackView > table td:hover 
    {
        background-color: #777777;
        cursor:pointer;
    }

    .trackView > table td.active {
        background-color: rgb(251,199,25);
    }
</style>

<div id="content" class='flex_content'>
    <div class='standardPagePanel'>
        <div id="app-container"> 
            <div id="left-column-container">
                <div id="track-list-container">
                    <div id="track-list-toolbar">
                        <div id="add-piano-button" class="add-instrument-button"><img src="/piano.png"></img><span>+</span></div>
                        <div id="add-trumpet-button" class="add-instrument-button"><img src="/trumpet.png"></img><span>+</span></div>
                        <div id="add-flute-button" class="add-instrument-button"><img src="/flute.png"></img><span>+</span></div>
                        <div id="add-kazoo-button" class="add-instrument-button"><img src="/kazoo.png"></img><span>+</span></div>
                        <div id="add-blarghl-button" class="add-instrument-button"><img src="/blarghl.png"></img><span>+</span></div></div>
                    <div id="track-list"></div>
                </div>
                <div id="export-container">
                    <div class="control-button" id="save-button">Save Zquence JSON</div>
                    <div class="control-button" id="load-button">Load Zquence JSON</div>
                    <input type="file" id="load-file" style="display: none;">        
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
                    <div class="time-line-control-button" id="play-button"><img src="/play.png"></img></div>
                    <div class="time-line-control-button" id="pause-button"><img src="/stop.png"></div>
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
