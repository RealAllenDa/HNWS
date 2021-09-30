/* eslint-disable no-console */
import logger from 'assets/logger'

export const state = () => ({
  shanghaiGeoJson: {},
  riverGeoJson: {},
  mapBounds: null,
  riverAnnotations: {},
  floodState: {},
  lastGetInfoTime: "",
  displayAllRivers: true,
  rainState: {},
  floodWarningState: {},
  weatherWarningState: {},
  windState: {},
  inundationState: {}
})
export const mutations = {
  setShanghaiGeoJson(state, content) {
    state.shanghaiGeoJson = content
  },
  setRiverGeoJson(state, content) {
    state.riverGeoJson = content
  },
  setMapBounds(state, content) {
    state.mapBounds = content
  },
  setRiverAnnotation(state, content) {
    state.riverAnnotations = content
  },
  setFloodState(state, content) {
    state.floodState = content
  },
  setGetInfoTime(state, content) {
    state.lastGetInfoTime = content
  },
  setDisplayAllRivers(state, content) {
    state.displayAllRivers = content
  },
  setRainState(state, content) {
    state.rainState = content
  },
  setFloodWarningState(state, content) {
    state.floodWarningState = content
  },
  setWeatherWarningState(state, content) {
    state.weatherWarningState = content
  },
  setWindState(state, content) {
    state.windState = content
  },
  setInundationState(state, content) {
    state.inundationState = content
  },
}
export const getters = {
  getShanghaiGeoJson(state) {
    return state.shanghaiGeoJson
  },
  getRiverGeoJson(state) {
    return state.riverGeoJson
  },
  getMapBounds(state) {
    return state.mapBounds
  },
  getRiverAnnotation(state) {
    return state.riverAnnotations
  },
  getFloodState(state) {
    return state.floodState
  },
  getGetInfoTime(state) {
    return state.lastGetInfoTime
  },
  getDisplayType(state) {
    return state.displayAllRivers
  },
  getRainState(state) {
    return state.rainState
  },
  getFloodWarningState(state) {
    return state.floodWarningState
  },
  getWeatherWarningState(state) {
    return state.weatherWarningState
  },
  getWindState(state) {
    return state.windState
  },
  getInundationState(state) {
    return state.inundationState
  },
}
export const actions = {
  async nuxtServerInit({ dispatch }, { route }) {
    if (route.name === "flood-rivers" ||
      route.name === "flood-stations") {
      await dispatch('initializeFloodData')
    } else if (route.name === "rain-24h") {
      await dispatch('initializeRainData')
    } else if (route.name === "rain-1h" ||
              route.name === "rain-period") {
      await dispatch('initializeRain1HData')
    } else if (route.name === "warning-flood") {
      await dispatch('initializeFloodWarningData')
    } else if (route.name === "warning-weather") {
      await dispatch('initializeWeatherWarningData')
    } else if (route.name === "wind") {
      await dispatch('initializeWindData')
    } else if (route.name === "inundation") {
      await dispatch('initializeInundationData')
    } else if (route.name === "index") {
      return
    } else if (route.name !== "null" || route.name !== null) {
      logger.error("Failed to determine assets to load according to route, " +
        `so no additional assets will be loaded. (Route=${route.name})`)
    }
    return await dispatch('initializeData')
  },
  async initializeData({ commit }) {
    const shanghaiGeoData = await this.$axios.get(
      `${logger.apiUrl}/assets/generic/around_shanghai_geojson`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setShanghaiGeoJson', shanghaiGeoData.data)
  },
  async initializeFloodWarningData({ commit }) {
    const floodWarningState = await this.$axios.get(
      `${logger.apiUrl}/warning/flood_warning`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setFloodWarningState', floodWarningState.data)
    const riverGeoData = await this.$axios.get(
      `${logger.apiUrl}/assets/flood/river_geojson`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setRiverGeoJson', riverGeoData.data)
  },
  async initializeWeatherWarningData({ commit }) {
    const weatherWarningState = await this.$axios.get(
      `${logger.apiUrl}/warning/weather_warning`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setWeatherWarningState', weatherWarningState.data)
  },
  async initializeWindData({ commit }) {
    const windState = await this.$axios.get(
      `${logger.apiUrl}/warning/wind_state`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setWindState', windState.data)
  },
  async initializeInundationData({ commit }) {
    const inundationState = await this.$axios.get(
      `${logger.apiUrl}/warning/inundation_state`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setInundationState', inundationState.data)
  },
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
  },
  async initializeFloodData({ commit }) {
    const riverGeoData = await this.$axios.get(
      `${logger.apiUrl}/assets/flood/river_geojson`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setRiverGeoJson', riverGeoData.data)

    const riverAnnotationData = await this.$axios.get(
      `${logger.apiUrl}/assets/flood/river_annotations`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setRiverAnnotation', riverAnnotationData.data)

    const floodState = await this.$axios.get(
      `${logger.apiUrl}/warning/flood_state`
    ).catch((error) => {
      logger.error('Error:', error)
    })
    try {
      commit("setFloodState", floodState.data)
    } catch (e) {
      logger.error("Failed to set floodState.", e)
    }
  }
}
