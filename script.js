const apiKey = "8b3688987312e6e8ba70e40420b6b3eb";
let page = 1;
let load = false;
const apiMovie = () => { 
  return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`;
}
const urlSearch = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
let isSearch = false;

async function fetchMovie(url){
  try {
    message.innerHTML = "loading...";
    let data = await fetch(url);
    let response = await data.json();
    toDisplay(response.results);
    console.log(response.results);
  } catch(error) {
    message.innerHTML = "failed to load: check your internet connection";
    console.log(error);
  }
}

function toDisplay(list){
  showMovies(list);
}

function showMovies(movies){
  const container = document.querySelector(".moviesContainer");
  const changeBtns = document.querySelector(".btnContainer");
  container.innerHTML = "";
  pageNumber.innerHTML = page;
  
  setParams();
  
  if(movies.length > 0 && isSearch){
    message.innerHTML = "";
    displaySearch.innerHTML = `<h2>Result: ${searchInput.value}</h2>`
    displaySearch.style.display = "block";
    changeBtns.style.display = "flex";
    btnNext.addEventListener("click", nextPage);
  } else if(movies.length > 0){
    message.innerHTML = "";
    changeBtns.style.display = "flex";
    btnNext.addEventListener("click", nextPage);
  } else if(isSearch && page > 1) {
    displaySearch.innerHTML = `<h2>Result: ${searchInput.value}</h2>`
    displaySearch.style.display = "block";
    message.innerHTML = "The page doesn't contain the movie you are looking for anymore, go back to the previous page";
    changeBtns.style.display = "flex";
    btnNext.removeEventListener("click", nextPage);
  } else {
    displaySearch.innerHTML = `<h2>Result: ${searchInput.value}</h2>`
    displaySearch.style.display = "block";
    message.innerHTML = "Movie is not found";
    changeBtns.style.display = "none";
  }
  movies.map(movie => {
    const {title, overview, poster_path} = movie;
    const card = document.createElement("div");
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="${title} Poster">
      <div class="detail">
        <p class="tittle">${title}</p>
      </div>
    `;
    card.classList.add("card");
    card.addEventListener("click", () => {
      container.innerHTML = "";
      changeBtns.style.display = "none";
      displaySearch.style.display = "none";
      searchInput.setAttribute("disabled", true)
      const moviePreview = document.querySelector(".moviePreview");
      moviePreview.innerHTML= `
       <img class="singlePoster" src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="${title} Poster">
       <div class="desc">
         <h2>${title}</h2>
         <p>${overview}</p>
       </div>
       <div class="btnReloadC">
         <a class="btnReload" href=""><</a>
       </div>
      `
    })
  //  card.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500/${poster_path}')`;
    container.appendChild(card);
  })
}

function setParams(){
    let val = searchInput.value.trim();
    let currentUrl = new URL(window.location);
    if(val || load){
        currentUrl.searchParams.set("search", val);
        window.history.pushState({}, '', currentUrl);
    } else {
        load = true;
        let title = currentUrl.searchParams.get("search");
        searchInput.value = title;
        search();
    }
}

function search(){
  if(searchInput.value.trim()){
    page = 1;
    isSearch = true;
    fetchMovie(urlSearch + searchInput.value + "&page=" + page);
  }
}

searchInput.addEventListener("input", () => {
  if(!searchInput.value.trim()){
    page = 1;
    isSearch = false;
    displaySearch.style.display = "none";
    fetchMovie(apiMovie());
  }
})

function updatePage(){
  let searchValue = searchInput.value;
  if(searchValue.trim()){
    isSearch = true;
    fetchMovie(urlSearch + searchValue + "&page=" + page);
  } else {
    isSearch = false;
    apiMovie();
    fetchMovie(apiMovie());
  }
}

function nextPage(){
  page += 1;
  updatePage();
}
btnNext.addEventListener("click", nextPage);

function prevPage(){
  if(page > 1){
    page -= 1;
    updatePage();
  }
}

fetchMovie(apiMovie());