import logger from 'assets/logger'

export const state = () => ({
  rainState: {}
})

export const mutations = {
  setRainState(state, content) {
    state.rainState = content
  }
}

export const getters = {
  getRainState(state) {
    return state.rainState
  }
}

export const actions = {
  async initializeRainData({ commit }) {
    const rainState = await this.$axios.get(
      `${logger.apiUrl}/warning/rain_state`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setRainState', rainState.data)
  },
  async initializeRain1HData({ commit }) {
    const rainState = await this.$axios.get(
      `${logger.apiUrl}/warning/rain_state_1h`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setRainState', rainState.data)
  }
}
