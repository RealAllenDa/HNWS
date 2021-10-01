import logger from 'assets/logger'

export const state = () => ({
  floodState: {},
  floodWarningState: {},
})

export const mutations = {
  setFloodState(state, content) {
    state.floodState = content
  },
  setFloodWarningState(state, content) {
    state.floodWarningState = content
  },
}

export const getters = {
  getFloodState(state) {
    return state.floodState
  },
  getFloodWarningState(state) {
    return state.floodWarningState
  },
}

export const actions = {
  async initializeFloodState({ commit }) {
    const floodState = await this.$axios.get(
      `${logger.apiUrl}/warning/flood_state`
    ).catch((error) => {
      logger.error('Error:', error)
    })
    try {
      commit('setFloodState', floodState.data)
    } catch (e) {
      logger.error("Failed to set floodState.", e)
    }
  },
  async initializeFloodWarningData({ commit }) {
    const floodWarningState = await this.$axios.get(
      `${logger.apiUrl}/warning/flood_warning`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setFloodWarningState', floodWarningState.data)
  },
}
