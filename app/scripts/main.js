/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here
})();

// template
(function($) {
  $(function() {
    $('.button-collapse').sideNav();
    $('.scrollspy').scrollSpy();

    /** Animate word **/

    // set animation timing
    var animationDelay = 2500;
    // loading bar effect
    var barAnimationDelay = 3800;
    // 3000 is the duration of the transition on the loading bar - set in the scss/css file
    var barWaiting = barAnimationDelay - 3000;
    // letters effect
    var lettersDelay = 50;
    // type effect
    var typeLettersDelay = 80;
    var selectionDuration = 500;
    var typeAnimationDelay = selectionDuration + 800;
    // clip effect
    var revealDuration = 600;
    var revealAnimationDelay = 1500;

    initHeadline();

    function initHeadline() {
      singleLetters($('.cd-headline.letters').find('b'));
      animateHeadline($('.cd-headline'));
    }

    function singleLetters($words) {
      $words.each(function() {
        var word = $(this);
        var letters = word.text().split('');
        var selected = word.hasClass('is-visible');
        for (var i in letters) {
          if (word.parents('.rotate-2').length > 0) {
            letters[i] = '<em>' + letters[i] + '</em>';
          }
          letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
        }
        var newLetters = letters.join('');
        word.html(newLetters).css('opacity', 1);
      });
    }

    function animateHeadline($headlines) {
      var duration = animationDelay;
      $headlines.each(function() {
        var headline = $(this);

        if (headline.hasClass('loading-bar')) {
          duration = barAnimationDelay;
          setTimeout(function() {
            headline.find('.cd-words-wrapper').addClass('is-loading');
          }, barWaiting);
        } else if (headline.hasClass('clip')) {
          var spanWrapper = headline.find('.cd-words-wrapper');
          var newWidth = spanWrapper.width() + 10;
          spanWrapper.css('width', newWidth);
        } else if (!headline.hasClass('type')) {
          // assign to .cd-words-wrapper the width of its longest word
          var words = headline.find('.cd-words-wrapper b');
          var width = 0;
          words.each(function() {
            var wordWidth = $(this).width();
            if (wordWidth > width) {
              width = wordWidth;
            }
          });
          headline.find('.cd-words-wrapper').css('width', width);
        }

        // trigger animation
        setTimeout(function() {
          hideWord(headline.find('.is-visible').eq(0));
        }, duration);
      });
    }

    function hideWord($word) {
      var nextWord = takeNext($word);

      if ($word.parents('.cd-headline').hasClass('type')) {
        var parentSpan = $word.parent('.cd-words-wrapper');
        parentSpan.addClass('selected').removeClass('waiting');
        setTimeout(function() {
          parentSpan.removeClass('selected');
          $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
        }, selectionDuration);
        setTimeout(function() {
          showWord(nextWord, typeLettersDelay);
        }, typeAnimationDelay);
      } else if ($word.parents('.cd-headline').hasClass('letters')) {
        var bool = ($word.children('i').length >= nextWord.children('i').length);
        hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
        showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);
      } else if ($word.parents('.cd-headline').hasClass('clip')) {
        $word.parents('.cd-words-wrapper').animate({width: '2px'}, revealDuration, function() {
          switchWord($word, nextWord);
          showWord(nextWord);
        });
      } else if ($word.parents('.cd-headline').hasClass('loading-bar')) {
        $word.parents('.cd-words-wrapper').removeClass('is-loading');
        switchWord($word, nextWord);
        setTimeout(function() {
          hideWord(nextWord);
        }, barAnimationDelay);
        setTimeout(function() {
          $word.parents('.cd-words-wrapper').addClass('is-loading');
        }, barWaiting);
      } else {
        switchWord($word, nextWord);
        setTimeout(function() {
          hideWord(nextWord);
        }, animationDelay);
      }
    }

    function showWord($word, $duration) {
      if ($word.parents('.cd-headline').hasClass('type')) {
        showLetter($word.find('i').eq(0), $word, false, $duration);
        $word.addClass('is-visible').removeClass('is-hidden');
      } else if ($word.parents('.cd-headline').hasClass('clip')) {
        $word.parents('.cd-words-wrapper').animate({width: $word.width() + 10}, revealDuration, function() {
          setTimeout(function() {
            hideWord($word);
          }, revealAnimationDelay);
        });
      }
    }

    function hideLetter($letter, $word, $bool, $duration) {
      $letter.removeClass('in').addClass('out');

      if (!$letter.is(':last-child')) {
        setTimeout(function() {
          hideLetter($letter.next(), $word, $bool, $duration);
        }, $duration);
      } else if ($bool) {
        setTimeout(function() {
          hideWord(takeNext($word));
        }, animationDelay);
      }

      if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
        var nextWord = takeNext($word);
        switchWord($word, nextWord);
      }
    }

    function showLetter($letter, $word, $bool, $duration) {
      $letter.addClass('in').removeClass('out');

      if ($letter.is(':last-child')) {
        if ($word.parents('.cd-headline').hasClass('type')) {
          setTimeout(function() {
            $word.parents('.cd-words-wrapper').addClass('waiting');
          }, 200);
        }
        if (!$bool) {
          setTimeout(function() {
            hideWord($word);
          }, animationDelay);
        }
      } else {
        setTimeout(function() {
          showLetter($letter.next(), $word, $bool, $duration);
        }, $duration);
      }
    }

    function takeNext($word) {
      return ($word.is(':last-child')) ? $word.parent().children().eq(0) : $word.next();
    }

    // function takePrev($word) {
    //   return ($word.is(':first-child')) ? $word.parent().children().last() : $word.prev();
    // }

    function switchWord($oldWord, $newWord) {
      $oldWord.removeClass('is-visible').addClass('is-hidden');
      $newWord.removeClass('is-hidden').addClass('is-visible');
    }

    $('.button-collapse').sideNav({
      // Default is 240
      menuWidth: 240,
      // Closes side-nav on <a> clicks, useful for Angular/Meteor
      closeOnClick: true
    });

    $('.parallax').parallax();

    // var card  = document.querySelectorAll('.card-work');
    // var transEndEventNames = {
    //   WebkitTransition: 'webkitTransitionEnd',
    //   MozTransition: 'transitionend',
    //   transition: 'transitionend'
    // };
    // var transEndEventName = transEndEventNames[Modernizr.prefixed('transition')];

    // function addDashes(name) {
    //   return name.replace(/([A-Z])/g, function(str, m1) {
    //     return '-' + m1.toLowerCase();
    //   });
    // }

    // function getPopup(id) {
    //   return document.querySelector('.popup[data-popup="' + id + '"]');
    // }

    // function getDimensions(el) {
    //   return el.getBoundingClientRect();
    // }

    // function getDifference(card, popup) {
    //   var cardDimensions = getDimensions(card);
    //   var popupDimensions = getDimensions(popup);

    //   return {
    //     height: popupDimensions.height / cardDimensions.height,
    //     width: popupDimensions.width / cardDimensions.width,
    //     left: popupDimensions.left - cardDimensions.left,
    //     top: popupDimensions.top - cardDimensions.top
    //   };
    // }

    // function transformCard(card, size) {
    //   var transf = 'translate(' + size.left + 'px,' + size.top + 'px)' + ' scale(' + size.width + ',' + size.height + ')';
    //   card.style[Modernizr.prefixed('transform')] = transf;
    //   return transf;
    // }

    // function hasClasshasClass(elem, cls) {
    //   var str = " " + elem.className + " ";
    //   var testCls = " " + cls + " ";
    //   return(str.indexOf(testCls) != -1) ;
    // }

    // function closest(e) {
    //   var el = e.target || e.srcElement;
    //   if (el === el.parentNode) {
    //     do {
    //       // its an inverse loop
    //       var cls = el.className;
    //       if (cls) {
    //         cls = cls.split(' ');
    //         if (cls.indexOf('card-work') !== -1) {
    //           return el;
    //         }
    //       }
    //     } while (el === el.parentNode);
    //   }
    // }

    // function scaleCard(e) {
    //   var el = closest(e);
    //   var target = el,
    //     id     = target.getAttribute('data-popup-id'),
    //     popup  = getPopup(id);

    //   var size = getDifference(target, popup);

    //   target.style[Modernizr.prefixed('transitionDuration')] = '0.5s';
    //   target.style[Modernizr.prefixed('transitionTimingFunction')] = 'cubic-bezier(0.4, 0, 0.2, 1)';
    //   target.style[Modernizr.prefixed('transitionProperty')] = addDashes(Modernizr.prefixed('transform'));
    //   target.style['borderRadius'] = 0;

    //   transformCard(target, size);
    //   onAnimated(target, popup);
    //   onPopupClick(target, popup);
    // }

    // function onAnimated(card, popup) {
    //   card.addEventListener(transEndEventName, function transitionEnded() {
    //     card.style['opacity'] = 0;
    //     popup.style['visibility'] = 'visible';
    //     popup.style['zIndex'] = 9999;
    //     card.removeEventListener(transEndEventName, transitionEnded);
    //   });
    // }

    // function onPopupClick(card, popup) {
    //   popup.addEventListener('click', function toggleVisibility(e) {
    //     var size = getDifference(popup, card);

    //     card.style['opacity'] = 1;
    //     card.style['borderRadius'] = '6px';
    //     hidePopup(e);
    //     transformCard(card, size);
    //   }, false);
    // }

    // function hidePopup(e) {
    //   e.target.style['visibility'] = 'hidden';
    //   e.target.style['zIndex'] = 2;
    // }

  // [].forEach.call(card, function(card) {
  // 	card.addEventListener('click', scaleCard, false);
  // });

  // end of document ready
  });
})(jQuery);
// end of jQuery name space
