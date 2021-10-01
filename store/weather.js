import logger from 'assets/logger'

export const state = () => ({
  weatherWarningState: {}
})

export const mutations = {
  setWeatherWarningState(state, content) {
    state.weatherWarningState = content
  },
}

export const getters = {
  getWeatherWarningState(state) {
    return state.weatherWarningState
  }
}

export const actions = {
  async initializeWeatherWarningData({ commit }) {
    const weatherWarningState = await this.$axios.get(
      `${logger.apiUrl}/warning/weather_warning`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setWeatherWarningState', weatherWarningState.data)
  }
}
