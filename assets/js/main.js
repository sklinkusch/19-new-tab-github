class Time {
  constructor(docSel) {
    this.container = document.querySelector(docSel);
    this.getTime();
    this.repeat();
  }
}
