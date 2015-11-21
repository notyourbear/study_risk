function placeBlock(templ, location, info){
  var source = $(templ).html(),
      template = Handlebars.compile(source),
      html = template(info);
      $(location).html(html);

  console.log('created');
}

function findPlace(side, oldBlock, body){
  console.log(oldBlock, 'old!');
  this[side] = oldBlock[body] + oldBlock[side];
}

function createBlock(id, type, qtype){
    return {
      'block-id': id,
      'block-type': type,
      'question-type': qtype
    };
}

function locateBlock(id){
  var $block = $('#block-'+id);
  
  var obj = {
    bottom: $block.css('bottom'),
    left: $block.css('left'),
    width: $block.css('width'),
    height: $block.css('height')
  };

  console.log(obj, 'baaaalh', id);
  return obj;
}

function setSide(side, lengthArr){
  var length = lengthArr[genRandomInt(lengthArr.length)];
  this[side] = length;
  
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

// function fits(block, field, side){

// }

// function calcLocation(blockLocation, fieldInfo){
//   var left = blockLocation.left;
//   var bottom = blockLocation.bottom;
//   var i = 1;

//   var options = [];

//   for(i; i < 4; i++){

//   }
// }

$(document).ready(function(){
  var blocks = {
    min: 25,
    max: 100
  };

  var field = {
    width: 600,
    height: 400
  };

  var a = {
    'block-id': 1,
    'block-height': 50,
    'block-width': 50,
    'block-type': 'black',
    'question-type': 'paw'
  };


  var b = createBlock(2, 'green', 'paw');
  setSide.call(b, 'block-height', genLength(blocks.min, blocks.max));
  setSide.call(b, 'block-width', genLength(blocks.min, blocks.max));
  // findPlace.call(b, 'left', locateBlock(1), 'width');
  // findPlace.call(b, 'bottom', locateBlock(1), 'height');
  console.log(b, 'newblock');

  placeBlock('#block-template', '#game-field', a);
  console.log(locateBlock(1));


}); //end ready

// block-id
// block-type
// question-type
