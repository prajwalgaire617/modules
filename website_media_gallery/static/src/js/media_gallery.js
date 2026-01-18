odoo.define('website_media_gallery.gallery', function (require) {
    'use strict';

    const publicWidget = require('web.public.widget');

    publicWidget.registry.MediaGallery = publicWidget.Widget.extend({
        selector: '.s_media_gallery',
        events: {
            'click .media-item': '_onImageClick',
        },
        
        start() {
            this._super.apply(this, arguments);
            console.log('Media gallery initialized');
            
            // Add hover effect
            this.$el.find('.media-card').hover(
                function() { $(this).css('transform', 'translateY(-5px)'); },
                function() { $(this).css('transform', 'translateY(0)'); }
            );
        },

        _onImageClick(ev) {
            const $img = $(ev.currentTarget);
            const src = $img.attr('src');
            const name = $img.attr('data-name') || 'Image';
            
            // Create lightbox modal
            const $modal = $(`
                <div class="modal fade media-lightbox" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
                        <div class="modal-content bg-transparent border-0">
                            <div class="modal-header border-0">
                                <h5 class="modal-title text-white">${name}</h5>
                                <button type="button" class="close text-white" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-center p-0">
                                <img src="${src}" class="img-fluid" style="max-height: 80vh; border-radius: 8px;"/>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            
            $('body').append($modal);
            $modal.modal('show');
            $modal.on('hidden.bs.modal', function() {
                $modal.remove();
            });
        }
    });
});