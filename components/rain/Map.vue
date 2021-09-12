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
          <l-marker :lat-lng='i["lng_lat"]'>
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
export default {
  name: 'Map',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      shanghaiGeoJson: this.$store.getters.getShanghaiGeoJson,
      rainState: this.$store.getters.getRainState,
      center: {
        "lat": 31.2686954430879,
        "lng": 121.52292649612262
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
        1: '/rain_icons/rain_little.svg',
        2: '/rain_icons/rain_medium.svg',
        3: '/rain_icons/rain_big.svg',
        4: '/rain_icons/rain_heavy.svg',
        5: '/rain_icons/rain_downpour.svg',
        6: '/rain_icons/rain_torrential.svg'
      }
    }
  },
  watch: {
    '$store.state.rainState'() {
      this.rainState = this.$store.getters.getRainState
      if (this.type === "rainLevel") {
        this.parseRainState()
      } else if (this.type === "rainPeriod") {
        this.parseRainPeriod()
      } else {
        // eslint-disable-next-line no-console
        console.warn("Failed to draw the map, " +
          `because the type isn't specified. (Type=${this.type})`)
      }
    }
  },
  methods: {
    updateBounds(bounds) {
      this.$store.commit('setMapBounds', bounds)
    },
    ready(obj) {
      this.$store.commit('setMapBounds', obj.getBounds())
      if (this.type === "rainLevel") {
        this.parseRainState()
      } else if (this.type === "rainPeriod") {
        this.parseRainPeriod()
      } else {
        // eslint-disable-next-line no-console
        console.warn("Failed to draw the map, " +
          `because the type isn't specified. (Type=${this.type})`)
      }
    },
    getStyle(feature) {
      let color = "#7f7f7f";
      let stroke = "white";
      let strokeWeight = 1;
      switch (this.areaState[feature.properties.name]) {
        case 0:
          color = "#7f7f7f";
          break;
        case 1:
          color = "dodgerblue";
          break;
        case 2:
          color = "#EEE414";
          break;
        case 3:
          color = "orange";
          break;
        case 4:
          color = "red";
          break;
        case 5:
          color = "#B31AB1";
          break;
        case 6:
          color = "black";
          stroke = "yellow";
          strokeWeight = 2;
          break;
      }
      return {
        fillColor: color,
        color: stroke,
        weight: strokeWeight
      }
    },
    parseRainState() {
      this.stationMarkers = []
      this.areaState = {}
      if (this.rainState === undefined) {
        // eslint-disable-next-line no-console
        console.warn('Failed to parse rain state: undefined')
        return
      }
      this.rainState.rain.forEach((content) => {
        if (this.areaState[content.area] === undefined) {
          this.areaState[content.area] = content.level
        } else if (content.level > this.areaState[content.area]) {
          this.areaState[content.area] = content.level
        }
        if (content.level === 0) {
          return
        }
        const stationIcon = this.CORRESPOND_ICONS[content.level]
        this.stationMarkers.push({
          id: content.id,
          icon: stationIcon,
          lng_lat: [content.latitude, content.longitude],
          text: `${content.area}-${content.name}: ${content.value}mm，${content.level}级`
        })
      })
      this.$refs.areaGeoJsonInstance.setOptionsStyle(this.getStyle)
    },
    parseRainPeriod() {
      this.stationMarkers = []
      this.areaState = {}
      if (this.rainState === undefined) {
        // eslint-disable-next-line no-console
        console.warn('Failed to parse rain state: undefined')
        return
      }
      this.rainState.rain.forEach((content) => {
        if (this.areaState[content.area] === undefined) {
          this.areaState[content.area] = content.period
        } else if (content.period > this.areaState[content.area]) {
          this.areaState[content.area] = content.period
        }
        if (content.period === 0) {
          return
        }
        const stationIcon = this.CORRESPOND_ICONS[content.period]
        this.stationMarkers.push({
          id: content.id,
          icon: stationIcon,
          lng_lat: [content.latitude, content.longitude],
          text: `${content.area}-${content.name}: ${content.value}mm，
          ${content.level}级，${content.period}级一遇程度`
        })
      })
      this.$refs.areaGeoJsonInstance.setOptionsStyle(this.getStyle)
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
