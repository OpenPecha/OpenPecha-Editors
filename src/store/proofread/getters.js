export function volumes(state) {
    return state.volumes.map(volume => {
        return {
            ...volume,
            bdrcId: volume.image_group_id
        }
    })
}