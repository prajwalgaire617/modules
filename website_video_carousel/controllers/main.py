from odoo import http
from odoo.http import request

class VideoController(http.Controller):

    @http.route(['/videos'], type='http', auth='public', website=True)
    def videos(self, **kw):
        Product = request.env['product.template'].sudo()
        products = Product.search([('is_video_product', '=', True), ('video_embed', '!=', False)])
        return request.render("website_video_carousel.videos_page_template", {
            'products': products
        })

        
