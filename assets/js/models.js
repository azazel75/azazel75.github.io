// -*- coding: utf-8 -*-
// :Progetto:  spa -- post model
// :Creato:    mer 15 ott 2014 13:02:16 CEST
// :Autore:    Alberto Berti <alberto@metapensiero.it>
// :Licenza:   GNU General Public License version 3 or later
//

define(['underscore', 'jquery',  'backbone', 'marionette'],
       function(_, $, Backbone, Marionette) {
           var Post = Backbone.Model.extend();
           var Posts = Backbone.Collection.extend({
               url: '/assets/json',
               model: Post,
               getOrFetch: function(id) {
                   var post;
                   post = this.get(id);
                   if (!post) {
                       post = new Post({id: id});
                       this.add(post);
                       post.fetch();
                   }
                   return post;
               }
           });
           return {
               Post: Post,
               Posts: Posts
           };
       });
