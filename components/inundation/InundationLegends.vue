<template>
  <div class='general-legends rain-legends'>
    <div class='legend-title'>图例</div>
    <div v-for='i in windLegends' :key='i.id' class='rain-legend-item'>
      <div v-if='i.img_text !== undefined' class='rain-demo'>{{ i.img_text }}</div>
      <img v-else alt='flood_image' :src="`/inundation_icons/inundation_${i.id}.svg`"
           class='rain-demo'>
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
          "img_text": "（无）",
          "text": "无积水"
        },
        {
          "id": "little",
          "text": "轻度积水"
        },
        {
          "id": "medium",
          "text": "中度积水"
        },
        {
          "id": "high",
          "text": "重度积水"
        },
        {
          "id": "danger",
          "text": "严重积水"
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
  height: 350px;
  top: 695px;
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
