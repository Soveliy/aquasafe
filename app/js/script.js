$('.slick-slider').slick({
    fade: true,
  cssEase: 'linear'
});
   

$('.calc-result__close').on('click', function() {
    $(".calc-result").addClass("js-hide");
});


$(".substance__item").hover(function(){
    $(this).children().next().next().delay(100).toggle(300);
    $(this).toggleClass("zIndex")
});
$('.calc__button').on('click', function() {
    $(".calc-result").removeClass("js-hide");
});

// $(".substance__container").hover(function(){
//     setTimeout(() => {
//         $(e.currentTarget).addClass('is-active');
//     }, 500)
// });

    
    $(".substance__container").hover(function(){
        // $(this).toggleClass("slower")
        setTimeout(function() { 
            $(".substance__container").toggleClass("active");
        }, 300);
        });

    // var isVisibilite = $(".section__shops_city_popup").hasClass("on");
    // console.log(isVisibilite);

 
    // $("#chloramine").velocity({
    //     transform: "rotate(692deg)",

    // }, {
    //     /* Velocity's default options */
    //     duration: 14000,
    //     queue: "",
    //     loop: false,
    //     mobileHA: false
    // });

    
  // Переключение типа Магазина
$('.jsTypeShops').on('click', function() {
  const jsTypeShops = $('.jsTypeShops');
  let typeShops = $(this).attr('data-shops-type');
  if (jsTypeShops.hasClass('active')) {
      jsTypeShops.removeClass('active');
  }
  $(this).addClass('active');

  function typeShopsBoxShow() {
      let typeShopsTab = '.section__shops_type_item_' + typeShops;
      let tapTypeShops = '.section__shops_box_' + typeShops;

      if ($('.section__shops_box').hasClass('active')) {
          $('.section__shops_box').removeClass('active').hide();
      }

      if ($('.jsTypeShops').hasClass('active')) {
          $('.jsTypeShops').removeClass('active');
      }

      $(tapTypeShops).addClass('active').show();
      $(typeShopsTab).addClass('active').show();
  }

  typeShopsBoxShow();
});

// Поиск города в попап
const сityInput = $('.section__shops_city_popup_search input');
const сityInputRes = $('.section__shops_city_popup_search_result');

сityInput.on('keyup', function() {
  const сityInputVal = сityInput.val();
  сityInputRes.html('');
  const citiesData = searchCityData.filter(function(cityData) {
      return cityData.name.startsWith(сityInputVal);
  });
  citiesData.forEach(function(cityName) {
      var cityAddObj = $('<div>' + cityName.name + '</div>').attr({
          class: 'section__shops_city_popup_search_result_item',
          'data-city': cityName.name,
          'data-city-slug': cityName.slug,
      });
      сityInputRes.prepend(cityAddObj);
  });

  if (сityInputVal === '') {
      сityInputRes.html('');
      сityInputRes.hide();
  } else {
      сityInputRes.show();
  }
});

// Проверяем есть ли .shopsBoxMapPopup
if ($('.shopsBoxMapPopup').length > 0) {
  // По клику на 'Показать на карте' показываем попап с картой
  $(document).on('click', '.shopsBoxMapPopup', function () {
      let dataCoordinates = $(this).attr('data-shops-coordinates');
      console.log(dataCoordinates);
      if (!mapScript.setPopupPlacemark(dataCoordinates, $(this).closest('.section__shops_box_item'))) {
          return false;
      }
      // Показываем попап
      $('.section__shops_popup').
      show().
      addClass('on');
      $(".city__popup-wrapper").show();
      // Показываем overlay
      $('.section__shops_popup_overlay').
      show().
      addClass('on');
  });

  // По клику на overlay, скрываем и его и сам попап
  $('.section__shops_popup_overlay').on('click', function () {
      $(this).
      removeClass('on').
      hide();
      $('.section__shops_popup').
      removeClass('on').
      hide();
  });
  // По клику на кнопку Close закрывает попап и скрываем overlay
  $('.section__shops_popup_close').on('click', function () {
      $('.section__shops_popup').
      removeClass('on').
      hide();
      $('.section__shops_popup_overlay').
      removeClass('on').
      hide();
  });

 
};
jQuery(function($){
  $(document).mouseup(function (e){ // отслеживаем событие клика по веб-документу
      var block = $(".city__popup-wrapper"); // определяем элемент, к которому будем применять условия (можем указывать ID, класс либо любой другой идентификатор элемента)
      if (!block.is(e.target) // проверка условия если клик был не по нашему блоку
          && block.has(e.target).length === 0) { // проверка условия если клик не по его дочерним элементам
          $(".section__shops_city_popup").hide(); // если условия выполняются - скрываем наш элемент
          $(".section__shops_city_popup").removeClass("on");
      }
  });
});
if ($('#shops-box-maps').length > 0) {
  function init() {
      ymaps.geolocation
          .get({
              provider: 'yandex',
              mapStateAutoApply: true,
          })
          .then(
              function(res) {
                  var userCity = res.geoObjects
                      .get(0)
                      .properties.get('name');
                  var userCoordinates = res.geoObjects.position;

                  // Добавляем город в localStorage
                  localStorage.setItem('geoUserCity', userCity);

                  // Добавляем город в localStorage
                  localStorage.setItem(
                      'geoUserPosition',
                      userCoordinates
                  );
                
                  var userInfo = 'Вы находитесь в городе: ' + userCity +  ', координаты: ' + userCoordinates;
                
                  console.log(userInfo);

                  mapScript.filter(
                      localStorage.getItem('userCity')
                  );

                  // Автоматический выбор города на основе геоположения пользователя
                  if (localStorage.getItem('userCity') !== null) {
                      const userCity = localStorage.getItem(
                          'userCity'
                      );
                      $('#user-city').text(userCity);
                  } else {
                      console.log('Санкт-Петербург');
                  }
              },
              function(err) {
                  console.log(err);
              }
          );
  }

  ymaps.ready(init);

  var mapScript = {
      ready: function() {
          if (localStorage.getItem('userPosition')) {
              var mapScriptcenter = localStorage.getItem(
                  'userPosition'
              );
          } else {
              var mapScriptcenter = '[55.753215, 37.622504]';
          }

          mapScript.mapParams = {
              center: mapScriptcenter,
              zoom: 12,
          };
          // if ($(window).width() > 0) {
          //     mapScript.geoLocation = false;
          //     return mapScript.createMap();
          // }
          ymaps.geolocation.get().then(
              function(res) {
                  mapScript.mapParams.center =
                      res.geoObjects.position;
                  mapScript.geoLocation = false;
                  mapScript.mapParams.zoom = 10;
                  mapScript.createMap();
                  res.geoObjects.options.set(
                      'preset',
                      'islands#nightCircleDotIcon'
                  );
                  mapScript.map.geoObjects.add(res.geoObjects);
              },
              function(e) {
                  mapScript.geoLocation = false;
                  mapScript.createMap();
              }
          );
      },
      createMap: function() {
          // console.log(mapScript.mapParams);
          (mapScript.map = new ymaps.Map('shops-box-maps', {
              center: mapScript.mapParams.center,
              zoom: mapScript.mapParams.zoom,
              controls: ['zoomControl'],
              behaviors: ['drag'],
          })),
              (mapScript.objectManager = new ymaps.ObjectManager({
                  // Чтобы метки начали кластеризоваться, выставляем опцию.
                  clusterize: true,
                  // ObjectManager принимает те же опции, что и кластеризатор.
                  preset: 	'islands#nightClusterIcons',
                  gridSize: 32,
                  clusterDisableClickZoom: true,
              }));
          mapScript.popupMap = new ymaps.Map('MapPopup', {
              center: [54.83, 37.11],
              zoom: 17,
              controls: ['zoomControl'],
              behaviors: ['drag'],
          });

          mapScript.objectManager.objects.options.set(
              'preset',
              'islands#nightCircleDotIcon'
          );

          mapScript.objectManager.clusters.options.set(
              'preset',
              'islands#nightClusterIcons'
          );
          mapScript.map.geoObjects.add(mapScript.objectManager);
          mapScript.objectManager.add(collection);
          mapScript.filter();

          mapScript.map.events.add('sizechange', function() {
              if (mapScript.geoLocation == false) {
                  var bounds = mapScript.objectManager.getBounds();
                  if (bounds) {
                      mapScript.map.setBounds(bounds, {
                          checkZoomRange: true,
                      });
                  }
              }
          });
      },
      setPopupPlacemark: function(coordinates, shopItem) {
          let shopData = { coordinates: coordinates };
          coordinates = coordinates.match(/[\d\.]{2,}/g);
          if (coordinates.length !== 2) {
              return false;
          }
          coordinates[0] = parseFloat(coordinates[0]);
          coordinates[1] = parseFloat(coordinates[1]);
          mapScript.popupMap.geoObjects.removeAll();
          shopData.title = shopItem
              .find('.title')
              .attr('data-shops-title');
          shopItem.find('.desc_line').each(function() {
              if ($(this).attr('data-shops-url') !== undefined) {
                  shopData.url = $(this).attr('data-shops-url');
              }
              if ($(this).attr('data-shops-adress') !== undefined) {
                  shopData.address = $(this).attr(
                      'data-shops-adress'
                  );
              }
              if (
                  $(this).attr('data-shops-works_time') !== undefined
              ) {
                  shopData.workTime = $(this).attr(
                      'data-shops-works_time'
                  );
              }
              if ($(this).attr('data-shops-phone') !== undefined) {
                  shopData.phone = $(this).attr('data-shops-phone');
              }
          });
          // console.log(shopData);
          let myPlacemark = new ymaps.Placemark(
              [coordinates[0], coordinates[1]],
              {
                  // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
                  balloonContentHeader: shopData.title,
                  balloonContentBody:
                      shopData.address + '<br>' + shopData.workTime,
                  balloonContentFooter: shopData.phone,
                  hintContent:
                      shopData.title + ' - ' + shopData.address
              },
              { preset: 'islands#nightCircleDotIcon' }
          );

          mapScript.popupMap.geoObjects.add(myPlacemark);
          mapScript.popupMap.setCenter([
              coordinates[0],
              coordinates[1],
          ]);
          return true;
      },
      filter: function(city) {
          city = city || 'Москва';
          mapScript.objectManager.setFilter(
              'properties.city == "' + city + '"'
          );
          if (mapScript.geoLocation == false) {
              var bounds = mapScript.objectManager.getBounds();
              if (bounds) {
                  mapScript.map.setBounds(bounds, {
                      checkZoomRange: true,
                  });
              }
          } else {
          console.log('No');
        }
      },
  };
  ymaps.ready(mapScript.ready);
}