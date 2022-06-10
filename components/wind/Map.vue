<template>
  <div class='map-container'>
    <client-only>
      <l-map ref='map'
             style='background: #a4a8ab'
             :options='options'
             :center='center'
             :zoom='9.5'
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
              :icon-size='[70, 70]'
              :icon-anchor='[27, 65]'
            >
              <img
                :src="i['icon']"
                :style='"width:70px;height:70px;transform:rotate("+i["degrees"]+"deg)"'
               alt='Flood icon'>
            </l-icon>
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
      windState: this.$store.getters['wind/getWindState'],
      center: {
        "lat": 31.381135264471283,
        "lng": 121.3161145041684
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
        0: '/wind_icons/wind_no.svg',
        1: '/wind_icons/wind_little.svg',
        2: '/wind_icons/wind_medium.svg',
        3: '/wind_icons/wind_big.svg',
        4: '/wind_icons/wind_heavy.svg',
        5: '/wind_icons/wind_typhoon.svg'
      }
    }
  },
  watch: {
    '$store.state.wind.windState'() {
      this.windState = this.$store.getters['wind/getWindState']
      this.parseWindState()
    }
  },
  methods: {
    updateBounds(bounds) {
      this.$store.commit('general/setMapBounds', bounds)
    },
    ready(obj) {
      this.$store.commit('general/setMapBounds', obj.getBounds())
      this.parseWindState()
    },
    parseWindState() {
      this.stationMarkers = []
      this.areaState = {}
      if (this.windState === undefined) {
        logger.error('Failed to parse wind state: undefined')
        return
      }
      for (const i in this.windState.wind) {
        this.windState.wind[i].forEach(content => {
          if (content.level === 0) {
            return
          }
          const stationIcon = this.CORRESPOND_ICONS[content.level]
          this.stationMarkers.push({
            id: content.id,
            icon: stationIcon,
            lng_lat: [content.latitude, content.longitude],
            level: content.level,
            degrees: content.degrees,
            text: `${i}-${content.name}：${content.speed}m/s` +
              `${content.wind_level}级 ${content.degrees}度(` +
              `${content.direction})`
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
