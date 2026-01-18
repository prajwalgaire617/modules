from odoo import models, fields, api

class ProductTemplate(models.Model):
    _inherit = 'product.template'
    
    iframe_url = fields.Char(
        string='Iframe URL',
        help='Enter the embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)'
    )
    use_iframe = fields.Boolean(
        string='Show Iframe Instead of Image',
        default=False,
        help='Check this to display iframe instead of product image on website'
    )
    iframe_height = fields.Integer(
        string='Iframe Height (px)',
        default=500,
        help='Height of the iframe in pixels'
    )
    iframe_width = fields.Integer(
        string='Iframe Width (%)',
        default=100,
        help='Width of the iframe in percentage'
    )