# -*- coding: utf-8 -*-
{
    'name': 'Premium Blog Cards (Dynamic Snippet)',
    'version': '15.0.1.0.0',
    'category': 'Website',
    'summary': 'Adds a premium card template to the standard Odoo blog dynamic snippet',
    'description': """
This module adds a new "Premium Card" template option to the standard Odoo 
"Blog Posts" dynamic snippet, matching the design from Data Home Nepal.

Features:
* Author overlay on images
* Teaser/content display with line clamping
* Views and Comments stats with icons
* Modern, responsive grid design
""",
    'author': 'Prajwal Gaire',
    'depends': ['website_blog', 'website'],
    'data': [
        'views/snippets.xml',
        'views/accordion_snippet.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'premium_blog_cards/static/src/scss/premium_blog_cards.scss',
            'premium_blog_cards/static/src/scss/chart_custom.scss',
            'premium_blog_cards/static/src/js/blog_accordion.js',
        ],
    },
    'installable': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
