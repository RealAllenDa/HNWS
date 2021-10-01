import logger from 'assets/logger'

export const state = () => ({
  shanghaiGeoJson: {},
  riverGeoJson: {},
  riverAnnotations: {},
  mapBounds: null
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
  }
}

export const actions = {
  async initializeData({ commit }) {
    const shanghaiGeoData = await this.$axios.get(
      `${logger.apiUrl}/assets/generic/around_shanghai_geojson`
    ).catch((error) => {
      logger.error("Error:", error);
    })
    commit('setShanghaiGeoJson', shanghaiGeoData.data)
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
  }
}
