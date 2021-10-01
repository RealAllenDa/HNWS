<template>
  <div class='information'>
    <div>
      <div v-for='(i, j) in WARNING_LEVEL_INUNDATION' :key='j'>
        <div v-if='areaState[j].length !== 0'>
          <div class='state' :class='i.id'>{{ i.name }}</div>
          <div class='state-text-container'>
            <div v-for='k in areaState[j]' :key='k' class='state-text'>
              <span v-if='k==="more"' class='more'>
                （更多...）
              </span>
              <span v-else>{{ k }}</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!--suppress JSUnresolvedVariable -->
<script>
export default {
  name: 'Information',
  data() {
    return {
      inundationState: this.$store.getters['inundation/getInundationState'],
      areaState: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: []
      },
      WARNING_LEVEL_INUNDATION: {
        4: {
          'id': 'danger',
          'name': '严重积水'
        },
        3: {
          'id': 'high',
          'name': '重度积水'
        },
        2: {
          'id': 'medium',
          'name': '中度积水'
        },
        1: {
          'id': 'little',
          'name': '轻度积水'
        }
      }
    }
  },
  watch: {
    '$store.state.inundation.inundationState'() {
      this.inundationState = this.$store.getters['inundation/getInundationState']
      this.initializeInformation()
    }
  },
  mounted() {
    this.initializeInformation()
  },
  methods: {
    initializeInformation() {
      this.parseInundationAreas()
    },
    parseInundationAreas() {
      this.areaState = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: []
      }
      for (const i in this.inundationState.inundation) {
        this.inundationState.inundation[i].forEach(content => {
          if (!this.areaState[content.level].includes(content.name)) {
            if (this.areaState[content.level].length > 4) {
              return;
            }
            if (this.areaState[content.level].length > 3) {
              this.areaState[content.level][3] = "more"
              return;
            }
            this.areaState[content.level].push(content.name)
          }
        })
      }
    }
  }
}
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.information {
  height: 1080px;
}

.little {
  color: black;
  background: var(--inundation-little-color);
}

.medium {
  color: black;
  background: var(--rain-medium-color);
}

.high {
  background: var(--rain-heavy-color);
}

.danger {
  background: var(--rain-downpour-color);
}


</style>
