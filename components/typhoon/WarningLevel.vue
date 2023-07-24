<template>
  <div id="warning-overlay" :class="warningClassName">
    <font-awesome-icon icon="triangle-exclamation"/>
    <span style="margin-left: 5px;">
      {{ warningText + "警戒等级 " + String(warningClass) + "：" + WARNING_LEVELS[warningClass] }}
    </span>
  </div>
</template>

<script>
export default {
  name: "WarningLevel",
  props: {
    // eslint-disable-next-line vue/require-default-prop
    distance: String,
    // eslint-disable-next-line vue/require-default-prop
    typhoonInformationIndex: Number
  },
  data() {
    return {
      warningText: "",
      WARNING_LEVELS: {
        0: "无威胁。",
        1: "台风外围可能掠过。",
        2: "台风可能掠过。注意接下来的预警信息。",
        3: "台风可能影响此地。注意接下来的预警信息。",
        4: "台风内圈可能影响此地。不要出门，特别注意接下来的预警信息。",
        5: "台风内圈可能已经影响此地。务必不要出门。"
      },
      warningClass: 0,
      warningClassName: "level-0"
    }
  },
  methods: {
    parseWarningLevel(circle) {
      this.warningText = this.typhoonInformationIndex !== 0 ? "（预计）" : "";
      const distance = parseInt(this.distance);
      if (distance <= 200) {
        this.warningClass = 2;
      } else if (distance <= 500) {
        this.warningClass = 1;
      } else {
        this.warningClass = 0;
      }
      if (distance - circle.radius7 <= 200) {
        this.warningClass = 3;
      }
      if (distance - circle.radius10 <= 200) {
        this.warningClass = 4;
      }
      if (distance - circle.radius12 <= 200) {
        this.warningClass = 5;
      }
      this.warningClassName = "level-" + String(this.warningClass);
    }
  }
}
</script>

<style scoped>
#warning-overlay {
  width: 800px;
  font-size: 30px;
  position: absolute;
  top: 65px;
  left: 700px;
  z-index: 999;
  background: var(--interactive-color);
  padding: 1px 3px 1px 10px;
}

.level-1 {
  background: rgb(30, 110, 230) !important;
}

.level-2 {
  color: black;
  background: rgb(255, 180, 0) !important;
}

.level-3 {
  background: rgb(160, 0, 0) !important;
}

.level-4 {
  background: rgb(150, 0, 150) !important;
  font-weight: bold;
}

.level-5 {
  background: black !important;
  color: yellow;
  font-weight: bold;
  border: 2px solid yellow;
}
</style>
