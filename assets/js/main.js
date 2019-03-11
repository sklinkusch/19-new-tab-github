class Time {
  constructor(docSel) {
    this.container = document.querySelector(docSel);
    this.getTime();
    // this.repeat();
  }
  getTime() {
    const timeObject = moment();
    const currentTime = timeObject._d;
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const hourString = hours < 10 ? `0${hours}` : `${hours}`;
    const minString = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const outputTime = `${hourString}:${minString}`;
    console.log(outputTime);
    this.container = outputTime;
  }
}

const myTime = new Time("#time");
