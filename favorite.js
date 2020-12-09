const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
console.log(movies)

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const favoriteBtn = document.querySelector('#favorite-btn')

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <!-- 不能用ID，因為ID只能有一個，但是電影清單會有很多個，所以用專屬的class去定義 -->
            <button class=".btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
            <button class=".btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
          </div>
        </div>
      </div>
    </div>  
      `
  })
  dataPanel.innerHTML = rawHTML
}

// 把抓到的id傳到這邊然後找出相對應的資料
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    console.log(data)
    modalTitle.innerText = data.title
    modalDate.innerText = 'Realease date：' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img
                  src="${POSTER_URL + data.image}"
                  alt="movie-poster" class="img-fluid">`
  }).catch((err) => console.log(err))

}

function removeFromFavorite(id) {
  // 錯誤處理，一旦收藏清單是空的就直接return掉
  if (!movies) return

  // 透過id找到要刪除電影的index
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  // 錯誤處理，一旦傳入的id在收藏清單中不存在，就return掉
  if (movieIndex === -1) return

  // 刪除該筆電影
  movies.splice(movieIndex, 1)

  // 存回local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))

  // 更新頁面
  renderMovieList(movies)
}

// 抓出特定電影的id(dataset:在上面的template設置data-id抓取資料不會重複的值－id)
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
    // console.log(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})


renderMovieList(movies)
