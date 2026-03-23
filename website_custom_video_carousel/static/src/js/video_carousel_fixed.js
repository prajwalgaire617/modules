odoo.define('website_custom_video_carousel.video_carousel', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');

    publicWidget.registry.CustomVideoCarousel = publicWidget.Widget.extend({
        selector: '.s_custom_video_carousel',
        events: {
            'click .yt-unmute-btn': '_onToggleAudio',
            'click .o_video_container': '_onVideoContainerClick', // Add click interaction
        },

        init: function () {
            this._super.apply(this, arguments);
            this.players = {};
            this.userInteracted = false; // Track user interaction
        },

        start: function () {
            var self = this;
            if (this.$el.data('dhn-js-active')) return Promise.resolve();
            this.$el.data('dhn-js-active', true);

            this._super.apply(this, arguments);
            
            if (!window.YT) {
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }

            this.$el.on('slide.bs.carousel', this._onSlide.bind(this));
            this.$el.on('slid.bs.carousel', this._onSlid.bind(this));

            this._waitForYT().then(function() {
                self._initPlayers();
            });

            return Promise.resolve();
        },

        _waitForYT: function () {
            return new Promise(function (resolve) {
                if (window.YT && window.YT.Player) {
                    resolve();
                } else {
                    var oldOnReady = window.onYouTubeIframeAPIReady;
                    window.onYouTubeIframeAPIReady = function () {
                        if (oldOnReady) oldOnReady();
                        resolve();
                    };
                }
            });
        },

        _initPlayers: function () {
            var self = this;
            this.$('.carousel-item[data-video="true"]').each(function () {
                var $slide = $(this);
                var slideIndex = $slide.index();
                var $iframe = $slide.find('iframe.yt-player');

                if ($iframe.length && !self.players[slideIndex]) {
                    // Give iframe a unique ID for better API tracking
                    var playerID = 'yt_player_' + Math.random().toString(36).substr(2, 9);
                    $iframe.attr('id', playerID);

                    self.players[slideIndex] = new YT.Player(playerID, {
                        events: {
                            'onReady': function (event) {
                                // Start muted and paused
                                event.target.mute();
                                event.target.pauseVideo();
                                
                                // Only play if this is the active slide
                                if ($slide.hasClass('active')) {
                                    setTimeout(function() {
                                        event.target.playVideo(); // Play muted initially
                                    }, 500);
                                }
                            },
                            'onStateChange': function (event) {
                                // Handle state changes for better audio control
                                if (event.data === YT.PlayerState.PLAYING) {
                                    console.log('Video is playing');
                                }
                            }
                        }
                    });
                }
            });
        },

        _onSlide: function (ev) {
            var prevIndex = $(ev.relatedTarget).siblings('.active').index();
            // Only pause the previous player, don't mute it
            if (this.players[prevIndex]) {
                try { 
                    this.players[prevIndex].pauseVideo(); 
                } catch(e) {}
            }
        },

        _onSlid: function (ev) {
            var currentIndex = $(ev.currentTarget).find('.carousel-item.active').index();
            var currentPlayer = this.players[currentIndex];
            if (currentPlayer) {
                // Ensure current player state is preserved
                if (currentPlayer.getPlayerState() !== 1) {
                    currentPlayer.playVideo();
                }
                
                // Stop ALL other players globally listed in this widget instance
                for (var key in this.players) {
                    if (parseInt(key) !== currentIndex) {
                        try { 
                            this.players[key].pauseVideo(); 
                        } catch(e) {}
                    }
                }
            }
        },

        _onVideoContainerClick: function (ev) {
            // Mark that user has interacted with the video
            this.userInteracted = true;
        },

        _onToggleAudio: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            
            var $btn = $(ev.currentTarget);
            var $slide = $btn.closest('.carousel-item');
            var index = $slide.index();
            var player = this.players[index];

            // Mark user interaction
            this.userInteracted = true;

            if (player && typeof player.unMute === 'function') {
                if ($btn.hasClass('active')) {
                    // Mute the current player
                    player.mute();
                    $btn.removeClass('active').find('i').attr('class', 'fa fa-volume-off');
                    $btn.find('span').text('Unmute');
                } else {
                    // This is the key fix - we need user interaction to unmute
                    // First mute all other players to prevent audio conflicts
                    for (var key in this.players) {
                        if (parseInt(key) !== index) {
                            try { this.players[key].mute(); } catch(e) {}
                        }
                    }
                    
                    // Force a user interaction by briefly pausing and resuming
                    var currentState = player.getPlayerState();
                    player.pauseVideo();
                    
                    // Small delay, then unmute and resume
                    var self = this;
                    setTimeout(function() {
                        try {
                            player.unMute();
                            player.setVolume(40); // Set to 40% volume
                            player.playVideo();
                            
                            $btn.addClass('active').find('i').attr('class', 'fa fa-volume-up');
                            $btn.find('span').text('Mute');
                            
                            console.log('Audio unmuted successfully');
                        } catch(e) {
                            console.log('Audio toggle failed:', e);
                            // Fallback: keep muted
                            player.mute();
                            $btn.removeClass('active').find('i').attr('class', 'fa fa-volume-off');
                            $btn.find('span').text('Unmute');
                        }
                    }, 100);
                }
            }
        },

        destroy: function () {
            this.$el.data('dhn-js-active', false);
            this.$el.off('slide.bs.carousel');
            this.$el.off('slid.bs.carousel');
            for (var key in this.players) {
                try { this.players[key].destroy(); } catch(e) {}
            }
            this._super.apply(this, arguments);
        }
    });

    return publicWidget.registry.CustomVideoCarousel;
});
