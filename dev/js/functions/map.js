function createMap(id, options, coords, scale){
  return L.map(id, options).setView(coords, scale);
}

function getListId(){
  var pathname = window.location.pathname;
  var id = "";
  var i = 6;

  for(i; i<pathname.length; i++){
    id += pathname[i];
  }

  return id;
}