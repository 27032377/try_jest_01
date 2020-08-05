import axios from 'axios'

export default {
  get (_url, _data) {
    return axios.get(_url, {
      params: _data
    })
  },
  post (_url, _data) {
    return axios.post(_url, {
      data: _data
    })
  }
}