# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.http import request
import logging

_logger = logging.getLogger(__name__)


class VisitorCounter(models.Model):
    _name = 'website.visitor.counter'
    _description = 'Website Visitor Counter'
    _order = 'visit_datetime desc'

    session_id = fields.Char(string='Session ID', required=True, index=True)
    ip_address = fields.Char(string='IP Address')
    user_agent = fields.Char(string='User Agent')
    visit_datetime = fields.Datetime(string='Visit Date Time', default=fields.Datetime.now)
    page_url = fields.Char(string='Page URL')

    _sql_constraints = [
        ('session_id_unique', 'unique(session_id)', 'Session ID must be unique!')
    ]

    @api.model
    def get_unique_visitors_count(self):
        """Get total count of unique visitors"""
        return self.search_count([])

    @api.model
    def register_visitor(self):
        """Register a new visitor or update existing one"""
        try:
            if not request:
                return False

            session_id = request.session.sid
            ip_address = request.httprequest.environ.get('REMOTE_ADDR', 'Unknown')
            user_agent = request.httprequest.environ.get('HTTP_USER_AGENT', 'Unknown')
            page_url = request.httprequest.url

            # Check if visitor already exists
            existing_visitor = self.search([('session_id', '=', session_id)], limit=1)
            
            if not existing_visitor:
                # Create new visitor record
                self.create({
                    'session_id': session_id,
                    'ip_address': ip_address,
                    'user_agent': user_agent,
                    'page_url': page_url,
                    'visit_datetime': fields.Datetime.now()
                })
                _logger.info(f"New visitor registered: {session_id}")
            else:
                # Update last visit
                existing_visitor.write({
                    'visit_datetime': fields.Datetime.now(),
                    'page_url': page_url
                })

            return True
        except Exception as e:
            _logger.error(f"Error registering visitor: {str(e)}")
            return False