# -*- coding: utf-8 -*-
{
    'name': 'Custom Video Background Carousel',
    'version': '15.0.1.0.0',
    'category': 'Website',
    'summary': 'Extends carousel with YouTube video support and audio controls',
    'description': """
This module adds a premium YouTube video background carousel snippet 
to the Odoo Website Builder, featuring autoplay/pause on slide transition 
and custom audio controls.
""",
    'author': 'Custom Developer',
    'depends': ['website'],
    'data': [
        'views/video_carousel_templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'website_custom_video_carousel/static/src/scss/video_carousel.scss',
            'website_custom_video_carousel/static/src/js/compatibility_fix.js',
            'website_custom_video_carousel/static/src/js/video_carousel.js',
        ],
    },
    'installable': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
