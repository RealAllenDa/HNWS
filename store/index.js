import logger from 'assets/logger'

export const state = () => ({
  shanghaiGeoJson: {},
  riverGeoJson: {},
  mapBounds: null,
  riverAnnotations: {},
  floodState: {}
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
  }
}
export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    return await dispatch('initializeData')
  },
  async initializeData({ commit }) {
    // TODO: Remove t=
    const shanghaiGeoData = await this.$axios.get(
      'https://earthquake.daziannetwork.com/api/HNWS/general/around_shanghai.geojson'
    ).catch((error) => {
      console.log("Error:", error);
    })
    commit('setShanghaiGeoJson', shanghaiGeoData.data)

    const riverGeoData = await this.$axios.get(
      'https://earthquake.daziannetwork.com/api/HNWS/river/rivers.geojson'
    ).catch((error) => {
      console.log("Error:", error);
    })
    commit('setRiverGeoJson', riverGeoData.data)

    const riverAnnotationData = await this.$axios.get(
      'https://earthquake.daziannetwork.com/api/HNWS/river/river_annotations.json'
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
