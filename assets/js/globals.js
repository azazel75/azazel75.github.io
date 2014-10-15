// -*- coding: utf-8 -*-
// :Progetto:  spa-jinha -- global context data
// :Creato:    mer 15 ott 2014 11:53:06 CEST
// :Autore:    Alberto Berti <alberto@metapensiero.it>
// :Licenza:   GNU General Public License version 3 or later
//

define(['json!globals.json'], function(globals) {
    globals._messages = globals.messages;
    globals.messages = function(key, lang) {
        lang = lang || globals.default_lang;
        return globals._messages[lang][key];
    };
    return globals;
});
