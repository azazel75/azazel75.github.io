// -*- coding: utf-8 -*-

define(['jquery', 'js!flowr.plugin', 'js!jquery.colorbox'],
       function($) {
           function setup_gallery(thumbnail_size, photo_array) {
               $("#gallery_container").flowr({
                   data : photo_array,
                   height : thumbnail_size *.6,
                   padding: 5,
                   rows: -1,
                   render : function(params) {
                       // Just return a div, string or a dom object,
                       // anything works fine
                       img = $("<img />").attr({
                           'src': params.itemData.url_thumb,
                           'width' : params.width,
                           'height' : params.height
                       }).css('max-width', '100%');
                       link = $( "<a></a>").attr({
                           'href': params.itemData.url,
                           'class': 'image-reference'
                       });
                       div = $("<div />").addClass('image-block').attr({
                           'title': params.itemData.title,
                           'data-toggle': "tooltip"
                       });
                       link.append(img);
                       div.append(link);
                       div.hover(div.tooltip());
                       return div;
                   },
                   itemWidth : function(data) { return data.size.w; },
                   itemHeight : function(data) { return data.size.h; },
                   complete : function(params) {
                       if( photo_array.length > params.renderedItems ) {
                           nextRenderList = photo_array.slice( params.renderedItems );
                       }
                   }
               });
               $("a.image-reference").colorbox({rel:"gal", maxWidth:"100%",maxHeight:"100%",scalePhotos:true});
           };
       });
