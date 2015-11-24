var expect = chai.expect;

describe('Gameboard', function(){
  var game = new Gameboard();
  describe('constructor', function(){

    it('should have a states array', function(){
      expect(game.states).to.be.an('array');
    });
    
    it('states array should have default states', function(){
      expect(game.states).to.include('alabama');
    });

    it('states array should not include made up states', function(){
      expect(game.states).to.not.include('oarga');
    });

    it('has a layers object', function(){
      expect(game.layers).to.be.an('object');
    });

    it('has a userStates object', function(){
      expect(game.userStates).to.be.an('object');
    });
  });


  describe('createBoard method', function(){
      game.createBoard('orange');
      
      it('should fill the layers obj', function(){
        expect(game.layers).to.not.be.empty;
      });
  });
});

