odoo.define('website_custom_video_carousel.video_carousel', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');

    publicWidget.registry.CustomVideoCarousel = publicWidget.Widget.extend({
        selector: '.s_custom_video_carousel',
        events: {
            'click .yt-unmute-btn': '_onToggleAudio',
            'click .o_video_container': '_onVideoClick', // Enable audio on video click
        },

        init: function () {
            this._super.apply(this, arguments);
            this.players = {};
            this.audioEnabled = {}; // Track audio state per player
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
                                console.log('Player ready for slide:', slideIndex);
                                
                                // Start muted and paused
                                event.target.mute();
                                event.target.pauseVideo();
                                
                                // Initialize audio state
                                self.audioEnabled[slideIndex] = false;
                                
                                // Only play if this is the active slide
                                if ($slide.hasClass('active')) {
                                    setTimeout(function() {
                                        event.target.playVideo();
                                    }, 1000);
                                }
                            },
                            'onStateChange': function (event) {
                                if (event.data === YT.PlayerState.PLAYING) {
                                    console.log('Video playing:', slideIndex, 'Audio enabled:', self.audioEnabled[slideIndex]);
                                }
                            }
                        }
                    });
                }
            });
        },

        _onSlide: function (ev) {
            var prevIndex = $(ev.relatedTarget).siblings('.active').index();
            // Only pause the previous player
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
                // Play the current player
                if (currentPlayer.getPlayerState() !== 1) {
                    currentPlayer.playVideo();
                }
                
                // Stop ALL other players
                for (var key in this.players) {
                    if (parseInt(key) !== currentIndex) {
                        try { 
                            this.players[key].pauseVideo(); 
                        } catch(e) {}
                    }
                }
            }
        },

        _onVideoClick: function (ev) {
            // Enable audio when user clicks on video container
            var $container = $(ev.currentTarget);
            var $slide = $container.closest('.carousel-item');
            var index = $slide.index();
            var player = this.players[index];
            
            if (player) {
                // This counts as user interaction
                try {
                    player.unMute();
                    player.setVolume(50);
                    this.audioEnabled[index] = true;
                    
                    // Update button state
                    var $btn = $slide.find('.yt-unmute-btn');
                    $btn.addClass('active').find('i').attr('class', 'fa fa-volume-up');
                    $btn.find('span').text('Mute');
                    
                    console.log('Audio enabled via video click');
                } catch(e) {
                    console.log('Failed to enable audio:', e);
                }
            }
        },

        _onToggleAudio: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            
            var $btn = $(ev.currentTarget);
            var $slide = $btn.closest('.carousel-item');
            var index = $slide.index();
            var player = this.players[index];

            if (player && typeof player.unMute === 'function') {
                if (this.audioEnabled[index]) {
                    // Mute the current player
                    try {
                        player.mute();
                        this.audioEnabled[index] = false;
                        $btn.removeClass('active').find('i').attr('class', 'fa fa-volume-off');
                        $btn.find('span').text('Unmute');
                        console.log('Audio muted');
                    } catch(e) {
                        console.log('Failed to mute:', e);
                    }
                } else {
                    // Unmute the current player
                    try {
                        // First mute all other players
                        for (var key in this.players) {
                            if (parseInt(key) !== index) {
                                try { 
                                    this.players[key].mute();
                                    this.audioEnabled[key] = false;
                                } catch(e) {}
                            }
                        }
                        
                        // Then unmute this player
                        player.unMute();
                        player.setVolume(50);
                        this.audioEnabled[index] = true;
                        $btn.addClass('active').find('i').attr('class', 'fa fa-volume-up');
                        $btn.find('span').text('Mute');
                        console.log('Audio unmuted');
                    } catch(e) {
                        console.log('Failed to unmute:', e);
                    }
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
