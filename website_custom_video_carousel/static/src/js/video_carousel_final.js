odoo.define('website_custom_video_carousel.video_carousel', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');

    publicWidget.registry.CustomVideoCarousel = publicWidget.Widget.extend({
        selector: '.s_custom_video_carousel',
        events: {
            'click .yt-unmute-btn': '_onToggleAudio',
        },

        init: function () {
            this._super.apply(this, arguments);
            this.players = {};
            this.isMuted = {};
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
                                console.log('YouTube player ready for video:', $slide.data('video-id'));
                                
                                // CRITICAL: Start completely muted and paused
                                event.target.mute();
                                event.target.pauseVideo();
                                self.isMuted[slideIndex] = true;
                                
                                // Only play if this is the active slide
                                if ($slide.hasClass('active')) {
                                    setTimeout(function() {
                                        // Start playing muted first
                                        event.target.playVideo();
                                        console.log('Started playing muted video');
                                    }, 1000);
                                }
                            },
                            'onStateChange': function (event) {
                                console.log('Video state changed:', event.data, 'for slide:', slideIndex);
                                
                                if (event.data === YT.PlayerState.PLAYING) {
                                    console.log('Video is playing, muted:', self.isMuted[slideIndex]);
                                } else if (event.data === YT.PlayerState.ENDED) {
                                    console.log('Video ended, restarting...');
                                    event.target.playVideo();
                                }
                            },
                            'onError': function (event) {
                                console.error('YouTube player error:', event);
                            }
                        }
                    });
                }
            });
        },

        _onSlide: function (ev) {
            var prevIndex = $(ev.relatedTarget).siblings('.active').index();
            
            // Pause the previous player
            if (this.players[prevIndex]) {
                try { 
                    this.players[prevIndex].pauseVideo(); 
                    console.log('Paused previous video:', prevIndex);
                } catch(e) {
                    console.log('Error pausing previous video:', e);
                }
            }
        },

        _onSlid: function (ev) {
            var currentIndex = $(ev.currentTarget).find('.carousel-item.active').index();
            var currentPlayer = this.players[currentIndex];
            
            if (currentPlayer) {
                // Play the current player
                try {
                    if (currentPlayer.getPlayerState() !== 1) {
                        currentPlayer.playVideo();
                        console.log('Started current video:', currentIndex);
                    }
                    
                    // Stop ALL other players
                    for (var key in this.players) {
                        if (parseInt(key) !== currentIndex) {
                            try { 
                                this.players[key].pauseVideo(); 
                                console.log('Stopped other video:', key);
                            } catch(e) {
                                console.log('Error stopping video:', key, e);
                            }
                        }
                    }
                } catch(e) {
                    console.log('Error in slid handler:', e);
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

            console.log('Toggle audio clicked for slide:', index, 'Current muted state:', this.isMuted[index]);

            if (player && typeof player.unMute === 'function') {
                try {
                    if (this.isMuted[index]) {
                        // UNMUTE the current player
                        console.log('Unmuting player:', index);
                        
                        // Force user interaction by pausing first
                        player.pauseVideo();
                        
                        setTimeout(function() {
                            player.unMute();
                            player.setVolume(40); // Set to 40% volume
                            player.playVideo();
                            
                            self.isMuted[index] = false;
                            $btn.addClass('active').find('i').attr('class', 'fa fa-volume-up');
                            $btn.find('span').text('Mute');
                            
                            console.log('Audio unmuted successfully');
                        }, 200);
                        
                    } else {
                        // MUTE the current player
                        console.log('Muting player:', index);
                        
                        player.mute();
                        self.isMuted[index] = true;
                        $btn.removeClass('active').find('i').attr('class', 'fa fa-volume-off');
                        $btn.find('span').text('Unmute');
                        
                        console.log('Audio muted successfully');
                    }
                } catch(e) {
                    console.error('Error toggling audio:', e);
                }
            } else {
                console.error('Player not available for slide:', index);
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
