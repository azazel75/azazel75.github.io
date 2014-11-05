// -*- coding: utf-8 -*-
// :Progetto:  spa-jinha -- global context data
// :Creato:    mer 15 ott 2014 11:53:06 CEST
// :Autore:    Alberto Berti <alberto@metapensiero.it>
// :Licenza:   GNU General Public License version 3 or later
//

define(['underscore', 'backbone', 'url/url', 'url/urljoin', 'json!globals.json'],
       function(_, Backbone, url, urljoin, globals_json) {
           var Globals, globals;
           Globals = Backbone.Model.extend({
               messages: function(key, lang) {
                   lang = lang || this.get('lang') || this.get('default_lang');
                   return this.get('_messages')[lang][key];
               },
               abs_link: function(dst) {
                   var result;
                   if(dst)
                       result = urljoin(this.get('BASE_URL'), dst);
                   else
                       result = this.get('BASE_URL');
                   return result;
               },
               rel_link: function(src, dst) {
                   src = urljoin(this.get('BASE_URL'), src);
                   dst = url.resolve(src, dst);
                   var parsed_src, parsed_dst, src_parts, dst_parts,
                       com_parts = [], result;
                   if (src == dst)
                       return '#';
                   parsed_src = url.parse(src);
                   parsed_dst = url.parse(dst);
                   if (parsed_src.protocol == parsed_dst.protocol &&
                       parsed_src.host == parsed_dst.host) {
                       src_parts = parsed_src.path.split('/').slice(1);
                       dst_parts = parsed_dst.path.split('/').slice(1);

                       _.find(_.zip(src_parts, dst_parts),
                              function(tuple) {
                                  result = tuple[0] == tuple[1];
                                  if (result)
                                      com_parts.push(tuple[0]);
                                  return result;
                              });
                       result = _.map(range(src_parts.length - com_parts.length),
                                      function() { return '..';});
                       result = result.concat(dst_parts.slice(com_parts.length - 1)).join('/');
                   } else
                       return result = dst;
                   return result;
               },
               set_locale: function(lang) {
                   this.set('lang', lang);
               },
               to_template_context: function() {
                   var result = this.toJSON(),
                       args;
                   if (arguments.length > 0) {
                       args = Array.prototype.slice.call(arguments);
                       args.unshift(result);
                       _.extend.apply(this, args);
                   }
                   result.get = function(name) {
                       return this[name];
                   };
                   result.set = function(name, value) {
                       this[name] = value;
                   };
                   result.messages = this.messages;
                   result.abs_link = this.abs_link;
                   result.rel_link = this.rel_link;
                   result.set_locale = this.set_locale;
                   _.bindAll(result, 'messages', 'abs_link', 'rel_link', 'set_locale');
                   return result;
               }
           });

           globals_json._messages = globals_json.messages;
           delete globals_json.messages;
           globals = new Globals(globals_json);
           return globals;
});
