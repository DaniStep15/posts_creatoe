import { Component } from '../core/component'
import { apiService } from '../services/api.service'
import { TransformService } from '../services/transform.service'

export class PostsComponent extends Component {
  constructor(id, { loader }) {
    super(id)
    this.loader = loader
  }

  init() {
    this.$el.addEventListener('click', buttonHandler.bind(this))
  }

  async onShow() {
    this.loader.show()
    const fbData = await apiService.fetchPosts()
    const posts = TransformService.fbObjectToArray(fbData)
    this.loader.hide()

    const html = posts.map((post) => renderPost(post)).join(' ')

    this.$el.insertAdjacentHTML('afterbegin', html)
  }

  onHide() {
    this.loader.hide()
    this.$el.innerHTML = ''
  }
}

function renderPost(post) {
  const tag =
    post.type === 'news'
      ? '<li class="tag tag-blue tag-rounded">News</li>'
      : '<li class="tag  tag-rounded">Post</li>'

  const button = (JSON.parse(localStorage.getItem('favorites')) || []).includes(
    post.id
  )
    ? `<button data-id="${post.id}" class="button-round button-small button-danger">Delete</button>`
    : `<button data-id="${post.id}" class="button-round button-small button-primary">Save</button>`

  return `
        <div class="panel">
        <div class="panel-head">
          <p class="panel-title">${post.title}</p>
          <ul class="tags">
          ${tag}
          </ul>
        </div>
        <div class="panel-body">
          <p class="multi-line">${post.fulltext}</p>
        </div>
        <div class="panel-footer w-panel-footer">
          <small>${post.date}</small>
          ${button}
        </div>
        </div>

  `
}

function buttonHandler(event) {
  const $el = event.target
  const id = $el.dataset.id

  if (id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []

    if (favorites.includes(id)) {
      //delete
      $el.textContent = 'Save'
      $el.classList.add('button-primary')
      $el.classList.remove('button-danger')

      favorites = favorites.filter((fid) => fid !== id)
    } else {
      //add
      $el.textContent = 'Delete'
      $el.classList.remove('button-primary')
      $el.classList.add('button-danger')
      favorites.push(id)
    }

    localStorage.setItem('favorites', JSON.stringify(favorites))
  }
}
