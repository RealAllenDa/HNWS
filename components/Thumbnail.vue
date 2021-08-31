<template>
  <div class='thumbnail-container'>
    <client-only>
      <l-map ref="thumbnail-map"
             style='background: var(--thumbnail-background)'
             :options='options'
             :center='center'
             :zoom='8.5'
      >
        <l-geo-json
          :geojson='shanghaiGeoJson'
          :options='geoJsonStyle'
        ></l-geo-json>
        <l-rectangle
          v-if='$store.getters.getMapBounds != null'
          :bounds='$store.getters.getMapBounds'
          :color="'#ff0000'"
          :weight='3'
        ></l-rectangle>
      </l-map>
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'Thumbnail',
  data () {
    return {
      shanghaiGeoJson: this.$store.getters.getShanghaiGeoJson,
      center: {
        "lat": 31.27413104501939,
        "lng": 121.47439783668806
      },
      options: {
        zoomSnap: 0.5,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        doubleClickZoom: false
      },
      geoJsonStyle: {
        style: {
          fillColor: "#3A3A3A",
          color: "#7F7F7F",
          weight: 1
        }
      },
    }
  }
}
</script>

<style scoped>
.thumbnail-container {
  width: 420px;
  height: 390px;
}
</style>
