<template>
  <div id="app" @onload="getInformation">
    <div v-if="loadingPercentage != 100" id="loading">
      <div>Loading...</div>
      <div>{{ loadingPercentage }}% - {{ loadingInformation }}</div>
    </div>
    <div id="main-container">
      <TyphoonSelection
        :china-typhoon-forecasts="chinaTyphoonForecasts"
        :current-typhoon="selectedTyphoon"
        :information="typhoonList"
        :selected-typhoon-time="currentInformationIndex"
        :typhoon-name-list="typhoonReferences"
        @updateTyphoonIndex="updateTyphoonIndex"
        @updateTyphoonSelection="updateTyphoonSelection"></TyphoonSelection>
      <WarningLevel
        ref="warning_level"
        :distance="distance"
        :typhoon-information-index="currentInformationIndex"></WarningLevel>
      <div id="content-container">
        <TyphoonInformation
          ref="typhoon_information"
          :distance="distance"
          :location="selectedLocation"
          :typhoon-information="chinaTyphoonForecasts"
          :typhoon-information-index="currentInformationIndex"
          :typhoon-name-list="typhoonReferences"
          :typhoon-selected-index="selectedTyphoon"></TyphoonInformation>
        <ClientOnly>
          <TyphoonMap
            ref="map"
            :china-typhoon-forecasts="chinaTyphoonForecasts"
            :location="locationLonLat"
            :typhoon-routes="typhoonRoutes"></TyphoonMap>
        </ClientOnly>
      </div>
      <Copyright :custom-text="copyrightText"></Copyright>
    </div>
    <div class='screenshot-container'>
      <b-button variant='primary' @click='screenShot'>下载图片</b-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as htmlToImage from 'html-to-image'
import logger from "assets/logger";
import TyphoonSelection from "@/components/typhoon/TyphoonSelection.vue";
import TyphoonInformation from "@/components/typhoon/TyphoonInformation.vue";
import TyphoonMap from '@/components/typhoon/Map.vue';
import WarningLevel from "@/components/typhoon/WarningLevel.vue";
import SVGToPNG from '@/assets/utilities'

export default {
  name: 'TyphoonIndex',
  components: {
    TyphoonInformation,
    TyphoonSelection,
    TyphoonMap,
    WarningLevel
  },
  data() {
    return {
      copyrightText:
        `    &copy; ${new Date().getFullYear()} Homenetwork Warning System (HNWS) /\n` +
        "    Does not necessarily reflect the views of the associated parties.",
      loadingPercentage: 0,
      loadingInformation: "获取台风列表...",
      typhoonList: [],
      selectedTyphoon: "99999",
      typhoonReferences: {},
      currentActiveTyphoon: {},
      currentTyphoonInformation: {},
      chinaTyphoonForecasts: [],
      currentInformationIndex: 0,
      typhoonRoutes: [],
      selectedLocation: "上海",
      locationLonLat: [121.4610, 31.1787],
      distance: "?"
    }
  },
  mounted() {
    logger.initialize();
    this.getInformation();
    this.timer = setInterval(this.getInformation, 60000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    screenShot() {
      htmlToImage.toSvg(document.getElementById("main-container"))
        .then(data => {
          // Filename like HNWS_Flood_Stations_YYYY_MM_DD_HH_MM_SS.png
          const infoTime = new Date()
          const filename = `HNWS_Legacy_Typhoon_` +
            `${infoTime.getFullYear()}_${infoTime.getMonth() + 1}_${infoTime.getDate()}_` +
            `${infoTime.getHours()}_${infoTime.getMinutes()}_${infoTime.getSeconds()}.png`
          SVGToPNG.download(data, filename, true)
        })
    },
    updateProgress(progress, text) {
      this.loadingInformation = text;
      this.loadingPercentage = progress;
    },
    getInformation() {
      axios(`${logger.apiUrl}/warning/typhoon_activity`)
        .then(response => {
          response = response.data
          this.updateProgress(10, "解析台风列表...");
          this.typhoonList = response
          if (this.typhoonList.length === 0) {
            this.updateProgress(0, "无有效台风。");
            return false;
          }
          this.selectedTyphoon = this.selectedTyphoon !== "99999" ? this.selectedTyphoon : response[0].tfid;
          response.forEach((content) => {
            this.typhoonReferences[content.tfid] = content.name;
          });
          return true;
        })
        .then(hasTyphoon => {
          if (!hasTyphoon) {
            return;
          }
          this.updateProgress(20, "获取台风详细信息...");
          this.updateTyphoonInfo();
        });
    },
    updateTyphoonSelection(value) {
      this.selectedTyphoon = value;
      this.updateProgress(20, "更新台风...");
      this.updateTyphoonInfo();
    },
    updateTyphoonIndex(value) {
      new Promise((resolve) => {
        this.currentInformationIndex = value;
        resolve(1);
      }).then(() => {
        this.updateProgress(60, "更新台风信息...");
        this.$refs.typhoon_information.updateTyphoonInformation();
        this.updateProgress(70, "绘制地图...");
        this.$refs.map.drawPoints(value);
        this.updateProgress(80, "获得距离信息...");
        this.distance = this.$refs.map.parseDistance(value);
      }).then(() => {
        this.updateProgress(90, "更新警告级别...");
        this.updateWarningLevel();
        this.updateProgress(100, "成功！");
      });
    },
    updateTyphoonInfo() {
      this.currentActiveTyphoon = {};
      this.currentTyphoonInformation = {};
      this.chinaTyphoonForecasts = [];
      this.currentInformationIndex = 0;
      this.typhoonRoutes = [];
      axios({
        method: "get",
        url: `${logger.apiUrl}/warning/typhoon_detail?id=${this.selectedTyphoon}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache'
        }
      })
        .then(response => {
          this.updateProgress(30, "解析台风路径...");
          response.data[0].points.forEach((content) => {
            this.typhoonRoutes.push({
              content,
              "is_future": false
            });
            if (content.time >= response.data[0].end_time) {
              this.currentActiveTyphoon = content;
            }
            if (content.forecast != null) {
              content.forecast.forEach((ct) => {
                this.currentTyphoonInformation[ct.sets] = ct.points;
              });
            }
          })
        })
        .then(() => {
          this.updateProgress(40, "插入台风当前路径...");
          for (const index in this.currentTyphoonInformation) {
            this.currentTyphoonInformation[index].unshift(this.currentActiveTyphoon);
          }
        })
        .then(() => {
          this.updateProgress(50, "重置变量...");
          this.chinaTyphoonForecasts = this.currentTyphoonInformation["中国"];
          this.currentInformationIndex = 0;
        }).then(() => {
        this.updateProgress(60, "更新台风信息...");
        this.$refs.typhoon_information.updateTyphoonInformation();
        this.updateProgress(70, "绘制地图...");
        this.$refs.map.drawRoute();
        this.updateProgress(80, "获得距离信息...");
        this.distance = this.$refs.map.parseDistance(0);
      }).then(() => {
        this.updateProgress(90, "更新警告级别...");
        this.updateWarningLevel();
        this.updateProgress(100, "成功！");
      });
    },
    updateWarningLevel() {
      this.$refs.warning_level.parseWarningLevel(this.$refs.map.getTyphoonCircles());
    }
  }
}
</script>

<style>
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  user-select: none;
  --container-color: #282B34;
  background: #373737 !important;
  --interactive-color: #414457;
  -webkit-font-smoothing: antialiased;
  color: white !important;
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif;
}

#main-container {
  width: 1920px;
  height: 1080px;
}

#content-container {
  display: flex;
}

* ::selection {
  background: #73c9e5;
  color: inherit;
}

#loading {
  width: 1920px;
  height: 1080px;
  font-size: 100px;
  vertical-align: middle;
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  flex-direction: column;
}


.screenshot-container {
  border: 1px solid white;
  width: 1920px;
  height: 50px;
  position: absolute;
  top: 1100px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copyright {
  left: 540px !important;
}
</style>
