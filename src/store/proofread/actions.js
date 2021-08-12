import axios from "axios"

export async function fetchVolumes({commit}, {pechaId}) {
    const response = await axios.get(process.env.OPENPECHA_API_URL + `/api/v1/proofread/${pechaId}`)
    commit("setVolumes", response.data)
}


export async function fetchPageIds({commit, dispatch}, {pechaId, volId}) {
    const response = await axios.get(process.env.OPENPECHA_API_URL + `/api/v1/proofread/${pechaId}/${volId}`)
    commit("setPageIds", response.data)

    // prefetch first page
    dispatch("fetchPage", {pechaId, volId, pageId: response.data[0]})
}

export async function fetchPage({commit}, {pechaId, volId, pageId}) {
    const response = await axios.get(process.env.OPENPECHA_API_URL +  `/api/v1/proofread/${pechaId}/${volId}/${pageId}`)

    commit("setPageContent", response.data.content)
    commit("setPageImageUrl", response.data["image_url"])
}