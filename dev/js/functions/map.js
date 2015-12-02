function createMap(id, options, coords, scale){
  return L.map(id, options).setView(coords, scale);
}