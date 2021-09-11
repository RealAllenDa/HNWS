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
      weatherWarningState: this.$store.getters.getWeatherWarningState,
      centralDistricts: ["黄浦区","徐汇区","长宁区","静安区",
        "普陀区","闸北区","虹口区","杨浦区"],
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
    }
  },
  watch: {
    '$store.state.weatherWarningState'() {
      this.weatherWarningState = this.$store.getters.getWeatherWarningState
      this.parseWeatherWarningState()
    }
  },
  methods: {
    updateBounds(bounds) {
      this.$store.commit('setMapBounds', bounds)
    },
    ready(obj) {
      this.$store.commit('setMapBounds', obj.getBounds())
      this.parseWeatherWarningState()
    },
    getStyle(feature) {
      let color = '#7f7f7f'
      let districtName = feature.properties.name
      const defaultStyle = {
        fillColor: 'white',
        color: '#7F7F7F',
        weight: 1
      }
      if (this.centralDistricts.includes(feature.properties.name)) {
        districtName = "上海市"
      }
      switch (this.weatherWarningState.coloring[districtName]) {
        case 0:
          color = '#7f7f7f'
          break
        case 1:
          color = 'dodgerblue'
          break
        case 2:
          color = '#EEE414'
          break
        case 3:
          color = 'orange'
          break
        case 4:
          color = 'red'
          break
      }
      if (feature.properties.parent.adcode === 310000) {
        // Is Shanghai
        return {
          fillColor: color,
          color: 'white',
          weight: 1
        }
      } else {
        return defaultStyle
      }
    },
    parseWeatherWarningState() {
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
