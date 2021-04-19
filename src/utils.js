export const idealColor = (hexString) => {
    // W3c offers a formula for calculating ideal color:
    // https://www.w3.org/TR/AERT/#color-contrast
    const r = parseInt(hexString.substr(1, 2), 16);
    const g = parseInt(hexString.substr(3, 2), 16);
    const b = parseInt(hexString.substr(5, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128 ? "#ffffff" : "#000000";
}

export const layerColor = {
        BookTitle: "#09ebdf",
        Chapter: "#09ebdf",
        Author: "#09ebdf",
        Citation: "#897335",
        Sabche: "#005e7f",
        Yigchung: "#d29eea",
        Tsawa: "#8b1409",
        FootNote: "#343233"
      }

export function getOrigin() {
    let orgin
    if (process.env.DEV) {
        origin = process.env.OPENPECHA_API_URL
    } else {
        origin = window.location.origin
    }
    console.log(origin)
    return origin
}
