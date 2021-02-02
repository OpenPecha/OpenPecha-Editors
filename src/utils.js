export const idealColor = (hexString) => {
    // W3c offers a formula for calculating ideal color:
    // https://www.w3.org/TR/AERT/#color-contrast
    const r = parseInt(hexString.substr(1, 2), 16);
    const g = parseInt(hexString.substr(3, 2), 16);
    const b = parseInt(hexString.substr(5, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128 ? "#ffffff" : "#000000";
}

export function getOrigin() {
    if (process.env.DEV) {
        return process.env.OPENPECHA_API_URL
    } else {
        return window.location.origin
    }
}