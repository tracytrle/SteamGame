const baseUrl = `https://steam-api-mass.onrender.com/games`;

let listOfCategory;
let pageApi = 0;

const categoryIdList = [];
const genresList = [];
let inputQueryList = [];

let showingGameByGenre = document.getElementById("showing-games");
let showmoregameBtn = document.getElementById("footerTag");

// step1: show Categories
// get list of Genres from API
async function getListOfGenres() {
  try {
    let categoryUrl = `https://steam-api-mass.onrender.com/genres?limit=29`;
    let data = await fetch(categoryUrl);
    const res = await data.json();
    const categories = res.data;
    // console.log("getListOfGenres from query: ", categories);
    return categories;
  } catch (err) {
    console.log("Err: ", err);
  }
}

// display Categories
async function displayCategories() {
  listOfCategory = await getListOfGenres();

  // console.log("print all cate list: ", listOfCategory);
  let categoryQuery = document.getElementById("categoryGroup");
  let ulCategoryQuery = categoryQuery.children[0];
  while (ulCategoryQuery.firstChild) {
    ulCategoryQuery.removeChild(ulCategoryQuery.firstChild);
  }

  listOfCategory.forEach((category, index) => {
    let name = category.name;

    let capName = name.charAt(0).toUpperCase() + name.slice(1);
    const liEle = document.createElement("li");
    liEle.id = `category-${index}`;
    liEle.textContent = capName;
    ulCategoryQuery.appendChild(liEle);
  });
}

// loading the first page
window.addEventListener("load", function () {
  displayCategories();
  renderAllGamesDefault();
});

// Home Icon
let homeIcon = document.getElementById("home-tab");
homeIcon.addEventListener("click", async function () {
  // console.log("test homeicon");
  renderAllGamesDefault();
});

// get 24 games for each page
async function getAllGames(pageApi) {
  try {
    let baseUrl = `https://steam-api-mass.onrender.com/games?limit=24`;
    let url = `${baseUrl}&page=${pageApi}`;
    let data = await fetch(url);
    let res = await data.json();
    return res;
  } catch (err) {
    console.log("Err: ", err);
  }
}

// Show default games on the browser
async function renderAllGamesDefault() {
  pageApi = 1;
  let data = await getAllGames(pageApi);
  console.log("getbyDefaultdata: ", data);
  renderGamesByGenre(data);
}

// Loadmore buttion. Noted: we can allow more than 5 pages to load
let loadmore = document.getElementById("loadmore");
loadmore.addEventListener("click", async function () {
  pageApi++;
  console.log("test showmore game with page: ", pageApi);
  if (pageApi < 5) {
    let dataList = await getAllGames(pageApi);
    console.log("getbyDefaultdata: ", dataList);
    let size = dataList.length < 24 ? dataList.length : 24;
    for (let i = 0; i < size; i++) {
      console.log("====TestRenderGamesByGenre loop");
      let image = dataList.data[i].header_image;
      let gameName = dataList.data[i].name;
      let price = dataList.data[i].price;
      let gameAppId = dataList.data[i].appid;
      const x = document.createElement("div");
      addGameInFo(x, image, gameAppId, gameName, price);
      showingGameByGenre.appendChild(x);
    }
  } else {
    loadmore.disabled = true;
  }
});

// Step2: get list of games base on chosen category
const categoryGroup = document.getElementById("categoryGroup").children[0];
// console.log("get ul html: ", categoryGroup);
categoryGroup.addEventListener("click", async (category) => {
  const name = category.target.innerText.toLowerCase();
  // console.log("name: ", name);
  let url = getUrlFromCatergory(name);
  let gamesListFromData = await getGameListFromQuery(url);
  // console.log("print gameList: ", gamesListFromData);
  renderGamesByGenre(gamesListFromData);
});

// get new url from given genre
function getUrlFromCatergory(genre) {
  let newUrl = `${baseUrl}?genres=${genre}&limit=24`;
  // console.log("print new url: ", newUrl);
  return newUrl;
}

// get Game List from query
async function getGameListFromQuery(url) {
  // console.log("==========test GetActionGameList");
  try {
    const data = await fetch(url);
    // console.log("print new url: ", url);
    const res = await data.json();
    // console.log("print gamelist res: ", res);
    return res;
  } catch (err) {
    console.log("ERROR: ", err);
  }
}

// Loading Games on the pages
function renderGamesByGenre(gamesList) {
  showingGameByGenre.innerHTML = "";
  let size = gamesList.length < 24 ? gamesList.length : 20;

  for (let i = 0; i < size; i++) {
    console.log("====TestRenderGamesByGenre ");
    let image = gamesList.data[i].header_image;
    let gameName = gamesList.data[i].name;
    let price = gamesList.data[i].price;
    let gameAppId = gamesList.data[i].appid;
    // console.log("getchild properties: ", gameName, price);

    const x = document.createElement("div");
    addGameInFo(x, image, gameAppId, gameName, price);
    showingGameByGenre.appendChild(x);
  }
}

// add info for list of games
function addGameInFo(element, image, gameAppId, gameName, price) {
  element.classList.add("game_wrapper");
  element.innerHTML = `
  <div class="cover" onclick="getDetail(${gameAppId})">
    <img
      src=${image}
      data-id=${gameAppId}
    />
  </div>
  <div class="game-info">
    <p id="game-name">${gameName}</p>
    <p id="game-price">$${price}</p>
  </div>`;
}

// part 3: get detail of game
async function getGameDetail(gameId) {
  try {
    let baseUrl = `https://steam-api-mass.onrender.com/single-game/`;
    let url = `${baseUrl}${gameId}`;

    const data = await fetch(url);
    const res = await data.json();
    return res.data;
  } catch (err) {
    console.log("ERR: ", err);
  }
}

function addSingleGameDetail(singleGameInfo) {
  console.log("====TestgetSingleGame");
  while (showingGameByGenre.firstChild) {
    showingGameByGenre.removeChild(showingGameByGenre.firstChild);
  }
  const divShowingGames = document.createElement("div");

  const titleName = document.createElement("div");
  titleName.classList.add("game-title");
  titleName.innerText = `${singleGameInfo.name}`;
  divShowingGames.appendChild(titleName);

  const gameDetail = document.createElement("div");
  let review =
    singleGameInfo.positive_ratings > singleGameInfo.negative_ratings
      ? "Positive"
      : "Negative";
  gameDetail.classList.add("game-detail");
  gameDetail.innerHTML = `
  <div class="image">
              <img
                src=${singleGameInfo.header_image}
                alt="game-picture"
              />
            </div>
            <div class="contain">
              <p class="description">${singleGameInfo.description}</p>
             <div class="moreinfo">
              <p>RECENT REVIEW : ${review} </p>
              <p>RELEASE DATE: ${singleGameInfo.release_date.substring(
                0,
                10
              )}</p>
              <p>DEVELOPER: ${singleGameInfo.developer}</p>
              <p>Price: $${singleGameInfo.price}</p>
            </div> 
            </div>`;

  divShowingGames.appendChild(gameDetail);

  const gameTags = document.createElement("div");
  gameTags.classList.add("game-tags");

  // create p tag
  const pShow = document.createElement("p");
  pShow.innerText = "Popular user-defined tags for this product:";
  gameTags.appendChild(pShow);
  const allTags = document.createElement("div");
  allTags.classList.add("tags");

  singleGameInfo.steamspy_tags.forEach((tagName) => {
    const tag = document.createElement("div");
    tag.classList.add("tag");
    tag.innerText = `${tagName}`;
    allTags.appendChild(tag);
  });
  gameTags.appendChild(allTags);
  divShowingGames.appendChild(gameTags);
  showingGameByGenre.appendChild(divShowingGames);
}

async function getDetail(gameId) {
  // set cursor for onclick
  document.body.style.cursor = "wait";
  let singlegameDetail = await getGameDetail(gameId);
  // console.log("print getSingleData: ", singlegameDetail);
  addSingleGameDetail(singlegameDetail);
  document.body.style.cursor = "auto";
}

// Step 4: search Input

const inputBox = document.getElementById("searchInput");
const searchBtn = document.getElementById("search-logo");

async function getGameByName(gameName) {
  try {
    let baseUrl = `https://steam-api-mass.onrender.com/games?`;
    let url = `${baseUrl}q=${gameName}`;
    console.log("print url: ", url);
    let data = await fetch(url);
    const res = await data.json();
    // console.log("print rederndata: ", res);
    console.log("print rederndata2: ", res.data);
    return res.data;
  } catch (err) {
    console.log("ERR", err);
  }
}

function renderGamesByName(gamesData) {
  console.log("====TestRenderGamesByName");

  console.log("getid: ", gamesData[0].appid);
  showingGameByGenre.innerHTML = "";
  console.log("getparent: ", showingGameByGenre);
  for (let i = 0; i < gamesData.length; i++) {
    const image = gamesData[i].header_image;
    const gameName = gamesData[i].name;
    const price = gamesData[i].price;
    const gameAppId = gamesData[i].appid;
    const x = document.createElement("div");
    addGameInFo(x, image, gameAppId, gameName, price);
    showingGameByGenre.appendChild(x);
  }
}
// get Input by Enter
inputBox.addEventListener("keydown", async function (event) {
  if (event.keyCode === 13) {
    let gameDataFromAPI = await getGameByName(inputBox.value);
    console.log("=====testInputBox with data: ", gameDataFromAPI);

    renderGamesByName(gameDataFromAPI);
  }
});

// get input by button
searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  console.log("=====testInputBox");
  console.log("=====testInputBox with input: ", inputBox.value);
  let gameDataFromAPI = await getGameByName(inputBox.value);
  console.log("=====testInputBox with data: ", gameDataFromAPI);
  renderGamesByName(gameDataFromAPI);
  // renderGamesByGenre(gameDataFromAPI);
});
