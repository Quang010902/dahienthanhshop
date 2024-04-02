import axiosClient from './axiosClient'

const HistoryAPI = {

    getHistoryAPI: (query) => {
        const url = `/histories${query}`
        return axiosClient.get(url)
    },

    getDetail: (id) => {
        const url = `/histories/${id}`
        return axiosClient.get(url)
    }

}

export default HistoryAPI