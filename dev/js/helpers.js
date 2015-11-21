function intoNum(stat){
  var i = stat.indexOf('px');
  var num = '';

  for(j = 0; j < i; j++){
    num += stat[j];
  }

  return num - 0;
}

function genRandomInt(max){
  var ints = Math.floor(Math.random() * (max));
  return ints;
}

function genLength(min, max){
  var m = max / min,
      i = 0,
      options = [];

  for(i; i<m; i++){
    options.push(min * i + min);
  }

  return options;
}