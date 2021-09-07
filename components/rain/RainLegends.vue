<template>
  <div class='general-legends rain-legends'>
    <div class='legend-title'>图例</div>
    <div v-for='i in rainLegends' :key='i.id' class='rain-legend-item'>
      <div v-if='i.img_text !== undefined' class='rain-demo'>{{ i.img_text }}</div>
      <img v-else alt='flood_image' :src="`/rain_icons/rain_${i.id}.svg`" class='rain-demo'>
      <div class='rain-text'>{{ i.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RainLegends',
  data() {
    return {
      rainLegends: [
        {
          "id": "none",
          "img_text": "（无）",
          "text": "未下雨"
        },
        {
          "id": "little",
          "text": "小雨"
        },
        {
          "id": "medium",
          "text": "中雨"
        },
        {
          "id": "big",
          "text": "大雨"
        },
        {
          "id": "heavy",
          "text": "暴雨"
        },
        {
          "id": "downpour",
          "text": "大暴雨"
        },
        {
          "id": "torrential",
          "text": "特大暴雨"
        }
      ]
    }
  }
}
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.rain-legends {
  user-select: none;
}
.legend-title {
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 35px;
}
.rain-legend-item {
  display: flex;
  width: 300px;
  height: 55px;
  padding: 10px 5px 5px 20px;
  align-items: center;
}
.rain-demo {
  width: 30%;
  height: 50px;
}
.rain-text {
  width: 75%;
  line-height: 40px;
}
</style>
