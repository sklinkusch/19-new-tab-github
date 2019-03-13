const moment = require("moment");
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
    let days = moment().date();
    let month = moment().month() + 1;
    let year = moment().year();
    month = month < 10 ? `0${month}` : `${month}`;
    days = days < 10 ? `0${days}` : `${days}`;
    const dateString = `${days}/${month}/${year}`;
    const outputTime = `${hourString}:${minString}<br><div class="small">${dateString}</div>`;
    this.container.innerHTML = outputTime;
  }
  repeat() {
    setInterval(() => {
      this.getTime();
    }, 1000);
  }
}

class RepoSearch {
  constructor(domSel, outputDomSel) {
    this.searchfield = document.querySelector(domSel);
    this.outputField = document.querySelector(outputDomSel);
    this.githubName = "sklinkusch";
    this.initialBackground();
    this.initialRender();
    this.addEventListeners();
    this.menuStyle = "none";
  }
  addEventListeners() {
    const feld = document.querySelector("#reposearch");
    feld.addEventListener("input", event => {
      const filterValue = event.target.value;
      let realData;
      if (filterValue == "") {
        realData = this.data;
      } else {
        realData = this.data.filter(repo =>
          repo.name.toLowerCase().includes(filterValue.toLowerCase())
        );
      }
      this.updateData(realData);
    });
    const settingsIcon = document.querySelector("#toggler");
    settingsIcon.addEventListener("click", () => {
      const menu = document.getElementById("menu");
      menu.style.display = this.menuStyle == "none" ? "block" : "none";
      this.menuStyle = menu.style.display;
    });
    const mainPart = document.querySelector("main");
    mainPart.addEventListener("click", () => {
      const menu = document.getElementById("menu");
      menu.style.display = this.menuStyle == "block" ? "none" : "none";
      this.menuStyle = "none";
    });
    const userButton = document.querySelector("#change-github");
    userButton.addEventListener("click", () => {
      const input = document.querySelector("#githubuser").value;
      if (input != "") {
        this.githubName = input;
        this.initialRender();
      }
    });
    const backgroundImages = document.querySelectorAll(".background");
    backgroundImages.forEach(image => {
      image.addEventListener("click", event => {
        const imageSource = event.target.src;
        document.body.style.backgroundImage = `url(${imageSource})`;
        const titlebar = document.querySelector(".fa-cog");
        const timeContainer = document.getElementById("time");
        const lastTitle = document.getElementById("lasttitle");
        if (imageSource.includes("1424180")) {
          titlebar.style.color = "black";
          timeContainer.style.color = "black";
          lastTitle.style.color = "black";
        } else {
          titlebar.style.color = "white";
          timeContainer.style.color = "white";
          lastTitle.style.color = "white";
        }
        localStorage.setItem("background", imageSource);
      });
    });
  }
  initialBackground() {
    const backgroundSource =
      localStorage.getItem("background") ||
      "assets/pawel-czerwinski-1424194-unsplash.jpg";
    document.body.style.backgroundImage = `url(${backgroundSource})`;
    const titlebar = document.querySelector(".fa-cog");
    const timeContainer = document.getElementById("time");
    const lastTitle = document.getElementById("lasttitle");
    if (backgroundSource.includes("1424180")) {
      titlebar.style.color = "black";
      timeContainer.style.color = "black";
      lastTitle.style.color = "black";
    } else {
      titlebar.style.color = "white";
      timeContainer.style.color = "white";
      lastTitle.style.color = "white";
    }
    localStorage.setItem("background", backgroundSource);
  }
  initialRender() {
    const url = `https://api.github.com/users/${
      this.githubName
    }/repos?per_page=100&client_id=${process.env.ID}&client_secret=${
      process.env.SECRET
    }`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const sorted = data.sort((a, b) => {
          if (a.created_at > b.created_at) {
            return -1;
          } else if (b.created_at < a.created_at) {
            return +1;
          } else {
            return 0;
          }
        });
        this.data = sorted;
        this.updateData(sorted);
      })
      .catch(error => console.log(error));
  }
  updateData(repos) {
    let html = repos
      .map(repo => {
        const {
          name,
          description,
          created_at,
          language,
          has_pages,
          pushed_at,
          html_url
        } = repo;
        let shortDescription;
        if (description != null) {
          shortDescription =
            description.length > 50
              ? `${description.substr(0, 50)}...`
              : description;
        } else {
          shortDescription = null;
        }
        const pagesUrl = `https://${this.githubName}.github.io/${name}/`;
        return `
    <div class="image-card">
    <a href="${html_url}" target=_blank><h2>${name}</h2></a>
    <div class="card-body">
    <ul>
    ${shortDescription != null ? `<li>${shortDescription}</li>` : ""}
    ${language != null ? `<li>main language: ${language}</li>` : ""}
    <li>created on ${this.getDate(created_at)}</li>
    <li>last push on ${this.getDate(pushed_at)}</li>
    <li>published on GitHub Pages: ${
      has_pages ? `<a href="${pagesUrl}" target=_blank>yes</a>` : "no"
    }</li>
    </ul>
      </div>
      </div>
      `;
      })
      .join("");
    this.outputField.innerHTML = html;
  }
  getDate(timestamp) {
    const dateStringArray = timestamp.substr(0, 10).split("-");
    const dateArray = dateStringArray.map(dateString => Number(dateString));
    let [year, month, day] = dateArray;
    month--;
    const date = new Date(year, month, day);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleString("en-US", options);
  }
}

class ExchangeRates {
  constructor(domSel) {
    this.container = document.querySelector(domSel);
    this.repeat();
  }
  repeat() {
    setInterval(() => {
      this.getData();
    }, 1000);
  }
  getData() {
    const url = "https://api.exchangeratesapi.io/latest";
    fetch(url)
      .then(response => response.json())
      .then(data => this.updateData(data))
      .catch(error => console.log(error));
  }
  updateData(data) {
    const { base, date, rates } = data;
    const html = `
    <h4>Exchange Rates (${base})</h4>
    <ul id="rates">
    <li>$: ${rates.USD}</li>
    <li>£: ${rates.GBP}</li>
    <li>¥: ${rates.JPY}</li>
    <li>SFr: ${rates.CHF}</li>
    </ul>
    <p>valid of: ${date}</p>
    `;
    this.container.innerHTML = html;
  }
}
const myTime = new Time("#time");
const myGithub = new RepoSearch("#searchfield", "#repos");
const exchange = new ExchangeRates("#exchange");
