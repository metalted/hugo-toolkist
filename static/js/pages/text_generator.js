import {toolkist} from '/toolkist/toolkist.js';

let textArea = null;
let currentFont = 'Round';
let currentLetterSpacing = 0;
let currentLineSpacing = 0;
let zeeplevelToExport = null;

var characterCodes = {
    "A": {
        "Round": 1747,
        "Block": 1786,
        "OpenRound": 1835
    },
    "B": {
        "Round": 1748,
        "Block": 1787,
        "OpenRound": 1836
    },
    "C": {
        "Round": 1749,
        "Block": 1788,
        "OpenRound": 1837
    },
    "D": {
        "Round": 1750,
        "Block": 1789,
        "OpenRound": 1838
    },
    "E": {
        "Round": 1751,
        "Block": 1790,
        "OpenRound": 1839
    },
    "F": {
        "Round": 1752,
        "Block": 1791,
        "OpenRound": 1840
    },
    "G": {
        "Round": 1753,
        "Block": 1792,
        "OpenRound": 1841
    },
    "H": {
        "Round": 1754,
        "Block": 1793,
        "OpenRound": 1842
    },
    "I": {
        "Round": 1755,
        "Block": 1794,
        "OpenRound": 1843
    },
    "J": {
        "Round": 1756,
        "Block": 1795,
        "OpenRound": 1844
    },
    "K": {
        "Round": 1757,
        "Block": 1796,
        "OpenRound": 1845
    },
    "L": {
        "Round": 1758,
        "Block": 1797,
        "OpenRound": 1846
    },
    "M": {
        "Round": 1759,
        "Block": 1798,
        "OpenRound": 1847
    },
    "N": {
        "Round": 1760,
        "Block": 1799,
        "OpenRound": 1848
    },
    "O": {
        "Round": 1761,
        "Block": 1800,
        "OpenRound": 1849
    },
    "P": {
        "Round": 1762,
        "Block": 1801,
        "OpenRound": 1850
    },
    "Q": {
        "Round": 1763,
        "Block": 1802,
        "OpenRound": 1851
    },
    "R": {
        "Round": 1764,
        "Block": 1803,
        "OpenRound": 1852
    },
    "S": {
        "Round": 1765,
        "Block": 1804,
        "OpenRound": 1853
    },
    "T": {
        "Round": 1766,
        "Block": 1805,
        "OpenRound": 1854
    },
    "U": {
        "Round": 1767,
        "Block": 1806,
        "OpenRound": 1855
    },
    "V": {
        "Round": 1768,
        "Block": 1807,
        "OpenRound": 1856
    },
    "W": {
        "Round": 1769,
        "Block": 1808,
        "OpenRound": 1857
    },
    "X": {
        "Round": 1770,
        "Block": 1809,
        "OpenRound": 1858
    },
    "Y": {
        "Round": 1771,
        "Block": 1810,
        "OpenRound": 1859
    },
    "Z": {
        "Round": 1772,
        "Block": 1811,
        "OpenRound": 1860
    },
    "0": {
        "Round": 1346,
        "Block": 1812,
        "OpenRound": 1861
    },
    "1": {
        "Round": 1347,
        "Block": 1813,
        "OpenRound": 1862
    },
    "2": {
        "Round": 1348,
        "Block": 1814,
        "OpenRound": 1863
    },
    "3": {
        "Round": 1349,
        "Block": 1815,
        "OpenRound": 1864
    },
    "4": {
        "Round": 1350,
        "Block": 1816,
        "OpenRound": 1865
    },
    "5": {
        "Round": 1351,
        "Block": 1817,
        "OpenRound": 1866
    },
    "6": {
        "Round": 1352,
        "Block": 1818,
        "OpenRound": 1867
    },
    "7": {
        "Round": 1353,
        "Block": 1819,
        "OpenRound": 1868
    },
    "8": {
        "Round": 1354,
        "Block": 1820,
        "OpenRound": 1869
    },
    "9": {
        "Round": 1355,
        "Block": 1821,
        "OpenRound": 1870
    },
    "!": {
        "Round": 1773,
        "Block": 1822,
        "OpenRound": 1871
    },
    "?": {
        "Round": 1774,
        "Block": 1823,
        "OpenRound": 1872
    },
    "&": {
        "Round": 1775,
        "Block": 1824,
        "OpenRound": 1873
    },
    "%": {
        "Round": 1776,
        "Block": 1825,
        "OpenRound": 1874
    },
    "#": {
        "Round": 1777,
        "Block": 1826,
        "OpenRound": 1875
    },
    "@": {
        "Round": 1778,
        "Block": 1827,
        "OpenRound": 1876
    },
    ".": {
        "Round": 1779,
        "Block": 1828,
        "OpenRound": 1877
    },
    ",": {
        "Round": 1780,
        "Block": 1829,
        "OpenRound": 1878
    },
    ":": {
        "Round": 1781,
        "Block": 1830,
        "OpenRound": 1879
    },
    "-": {
        "Round": 1782,
        "Block": 1831,
        "OpenRound": 1880
    },
    "=": {
        "Round": 1783,
        "Block": 1832,
        "OpenRound": 1881
    },
    "+": {
        "Round": 1784,
        "Block": 1833,
        "OpenRound": 1882
    },
    "_": {
        "Round": 1785,
        "Block": 1834,
        "OpenRound": 1883
    }
};

export function init()
{
    window.onFontSelected = onFontSelected;
    window.onLetterSpacingChange = onLetterSpacingChange;
    window.onLineSpacingChange = onLineSpacingChange;
    window.onCopyToClipboardButton = onCopyToClipboardButton;
    window.onDownloadZeeplevelButton = onDownloadZeeplevelButton;

    //Add text area to the panel
    textArea = $('<textarea>').attr({'id' : 'textAreaInput', 'placeholder':'Enter text here...'});
    $('#pagepanel1').append(textArea);
}

function onFontSelected()
{
    currentFont = $('#fontSelect').val();
}

function onLetterSpacingChange()
{
    const value = parseFloat($('#letterSpacingNumber').val());
    currentLetterSpacing = isNaN(value) ? 0 : value;
    console.log(currentLetterSpacing);
}

function onLineSpacingChange()
{
    const value = parseFloat($('#lineSpacingNumber').val());
    currentLineSpacing = isNaN(value) ? 0 : value;
    console.log(currentLineSpacing);
}

function onCopyToClipboardButton()
{
    generateZeeplevel();

    toolkist.fs.CopyToClipboard(zeeplevelToExport.ToCSV()); 
    console.log(zeeplevelToExport.ToCSV());
    window.alert("Copied to clipboard");
}

function onDownloadZeeplevelButton()
{
    generateZeeplevel();
    
    const firstSixAlphanumerics = textArea.val().replace(/[^a-zA-Z0-9]/g, '').substring(0, 6);
    toolkist.fs.DirectDownload("Text_" + firstSixAlphanumerics + ".zeeplevel", zeeplevelToExport.ToCSV()); 
}

function generateZeeplevel()
{
    const text = $('#textAreaInput').val();
    const selectedFont = currentFont;
    const results = [];
    for (let char of text) {
        if (char === ' ') {
            results.push({type: 'Space'});
        } else if (char === '\n') {
            results.push({type: 'Line break'});
        } else {
            results.push(getCharacterInfo(char, selectedFont));
        }
    }
    
    zeeplevelToExport = exportToZeeplevel(results);
}

function getCharacterInfo(char, font) {
    const upperChar = char.toUpperCase();
    let originalCase;
    if (char === upperChar && /[A-Z]/.test(char)) {
        originalCase = 'Upper';
    } else if (char !== upperChar && /[a-z]/.test(char)) {
        originalCase = 'Lower';
    } else {
        originalCase = 'Neither';
    }
    const charCode = characterCodes[upperChar] ? characterCodes[upperChar][font] : 'N/A';
    return {
        character: upperChar,
        original: char,
        case: originalCase,
        id: charCode
    };
}

function exportToZeeplevel(result)
{
    var zeeplevel = new toolkist.game.Zeeplevel();
    var currentLine = 0;
    var currentPosition = 0;
    var letterStep = 16 + currentLetterSpacing;
    var lineStep = 16 + currentLineSpacing;

    result.forEach((r) => {

        if(r.type == "Space")
        {
            currentPosition++;
        }
        else if(r.type == "Line break")
        {
            currentPosition = 0;
            currentLine++;
        }
        else if(r.id)
        {
            if(r.id == "N/A")
            {
                currentPosition++;
            }
            else
            {
                var block = new toolkist.game.Block();
                block.blockID = r.id;
                
                var letterPosition = currentPosition * letterStep;
                var linePosition = currentLine * -lineStep;

                block.position.x = letterPosition;
                block.position.y = linePosition;
                block.scale.x = 1;
                block.scale.y = 1;
                block.scale.z = 1;

                if(r.case == "Upper")
                {
                    block.options[0] = 1;
                }
                else if(r.case == "Lower")
                {
                    block.options[1] = 1;
                }            

                block.paints[0] = 285;
                block.paints[1] = 285;        
                
                zeeplevel.AddBlock(block);

                currentPosition++;
            }
        }
    });

    return zeeplevel;
}