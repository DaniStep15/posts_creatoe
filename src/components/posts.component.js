import { Component } from '../core/component'
import { apiService } from '../services/api.service'
import { TransformService } from '../services/transform.service'
import { renderPost } from '../templates/post.template'

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

    const html = posts
      .map((post) => renderPost(post, { withButton: true }))
      .join(' ')

    this.$el.insertAdjacentHTML('afterbegin', html)
  }

  onHide() {
    this.loader.hide()
    this.$el.innerHTML = ''
  }
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
