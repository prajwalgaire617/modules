/** @odoo-module **/

import { registry } from '@web/core/registry';
import { CharField } from '@web/views/fields/char/char_field';

/**
 * Custom field widget for iframe preview
 */
class IframeField extends CharField {
    
    get formattedValue() {
        // Return the raw HTML/iframe code
        return this.props.value || '';
    }
}

IframeField.template = 'product_iframe.IframeField';

registry.category('fields').add('iframe_preview', IframeField);