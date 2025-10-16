import axios from 'axios'
//justlabs
const API_URL = "https://api.koaiarchitecture.com"
const baseURL = API_URL

const api = {
    get: async (url, params) => {
        // console.log(params)
        try {
            const res = await axios.get(`${baseURL}/${url}`, { params: params })
            return res.data
        } catch (error) {
            // console.log(error)
            return error.response.data
        }
    },

    post: async (url, params) => {
        try {
            const res = await axios.post(`${baseURL}/${url}`, params)
            return res.data
        } catch (error) {
            // console.log(error)
            return error.response.data
        }
    },

    put: async (url, params) => {
        try {
            const res = await axios.put(`${baseURL}/${url}`, params)
            return res.data
        } catch (error) {
            // console.log(error)
            return error.response.data
        }
    },

    delete: async (url, params) => {
        console.log(params)
        try {
            const res = await axios.delete(`${baseURL}/${url}`, { params: params })
            return res.data
        } catch (error) {
            // console.log(error)
            return error.response.data
        }
    },
}

export default api
