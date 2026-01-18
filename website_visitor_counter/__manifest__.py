# -*- coding: utf-8 -*-
{
    'name': 'Website Visitor Counter',
    'version': '15.0.1.0.0',
    'category': 'Website',
    'summary': 'Track unique website visitors with real-time counter',
    'description': """
Track unique website visitors with real-time counter badge.

Features:
- Tracks unique visitors based on session ID
- Displays visitor count with eye icon badge on homepage
- Real-time updates every 30 seconds
- Shows total unique visitors count
- IP address tracking
- User agent detection
- Admin panel for visitor management
    """,
    'author': 'Your Company',
    'website': 'https://www.yourcompany.com',
    'depends': ['website', 'web'],
    'data': [
        'security/ir.model.access.csv',
        'views/visitor_counter_template.xml',
        'views/visitor_counter_menu.xml',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}