class ApiService {
  constructor(baseURL) {
    this.url = baseURL
  }

  async createPost(post) {
    try {
      const request = new Request(this.url + '/posts.json', {
        method: 'post',
        body: JSON.stringify(post),
      })

      const response = await fetch(request)
      return await response.json()
    } catch (error) {
      console.log(error)
    }
  }
}

export const apiService = new ApiService(
  'https://wfm-js-29ab7-default-rtdb.firebaseio.com'
)
