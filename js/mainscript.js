/**
       * The main namespace
       */
      var TravelByEvent = {};

      /**
       * A constructor function that creates a new carousel frame HTML 
       */
      TravelByEvent.CarouselFrame = (function($, _){

        if(!$){
          throw 'jQuery was not loaded!';
        }

        if(!_){
          throw 'Underscore was not loaded!';
        }

        /**
         * Get the template once 
         */
        var _template = _.template($('#event-travel-carousel-frame').html());

        /**
         * Main constructor function
         */
        var CarouselFrame = function(data){

          this.eventSubject = data.eventSubject || '';
          this.eventfulLink = data.eventfulLink || '';
          this.imageUrl = data.imageUrl || '';
          this.eventDate = data.eventDate || '';
          this.eventLocation = data.eventLocation || '';
          this.venueName = data.venueName || '';
          this.additionalInfo = data.additionalInfo || '';

        };
        CarouselFrame.prototype.getTemplate = function(){
          return _template;
        }
        CarouselFrame.prototype.generateHTML = function(){
          var params = {
            event_subject:this.eventSubject,
            eventful_link:this.eventfulLink,
            image_url:this.imageUrl,
            event_date:this.eventDate,
            event_location:this.eventLocation,
            venue_name:this.venueName,
            additional_info:this.additionalInfo
          }
          return this.getTemplate()(params);
        }
        return CarouselFrame;
      }(jQuery, _));

      /**
       * Generate html frame from data
       */
      TravelByEvent.FrameCreator = (function($, _, CarouselFrame){
        if(!$){
          throw 'jQuery was not loaded!';
        }

        if(!_){
          throw 'Underscore was not loaded!';
        }

        if(!CarouselFrame){
          throw 'CarouselFrame was loaded!';
        }

        var FrameCreator = function(framesData){
          this.framesData = framesData || [];
        }
        FrameCreator.prototype.getFrameData = function(index){
          if(_.isNaN(index)){
            throw 'index must be a number';
          }
          if(index >= this.framesData.length){
            throw 'index must be a lower than frames count';
          }
          var rawData = this.framesData[index];
          var frameData = {
            eventSubject:rawData.title || '',
            eventfulLink:rawData.url || '',
            imageUrl:rawData.image && rawData.image.block250 && rawData.image.block250.url || 'images/placeholder.jpg',
            eventDate:rawData.start_time || '',
            eventLocation:(rawData.city_name + ", " || '') + (rawData.country_name || ''),
            venueName:rawData.venue_name || '',
            additionalInfo:rawData.description || ''
          }
          return frameData;
        }
        FrameCreator.prototype.generateFrameHTML = function(index){
          var carouselFrame = new CarouselFrame(this.getFrameData(index));
          return carouselFrame.generateHTML();
        }
        FrameCreator.prototype.generateAllHTML = function(){
          var htmlString = '';
          for(var i = 0, len = this.framesData.length; i < len; i++){
            htmlString += this.generateFrameHTML(i);
          }
          return htmlString;
        }
        return FrameCreator;
      }(jQuery,_, TravelByEvent.CarouselFrame));

      /**
       * A simple controller for the carousel
       */
      TravelByEvent.carouselController = (function($, _, frameCount){
        var _currentPosition = +$('.js-event-travel-carousel-container').css("top").split("px")[0], _max = (510 * (frameCount - 1)) * -1;
        function _moveNext(){
          if(_currentPosition > _max){
            _currentPosition += -510;
            $('.js-event-travel-carousel-container').animate({left:_currentPosition + "px"});
          }
        }

        function _moveBack(){
          if(_currentPosition < 0){
            _currentPosition += 510;
            $('.js-event-travel-carousel-container').animate({left:_currentPosition + "px"});
          }
        }
        return {
          moveNext: function(){
            _moveNext();
          },
          moveBack:function(){
            _moveBack();
          }
        }

      }(jQuery, _, fakeData.events.event.length));

      $(function(){
        var frameCreator = new TravelByEvent.FrameCreator(fakeData.events.event);
        $('.js-event-travel-carousel-container').empty().append(frameCreator.generateAllHTML());

        $(document).on('click', function(event){
          if($(event.target).hasClass('js-event-travel-carousel-next-button')){
            TravelByEvent.carouselController.moveNext();
          }
          if($(event.target).hasClass('js-event-travel-carousel-back-button')){
            TravelByEvent.carouselController.moveBack();
          }
        })
      });