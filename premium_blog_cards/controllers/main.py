# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request


class BlogAccordionController(http.Controller):

    @http.route('/blog_accordion/data', type='json', auth='public', website=True)
    def get_blog_accordion_data(self, **kwargs):
        """Return blog accordion data in the current language context."""
        website = request.website
        lang = request.context.get('lang', 'en_US')
        env = request.env

        blogs = env['blog.blog'].with_context(lang=lang).search([
            ('website_id', 'in', [website.id, False])
        ])

        result = []
        for blog in blogs:
            posts_data = []
            posts = env['blog.post'].with_context(lang=lang).search([
                ('blog_id', '=', blog.id),
                ('website_published', '=', True),
                ('website_id', 'in', [website.id, False]),
            ])
            for post in posts:
                posts_data.append({
                    'id': post.id,
                    'name': post.name,
                    'url': post.website_url,
                })
            result.append({
                'id': blog.id,
                'name': blog.name,
                'posts': posts_data,
            })

        return result
