
export function setIsAuthenticated(state, data) {
  // data eg: {service: 'github', value: true}
  console.log(data)
  state[data.service].isAuthenticated = data.value;
}

export function setUserAccessToken(state, token) {
  state.userAccessToken = token;
}

export function initAuth0(state, auth0) {
  state.auth0 = auth0
}