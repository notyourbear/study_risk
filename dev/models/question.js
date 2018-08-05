/* Question Model:
* @answers: array of objects: { value: string, isValid: boolean }
* @question: string
* @type: string [radio, input, multiple-choice]
*/

class Question {
  constructor(options = {}) {
    let { answers, question, type } = options;

    this.answers = answers;
    this.question = question;
    this.type = type;
  }

  shuffle() {
    let len = this.answers.length;
    while (len) {
      let index = Math.floor(Math.random() * len);
      len--;

      let temporary = this.answers[len];
      this.answers[len] = this.answers[index];
      this.answers[index] = temporary;
    }
  }

  validate(choice) {
    // under the assumption that choice is just the string.
    let answer = this.answers.find(answer => answer.value = choice);
    return !!(answer && answer.isValid);
  }
}


export default Question;
