var H5P = H5P || {};
H5P.ImageHotspots = H5P.ImageHotspots || {};
/**
 * SingleChoiceResultSlide - Represents the result slide
 */
H5P.ImageHotspots.Popup = (function ($) {

  function Popup($container, $content, x, y, hotspotWidth, header, className, fullscreen) {
    var self = this;
    this.$container = $container;

    var width = this.$container.width();

    var pointerWidthInPercent = 4;
    hotspotWidth = (hotspotWidth/width)*100;

    var popupLeft = 0;
    var popupWidth = 0;
    var toTheLeft = false;

    if (fullscreen) {
      popupWidth = 100;
      className += ' fullscreen-popup';
    }
    else {
      toTheLeft = (x > 45);
      popupLeft = (toTheLeft ? 0 : (x + hotspotWidth + pointerWidthInPercent));
      popupWidth = (toTheLeft ?  x - pointerWidthInPercent : 100 - popupLeft);
    }

    this.$popupBackground = $('<div/>', {'class': 'h5p-image-hotspots-overlay'});
    this.$popup = $('<div/>', {
      'class': 'h5p-image-hotspot-popup ' + className
    }).css({
      left: (toTheLeft ? '' : '-') + '100%',
      width: popupWidth + '%'
    }).click(function (event){
      // If clicking on popup, stop propagating:
      event.stopPropagation();
    }).appendTo(this.$popupBackground);

    var $popupContent = $('<div/>', {'class': 'h5p-image-hotspot-popup-content'});
    if (header) {
      $popupContent.append($('<div/>', {'class': 'h5p-image-hotspot-popup-header', html: header}));
      this.$popup.addClass('h5p-image-hotspot-has-header');
    }
    $content.appendTo($popupContent);
    $popupContent.appendTo(this.$popup);

    // Need to add pointer to parent container, since this should be partly covered
    // by the popup
    if (fullscreen) {
      this.$closeButton = $('<div>', {
        'class': 'h5p-image-hotspot-close-popup-button',
      }).appendTo(this.$popupBackground);

      var $fullscreenButton = $('.h5p-enable-fullscreen').is(':visible') ? $('.h5p-enable-fullscreen') : ($('.h5p-disable-fullscreen').is(':visible') ? $('.h5p-disable-fullscreen') : undefined);
      if ($fullscreenButton !== undefined) {
        this.$closeButton.css({
          width: $fullscreenButton.outerWidth() + 'px',
          top: $fullscreenButton.outerHeight() + 'px'
        });
      }

      H5P.Transition.onTransitionEnd(self.$popup, function () {
        self.$closeButton.css({
          right: ($fullscreenButton === undefined ? 0 : 2) + 'px'
        });
      }, 300);
    }
    else {
      this.$pointer = $('<div/>', {
        'class': 'h5p-image-hotspot-popup-pointer to-the-' + (toTheLeft ? 'left' : 'right'),
      }).css({
        top: y + 0.5 + '%'
      }).appendTo(this.$popup);
    }

    this.$popupBackground.appendTo(this.$container);

    // Create animation:
    setTimeout(function(){
      self.$popup.css({
        left: popupLeft + '%'
      });
      self.$popupBackground.addClass('visible');
    }, 100);
  }

  Popup.prototype.hide = function () {
    this.$popupBackground.remove();
  };

  return Popup;

})(H5P.jQuery);
