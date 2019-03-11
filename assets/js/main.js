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
    this.initialRender();
    // this.render("");
    // this.addEventListeners();
  }
  initialRender() {
    const url = `https://api.github.com/users/${
      this.githubName
    }/repos?per_page=100&client_id=${this.id}&client_secret=${this.secret}`;
    fetch(url)
      .then(response => response.json())
      .then(data => this.updateData(data))
      .catch(error => console.log(error));
  }
  updateData(repos) {
    this.data = repos;
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
