<template>
  <div id="map"></div>
</template>

<script>
import 'leaflet/dist/leaflet.css';

const isBrowser = typeof window !== 'undefined';
let L;
if (isBrowser) {
  L = require('leaflet');
  require("leaflet.chinatmsproviders");
  require("~/plugins/typhoon")
}

export default {
  name: "TyphoonMap",
  props: {
    // eslint-disable-next-line vue/require-default-prop
    typhoonRoutes: Array,
    // eslint-disable-next-line vue/require-default-prop
    chinaTyphoonForecasts: Array,
    // eslint-disable-next-line vue/require-default-prop
    location: Array
  },
  data() {
    return {
      map: null,
      HOUR_24_ATTENTION_LINE: [
        [34, 127],
        [22, 127],
        [15, 110]
      ],
      HOUR_48_ATTENTION_LINE: [
        [34, 132],
        [22, 132],
        [15, 125],
        [15, 110]
      ],
      combinedTyphoonLines: [],
      combinedTyphoonRoutes: [],
      typhoonCircles: {
        "radius7_quad": null,
        "radius10_quad": null,
        "radius12_quad": null
      },
      typhoonRouteGroup: undefined,
      typhoonPointsGroup: undefined,
      typhoonCircleGroup: undefined,
      typhoonLocationNow: []
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      });
      this.map = L.map("map", {
        center: [31.59, 120.29],
        zoom: 5,
        zoomSnap: 0.01,
        zoomDelta: 0.5,
        attributionControl: false
      });
      this.typhoonRouteGroup = L.layerGroup();
      this.typhoonPointsGroup = L.layerGroup();
      this.typhoonCircleGroup = L.layerGroup();

      L.tileLayer.chinaProvider("GaoDe.Satellite.Map", {
        maxZoom: 11,
        minZoom: 5
      }).addTo(this.map);
      L.polyline(this.HOUR_24_ATTENTION_LINE, {color: 'yellow', weight: '1'}).addTo(this.map);
      L.polyline(this.HOUR_48_ATTENTION_LINE, {color: 'lightblue', weight: '1'}).addTo(this.map);
      const attention24HourIcon = L.divIcon({
        iconAnchor: [5, -50],
        className: "icon-attention",
        color: "yellow",
        html: "<span style='color: yellow'>24<br>小<br>时<br>警<br>戒<br>线</span>",
        iconSize: 30
      });
      const attention48HourIcon = L.divIcon({
        iconAnchor: [5, -100],
        className: "icon-attention",
        color: "lightblue",
        html: "<span style='color: lightblue'>48<br>小<br>时<br>警<br>戒<br>线</span>",
        iconSize: 30
      });
      L.marker(this.HOUR_24_ATTENTION_LINE[0], {
        icon: attention24HourIcon
      }).addTo(this.map);
      L.marker(this.HOUR_48_ATTENTION_LINE[0], {
        icon: attention48HourIcon
      }).addTo(this.map);
    },
    clearRoutes() {
      if (this.typhoonRouteGroup !== undefined) {
        this.typhoonRouteGroup.clearLayers();
        this.map.removeLayer(this.typhoonRouteGroup);
      }
      if (this.typhoonCircleGroup !== undefined) {
        this.typhoonCircleGroup.clearLayers();
        this.map.removeLayer(this.typhoonCircleGroup);
      }
      if (this.typhoonPointsGroup !== undefined) {
        this.typhoonPointsGroup.clearLayers();
        this.map.removeLayer(this.typhoonPointsGroup);
      }
    },
    drawRoute() {
      this.clearRoutes();
      this.typhoonLocationNow = [
        this.chinaTyphoonForecasts[0].latitude,
        this.chinaTyphoonForecasts[0].longitude
      ];
      this.combinedTyphoonRoutes = [];
      this.combinedTyphoonLines = [];
      this.typhoonRouteGroup = L.layerGroup();
      this.typhoonRoutes.forEach((content) => {
        this.combinedTyphoonLines.push(content);
      });
      this.chinaTyphoonForecasts.forEach((content, index) => {
        if (index !== 0) {
          this.combinedTyphoonLines.push({
            content,
            "is_future": true
          });
        }
      });
      this.combinedTyphoonLines.forEach((content) => {
        const rawContent = content.content;
        const location = [rawContent.latitude, rawContent.longitude];
        this.combinedTyphoonRoutes.push(location);
        this.typhoonRouteGroup.addLayer(L.polyline(this.combinedTyphoonRoutes, {
          weight: 3,
          color: 'white',
          dashArray: content.is_future ? 5 : 0
        }));
        if (Array.prototype.hasOwnProperty.call(this.typhoonCircles, "radius7_quad")) {
          this.typhoonCircles.radius7_quad = !content.is_future ? rawContent.radius7_quad : this.typhoonCircles.radius7_quad;
        }
        if (Array.prototype.hasOwnProperty.call(this.typhoonCircles, "radius10_quad")) {
          this.typhoonCircles.radius10_quad = !content.is_future ? rawContent.radius10_quad : this.typhoonCircles.radius10_quad;
        }
        if (Array.prototype.hasOwnProperty.call(this.typhoonCircles, "radius12_quad")) {
          this.typhoonCircles.radius12_quad = !content.is_future ? rawContent.radius12_quad : this.typhoonCircles.radius12_quad;
        }
      });
      this.drawTyphoonCircles();
      this.drawPoints(0);
      this.typhoonPointsGroup.addTo(this.map);
      this.setBounds();
    },
    drawPoints(activeIndex) {
      const currentSelectedPoint = this.chinaTyphoonForecasts[activeIndex];
      this.typhoonPointsGroup.clearLayers();
      this.combinedTyphoonLines.forEach((content) => {
        const location = [content.content.latitude, content.content.longitude];
        if (content.content.time !== currentSelectedPoint.time) {
          this.drawTyphoonPoint(location, this.colorSelection(content.content.strong), false);
        } else {
          this.drawTyphoonPoint(location, this.colorSelection(content.content.strong), true);
        }
      });
      this.typhoonRouteGroup.addTo(this.map);
    },
    getTyphoonCircles() {
      return this.typhoonCircles
    },
    drawTyphoonCircles() {
      this.typhoonCircleGroup = L.layerGroup();
      this.drawTyphoonCircle(this.typhoonCircles.radius7_quad, 7);
      this.drawTyphoonCircle(this.typhoonCircles.radius10_quad, 10);
      this.drawTyphoonCircle(this.typhoonCircles.radius12_quad, 12);
      this.typhoonCircleGroup.addTo(this.map);
    },
    drawTyphoonCircle(circle, strength) {
      if (circle.sw === 0 && circle.nw === 0 && circle.se === 0 && circle.ne === 0) {
        return;
      }
      let color = 'white';
      let opacity = 0.1;
      if (strength === 7) {
        color = '#fff500';
        opacity = 0.2
      } else if (strength === 10) {
        color = '#ff4600';
        opacity = 0.4
      } else if (strength === 12) {
        color = '#b40068';
        opacity = 0.5
      } else {
        return;
      }
      const cs = new L.Typhoon(this.typhoonLocationNow, circle, {
        color,
        fillOpacity: opacity,
        stroke: true
      })
      this.typhoonCircleGroup.addLayer(cs);
    },
    drawTyphoonPoint(location, color, isHighlighted = false) {
      this.typhoonPointsGroup.addLayer(L.circleMarker(location, {
        color,
        radius: isHighlighted ? 10 : 4,
        fillOpacity: 1
      }));
    },
    setBounds() {
      const bound = L.latLngBounds();
      this.typhoonRouteGroup.getLayers().forEach((content) => {
        bound.extend(content.getBounds());
      });
      this.map.fitBounds(bound, {padding: [300, 0]});
    },
    parseDistance(activeIndex) {
      const currentSelectedPoint = this.chinaTyphoonForecasts[activeIndex];
      return (L.latLng(currentSelectedPoint.latitude,
        currentSelectedPoint.longitude).distanceTo(
        L.latLng(
          this.location[1],
          this.location[0]
        )
      ) / 1000).toFixed(2);
    },
    colorSelection(strength) {
      let color = "#000000";
      switch (strength) {
        case "热带低压(TD)":
          color = "#00D5CB";
          break;
        case "热带风暴(TS)":
          color = "#FCFA00";
          break;
        case "强热带风暴(STS)":
          color = "#FDAE0D";
          break;
        case "台风(TY)":
          color = "#FB3B00";
          break;
        case "强台风(STY)":
          color = "#FC4D80";
          break;
        case "超强台风(Super TY)":
          color = "#C2218E";
          break;
      }
      return color;
    }
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 1020px;

}
</style>
