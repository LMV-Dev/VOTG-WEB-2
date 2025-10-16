import axios from 'axios'

// const PDF_HASH_URL = process.env.NEXT_PUBLIC_PDF_HASH
// const baseURL = PDF_HASH_URL
const API_URL = "https://api.koaiarchitecture.com"
const baseURL = API_URL

let axiosConfig = {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
}

const pdf = {
    get: async (url, params) => {
        // console.log(params)
        try {
            const res = await axios.get(`${baseURL}/${url}`, { params: params })
            return res.data
        } catch (error) {
            // console.log(error)
            return error.response
        }
    },

    post: async (url, params) => {
        try {
            const res = await axios.post(`${baseURL}/${url}`, params, axiosConfig)
            return res.data
        } catch (error) {
            // console.log(error)
            return error.response
        }
    },

    put: async (url, params) => {
        try {
            const res = await axios.put(`${baseURL}/${url}`, params)
            return res.data
        } catch (error) {
            // console.log(error)
            return error.response
        }
    },
}

export default pdf
