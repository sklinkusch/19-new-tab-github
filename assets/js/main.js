class Time {
  constructor(docSel) {
    this.container = document.querySelector(docSel);
    this.repeat();
  }
  getTime() {
    const timeObject = moment();
    const currentTime = timeObject._d;
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const hourString = hours < 10 ? `0${hours}` : `${hours}`;
    const minString = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const outputTime = `${hourString}:${minString}`;
    this.container.innerHTML = outputTime;
  }
  repeat() {
    setInterval(() => {
      this.getTime();
    }, 1000);
  }
}

const myTime = new Time("#time");
