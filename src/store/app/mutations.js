export function setUserAccessToken(state, token) {
  state.userAccessToken = token;
  localStorage.setItem("token", token)
}

export function unsetUserAccessToken(state) {
  state.userAccessToken = ""
  localStorage.removeItem("token")
}