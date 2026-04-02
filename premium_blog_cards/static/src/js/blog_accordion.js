odoo.define('premium_blog_cards.blog_accordion', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');

    publicWidget.registry.BlogAccordion = publicWidget.Widget.extend({
        selector: '.s_blog_accordion',
        disabledInEditableMode: true,  // Don't run in editor mode

        start: function () {
            var self = this;
            return this._super.apply(this, arguments).then(function () {
                return self._loadAccordionData();
            });
        },

        _loadAccordionData: function () {
            var self = this;
            return this._rpc({
                route: '/blog_accordion/data',
                params: {},
            }).then(function (data) {
                self._renderAccordion(data);
            }).catch(function (error) {
                var $accordion = self.$('#blogAccordion').length ? self.$('#blogAccordion') : self.$('.accordion');
                if ($accordion.length) {
                    $accordion.html('<div class="alert alert-danger m-3">Error loading blogs. Please try again later.</div>');
                }
            });
        },

        _renderAccordion: function (blogs) {
            var $accordion = this.$('#blogAccordion');
            if (!$accordion.length) {
                $accordion = this.$('.accordion');
            }
            if (!$accordion.length) {
                return;
            }
            if (!blogs || !blogs.length) {
                $accordion.html('<div class="text-center text-muted p-4 border rounded bg-light">No blogs available yet.</div>');
                return;
            }

            var html = '';
            blogs.forEach(function (blog) {
                var postsHtml = '';
                if (blog.posts && blog.posts.length) {
                    blog.posts.forEach(function (post) {
                        postsHtml +=
                            '<li class="list-group-item py-2 px-4 border-0">' +
                                '<a href="' + _.escape(post.url) + '" class="text-info text-decoration-none d-flex align-items-center">' +
                                    '<i class="fa fa-caret-right mr-2"></i>' +
                                    '<span>' + _.escape(post.name) + '</span>' +
                                '</a>' +
                            '</li>';
                    });
                } else {
                    postsHtml = '<li class="list-group-item text-muted small">No posts available in this category.</li>';
                }

                html +=
                    '<div class="card border-0 mb-2 shadow-sm">' +
                        '<div class="card-header bg-white p-0" id="heading' + blog.id + '">' +
                            '<h5 class="mb-0">' +
                                '<button class="btn btn-link btn-block text-left d-flex justify-content-between align-items-center p-3 text-dark font-weight-bold collapsed"' +
                                    ' type="button" data-toggle="collapse"' +
                                    ' data-target="#collapse' + blog.id + '"' +
                                    ' aria-expanded="false"' +
                                    ' aria-controls="collapse' + blog.id + '">' +
                                    '<span>' + _.escape(blog.name) + '</span>' +
                                    '<i class="fa fa-chevron-down small"></i>' +
                                '</button>' +
                            '</h5>' +
                        '</div>' +
                        '<div id="collapse' + blog.id + '" class="collapse"' +
                            ' aria-labelledby="heading' + blog.id + '"' +
                            ' data-parent="#blogAccordion">' +
                            '<div class="card-body p-0">' +
                                '<ul class="list-group list-group-flush">' +
                                    postsHtml +
                                '</ul>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            });

            $accordion.html(html);
        },
    });

    return publicWidget;
});
