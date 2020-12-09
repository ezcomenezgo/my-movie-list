const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = []

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
            <button class=".btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
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

function addToFavorite(id) {
  // 這裡的變數有點不瞭解，為甚麼不能直接這樣傳進去就好還要用JSON.parse轉成javascript的物件? 原本的list.push進去的movie不是早就已經是JS的物件了嗎?
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)

  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }

  list.push(movie)
  console.log(list)

  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}


// 抓出特定電影的id(dataset:在上面的template設置data-id抓取資料不會重複的值－id)
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
    // console.log(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 將搜尋表單綁定提交事件，觸發搜尋功能
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  // 停止網頁的預設行為，讓Javascript控制
  event.preventDefault()
  // 取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase()
  // 儲存符合條件的項目
  let filteredMovies = []

  // 當使用者沒有輸入任何關鍵字時，畫面顯示全部電影 ( 在 include () 中傳入空字串，所有項目都會通過篩選），所以不用下面這一種錯誤處理，因為他條件句的意思是：如果keyword的長度等於0(會回傳false)，但是前面加了一個驚嘆號，所以如果長度等於0會回傳true，就沒辦法在沒有輸入關鍵字時顯示全部的電影
  // if (!keyword.length) {
  //   return alert('請輸入有效字串！')
  // }

  // 條件篩選

  // method 1: use for loop
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)){
  //     filteredMovies.push(movie)
  //   }
  // }
  // function filteredMovie(movie){
  // 
  // }
  // method 2: use filter
  filteredMovies = movies.filter(function (movie) {
    return movie.title.toLowerCase().includes(keyword)
  })

  // 錯誤處理：無符合條件的結果
  // 陣列的長度若等於0
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }

  // 重新輸出至畫面
  renderMovieList(filteredMovies)
})

// 列出所有電影清單
axios.get(INDEX_URL).then((response) => {
  movies.push(...response.data.results)
  // console.log(movies)
  renderMovieList(movies)
}).catch((err) => console.log(err))
