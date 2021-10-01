import logger from 'assets/logger'

export const state = () => ({
  windState: {}
})

export const mutations = {
  setWindState(state, content) {
    state.windState = content
  }
}

export const getters = {
  getWindState(state) {
    return state.windState
  }
}

export const actions = {
  async initializeWindData({ commit }) {
    const windState = await this.$axios.get(
      `${logger.apiUrl}/warning/wind_state`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setWindState', windState.data)
  }
}
