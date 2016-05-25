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

  mapa.addListener('tilesloaded', function(){
  //google.maps.event.addDomListener(window, 'load', function(){
    var ne = mapa.getBounds().getNorthEast();
    var sw = mapa.getBounds().getSouthWest();
    if (urlBase.slice(-1) != "?"){
      urlBase = urlBase + "&";
    }
    caminho = urlBase + "lat=" + ne.lat().toFixed(6) + "&lat=" + sw.lat().toFixed(6) + "&lng=" + ne.lng().toFixed(6) + "&lng=" + sw.lng().toFixed(6);
    console.log(caminho);

    carregaOcorrencias(caminho);
  });
  //});

}

function adicionarOcorrencia (mapa, latLng){
  var marcador = new google.maps.Marker({
    position: latLng,
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

$(document).ready(function(){
})

$("#botaoEnvio").click(function() {
    var query = $("#formulario").serialize();
    //if (query == []){
      urlBase = "http://sigcao.herokuapp.com/ocorrencias/?"
    //}
    urlBase = urlBase + query;
    console.log(urlBase);
    carregaOcorrencias(urlBase);
    return false;
});


function carregaOcorrencias(caminho){
  limpaMarcadores();
  $.ajax({
    url: caminho
  }).then(function(data){
    for (i = 0; i < data.length; i++){
      var coordenadas = {
        lat: Number(data[i].latitude),
        lng: Number(data[i].longitude)
      };
      adicionarOcorrencia(mapa, coordenadas);
    }
    console.log(arrayMarcadores.length);
  });
}
