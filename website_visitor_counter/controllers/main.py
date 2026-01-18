from odoo import http
from odoo.http import request
import logging

_logger = logging.getLogger(__name__)


class VisitorController(http.Controller):

    @http.route('/website/visitor/register', type='json', auth='public', website=True, csrf=False)
    def register_visitor(self, **kwargs):
        """Register visitor and return count"""
        _logger.info("Visitor registration endpoint called")
        try:
            VisitorCounter = request.env['website.visitor.counter'].sudo()
            VisitorCounter.register_visitor()
            count = VisitorCounter.get_unique_visitors_count()
            
            return {
                'success': True,
                'count': count
            }
        except Exception as e:
            _logger.error(f"Error in register_visitor: {str(e)}", exc_info=True)
            return {
                'success': False,
                'error': str(e),
                'count': 0
            }

    @http.route('/website/visitor/count', type='json', auth='public', website=True, csrf=False)
    def get_visitor_count(self, **kwargs):
        """Get current visitor count"""
        try:
            count = request.env['website.visitor.counter'].sudo().get_unique_visitors_count()
            return {
                'success': True,
                'count': count
            }
        except Exception as e:
            _logger.error(f"Error in get_visitor_count: {str(e)}", exc_info=True)
            return {
                'success': False,
                'error': str(e),
                'count': 0
            }