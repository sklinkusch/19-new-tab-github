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
    const outputTime = `${hourString}:${minString}`;
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
    this.id = "3a6a22eb32c03ecfd02b";
    this.secret = "6c1e72cc2af26bdab69798e0ce85f86fb00c3584";
    this.initialBackground();
    this.initialRender();
    this.addEventListeners();
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
      menu.style.display = menu.style.display == "none" ? "block" : "none";
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
        const titlebar = document.getElementById("titlebar");
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
    }/repos?per_page=100&client_id=${this.id}&client_secret=${this.secret}`;
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
          html_url,
          has_pages,
          pushed_at
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
        const githubPages = `https://${this.name}.github.io/${name}`;
        return `
    <div class="image-card">
    <h2>${name}</h2>
    <div class="card-body">
    <ul>
    ${shortDescription != null ? `<li>${shortDescription}</li>` : ""}
    ${language != null ? `<li>main language: ${language}</li>` : ""}
    <li>created on ${this.getDate(created_at)}</li>
    <li>last push on ${this.getDate(pushed_at)}</li>
    <li>published on GitHub Pages: ${has_pages ? "yes" : "no"}</li>
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

const myTime = new Time("#time");
const myGithub = new RepoSearch("#searchfield", "#repos");
