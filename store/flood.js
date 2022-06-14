import logger from 'assets/logger'

export const state = () => ({
  floodState: {},
  floodWarningState: {},
  detailedStationState: {},
  mapShown: false,
  chartStartDate: '',
  chartEndDate: ''
})

export const mutations = {
  setFloodState(state, content) {
    state.floodState = content
  },
  setFloodWarningState(state, content) {
    state.floodWarningState = content
  },
  setDetailedStationState(state, content) {
    state.detailedStationState = content
  },
  setMapShown(state, content) {
    state.mapShown = content
  },
  setChartEndDate(state, content) {
    state.chartEndDate = content
  },
  setChartStartDate(state, content) {
    state.chartStartDate = content
  }
}

export const getters = {
  getFloodState(state) {
    return state.floodState
  },
  getFloodWarningState(state) {
    return state.floodWarningState
  },
  getDetailedStationState(state) {
    return state.detailedStationState
  },
  getMapShown(state) {
    return state.mapShown
  },
  getChartStartDate(state) {
    return state.chartStartDate
  },
  getChartEndDate(state) {
    return state.chartEndDate
  }
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
      logger.error('Failed to set floodState.', e)
    }
  },
  async initializeFloodWarningData({ commit }) {
    const floodWarningState = await this.$axios.get(
      `${logger.apiUrl}/warning/flood_warning`
    ).catch((error) => {
      logger.error('Error:', error)
    })
    commit('setFloodWarningState', floodWarningState.data)
  }
}
