import axios from "axios"

export async function fetchVolumes({commit}, {pechaId}) {
    const response = await axios.get(process.env.OPENPECHA_API_URL + `/api/v1/proofread/${pechaId}`)
    commit("setVolumes", response.data)
}


export async function fetchPageIds({commit, dispatch}, {pechaId, volId}) {
    // const response = await axios.get(getOrigin() + `/api/v1/proofread/${pechaId}/${volId}`)
    const response = {
        data: [
            "0005",
            "0006",
            "0007",
        ]
    }
    commit("setPageIds", response.data)

    // prefetch first page
    dispatch("fetchPage", {pechaId, volId, pageId: response.data[0]})
}

export async function fetchPage({commit}, {pechaId, volId, pageId}) {
    // const response = await axios.get(getOrigin() + `/api/v1/proofread/${pechaId}/${volId}/${pageId}`)
    console.log(pechaId, volId, pageId)
    const response = {
        data: {
            content: `this page ${pageId} content`,
            "image_url": `https://iiif.bdrc.io/bdr:I0886::0886${pageId}.tif/full/max/0/default.png`
        }
    }
    commit("setPageContent", response.data.content)
    commit("setPageImageUrl", response.data["image_url"])
}