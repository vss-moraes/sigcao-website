var mapa;
function initMap() {
  mapa = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -20.462302, lng: -55.791090},
    disableDefaultUI: true,
    scrollwheel: false,
    zoom: 14
  });
}

function adicionarOcorrencia (mapa, latLng){
  var marcador = new google.maps.Marker({
    position: latLng,
    map: mapa
  });
}

var ocorrencias;
$(document).ready(function(){
  $.ajax({
    url: "http://sigcao.herokuapp.com/ocorrencias.json"
  }).then(function(data){
    for (i = 0; i < data.length; i++){
      var coordenadas = {
        lat: Number(data[i].latitude),
        lng: Number(data[i].longitude)
      };
      console.log(coordenadas);
      adicionarOcorrencia(mapa, coordenadas);
    }
  });
});
