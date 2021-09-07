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
  rainState: {}
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
  }
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
  }
}
export const actions = {
  async nuxtServerInit({ dispatch }, { route }) {
    if (route.name === "flood-rivers" ||
      route.name === "flood-stations") {
      await dispatch('initializeFloodData')
    } else if (route.name === "rain") {
      await dispatch('initializeRainData')
    }
    return await dispatch('initializeData')
  },
  async initializeData({ commit }) {
    const shanghaiGeoData = await this.$axios.get(
      `${logger.apiUrl}/assets/generic/around_shanghai_geojson`
    ).catch((error) => {
      console.log("Error:", error);
    })
    commit('setShanghaiGeoJson', shanghaiGeoData.data)
  },
  async initializeRainData({ commit }) {
    const rainState = await this.$axios.get(
      `${logger.apiUrl}/warning/rain_state`
    ).catch((error) => {
      console.log("Error:", error);
    })
    commit('setRainState', rainState.data)
  },
  async initializeFloodData({ commit }) {
    const riverGeoData = await this.$axios.get(
      `${logger.apiUrl}/assets/flood/river_geojson`
    ).catch((error) => {
      console.log("Error:", error);
    })
    commit('setRiverGeoJson', riverGeoData.data)

    const riverAnnotationData = await this.$axios.get(
      `${logger.apiUrl}/assets/flood/river_annotations`
    ).catch((error) => {
      console.log("Error:", error);
    })
    commit('setRiverAnnotation', riverAnnotationData.data)

    const floodState = await this.$axios.get(
      `${logger.apiUrl}/warning/flood_state`
    ).catch((error) => {
      console.warn('Error:', error)
    })
    try {
      commit("setFloodState", floodState.data)
    } catch (e) {
      console.warn("Failed to set floodState.", e)
    }
  }
}
