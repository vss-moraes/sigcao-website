(function() {
  var app = angular.module('mapa', []);

  app.controller('MapaController', function($http){
    var self = this;
    self.mapa = '';

    function iniciarMapa(ocorrencias){
      self.mapa = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -20.471069, lng: -55.787273},
        disableDefaultUI: true,
        scrollwheel: false,
        zoom: 14
      });

      function adicionarOcorrencia(mapa, latLong){
        var marcador = new google.maps.Marker({
          position: latLong,
          map: mapa
        });
      }

      var i;
      for (i = 0; i < ocorrencias.length; i++){
        var coordenadas = {
          lat: Number(ocorrencias[i].latitude),
          lng: Number(ocorrencias[i].longitude)
        };

        console.log(coordenadas);

        adicionarOcorrencia(self.mapa, coordenadas);
      }

    };

    $http({
      method: 'GET',
      url: 'http://localhost:8000/ocorrencias.json'
    }).then(function successCallback(response) {
      iniciarMapa(response.data);
    }, function errorCallback() {
      alert('Não foi possível encontrar as ocorrencias');
    });

  });
  
})();