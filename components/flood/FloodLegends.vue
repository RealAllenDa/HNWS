<template>
  <div class='general-legends flood-legends'>
    <div class='legend-title'>图例</div>
    <div v-for='i in floodLegends' :key='i.id' class='flood-legend-item'>
      <div class='river-demo' :class='i.id'></div>
      <div class='river-text'>{{ i.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloodLegends',
  data() {
    return {
      floodLegends: [
        {
          "id": "normal",
          "text": "正常"
        },
        {
          "id": "caution",
          "text": "泛滥注意"
        },
        {
          "id": "warning",
          "text": "泛滥警戒"
        },
        {
          "id": "danger",
          "text": "泛滥危险"
        },
        {
          "id": "occur",
          "text": "发生泛滥"
        }
      ]
    }
  }
}
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.flood-legends {
  user-select: none;
}
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
  width: 39%;
  height: 15px;
  border: 1px solid white;
  border-radius: 25px;
  margin-top: 14px;
}
.river-text {
  margin-left: 25px;
  width: 50%;
  line-height: 40px;
}
.normal {
  border-color: var(--flood-normal-color);
  background: var(--flood-normal-color);
}
.caution {
  border-color: var(--flood-caution-color);
  background: var(--flood-caution-color);
}
.warning {
  border-color: var(--flood-warning-color);
  background: var(--flood-warning-color);
}
.danger {
  border-color: var(--flood-danger-color);
  background: var(--flood-danger-color);
}
.occur {
  border-color: yellow;
  background: var(--flood-occur-color);
}
</style>
