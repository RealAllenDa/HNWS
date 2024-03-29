<template>
  <div class='map-container'>
    <client-only>
      <l-map ref='map'
             :center='center'
             :options='options'
             :zoom='10.12'
             style='background: #a4a8ab'
             @ready='ready'
             @update:bounds='updateBounds'
      >
        <l-geo-json
          :geojson='shanghaiGeoJson'
          :options='geoJsonStyle'
        ></l-geo-json>
        <l-geo-json
          ref='riverGeoJsonInstance'
          :geojson='riverGeoJson'
          :options='riverGeoJsonStyle'
        ></l-geo-json>
        <div
          v-for='i in riverAnnotations'
          :key='i["id"]'>
          <l-marker
            :lat-lng='i["marker"]'
            :opacity='0'
          >
            <l-tooltip
              :options='tooltipOptions'
            >{{ i['name'] }}
            </l-tooltip>
          </l-marker>
        </div>
        <div
          v-for='i in stationMarkers'
          :key='i["id"]'>
          <l-marker :lat-lng='i["lng_lat"]'>
            <l-tooltip :options='{
              "className": "tooltip-show",
              "direction": "top"
            }'>{{ i['text'] }}
            </l-tooltip>
            <l-icon
              :icon-anchor='[27, 65]'
              :icon-size='[70, 70]'
              :icon-url="i['icon']"
            ></l-icon>
          </l-marker>
        </div>
      </l-map>
    </client-only>
  </div>
</template>

<!--suppress JSUnresolvedVariable, JSUnresolvedFunction -->
<script>
import logger from 'assets/logger'

export default {
  name: 'Map',
  data() {
    return {
      shanghaiGeoJson: this.$store.getters['general/getShanghaiGeoJson'],
      riverGeoJson: this.$store.getters['general/getRiverGeoJson'],
      riverAnnotations: this.$store.getters['general/getRiverAnnotation'],
      floodState: this.$store.getters['flood/getFloodState'],
      center: {
        'lat': 31.18930843952816,
        'lng': 121.05972290039064
      },
      options: {
        zoomSnap: 0.01,
        zoomDelta: 0.01,
        zoomControl: false,
        attributionControl: false
      },
      geoJsonStyle: {
        style: {
          fillColor: 'white',
          color: '#7F7F7F',
          weight: 1
        }
      },
      riverGeoJsonStyle: {
        style: (feature) => {
          return {
            color: '#808080',
            weight: feature.properties.important ? 10 : 2,
            className: feature.properties.important ? 'important-rivers' : ''
          }
        }
      },
      tooltipOptions: {
        permanent: true,
        direction: 'top',
        offset: [-15, 55],
        className: 'river-annotation'
      },
      CORRESPOND_ICONS: {
        1: '/icons/flood_caution.svg',
        2: '/icons/flood_warning.svg',
        3: '/icons/flood_danger.svg',
        4: '/icons/flood_occur.svg'
      },
      stationMarkers: [],
      riverState: {}
    }
  },
  watch: {
    '$store.state.flood.floodState'() {
      this.floodState = this.$store.getters['flood/getFloodState']
      this.parseFloodState()
    }
  },
  methods: {
    updateBounds(bounds) {
      this.$store.commit('general/setMapBounds', bounds)
    },
    ready(obj) {
      this.$store.commit('general/setMapBounds', obj.getBounds())
      this.parseFloodState()
    },
    getStyle(feature) {
      let color = '#808080'
      switch (this.riverState[feature.properties.name]) {
        case 0:
          color = '#1e90ff'
          break
        case 1:
          color = '#EEE414'
          break
        case 2:
          color = '#FF3E1A'
          break
        case 3:
          color = '#B31AB1'
          break
        case 4:
          color = '#111111'
          break
      }
      return {
        color,
        weight: feature.properties.important ? 10 : 2,
        className: feature.properties.important ? 'important-rivers' : ''
      }
    },
    parseFloodState() {
      this.stationMarkers = []
      if (this.floodState === undefined) {
        logger.error('Failed to parse flood state: undefined')
        return
      }
      for (const i in this.floodState.flood) {
        let maximumLevelPerRiver = 0
        for (const j in this.floodState.flood[i]) {
          if (j === 'important') {
            continue
          }
          const stationCurrentState = this.floodState.flood[i][j]
          if (stationCurrentState === 0) {
            continue
          }
          if (stationCurrentState > maximumLevelPerRiver) {
            maximumLevelPerRiver = stationCurrentState
          }
        }
        this.riverState[i] = maximumLevelPerRiver
      }
      for (const i in this.floodState.station) {
        const stationCurrentState = this.parseWarningState(
          this.floodState.station[i]
        )
        if (stationCurrentState === 0) {
          continue
        }
        const stationLongitude = this.floodState.station[i].longitude
        const stationLatitude = this.floodState.station[i].latitude
        const stationIcon = this.CORRESPOND_ICONS[stationCurrentState]
        this.stationMarkers.push({
          id: i,
          icon: stationIcon,
          lng_lat: [stationLatitude, stationLongitude],
          text: `${this.floodState.station[i].original_river}-${i}：
          ${this.floodState.station[i].current_level}m ${stationCurrentState}级`
        })
      }
      this.$refs.riverGeoJsonInstance.setOptionsStyle(this.getStyle)
    },
    parseWarningState(station) {
      const currentLevel = station.current_level
      if (station.levee_crown !== null) {
        if (currentLevel >= parseFloat(station.levee_crown)) {
          return 4
        }
      }
      if (station.danger_level !== null) {
        if (currentLevel >= parseFloat(station.danger_level)) {
          return 3
        }
      }
      if (station.historical_highest !== null) {
        if (currentLevel >= parseFloat(station.historical_highest)) {
          return 3
        }
      }
      if (station.warning_level !== null) {
        if (currentLevel >= parseFloat(station.warning_level)) {
          return 2
        }
        if (currentLevel >= parseFloat(station.warning_level) - 0.25) {
          return 1
        }
      }
      return 0
    }
  }
}
</script>

<style scoped>
.map-container {
  width: 1500px;
  height: 1080px;
}
</style>
