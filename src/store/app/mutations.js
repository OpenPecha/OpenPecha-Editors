
export function setIsAuthenticated(state, data) {
  // data eg: {service: 'github', value: true}
  state[data.service].isAuthenticated = data.value;
}

export function setUserAccessToken(state, token) {
  state.userAccessToken = token;
}
