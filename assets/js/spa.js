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
            'json!': '/assets/json'
        }
    });

    curl(['underscore', 'jquery',  'backbone', 'marionette', 'nunjucks', 'globals', 'models'])
        .then(debugStart, fail);

    function start(_, $, Backbone, Marionette, nunjucks, globals, models) {
        // Initialize nunjucks template system and plug it in inside Marionette
        var template_env = new nunjucks.Environment(new nunjucks.WebLoader('/assets/view', true));
        Marionette.TemplateCache.prototype.loadTemplate = function(templateId){
            return template_env.getTemplate(templateId);
        };
        Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
            return rawTemplate;
        };
        Marionette.Renderer.render = function(template, data){
            var template = Marionette.TemplateCache.get(template);
            var blog_data = _.clone(globals);
            blog_data.post = data;
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
                ':type/*content_id': 'goToContent'
            },

            goToContent: function(type, id) {
                var posts = this.getOption('posts'),
                    real_id = type +'/' + id + '.json',
                    template_name, post, self;
                if (type == 'posts')
                    template_name = 'post.partial';
                else if (type == 'stories')
                    template_name = 'story.partial';
                self = this;
                post = posts.get(real_id);
                function renderPost(post_or_d) {
                    var view, app;
                    view = new ContentView({model: post, template: template_name,
                                            router: self});
                    app = self.getOption('app');
                    app.content_region.show(view);
                }
                if (post)
                    renderPost(post);
                else {
                    post = new models.Post({id: real_id});
                    posts.add(post);
                    post.fetch().then(renderPost);
                }
            }
        });
        var spa = new Spa();
        spa.addInitializer(function(options) {
            this.addRegions({content_region: '#view-content'});
            var router = new ContentRouter({posts: options.posts, app: this});
            Backbone.history.start({pushState: true});
        });
        spa.start({posts: posts});
    }
    function fail(err) {
        console.log(err);
    }

    function debugStart() {
        try {
            start.apply(this, arguments);
        } catch(e) {
            console.error(e);
        }
    }
})();
