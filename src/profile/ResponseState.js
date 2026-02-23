export class ResponseState {
  static Unknown = new ResponseState('unknown');
  static Responded = new ResponseState('responded');
  static NotResponded = new ResponseState('not_responded');

  constructor(name) {
    this.name = name;
  }
}