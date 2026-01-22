from odoo import http
from odoo.http import request
from odoo.addons.website_sale.controllers.main import WebsiteSale


class WebsiteSaleCustom(WebsiteSale):

    # New shop URL: /videos
    @http.route(['/videos'], type='http', auth='public', website=True, sitemap=True)
    def shop_videos(self, **kwargs):
        # Reuse Odoo's original shop logic
        return super().shop(**kwargs)

    # Redirect old shop URL to new one
    @http.route(['/shop'], type='http', auth='public', website=True)
    def shop_redirect(self, **kwargs):
        return request.redirect('/videos', code=301)
