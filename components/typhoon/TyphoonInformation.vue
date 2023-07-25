<template>
  <div id="typhoon-information">
    <div id="title-container">
      <span v-if="typhoonInformationIndex == 0" class="title-display">
        {{ typhoonNameList[typhoonSelectedIndex] }} 路径实况
      </span>
      <span v-else class="title-display">
        {{ typhoonNameList[typhoonSelectedIndex] }} 路径预报
      </span><br>
      <span id="display-time">
        于
        <span v-if="typhoonInformation[typhoonInformationIndex] != undefined" id="receive-time">
          {{ typhoonInformation[typhoonInformationIndex]["time"].replace("T", " ") }}
        </span>
      </span>
    </div>
    <hr style="margin: unset !important; border: none !important;">
    <div id="information-container">
      <template v-for="(content, index) in filteredInformation">
        <div v-if="content['content'] !== ''" :key="index" class="information">
          <span>{{ content["chinese_name"] }}</span>
          <br>
          <span>
          <span class="information-content">
            {{ content["content"] }}
          </span> {{ content["metrics"] }}
        </span>
        </div>
      </template>
      <div class="information">
        <span>距离<span>{{ location }}</span></span><br>
        <span>
          <span class="information-content">{{ distance }}</span> km
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: `TyphoonInformation`,
  props: {
    // eslint-disable-next-line vue/require-default-prop
    typhoonInformation: Array,
    // eslint-disable-next-line vue/require-default-prop
    typhoonNameList: Object,
    // eslint-disable-next-line vue/require-default-prop
    typhoonSelectedIndex: String,
    // eslint-disable-next-line vue/require-default-prop
    typhoonInformationIndex: Number,
    // eslint-disable-next-line vue/require-default-prop
    location: String,
    // eslint-disable-next-line vue/require-default-prop
    distance: String
  },
  data() {
    return {
      filteredInformation: {},
      CORRESPONDING_INFO_CHINESE: {
        "speed": "最大风速 ",
        "strong": "强度 ",
        "pressure": "中心气压 ",
        "move_speed": "移动速度 ",
        "move_dir": "移动方向 "
      },
      CORRESPONDING_INFO_METRICS: {
        "speed": "m/s",
        "strong": "",
        "pressure": "hPa",
        "move_speed": "km/h",
        "move_dir": ""
      }
    }
  },
  methods: {
    updateTyphoonInformation() {
      for (const index in this.typhoonInformation[this.typhoonInformationIndex]) {
        if (index in this.CORRESPONDING_INFO_CHINESE) {
          let contentAfterFilter;
          let content;
          if (index === "strong") {
            contentAfterFilter = this.typhoonInformation[this.typhoonInformationIndex][index]
              .replace(/\(.*\)/gm, "(" + this.typhoonInformation[this.typhoonInformationIndex].power + "级)");
          } else {
            contentAfterFilter = this.typhoonInformation[this.typhoonInformationIndex][index];
          }
          if (contentAfterFilter === "" || contentAfterFilter === 0 ||
            contentAfterFilter == null) {
            content = {
              "content": "",
              "chinese_name": "",
              "metrics": ""
            }
          } else {
            content = {
              "content": contentAfterFilter,
              "chinese_name": this.CORRESPONDING_INFO_CHINESE[index],
              "metrics": this.CORRESPONDING_INFO_METRICS[index]
            };
          }
          this.filteredInformation[index] = content
        }
      }
    }
  }
}
</script>

<style scoped>
#typhoon-information {
  width: 720px;
  height: 1020px;
  padding-left: 15px;
  font-size: 40px;
  background: black;
  user-select: text;
}

#title-container {
  padding-top: 5px;
}

.title-display {
  font-weight: bold;
}

#display-time {
  font-size: 25px;
}

.information {
  font-size: 40px;
  border-left: 15px solid orange;
  padding-left: 20px;
  margin-top: 10px;
}

.information-content {
  font-weight: bolder;
  font-size: 50px;
}
</style>
