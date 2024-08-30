import {toolkist} from '/toolkist/toolkist.js';

$(document).ready(function() {
    // Get the config name from the global variable
    const configName = window.pageConfig;
    
    if (!configName) {
        console.error("No config name provided.");
        return;
    }

    // Load the corresponding JSON configuration file
    $.getJSON(`/page_cfg/${configName}.json`)
        .done(function(config) {
            applyConfig(config);
        })
        .fail(function(jqxhr, textStatus, error) {
            const err = textStatus + ", " + error;
            console.error("Error loading config: " + err);
        });
});

function applyConfig(config) 
{
    let wrapper = $('#contentWrapper');
    let content;

    //Get page type
    let pageType = 'flex';
    if(config.hasOwnProperty('pageType'))
    {
        pageType = config.pageType;
    }

    //Apply page type
    switch(pageType)
    {
        case 'flex':
            content = $('<div>').addClass('flex_content').attr({id : 'content'});
            wrapper.append(content);
            break;
    }

    //Apply sidebar
    if(config.hasOwnProperty('sidebar'))
    {
        let sidebar = $('<div>').addClass('standardLeftPanel');
        content.append(sidebar);

        if(config.sidebar.hasOwnProperty('sections'))
        {
            constructSidebar(config.sidebar.sections);
        }
    }

    //Apply panels
    if(config.hasOwnProperty('panels'))
    {
        let panelID = 1;
        let lastPanelID = config.panels.length;

        config.panels.forEach((p) => {
            switch(p.type)
            {
                case 'flex':
                    let panel = $('<div>').addClass('standardPagePanel');

                    if(panelID == lastPanelID)
                    {
                        panel.addClass('lastStandardPagePanel');
                    }

                    panel.attr({id: "pagepanel" + panelID});
                    content.append(panel);
                    break;
            }
            panelID++;
        });
    }    

   // Include the JavaScript file if specified
    if (config.hasOwnProperty('javascriptFile')) {
        const script = document.createElement('script');
        script.src = config.javascriptFile;
        script.type = 'module'; // Set the script type to 'module'

        script.onload = async function() {
            try {
                // Dynamically import the module
                const module = await import(config.javascriptFile);
                // Call the init function from the module
                if (typeof module.init === 'function') {
                    module.init();
                } else {
                    console.error('init() function not found in the loaded module.');
                }
            } catch (error) {
                console.error('Error importing module:', error);
            }
        };

        script.onerror = function() {
            console.error('Failed to load the script:', script.src);
        };

        document.body.appendChild(script);
    }
}

function constructSidebar(sections)
{
    sections.forEach((s) => {
        
        if(s.hasOwnProperty("header"))
        {
            toolkist.ui.createSidebarHeader('.standardLeftPanel', s.header);
        }

        if(s.hasOwnProperty("controls"))
        {
            s.controls.forEach((c) => {
                toolkist.ui.createSidebarControl('.standardLeftPanel', c);
            });
        }
    });
}