var mapa;
var mapaDiv = document.getElementById('map');
var arrayMarcadores = [];
var urlBase = "http://sigcao.herokuapp.com/ocorrencias/?"

function initMap() {
  mapa = new google.maps.Map(mapaDiv, {
    center: {lat: -20.462302, lng: -55.791090},
    disableDefaultUI: true,
    scrollwheel: false,
    zoom: 15
  });

  // mapa.addListener('tilesloaded', function(){
  google.maps.event.addDomListener(window, 'load', function(){
    var ne = mapa.getBounds().getNorthEast();
    var sw = mapa.getBounds().getSouthWest();
    if (urlBase.slice(-1) != "?"){
      urlBase = urlBase + "&";
    }
    caminho = urlBase + "lat=" + ne.lat().toFixed(6) + "&lat=" + sw.lat().toFixed(6) +
              "&lng=" + ne.lng().toFixed(6) + "&lng=" + sw.lng().toFixed(6);
    console.log(caminho);

    carregaOcorrencias(caminho);
  });
  //});
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
    console.log(arrayMarcadores.length);
  });
}

$body = $("body");

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
    urlBase = "http://sigcao.herokuapp.com/ocorrencias/?" + query;
    carregaOcorrencias(urlBase);
    return false;
});

$(document).ready(function(){
    $('#carregando').hide();
});
