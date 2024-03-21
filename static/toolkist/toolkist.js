import {api} from '/toolkist/api.toolkist.js';
import {fs} from '/toolkist/fs.toolkist.js';
import {game} from '/toolkist/game.toolkist.js';
import {html} from '/toolkist/html.toolkist.js';
import {util} from '/toolkist/util.toolkist.js';
import {graphics} from '/toolkist/graphics.toolkist.js';

export var toolkist = (function($) {
    var toolkist = {};  
    toolkist.api = api;
    toolkist.fs = fs;
    toolkist.game = game;
    toolkist.html = html;
    toolkist.util = util;
    toolkist.graphics = graphics;
    return toolkist;
})(jQuery);