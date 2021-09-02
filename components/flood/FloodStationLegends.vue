<template>
  <div class='flood-legends'>
    <div class='legend-title'>图例</div>
    <div v-for='i in floodLegends' :key='i.id' class='flood-legend-item'>
      <div v-if='i.img_text !== undefined' class='river-text-demo river-demo'>{{ i.img_text }}</div>
      <img v-else :src="`/icons/flood_${i.id}.svg`" class='river-demo'>
      <div class='river-text'>{{ i.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloodStationLegends',
  data() {
    return {
      floodLegends: [
        {
          "id": "normal",
          "img_text": "（无）",
          "text": "正常"
        },
        {
          "id": "caution",
          "text": "泛滥注意水位"
        },
        {
          "id": "warning",
          "text": "泛滥警戒水位"
        },
        {
          "id": "danger",
          "text": "泛滥危险水位"
        },
        {
          "id": "occur",
          "text": "发生泛滥水位"
        }
      ]
    }
  }
}
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.legend-title {
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 35px;
}
.flood-legend-item {
  display: flex;
  width: 300px;
  height: 55px;
  padding: 10px 5px 5px 20px;
}
.river-demo {
  width: 30%;
  height: 50px;
}
.river-text {
  width: 75%;
  line-height: 40px;
}
.river-text-demo {
  line-height: 35px;
}
</style>
