odoo.define('website_homepage_counter.counter', function (require) {
    "use strict";

    var ajax = require('web.ajax');

    function updateCounter() {
        ajax.jsonRpc('/website/visit_count', 'call', {}).then(function(count) {
            var el = document.getElementById('visit-counter');
            if(el){
                el.textContent = count;
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        updateCounter();
        setInterval(updateCounter, 5000); // Refresh every 5 seconds
    });
});
