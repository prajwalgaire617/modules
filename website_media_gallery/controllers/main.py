from odoo import http
from odoo.http import request

class WebsiteMediaGallery(http.Controller):

    @http.route(['/media', '/media/page/<int:page>'], auth='public', website=True)
    def media_gallery_page(self, page=1, **kwargs):
        """Full media gallery page with pagination"""
        limit = 48
        offset = (page - 1) * limit

        domain = [
    ('type', '=', 'binary'),
    ('mimetype', 'ilike', 'image/'),
    ('datas', '!=', False),  # Only attachments with actual data
]

        Attachment = request.env['ir.attachment'].sudo()
        
        attachments = Attachment.search(
            domain,
            limit=limit,
            offset=offset,
            order='create_date desc'
        )
        
        total_count = Attachment.search_count(domain)
        total_pages = (total_count + limit - 1) // limit

        return request.render('website_media_gallery.media_gallery_page', {
            'attachments': attachments,
            'page': page,
            'total_pages': total_pages,
            'has_next': page < total_pages,
            'has_prev': page > 1,
        })