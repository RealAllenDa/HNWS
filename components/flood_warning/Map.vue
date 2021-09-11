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
        <l-geo-json
          ref='riverGeoJsonInstance'
          :geojson='riverGeoJson'
          :options='riverGeoJsonStyle'
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
      floodWarningState: this.$store.getters.getFloodWarningState,
      riverGeoJson: this.$store.getters.getRiverGeoJson,
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
      riverGeoJsonStyle: {
        style: (feature) => {
          let isHuangpuRiver = false
          if (feature.properties.name.includes('黄浦江')) {
            isHuangpuRiver = true
          }
          return {
            color: '#808080',
            weight: isHuangpuRiver ? 10 : 0,
            fill: false,
            className: isHuangpuRiver ? 'important-rivers' : ''
          }
        }
      }
    }
  },
  watch: {
    '$store.state.floodWarningState'() {
      this.floodWarningState = this.$store.getters.getFloodWarningState
      this.parseFloodWarningState()
    }
  },
  methods: {
    updateBounds(bounds) {
      this.$store.commit('setMapBounds', bounds)
    },
    ready(obj) {
      this.$store.commit('setMapBounds', obj.getBounds())
      this.parseFloodWarningState()
    },
    getStyle(feature) {
      let color = '#7f7f7f'
      const defaultStyle = {
        fillColor: 'white',
        color: '#7F7F7F',
        weight: 1
      }
      switch (this.floodWarningState.flood) {
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
    getRiverStyle(feature) {
      let isHuangpuRiver = false
      let color = '#808080'
      if (feature.properties.name.includes('黄浦江')) {
        isHuangpuRiver = true
      }
      switch (this.floodWarningState.water_level) {
        case 0:
          color = '#808080'
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
      return {
        color: isHuangpuRiver ? color : "#808080",
        weight: isHuangpuRiver ? 10 : 0,
        fill: false,
        className: isHuangpuRiver ? 'important-rivers' : ''
      }
    },
    parseFloodWarningState() {
      this.$refs.areaGeoJsonInstance.setOptionsStyle(this.getStyle)
      this.$refs.riverGeoJsonInstance.setOptionsStyle(this.getRiverStyle)
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
