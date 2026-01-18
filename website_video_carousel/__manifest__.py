{
    'name': 'Product Image Iframe Replacement',
    'version': '15.0.1.0.0',
    'category': 'Website',
    'summary': 'Replace product image with iframe in website sale',
    'description': """
        This module replaces the product image with an embedded iframe
        in the website sale product template.
    """,
    'author': 'Your Name',
    'depends': ['website_sale'],
    'data': [
        'views/product_template.xml',
        'views/video_page.xml',

    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}

