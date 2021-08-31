<template>
  <div class='map-container'>
    <client-only>
      <l-map ref="map"
             style='background: var(--background-color)'
             :options='options'
             :center='center'
             :zoom='10'
             @update:bounds='updateBounds'
             @update:zoom='updateZoom'
             @update:center='updateCenter'
             @ready='ready'
             @click='testLatLng'
      >
        <l-geo-json
          :geojson='shanghaiGeoJson'
          :options='geoJsonStyle'
        ></l-geo-json>
        <l-geo-json
          :geojson='riverGeoJson'
          :options='riverGeoJsonStyle'
        ></l-geo-json>
        <div
          v-for='i in riverAnnotations'
          :key='i["name"]'>
          <l-marker
            :opacity='0'
            :lat-lng='i["marker"]'
          >
            <l-tooltip
              :options='tooltipOptions'
            >{{ i["name"] }}</l-tooltip>
          </l-marker>
        </div>
      </l-map>
    </client-only>
  </div>
</template>

<script>
import logger from '@/assets/logger'

export default {
  name: 'Map',
  data() {
    return {
      shanghaiGeoJson: this.$store.getters.getShanghaiGeoJson,
      riverGeoJson: this.$store.getters.getRiverGeoJson,
      riverAnnotations: this.$store.getters.getRiverAnnotation,
      center: {
        "lat": 31.15170747813368,
        "lng": 121.29318237304689
      },
      options: {
        zoomSnap: 0.01,
        zoomDelta: 0.5,
        zoomControl: false,
        attributionControl: false,
      },
      geoJsonStyle: {
        style: {
          fillColor: "#3A3A3A",
          color: "#7F7F7F",
          weight: 1
        }
      },
      riverGeoJsonStyle: {
        style: (feature) => {
          // TODO: Color changing by levels
          if (feature.properties.important) {
            // noinspection JSUnresolvedVariable
            console.log(feature.properties.name + " " + feature.properties.river_id);
          }
          return {
            color: "#8AB5E5",
            weight: feature.properties.important ? 10 : 2,
            className: feature.properties.important ? "important-rivers" : ""
          }
        }
      },
      tooltipOptions: {
        permanent: true,
        direction: "top",
        offset: [-15, 55],
        className: "river-annotation"
      }
    }
  },
  methods: {
    saveMap(obj) {
      logger.saveMap(obj);
    },
    updateBounds(bounds) {
      this.$store.commit("setMapBounds", bounds);
    },
    ready(obj) {
      this.$store.commit("setMapBounds", obj.getBounds());
      this.saveMap(obj);
    },
    updateZoom(zoom) {
      console.log(zoom)
    },
    updateCenter(center) {
      console.log(center)
    },
    testLatLng(e) {
      console.log(e.latlng)
    }
  }
}
</script>

<style scoped>
.map-container {
  width: 1500px;
  height: 1077px;
}
</style>
