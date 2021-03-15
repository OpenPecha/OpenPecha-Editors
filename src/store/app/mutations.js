export function setUserAccessToken(state, token) {
  state.userAccessToken = token;
  localStorage.setItem("token", token)
}
