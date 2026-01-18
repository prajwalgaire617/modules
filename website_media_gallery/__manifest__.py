{
    'name': 'Website Media Gallery (Read Only)',
    'version': '1.0',
    'summary': 'Display archived and active images/videos in website gallery',
    'category': 'Website',
    'depends': ['website'],
    'data': [
        'views/media_templates.xml',
        'views/media_snippets.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'website_media_gallery/static/src/js/media_gallery.js',
            'website_media_gallery/static/src/css/media_gallery.css',
            
        ],
    },
    'installable': True,
    'application': False,
}