/*
export function someAction (context) {
}
*/

function _round(value, place) {
    return parseFloat(value.toFixed(place))

}
export function incrementFontSize({commit, state}, value) {
    const newFontSize = _round(state.fontSize + value, 1)
    commit("setFontSize", newFontSize)
}

export function decrementFontSize({commit, state}, value) {
    const newFontSize = _round(state.fontSize - value, 1)
    commit("setFontSize", newFontSize)
}