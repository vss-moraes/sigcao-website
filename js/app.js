var mapa;
var mapaDiv = document.getElementById('map');
var arrayMarcadores = [];
var urlBase = "http://localhost:8000/ocorrencias/?"

function initMap() {
  mapa = new google.maps.Map(mapaDiv, {
    center: {lat: -20.462302, lng: -55.791090},
    disableDefaultUI: true,
    scrollwheel: false,
    zoom: 14
  });

  google.maps.event.addDomListener(window, 'load', function(){
    caminho = urlBase + "doenca=Babesiose&doenca=Cinomose&doenca=Coronavirose&doenca=Ehrlichiose&doenca=Hepatite+Infecciosa&doenca=Leishmaniose&doenca=Leptospirose&doenca=Parainfluenza&doenca=Parvovirose&doenca=Raiva";
    carregaOcorrencias(caminho);
  });

  var limitesPermitidos = new google.maps.LatLngBounds(
      new google.maps.LatLng(-20.517839, -55.856804),
      new google.maps.LatLng(-20.400109, -55.707116)
  );
  var ultimoCentroValido = mapa.getCenter();

  google.maps.event.addListener(mapa, 'center_changed', function() {
      if (limitesPermitidos.contains(mapa.getCenter())) {
          ultimoCentroValido = mapa.getCenter();
          return;
      }
      mapa.panTo(ultimoCentroValido);
  });
}

function adicionarOcorrencia (mapa, latLng, icone){
  var marcador = new google.maps.Marker({
    position: latLng,
    icon: icone,
    map: mapa
  });
  arrayMarcadores.push(marcador);
}

function limpaMarcadores(){
  for (var i = 0; i < arrayMarcadores.length; i++){
    arrayMarcadores[i].setMap(null);
  }
  arrayMarcadores.length = 0;
}

function carregaOcorrencias(caminho){
  $.ajax({
    url: caminho
  }).then(function(data){
    limpaMarcadores();
    for (i = 0; i < data.length; i++){
      var coordenadas = {
        lat: Number(data[i].latitude),
        lng: Number(data[i].longitude)
      };
      var cores = ['yellow', 'blue', 'green', 'ltblue', 'orange', 'pink', 'purple', 'red'];
      var icone = "https://maps.google.com/mapfiles/ms/icons/" + cores[data[i].doenca.id - 1] +  "-dot.png";
      adicionarOcorrencia(mapa, coordenadas, icone);
    }
  });
}

$(document).on({
    ajaxStart: function() {
        $('#carregando').show();
    },
    ajaxStop: function() {
        $('#carregando').hide();
        $("#barra_busca").removeClass("is-visible");
        $("#barra_busca").attr("aria-hidden", "true");
        $(".mdl-layout__obfuscator").removeClass("is-visible");
    }
});

$("#botaoEnvio").click(function() {
    var query = $("#formulario").serialize();
    // urlBase = "http://localhost:8000/ocorrencias/?" + query;
    carregaOcorrencias("http://localhost:8000/ocorrencias/?" + query);
    return false;
});

$(document).ready(function(){
    $('#carregando').hide();
});
