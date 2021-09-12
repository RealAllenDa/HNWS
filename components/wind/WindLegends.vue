<template>
  <div class='general-legends rain-legends'>
    <div class='legend-title'>图例</div>
    <div v-for='i in windLegends' :key='i.id' class='rain-legend-item'>
      <div v-if='i.img_text !== undefined' class='rain-demo'>{{ i.img_text }}</div>
      <img v-else alt='flood_image' :src="`/wind_icons/wind_${i.id}.svg`" class='rain-demo'>
      <div class='rain-text'>{{ i.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WindLegends',
  data() {
    return {
      windLegends: [
        {
          "id": "no",
          "text": "小于1级"
        },
        {
          "id": "little",
          "text": "1-4级"
        },
        {
          "id": "medium",
          "text": "4-7级"
        },
        {
          "id": "big",
          "text": "7-10级"
        },
        {
          "id": "heavy",
          "text": "10-12级"
        },
        {
          "id": "typhoon",
          "text": "大于12级"
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
  height: 410px;
  top: 635px;
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
