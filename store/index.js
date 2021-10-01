/* eslint-disable no-console */
export const state = () => ({
  lastGetInfoTime: "",
  displayAllRivers: true,
})
export const mutations = {
  setGetInfoTime(state, content) {
    state.lastGetInfoTime = content
  },
  setDisplayAllRivers(state, content) {
    state.displayAllRivers = content
  },
}
export const getters = {
  getGetInfoTime(state) {
    return state.lastGetInfoTime
  },
  getDisplayType(state) {
    return state.displayAllRivers
  },
}
export const actions = {
  async nuxtServerInit({ dispatch }, { route }) {
    if (route.name === "flood-rivers" ||
      route.name === "flood-stations") {
      await dispatch('general/initializeFloodData')
      await dispatch('flood/initializeFloodState')
    } else if (route.name === "rain-24h") {
      await dispatch('rain/initializeRainData')
    } else if (route.name === "rain-1h" ||
              route.name === "rain-period") {
      await dispatch('rain/initializeRain1HData')
    } else if (route.name === "warning-flood") {
      await dispatch('general/initializeFloodData')
      await dispatch('flood/initializeFloodWarningData')
    } else if (route.name === "warning-weather") {
      await dispatch('weather/initializeWeatherWarningData')
    } else if (route.name === "wind") {
      await dispatch('wind/initializeWindData')
    } else if (route.name === "inundation") {
      await dispatch('inundation/initializeInundationData')
    } else if (route.name === "index") {
      return
    } else {
      return
    }
    return await dispatch('general/initializeData')
  },
}
