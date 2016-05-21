var mapa;
var arrayMarcadores = [];
var urlBase = "http://localhost:8000/ocorrencias/"

function initMap() {
  mapa = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -20.462302, lng: -55.791090},
    disableDefaultUI: true,
    scrollwheel: false,
    zoom: 15
  });
  mapa.addListener('tilesloaded', function(){
    var ne = mapa.getBounds().getNorthEast();
    var sw = mapa.getBounds().getSouthWest();
    caminho = urlBase + "mapa/?lat=" + ne.lat().toFixed(6) + "&lat=" + sw.lat().toFixed(6) + "&lng=" + ne.lng().toFixed(6) + "&lng=" + sw.lng().toFixed(6);
    console.log(caminho);

    carregaOcorrencias(caminho);
  });
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

/*$(document).ready(function(){
  carregaOcorrencias(urlBase);
})*/

$("#botaoEnvio").click(function() {
    var query = $("#formulario").serialize();
    var caminho = urlBase +"?"+ query;
    console.log(caminho);
    carregaOcorrencias(caminho);
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
    if (arrayMarcadores.length == 0){
      alert("Nenhuma ocorrência encontrada.");
    }
  });
}
