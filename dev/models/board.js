import states from './states';

/* Board Model:
* @FIELDS: board field
*/

class Board {
  constructor(options) {
    let { fields } = options;

    this.bordering = {};
    this.borderStatesColors = ['#fce8c7'];
    this.currentBorderStatesColor = 0;
    this.currentUserStateColor = 0;
    this.enemyStates = {};
    this.fields = fields || states;
    this.layers = {};
    this.stateProps = {};
    this.userStates = {};
    this.userStatesColors = ['#b8b453', '#9c9c44', '#96964d', '#8f8e4f'];
    this.vacantStates = {};
  }

  init(el) {

  }
}


export default Board;
