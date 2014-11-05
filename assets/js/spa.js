// -*- coding: utf-8 -*-
(function () {

    curl.config({
        baseUrl: '/assets/js',
        paths: {
            curl: 'curl/curl',
            jquery: 'jquery.min',
            underscore: 'backbone.marionette/underscore',
            backbone: 'backbone.marionette/backbone',
            marionette: 'backbone.marionette/backbone.marionette',
            nunjucks: 'nunjucks/nunjucks',
            punycode: 'url/punycode',
            'json!': '/assets/json'
        }
    });

    curl(['underscore', 'jquery',  'backbone', 'marionette', 'nunjucks', 'globals', 'models'])
        .then(start, fail);

    function start(_, $, Backbone, Marionette, nunjucks, globals, models) {
        // Initialize nunjucks template system and plug it in inside Marionette
        var template_env = new nunjucks.Environment(new nunjucks.WebLoader('/assets/view', true));
        template_env.dev= true;
        Marionette.TemplateCache.prototype.loadTemplate = function(templateId){
            return template_env.getTemplate(templateId);
        };
        Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
            return rawTemplate;
        };
        Marionette.Renderer.render = function(template, data){
            template = Marionette.TemplateCache.get(template);
            var blog_data = globals.to_template_context(data);
            return template.render(blog_data);
        };
        var Spa = Marionette.Application.extend();
        var posts = new models.Posts();
        var ContentView = Marionette.ItemView.extend({
            events: {
                "click a[href^='/']": 'pushLinkToHistory'
            },

            pushLinkToHistory: function(event) {
                var href = event.target.getAttribute('href'),
                    router = this.getOption('router'),
                    testurl;

                if (href.search('#') > -1)
                    testurl = href.substr(0, href.search('#'));
                else
                    testurl = href;
                if (testurl !=  window.location.pathname) {
                    event.preventDefault();
                    router.navigate(href, {trigger: true});
                }
            }
        });
        var ContentRouter = Marionette.AppRouter.extend({
            routes: {
                ':type/*content_id': 'goToContent',
                '': 'goToRoot'
            },

            goToContent: function(type, id) {
                var real_id = type +'/' + id + '.json';
                this.showModel(real_id);
            },

            goToRoot: function() {
                this.showModel('index.html.json');
            },

            showModel: function(model_id) {
                var self = this,
                    posts = this.getOption('posts'),
                    post = posts.get(model_id);

                if (post)
                    renderPost(post.toJSON());
                else {
                    post = new models.Post({id: model_id});
                    posts.add(post);
                    post.fetch().then(renderPost);
                }

                function renderPost(post_or_d) {
                    var view, app, extrajs_view,
                        template_data = globals.get('client_templates')[post_or_d['template_name']],
                        content_tmpl = template_data['view-content'],
                        extrajs_tmpl = template_data['view-extrajs'];
                    view = new ContentView({model: post, template: content_tmpl,
                                            router: self});
                    app = self.getOption('app');
                    if (extrajs_tmpl) {
                        extrajs_view = new Marionette.ItemView({model: post, template: extrajs_tmpl,
                                                                router: self});
                        app.extrajs_region.show(extrajs_view);
                    } else
                        app.extrajs_region.reset();
                    app.content_region.show(view);
                }
            }
        });
        var spa = new Spa();
        spa.addInitializer(function(options) {
            this.addRegions({content_region: '#view-content',
                             extrajs_region: '#view-extrajs'});
            var router = new ContentRouter({posts: options.posts, app: this});
            Backbone.history.start({pushState: true});
        });
        spa.start({posts: posts});
    }
    function fail(err) {
        console.log(err);
    }
})();
