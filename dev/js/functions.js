function inObj(key){
  if(this.hasOwnPropety(key)){
    return true;
  }

  return false;
}

function createMap(id, options, coords, scale){
  return L.map(id, options).setView(coords, scale);
}