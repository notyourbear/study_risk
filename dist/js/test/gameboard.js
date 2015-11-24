var expect = chai.expect;

describe('Gameboard', function(){
  describe('constructor', function(){
    var game = new Gameboard();
    
    it('should have default states', function(){
      console.log(game.states);
      expect(game.states).to.include('alabama');
    });

    it('should not include made up states', function(){
      expect(game.states).to.not.include('oarga');
    });

  });
});

