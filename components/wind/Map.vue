<template>
  <div class='map-container'>
    <client-only>
      <l-map ref='map'
             style='background: #a4a8ab'
             :options='options'
             :center='center'
             :zoom='10.12'
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
            <l-icon
              :icon-size='[70, 70]'
              :icon-anchor='[27, 65]'
            >
              <img
                :src="i['icon']"
                :style='"width:70px;height:70px;transform:rotate("+i["degrees"]+"deg)"'
              >
            </l-icon>
          </l-marker>
        </div>
      </l-map>
    </client-only>
  </div>
</template>

<!--suppress JSUnresolvedVariable, JSUnresolvedFunction -->
<script>
export default {
  name: 'Map',
  data() {
    return {
      shanghaiGeoJson: this.$store.getters.getShanghaiGeoJson,
      windState: this.$store.getters.getWindState,
      center: {
        'lat': 31.2686954430879,
        'lng': 121.52292649612262
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
    '$store.state.getWindState'() {
      this.windState = this.$store.getters.getWindState
      this.parseWindState()
    }
  },
  methods: {
    updateBounds(bounds) {
      this.$store.commit('setMapBounds', bounds)
    },
    ready(obj) {
      this.$store.commit('setMapBounds', obj.getBounds())
      this.parseWindState()
    },
    parseWindState() {
      this.stationMarkers = []
      this.areaState = {}
      if (this.windState === undefined) {
        // eslint-disable-next-line no-console
        console.warn('Failed to parse wind state: undefined')
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
            degrees: content.degrees
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
