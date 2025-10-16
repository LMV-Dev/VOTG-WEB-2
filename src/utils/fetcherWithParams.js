import axios from 'axios'

const API_URL = "https://api.koaiarchitecture.com"
const baseURL = API_URL

const fetcherWithParam = (url, params) => axios.get(`${baseURL}/${url}`, { params: params }, { withCredentials: true }).then((response) => response.data)

export default fetcherWithParam
