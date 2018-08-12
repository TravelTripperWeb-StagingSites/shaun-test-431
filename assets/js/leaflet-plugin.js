// Leaflet Interactive Map Plugin

(function ($) {
  $.fn.leafMap = function (options) {
    var self     = this;
    var defaults = {
      hotelTitle      : 'Bedrock',
      hotelAddress    : '9 Crosby St New York, NY 10013',
      hotelLat        : 40.719892,
      hotelLong       : -74.000173,
      hotelMarker     : '/assets/images/map-marker.png',
      markerSize      : [36, 46],
      zoom            : 14,
      minZoom         : 0,
      maxZoom         : 20,
      fitBounds       : true,
      attrIconClass   : 'map-circle-icon',
      attrLabel       : false,
      markerLabelText : false,
      categorytypeIcon: false,
      scrollWheelZoom : false,
      scrollOnClick   : true,
      getDirectionBtn : false,
      googleLink      : false,
      websiteLink     : false,
      getDirectionBtnLabel: 'Get Direction',
      hideMarkerLabelHover: true,
      TileStyle       : 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
      attribution     : 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    },

    options                       = $.extend(defaults, options);
    var mapID                     = self.attr('id'); //map element id
    var attractionsArray          = options.attractionsList;
    var formattedAttractionsList  = [];
    var attractionsfilter         = {};

    // Set hotel marker icon
    var hotelIcon = L.icon({
      iconUrl: options.hotelMarker,
      iconSize: options.markerSize
    });

    if (mapID) {
      var map = L.map(mapID, {
        scrollWheelZoom: options.scrollWheelZoom
      });
      map.setView([options.hotelLat, options.hotelLong], options.zoom);
      L.tileLayer(options.TileStyle, {
        attribution: options.attribution,
        minZoom    : options.minZoom,
        maxZoom    : options.maxZoom
      }).addTo(map);

      // Enable scrolling on map after clicking
      map.on('click', function () {
        if(!options.scrollWheelZoom && options.scrollOnClick) {
          if (map.scrollWheelZoom.enabled()) { // if scroll is already enabled then clicking should disable it
            map.scrollWheelZoom.disable();
          } else {
            map.scrollWheelZoom.enable();
          }
        }
      });

      // Set hotel marker
      var marker = L.marker([options.hotelLat, options.hotelLong], {
        title: options.hotelTitle,
        alt  : 'Hotel Map Marker',
        icon : hotelIcon
      }).bindPopup('<h4>' + options.hotelTitle + '</h4>' + options.hotelAddress).addTo(map);

      if($(self).data("attractions") == 'show') {
        loadAttractionMarkers();
        setCategoriesFilter();
        showAttractionsHTMLList();
      }
    }

    // Set attraction markers
    function attractionMarkersIcon($value, $category) {
      var attractionIcon;
      var iconObj = {
        className: $category + options.attrIconClass
      };

      if(options.attrLabel) {
        iconObj = $.extend(iconObj, {
          html: $value
        });
      }
      attractionIcon = L.divIcon(iconObj);
      return attractionIcon;
    }

    function loadAttractionMarkers() {
      for (var i = 0; i < attractionsArray.length; i++) {
        var infoText ='';
        if (options.googleLink) {
          infoText = '<a href="http://maps.google.com/maps?q='+attractionsArray[i][0]+'+'+ attractionsArray[i][4]+'" target="_blank"><h4>' + attractionsArray[i][0] + '</h4>' + attractionsArray[i][4]+ '</a>';
        }else if(!options.websiteLink && options.getDirectionBtn){
          infoText = '<h4>' + attractionsArray[i][0] + '</h4>' + attractionsArray[i][4]+ ' <br><a class="btnDirection" href="http://maps.google.com/maps?q='+ encodeURIComponent(attractionsArray[i][0]).replace(/ /g,'+')+'+'+ encodeURIComponent(attractionsArray[i][4]).replace(/ /g,'+')+'" target="_blank">'+options.getDirectionBtnLabel+'</a>';
        }else if( options.websiteLink && !options.getDirectionBtn) {
          infoText = '<h4><a href="'+attractionsArray[i][5]+'">' + attractionsArray[i][0] + '</a></h4>' + attractionsArray[i][4];
        }
        else if( options.websiteLink && options.getDirectionBtn) {
        infoText = '<h4><a href="'+attractionsArray[i][5]+'">' + attractionsArray[i][0] + '</a></h4>' + attractionsArray[i][4]+ ' <br><a class="btnDirection" href="http://maps.google.com/maps?q='+encodeURIComponent(attractionsArray[i][0]).replace(/ /g,"+")+'+'+ encodeURIComponent(attractionsArray[i][4]).replace(/ /g,'+')+'" target="_blank">'+options.getDirectionBtnLabel+'</a>';
        }
        else{
          infoText = '<h4>' + attractionsArray[i][0] + '</h4>' + attractionsArray[i][4];
        }

        var category                = attractionsArray[i][3];
        var iconClass = options.categorytypeIcon ? attractionsArray[i][3] : '';
        var iconLabel = options.markerLabelText ? attractionsArray[i][0] : i + 1;

        attractionsfilter[category] = attractionsfilter[category] || [];

        marker = new L.marker([attractionsArray[i][1], attractionsArray[i][2]], {
          title: options.hideMarkerLabelHover ? '': attractionsArray[i][0],
          alt  : attractionsArray[i][3],
          icon : attractionMarkersIcon(iconLabel, iconClass),
          riseOnHover: true
        }).bindPopup(infoText).addTo(map);

        var attractionObj = {
          lat     : attractionsArray[i][1],
          lon     : attractionsArray[i][2],
          marker  : marker,
          li      : self,
          category: attractionsArray[i][3]
        };

        formattedAttractionsList.push(attractionObj);
        attractionsfilter[category].push(attractionObj);
      }
    }

    function setCategoriesFilter() {
      var categories             = Object.keys(attractionsfilter);
      var mapcategoryFilterEle   = $("[data-mapcategory-filter]");

      // Add filter
      if (categories.length > 1) {
        // Setup tabs
        if (mapcategoryFilterEle) {
          // First add 'All' option
          mapcategoryFilterEle.append(
            "<li class=\"nav-item\"><a class=\"nav-link active\" data-category='all'>All</a></li>"
          );
          // Now add all categories
          for (var i = 0, ii = categories.length; i < ii; i++) {
            mapcategoryFilterEle.append(
              "<li class=\"nav-item " + $.trim(categories[i]).toLowerCase() + "\"><a class=\"nav-link\" data-category=\"" + categories[i] + "\">" + categories[i] + "</a></li>"
            );
          }
        }
      }

      // Define category filter behaviour

      $("[data-category]").click(function () {
        var bound = []; // Set autofit bound
        var selectedCategory = $(this).data('category');
        $(this).parent('li').siblings().find('a').removeClass('active');
        $(this).addClass('active');
        // Show/hide attractions from html list
        if (selectedCategory != "all") {
          $('[data-mappable-category]').hide();
          $('[data-mappable-category="' + selectedCategory + '"]').show();
        } else {
          $('[data-mappable-category]').show();
        }

        // Show/hide markers based on selected attractions category or 'All'
        for (var i = 0; i < formattedAttractionsList.length; i++) {
          if (formattedAttractionsList[i].category == selectedCategory || selectedCategory == "all") {
            formattedAttractionsList[i].marker.addTo(map);
            bound.push([formattedAttractionsList[i].lat, formattedAttractionsList[i].lon]);
          } else {
            map.removeLayer(formattedAttractionsList[i].marker);
          }
        }

        // Category based fit bounds map
        setTimeout(function(){
          if (options.fitBounds) {
            map.fitBounds(bound);
          }
        },200);
      });
    }

    function showAttractionsHTMLList() {
      var mapcategoryFilterEle   = $("[data-mapcategory-filter]");
      var mapCategoryHtmlListEle = $("[data-mapcategory-list]");

      // Show all attractions
      if (mapCategoryHtmlListEle) {
        // Add attractions items
        $.each(attractionsfilter, function (key1, value1) {
          mapCategoryHtmlListEle.append('<div data-mappable-category="' + key1 + '"><h3>' + key1 + '</h3><ul class="attraction-lists list-' + key1 + '"></ul></div>');
          for (var i = 0; i < value1.length; i++) {
            $('ul.list-' + key1).append('<li data-mappable-item="' + i + '" data-mappable-category="' + value1[i].category + '">' + value1[i].marker.options.title + '</li>');
          };
        });

        // Define each attractions 'on hover' and 'on click' behaviour
        $("[data-mappable-item]").each(function () {
          var categoryitem = $(this).data('mappable-category');
          var itemID       = $(this).data('mappable-item');

          // 'On hover' highlight selected attraction's marker
          $(this).hover(function () {
            $(marker.icon).removeClass('active');
            $(attractionsfilter[categoryitem][itemID].marker._icon).addClass('active');
          }, function () {
            $(attractionsfilter[categoryitem][itemID].marker._icon).removeClass('active');
          });

          // 'On click' show selected attraction's popup
          $(this).click(function () {
            var mlat = $(attractionsfilter[categoryitem][itemID].marker._latlng.lat);
            var mlng = $(attractionsfilter[categoryitem][itemID].marker._latlng.lng);
            mlat.push.apply(mlat, mlng);

            map.panTo({
              lat: mlat[0],
              lng: mlat[1]
            });
            attractionsfilter[categoryitem][itemID].marker.openPopup();
          });
        });
      }
    }
  };

})(jQuery);
