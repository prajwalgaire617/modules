odoo.define('website_custom_video_carousel.compatibility_fix', function (require) {
    'use strict';

    /**
     * DHN Compatibility Fix v19 (Surgical)
     * Blocks the "expected pattern" crash dialog without causing editor hangs.
     */
    console.log("DHN-Compatibility-Fix-v19-Active");

    const originalQS = document.querySelector;
    const originalQSA = document.querySelectorAll;

    function isPatternError(err) {
        if (!err) return false;
        var msg = (err.message || err.toString() || "").toLowerCase();
        return msg.indexOf('expected pattern') !== -1 || 
               msg.indexOf('not a valid selector') !== -1;
    }

    document.querySelector = function(selector) {
        // DO NOT touch empty selectors (causes Odoo hangs)
        if (!selector) return originalQS.apply(this, arguments);
        
        try {
            return originalQS.apply(this, arguments);
        } catch (e) {
            if (isPatternError(e)) {
                // Return null instead of crashing Odoo
                return null; 
            }
            throw e;
        }
    };

    document.querySelectorAll = function(selector) {
        if (!selector) return originalQSA.apply(this, arguments);
        try {
            return originalQSA.apply(this, arguments);
        } catch (e) {
            if (isPatternError(e)) {
                return [];
            }
            throw e;
        }
    };

    // Suppress Sizzle error which crashes snippet rendering
    window.addEventListener('unhandledrejection', function (event) {
        var msg = (event.reason && event.reason.message) ? event.reason.message.toLowerCase() : "";
        if (msg.indexOf('elems.length') !== -1 || msg.indexOf('undefined is not an object') !== -1) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, true);

    return {};
});
