<template>
  <div class='map-container'>
    <client-only>
      <l-map ref='map'
             style='background: #a4a8ab'
             :options='options'
             :center='center'
             :zoom='12'
             @update:bounds='updateBounds'
             @ready='ready'
      >
        <l-geo-json
          ref='areaGeoJsonInstance'
          :geojson='shanghaiGeoJson'
          :options='geoJsonStyle'
        ></l-geo-json>
        <div
          v-for='i in stationMarkers'
          :key='i["id"]'>
          <l-marker
            :lat-lng='i["lng_lat"]'
            :z-index-offset='i["level"]*1000'
          >
            <l-tooltip :options='{
              "className": "tooltip-show",
              "direction": "top"
            }'>{{ i["text"] }}</l-tooltip>
            <l-icon
              :icon-url="i['icon']"
              :icon-size='[70, 70]'
              :icon-anchor='[27, 65]'
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
      shanghaiGeoJson: this.$store.getters.getShanghaiGeoJson,
      inundationState: this.$store.getters.getInundationState,
      center: {
        "lat": 31.28295208489115,
        "lng": 121.48544311523439
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
      stationMarkers: [],
      areaState: {},
      CORRESPOND_ICONS: {
        1: '/inundation_icons/inundation_little.svg',
        2: '/inundation_icons/inundation_medium.svg',
        3: '/inundation_icons/inundation_high.svg',
        4: '/inundation_icons/inundation_danger.svg'
      }
    }
  },
  watch: {
    '$store.state.inundationState'() {
      this.inundationState = this.$store.getters.getInundationState
      this.parseInundationState()
    }
  },
  methods: {
    updateBounds(bounds) {
      this.$store.commit('setMapBounds', bounds)
    },
    ready(obj) {
      this.$store.commit('setMapBounds', obj.getBounds())
      this.parseInundationState()
    },
    parseInundationState() {
      this.stationMarkers = []
      this.areaState = {}
      if (this.inundationState === undefined) {
        logger.error('Failed to parse inundation state: undefined')
        return
      }
      for (const i in this.inundationState.inundation) {
        this.inundationState.inundation[i].forEach(content => {
          if (content.level === 0) {
            return
          }
          const stationIcon = this.CORRESPOND_ICONS[content.level]
          this.stationMarkers.push({
            id: content.id,
            icon: stationIcon,
            lng_lat: [content.latitude, content.longitude],
            level: content.level,
            text:
              `${i}-${content.name}：${content.water_level}cm，${content.level}级积水`
          })
        })
      }
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
