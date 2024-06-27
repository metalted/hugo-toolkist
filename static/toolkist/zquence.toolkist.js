import { toolkist } from '/toolkist/toolkist.js';
import { Soundfont } from "https://unpkg.com/smplr/dist/index.mjs";
import { MidiParser } from '/libs/midi/midi-parser.js';

export var zquence = (function($) {
    var zquence = {};
    
    zquence.Sequencer = class
    {
        constructor()
        {
            //Stores the different instrumental tracks.
            this.tracks = [];
            //The current select track
            this.selectedTrack = -1;
            //The amount of bars this sequencer has
            this.bars = 1;
            //How many note slot per music bar
            this.notesPerBar = 4;
            //The currently displayed sequencer grid cells
            this.cells = [];
            //Is the sequencer currently playing back?
            this.isPlaying = false;
            //The current step (note column) that is being played.
            this.currentStep = 0;
            //Stores the interval ID for playback.
            this.intervalID = null;

            //Zeeplevel exporter
            this.exporter = new zquence.ZeeplevelExporter();

            //Midi importer
            this.midiImporter = new zquence.MidiImporter();

            //Audio Source
            this.audioSource = new zquence.AudioSource();
            
            //Types of instruments
            this.instrumentList = ['Piano', 'Trumpet', 'Flute', 'Kazoo', 'Blarghl'];

            //Keyboard definition
            this.keyboardKeys = [
                { name: "B3", note: 24 }, { name: "A3#", note: 23 }, { name: "A3", note: 22 }, { name: "G3#", note: 21 },
                { name: "G3", note: 20 }, { name: "F3#", note: 19 }, { name: "F3", note: 18 }, { name: "E3", note: 17 },
                { name: "D3#", note: 16 }, { name: "D3", note: 15 }, { name: "C3#", note: 14 }, { name: "C3", note: 13 },
                { name: "B2", note: 12 }, { name: "A2#", note: 11 }, { name: "A2", note: 10 }, { name: "G2#", note: 9 },
                { name: "G2", note: 8 }, { name: "F2#", note: 7 }, { name: "F2", note: 6 }, { name: "E2", note: 5 },
                { name: "D2#", note: 4 }, { name: "D2", note: 3 }, { name: "C2#", note: 2 }, { name: "C2", note: 1 }
            ];

            this.initialize();
        }

        initialize()
        {
            //Add listeners to html elements

            //Track list toolbar
            $('#add-piano-button').on('click', () => this.addInstrumentTrack('Piano'));
            $('#add-trumpet-button').on('click', () => this.addInstrumentTrack('Trumpet'));
            $('#add-flute-button').on('click', () => this.addInstrumentTrack('Flute'));
            $('#add-kazoo-button').on('click', () => this.addInstrumentTrack('Kazoo'));
            $('#add-blarghl-button').on('click', () => this.addInstrumentTrack('Blarghl'));
            
            //Export window
            $('#save-button').on('click', () => {
                const data = this.exportData();
                const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
            
                let exportFileName = $('#exportName').val();
                if (exportFileName.trim() === "") {
                    exportFileName = "zquenceData.json";
                } else {
                    exportFileName += ".json";
                }
            
                a.download = exportFileName;
                a.click();
                URL.revokeObjectURL(url);
            });

            $('#load-button').on('click', () => $('#load-file').click());
            $('#load-file').on('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = JSON.parse(e.target.result);
                    this.loadZquenceData(data);
                };
                reader.readAsText(file);
            });

            $('#import-midi-button').on('click', () => 
            {                
                if(window.confirm("MIDI Importing doesn't work with each MIDI type yet, and can get laggy because the time line isnt optimized for long tracks. Loading will also take a bit, as well as changing instruments. Refresh the page before importing another MIDI! Continue?"))
                {
                    $('#load-midi').click();
                }                
            });

            $('#load-midi').on('input', () => 
            {
                this.midiImporter.importMidi('load-midi', (midiData) => {
                    console.log(midiData);
                    const zquenceData = this.midiImporter.convertMidiDataToZquenceData(midiData);
                    console.log(zquenceData);
                    this.loadZquenceData(zquenceData);
                });                
            });

            $('#export-button').on('click', () => 
            {
                let trackData = this.exportData();
                let targetSpeed = parseFloat($('#targetspeed-input').val());
                let exportType = $("#exportType").val();
                let zeeplevel = null;

                switch(exportType)
                {
                    case 'circle':
                        zeeplevel = this.exporter.exportCircleZeeplevel(trackData, targetSpeed);
                        break;
                    case 'line':
                        zeeplevel = this.exporter.exportLineZeeplevel(trackData, targetSpeed);
                        break;
                    case 'road':
                        zeeplevel = this.exporter.exportRoadZeeplevel(trackData, targetSpeed);
                        break;
                }

                let exportFileName = $('#exportName').val();
                if(exportFileName.trim() == "")
                {
                    exportFileName = "zquence.zeeplevel";
                }
                else
                {
                    exportFileName += ".zeeplevel";
                }
                
                if(zeeplevel != null)
                {
                    toolkist.fs.DirectDownload(exportFileName, zeeplevel.ToCSV());
                }
            });

            //Sequencer toolbar
            $('#play-button').on('click', () => 
            {
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
            });

            $('#pause-button').on('click', () => {
                this.isPlaying = false;
                clearInterval(this.intervalId);
            });

            $('#notesPerBarSelection').on('change', () => 
            {
                const nbpValue = $('#notesPerBarSelection').val();
                this.notesPerBar = nbpValue;
                this.updateTracks();
            });

            $('#add-bar-button').on('click', () => {
                this.bars++;
                for (let i = 0; i < this.tracks.length; i++) {
                    if (this.tracks[i].bars.length < this.bars) {
                        this.tracks[i].bars.push(Array.from({ length: 32 }, () => []));
                    }
                }
                this.updateTracks();
            });

            $('#remove-bar-button').on('click', () => {
                if (this.bars <= 1) {
                    return;
                }

                let barContainsNotes = false;
                let lastBarIndex = this.bars - 1;

                for (let i = 0; i < this.tracks.length; i++) {
                    if (!this.isTrackOrBarEmpty(i, lastBarIndex)) {
                        barContainsNotes = true;
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
            });
        }

        loadZquenceData(data)
        {
            this.bars = data.bars;
            this.notesPerBar = data.notesPerBar;

            $('#bpm-input').val(data.bpm);
            $('#notesPerBarSelection').val(data.notesPerBar);
            $('#track-list').empty();

            this.tracks = data.tracks.map((track, index) => {
                const tracklistEntry = this.createTracklistEntry(index, track.instrument);
                $('#track-list').append(tracklistEntry);
                
                return {
                    instrument: track.instrument,
                    element: tracklistEntry,
                    bars: track.bars
                };
            });

            this.selectedTrack = (this.tracks.length > 0) ? 0 : -1;

            if(this.selectedTrack == -1)
            {
                this.updateTracks();
            }
            else
            {
                this.selectTrack(this.selectedTrack);
            }
        }

        //Tracklist
        createTracklistEntry(trackIndex, instrumentType)
        {
            const listItem = $('<div>').addClass('sq_tracklist_entry');
            const icon = $('<img>').addClass('sq_tracklist_entry_image').attr({src: '/img/' + instrumentType.toLowerCase() + ".png"});
            const name = $('<span>').addClass('sq_tracklist_entry_name').text(instrumentType.toUpperCase());
            const remove = $('<div>').addClass('sq_tracklist_entry_closeButton').text('X');
            const mute = $('<div>').addClass('sq_tracklist_entry_muteButton').html($('<img>').attr({src: '/img/volume.png'}));
            listItem.append(icon,name,remove,mute);

            listItem.on('click', () => this.selectTrack(trackIndex));
            icon.on('click', (e) => {
                e.stopPropagation();
                this.showInstrumentPicker(trackIndex);
            });
            remove.on('click', (e) => { 
                e.stopPropagation(); 
                this.removeTrack(trackIndex); 
            });
            mute.on('click', (e) => {
                e.stopPropagation();
                this.toggleMuteTrack(trackIndex);
            });

            return listItem;
        }

        addInstrumentTrack(instrumentType)
        {
            const trackIndex = this.tracks.length;
            const tracklistEntry = this.createTracklistEntry(trackIndex, instrumentType);
            $('#track-list').append(tracklistEntry);

            const track = {
                instrument: instrumentType,
                element: tracklistEntry,
                bars: Array.from({length: this.bars}, () => new Array(32).fill().map(() => [])),
                muted: false
            }

            this.tracks.push(track);
            this.selectTrack(trackIndex);            
        }

        toggleMuteTrack(trackIndex) {
            if (trackIndex >= 0 && trackIndex < this.tracks.length) {
                let track = this.tracks[trackIndex];
                track.muted = !track.muted;
                
                let imgSrc = track.muted ? '/img/mute.png' : '/img/volume.png';
                track.element.find('.sq_tracklist_entry_muteButton').html($('<img>').attr({ src: imgSrc }));
            }
        }

        showInstrumentPicker(trackIndex)
        {
            const overlay = $('<div>').addClass('instrument-picker-overlay');

            this.instrumentList.forEach(instrument => {
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
                track.element.find('.sq_tracklist_entry_image').attr({ src: "/img/" + newInstrument.toLowerCase() + ".png" });
                track.element.find('.sq_tracklist_entry_name').text(newInstrument.toUpperCase());

                // Check if the element has the 'active' class
                if (track.element.hasClass('active')) 
                {
                    //Reselect it so the keyboard gets updated.
                    this.selectTrack(trackIndex);
                }
            }
        }

        selectTrack(trackIndex) 
        {
            if (this.selectedTrack !== -1) {
                this.tracks[this.selectedTrack].element.removeClass('active');
            }

            this.selectedTrack = trackIndex;
            this.tracks[this.selectedTrack].element.addClass('active');
            this.updateTracks();
        }

        removeTrack(trackIndex) {
            if (trackIndex >= 0 && trackIndex < this.tracks.length) {
                const track = this.tracks[trackIndex];
        
                // Check if the track or any bar in the track has notes
                if (!this.isTrackOrBarEmpty(trackIndex)) {
                    const confirmDelete = window.confirm("This track contains notes. Are you sure you want to delete it?");
                    if (!confirmDelete) return;
                }
        
                // Proceed with removing the track
                track.element.remove();
                this.tracks.splice(trackIndex, 1);
        
                // Reassign indices for the remaining tracks
                this.reassignTrackIndices();
        
                // Update selectedTrack index to the first track if possible, otherwise set to -1
                this.selectedTrack = (this.tracks.length > 0) ? 0 : -1;
        
                this.updateTracks();
            }
        }

        reassignTrackIndices() {
            this.tracks.forEach((track, i) => {
                track.element.off('click').on('click', () => this.selectTrack(i));
                track.element.find('.sq_tracklist_entry_closeButton').off('click').on('click', (e) => {
                    e.stopPropagation();
                    this.removeTrack(i);
                });
            });
        }


        //Sequencer
        isTrackOrBarEmpty(trackIndex, barIndex = -1) {
            if (trackIndex >= 0 && trackIndex < this.tracks.length) {
                const track = this.tracks[trackIndex];
        
                if (barIndex === -1) {
                    // Check all bars in the track
                    for (let bar of track.bars) {
                        for (let column of bar) {
                            if (column.length > 0) {
                                return false;
                            }
                        }
                    }
                } else if (barIndex >= 0 && barIndex < track.bars.length) {
                    // Check specific bar
                    for (let column of track.bars[barIndex]) {
                        if (column.length > 0) {
                            return false;
                        }
                    }
                }
                return true;
            }
            return true;
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
                this.audioSource.playSound(this.tracks[trackIndex].instrument, note + 1);
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
                    this.audioSource.playSound(instrument, this.keyboardKeys[i].note)
                })
                keyboard.append(keyboardKey);                    
            }

            return keyboard;
        }

        updateTracks() 
        {
            $('#sequencer').html(""); // Clear the existing content
            if (this.selectedTrack !== -1) {
                $('#sequencer').append(this.createKeyboard(this.tracks[this.selectedTrack].instrument));
            }
            const trackView = $('<div>').addClass('trackView');
            $('#sequencer').append(trackView);

            this.cells = [];

            if (this.selectedTrack !== -1) {
                const openedTrack = this.tracks[this.selectedTrack];
                console.log(openedTrack);
                
                const table = $('<table>');

                for (let n = 23; n >= 0; n--) {
                    const row = $('<tr>');
                    for (let b = 0; b < this.bars; b++) {
                        const iterationStep = 32 / this.notesPerBar;
                        for (let c = 0; c < 32; c += iterationStep) {
                            let cell;
                            try{
                                cell = $('<td>')
                                .addClass(openedTrack.bars[b][c].includes(n) ? 'active' : 'inactive')
                                .on('click', () => this.setTrackNote(this.selectedTrack, b, c, n));
                            }
                            catch{
                                console.log("note:",n,"bar:",b,"column:",c);
                            }

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

        playCurrentStep() {
            const step = this.currentStep;
            const barIndex = Math.floor(step / this.notesPerBar);
            const columnIndex = (step % this.notesPerBar) * (32 / this.notesPerBar);

            for (let track of this.tracks) {
                if(!track.muted)
                {
                    if (track.bars[barIndex] && track.bars[barIndex][columnIndex]) {
                        for (let note of track.bars[barIndex][columnIndex]) {
                            this.audioSource.playSound(track.instrument, note + 1);
                        }
                    }
                }
            }
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
    }

    zquence.ZeeplevelExporter = class
    {
        constructor()
        {

        }

        exportLineZeeplevel(trackData, targetSpeedInKph)
        {
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

            return zeeplevel;
        }

        exportCircleZeeplevel(trackData, targetSpeedInKph)
        {
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

            return zeeplevel;
        }

        exportRoadZeeplevel(trackData, targetSpeedInKph)
        {
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

            return zeeplevel;
        }
    }

    zquence.MidiImporter = class
    {
        constructor()
        {

        }

        importMidi(elementId, callback) 
        {
            const fileInput = document.getElementById(elementId);
            
            MidiParser.parse(fileInput, (obj) => 
            {
                callback(obj);
            });
        }        

        mapMidiNoteToValue(note, minNote = 48, maxNote = 71) {
            // Validate the base range
            if (minNote >= maxNote) {
                console.error("The minimum note must be less than the maximum note.");
                return 0;
            }
        
            // Calculate the range width (should be 23 for two octaves minus one note)
            const rangeWidth = maxNote - minNote;
            if (rangeWidth !== 23) {
                console.error("The specified range must cover exactly 23 notes.");
                return 0;
            }
        
            // Ensure the note is within the valid MIDI range
            if (note < 0 || note > 127) {
                console.error("The note must be a valid MIDI note (0-127).");
                return 0;
            }
        
            // Map the note to the specified range
            while (note < minNote) {
                note += 12; // Add an octave
            }
            while (note > maxNote) {
                note -= 12; // Subtract an octave
            }
        
            // Map the adjusted note to a value from 0 to 23
            const mappedValue = (note - minNote) % 24;
        
            return mappedValue;
        }

        extractBPM(obj) 
        {
            try {
                if (!obj || !obj.track || !Array.isArray(obj.track)) {
                    throw new Error("Invalid MIDI object structure");
                }

                for (let track of obj.track) {
                    if (!track.event || !Array.isArray(track.event)) {
                        console.warn("Track is missing events or events are not in array format");
                        continue;
                    }

                    for (let event of track.event) {
                        if (event.metaType == 81) { // Tempo meta event
                            const tempo = event.data;
                            if (tempo <= 0) {
                                console.warn("Invalid tempo value found in event");
                                continue;
                            }
                            return Math.floor(60000000 / tempo); // Microseconds per beat to BPM
                        }
                    }
                }
                
                console.warn("No tempo meta event found in any track");
                return 120;
            } catch (error) {
                console.error("Error extracting BPM:", error.message);
                return 120;
            }
        }        

        convertMidiDataToZquenceData(midiData) 
        {
            const timeDivision = midiData.timeDivision; // Ticks per beat (quarter note)
            const bpm = this.extractBPM(midiData);
            const secondsPerBeat = 60 / bpm;
            const beatsPerBar = 4;
            const notesPerBar = 32;

            let keyOnEvent = 9;
            
            let tracks = [];
        
            midiData.track.forEach((track, index) => {
                try {
                    let currentTime = 0;
                    let notes = [];
                    let bars = {};
        
                    // Extracting notes from MIDI events
                    track.event.forEach((e) => {
                        currentTime += e.deltaTime / timeDivision;
        
                        if (e.type == keyOnEvent) { // Note on event
                            const barIndex = Math.floor(currentTime / (secondsPerBeat * beatsPerBar));
                            if (!bars[barIndex]) {
                                bars[barIndex] = Array.from({ length: notesPerBar }, () => []);
                            }
                            const beatPosition = (currentTime % (secondsPerBeat * beatsPerBar)) / secondsPerBeat * notesPerBar / beatsPerBar;
                            const slotIndex = Math.floor(beatPosition);
                            bars[barIndex][slotIndex].push(this.mapMidiNoteToValue(e.data[0]));
                        }
                    });
        
                    // Fill missing bars in the track
                    const maxBarIndex = Math.max(...Object.keys(bars).map(Number));
                    for (let i = 0; i <= maxBarIndex; i++) {
                        if (!bars[i]) {
                            bars[i] = Array.from({ length: notesPerBar }, () => []);
                        }
                    }
        
                    // Convert the bars object to an array
                    const barArray = Object.keys(bars).sort((a, b) => a - b).map(key => bars[key]);
        
                    tracks.push({
                        instrument: 'Piano',
                        bars: barArray
                    });
                } catch (error) {
                    console.error(`Error processing track ${index}:`, error);
                    // Skip the track if there's an error
                }
            });
        
            // Find the maximum length of the bars among all tracks
            const maxBars = Math.max(...tracks.map(track => track.bars.length));
        
            // Ensure all tracks have the same number of bars
            tracks.forEach(track => {
                while (track.bars.length < maxBars) {
                    track.bars.push(Array.from({ length: notesPerBar }, () => []));
                }
            });
        
            const formattedData = {
                bpm: bpm,
                bars: maxBars,
                notesPerBar,
                tracks
            };
        
            return formattedData;
        }                

        organizeNotesIntoBars(notes, secondsPerBeat, beatsPerBar) {
            const bars = [];
            const notesPerBar = 32;
            const secondsPerBar = secondsPerBeat * beatsPerBar;

            notes.forEach(note => {
                const barIndex = Math.floor(note.t / secondsPerBar);
                const beatPosition = (note.t % secondsPerBar) / secondsPerBeat * notesPerBar / beatsPerBar;

                if (!bars[barIndex]) {
                    bars[barIndex] = Array.from({ length: notesPerBar }, () => []);
                }

                const slotIndex = Math.floor(beatPosition);
                bars[barIndex][slotIndex].push(note.n);
            });

            return bars;
        }
    }    

    zquence.AudioSource = class
    {
        constructor()
        {
            this.context = new AudioContext();

            this.piano = new Soundfont(this.context, { instrument: "electric_grand_piano", decayTime: 0.1  });
            this.flute = new Soundfont(this.context, {instrument: "flute"});
            this.trumpet = new Soundfont(this.context, {instrument: "muted_trumpet"});
            this.kazoo = new Soundfont(this.context, {instrument: "oboe"});
            this.blarghl = new Soundfont(this.context, {instrument: "choir_aahs"});
        }

        playSound(instrument, note) 
        {
            this.context.resume();
            const now = this.context.currentTime;

            switch(instrument) {
                case "Piano":
                    this.piano.start({ note: (note + 35), time: now, duration: 0.5 });
                    break;
                case "Trumpet":
                    this.trumpet.start({ note: (note + 35), time: now, duration: 0.5 });
                    break;
                case "Flute":
                    this.flute.start({ note: (note + 35), time: now, duration: 0.5 });
                    break;
                case "Kazoo":
                    this.kazoo.start({ note: (note + 35), time: now, duration: 0.5 });
                    break;
                case "Blarghl":
                    this.blarghl.start({ note: (note + 35), time: now, duration: 0.5 });
                    break;
            }
        }
    }

    return zquence;
})(jQuery);
