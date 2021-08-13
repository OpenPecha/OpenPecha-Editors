import axios from "axios"

export async function fetchVolumes({commit}, {pechaId}) {
    const response = await axios.get(process.env.OPENPECHA_API_URL + `/api/v1/proofread/${pechaId}`)
    commit("setVolumes", response.data)
}


export async function fetchPageIds({commit}, {pechaId, volId}) {
    const response = await axios.get(process.env.OPENPECHA_API_URL + `/api/v1/proofread/${pechaId}/${volId}`)
    commit("setPageIds", response.data)
}

export async function fetchPage({commit}, {pechaId, volId, pageId}) {
    const response = await axios.get(process.env.OPENPECHA_API_URL +  `/api/v1/proofread/${pechaId}/${volId}/${pageId}`)

    commit("setPageContent", response.data.content)
    commit("setPageImageUrl", response.data["image_url"])
}