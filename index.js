const baseUrl = `https://steam-api-mass.onrender.com/games`;

let listOfCategory;
let actionInput;
let adventureInput;
let casualInput;
let showingGameByGenre;
const categoryIdList = [];
const genresList = [];
let inputQueryList = [];
// let renderCategorisList = [];

// let gamesListFromData;
// let genre;
// let inputQuery;
// let genre;

// const priceGame1 = document.getElementById("game-name");

// console.log("get val of input advanture=", adventureInput);
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

async function displayCategories() {
  listOfCategory = await getListOfGenres();
  // categories.forEach((cateObj) => {
  //   listOfCategory.add(cateObj.name);
  // });

  // console.log("print all cate list: ", listOfCategory);
  let categoryQuery = document.getElementById("categoryGroup");
  let ulCategoryQuery = categoryQuery.children[0];
  while (ulCategoryQuery.firstChild) {
    ulCategoryQuery.removeChild(ulCategoryQuery.firstChild);
  }

  listOfCategory.forEach((category, index) => {
    let name = category.name;

    let capName = name.charAt(0).toUpperCase() + name.slice(1);
    // genresList.push(capName);
    const liEle = document.createElement("li");
    liEle.id = `category-${index}`;
    // categoryIdList.push(`category-${index}`);
    liEle.textContent = capName;
    ulCategoryQuery.appendChild(liEle);
  });
}

displayCategories();
// console.log("print genresList: ", genresList);

async function getAllGenreNames() {
  console.log("=======inside method getAllGenreNames");
  let data = await getListOfGenres();
  console.log("printdata in GetAllGen: ", data);
  data.forEach((ele, index) => {
    let newName = ele.name.charAt(0).toUpperCase() + ele.name.slice(1);
    genresList.push(newName);
    categoryIdList.push(`category-${index}`);
  });
  // console.log("print genresList: ", genresList);
  // console.log("print genresListId: ", categoryIdList);
  let input = "";
  // let render = "";
  for (let i = 0; i < categoryIdList.length; i++) {
    input = `inputQuery${i}`;
    console.log("input", input, typeof input);
    input = document.getElementById(categoryIdList[i]);
    inputQueryList.push(input);
    // render = `${genresList[i]}`;
    // render
  }
  // console.log("inputQueryList: ", inputQueryList);
  // let inputClick =
}

getAllGenreNames();

showingGameByGenre = document.getElementById("showing-games");

// console.log("get val of input action=", actionInput);

function getUrlFromCatergory(genre) {
  let newUrl = `${baseUrl}?genres=${genre}`;

  console.log("print new url: ", newUrl);
  return newUrl;
}

// get Action Game List from query
const getActionGameList = async (url) => {
  console.log("==========test GetActionGameList");
  try {
    const data = await fetch(url);
    console.log("print new url: ", url);
    const res = await data.json();
    console.log("print gamelist res: ", res);
    return res;
  } catch (err) {
    console.log("ERROR: ", err);
  }
};

// Loading Games on the pages
function renderGamesByGenre(gamesList) {
  console.log("====TestRenderGamesByGenre");
  // let divShowingGames = showingGameByGenre.children[1];
  // console.log("getparent: ", showingGameByGenre);

  // console.log("getGameList: ", gamesList);

  while (showingGameByGenre.firstChild) {
    showingGameByGenre.removeChild(showingGameByGenre.firstChild);
  }

  for (let i = 0; i < 9; i++) {
    console.log("====TestRenderGamesByGenre loop");
    let image = gamesList.data[i].header_image;
    let gameName = gamesList.data[i].name;
    let price = gamesList.data[i].price;
    let gameAppId = gamesList.data[i].appid;
    console.log("getchild properties: ", gameName, price);

    const x = document.createElement("div");
    addGameInFo(x, image, gameAppId, gameName, price);
    // console.log("getX: ", x);
    // divShowingGames.appendChild(x);
    showingGameByGenre.appendChild(x);
  }
}

function addGameInFo(element, image, gameAppId, gameName, price) {
  element.classList.add("game_wrapper");
  element.innerHTML = `
  <div class="cover" onclick="getDetail()">
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

// function reset() {
//   // // actionInput = null;
//   gamesListFromData = null;
// }

// get ActionEvent

adventureInput.addEventListener("click", async function () {
  let genre = "adventure";
  console.log("=========TestAddEventAdventure");

  let url = getUrlFromCatergory(genre);
  // let gamesList = await getActionGameList(url);
  let gamesListFromData = await getActionGameList(url);
  console.log("print gameList: ", gamesListFromData);
  renderGamesByGenre(gamesListFromData);
  gamesListFromData = null;
  // url = null;
});

actionInput.addEventListener("click", async function () {
  // let gamesListFromData;
  let genre = "action";
  console.log("=========TestAddEventAction");

  let url = getUrlFromCatergory(genre);
  // let gamesList = await getActionGameList(url);
  let gamesListFromData = await getActionGameList(url);
  console.log("print gameList: ", gamesListFromData);
  renderGamesByGenre(gamesListFromData);
  gamesListFromData = null;
  // url = null;
});

casualInput.addEventListener("click", async function () {
  let genre = "casual";

  console.log("=========TestAddEventCasual");

  let url = getUrlFromCatergory(genre);
  // let gamesList = await getActionGameList(url);
  let gamesListFromData3 = await getActionGameList(url);
  console.log("print gameList: ", gamesListFromData3);
  renderGamesByGenre(gamesListFromData3);
  gamesListFromData3 = null;
});
