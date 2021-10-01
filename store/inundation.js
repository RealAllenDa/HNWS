import logger from 'assets/logger'

export const state = () => ({
  inundationState: {}
})

export const mutations = {
  setInundationState(state, content) {
    state.inundationState = content
  },
}

export const getters = {
  getInundationState(state) {
    return state.inundationState
  },
}

export const actions = {
  async initializeInundationData({ commit }) {
    const inundationState = await this.$axios.get(
      `${logger.apiUrl}/warning/inundation_state`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setInundationState', inundationState.data)
  },
}
