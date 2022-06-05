<template>
  <div class='information'>
    <div v-if='parseType==="areaLevels"'>
      <div v-for='(i, j) in SPECIFIED_WARNING_LEVEL' :key='j'>
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
    <div v-else-if='parseType==="stationLevels"'>
      <div v-for='(i, j) in SPECIFIED_WARNING_LEVEL' :key='j'>
        <div v-if='stationState[j].length !== 0'>
          <div class='state' :class='i.id'>{{ i.name }}</div>
          <div class='state-text-container'>
            <div v-for='k in stationState[j]' :key='k' class='state-text'>
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
import logger from 'assets/logger'
export default {
  name: 'Information',
  props: {
    parseType: {
      type: String,
      required: true
    },
    displayType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      rainState: this.$store.getters['rain/getRainState'],
      areaState: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      },
      stationState: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      },
      SPECIFIED_WARNING_LEVEL: {},
      WARNING_LEVEL_RAIN: {
        6: {
          'id': 'torrential',
          'name': '特大暴雨级'
        },
        5: {
          'id': 'downpour',
          'name': '大暴雨级'
        },
        4: {
          'id': 'heavy',
          'name': '暴雨级'
        },
        3: {
          'id': 'big',
          'name': '大雨级'
        },
        2: {
          'id': 'medium',
          'name': '中雨级'
        },
        1: {
          'id': 'little',
          'name': '小雨级'
        }
      },
      WARNING_LEVEL_PERIOD: {
        6: {
          'id': 'torrential',
          'name': '大于100年一遇'
        },
        5: {
          'id': 'downpour',
          'name': '70-90年一遇'
        },
        4: {
          'id': 'heavy',
          'name': '50-70年一遇'
        },
        3: {
          'id': 'big',
          'name': '30-50年一遇'
        },
        2: {
          'id': 'medium',
          'name': '10-30年一遇'
        },
        1: {
          'id': 'little',
          'name': '1-10年一遇'
        }
      }
    }
  },
  watch: {
    '$store.state.rain.rainState'() {
      this.rainState = this.$store.getters['rain/getRainState']
      this.initializeInformation()
    },
    'parseType'() {
      this.initializeInformation()
    }
  },
  mounted() {
    this.initializeInformation()
  },
  methods: {
    initializeInformation() {
      if (this.displayType === "rainLevel") {
        this.SPECIFIED_WARNING_LEVEL = this.WARNING_LEVEL_RAIN
        if (this.parseType === 'areaLevels') {
          this.parseRainAreas()
        } else if (this.parseType === 'stationLevels') {
          this.parseRainStations()
        } else {
          logger.error('Failed to determine display type. ' +
            `(Type=${this.parseType})`)
        }
      } else if (this.displayType === "rainPeriod") {
        this.SPECIFIED_WARNING_LEVEL = this.WARNING_LEVEL_PERIOD
        if (this.parseType === 'areaLevels') {
          this.parsePeriodAreas()
        } else if (this.parseType === 'stationLevels') {
          this.parsePeriodStations()
        } else {
          logger.error('Failed to determine display type. ' +
            `(Type=${this.parseType})`)
        }
      } else {
        logger.error("Failed to display information, " +
          `because the type isn't specified. (Type=${this.type})`)
      }
    },
    parseRainAreas() {
      this.areaState = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      };
      const rainAreas = {};
      this.rainState.rain.forEach((content) => {
        if (rainAreas[content.area] === undefined) {
          rainAreas[content.area] = content.level
        } else if (content.level > rainAreas[content.area]) {
          rainAreas[content.area] = content.level
        }
      })
      for (const i in rainAreas) {
        this.areaState[rainAreas[i]].push(i)
      }
    },
    parseRainStations() {
      this.stationState = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      }
      this.rainState.rain.forEach((content) => {
        if (!this.stationState[content.level].includes(content.name)) {
          if (this.stationState[content.level].length > 9) {
            return;
          }
          if (this.stationState[content.level].length > 8) {
            this.stationState[content.level][8] = "more"
            return;
          }
          this.stationState[content.level].push(content.name)
        }
      })
    },
    parsePeriodAreas() {
      this.areaState = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      }
      const periodAreas = {};
      this.rainState.rain.forEach((content) => {
        if (periodAreas[content.area] === undefined) {
          periodAreas[content.area] = content.level
        } else if (content.level > periodAreas[content.area]) {
          periodAreas[content.area] = content.level
        }
      })
      for (const i in periodAreas) {
        this.areaState[periodAreas[i]].push(i)
      }
    },
    parsePeriodStations() {
      this.stationState = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      }
      this.rainState.rain.forEach((content) => {
        if (!this.stationState[content.period].includes(content.name)) {
          if (this.stationState[content.period].length > 9) {
            return;
          }
          if (this.stationState[content.period].length > 8) {
            this.stationState[content.period][8] = "more"
            return;
          }
          this.stationState[content.period].push(content.name)
        }
      })
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
  background: var(--rain-little-color);
}

.medium {
  color: black;
  background: var(--rain-medium-color);
}

.big {
  color: black;
  background: var(--rain-big-color);
}

.heavy {
  background: var(--rain-heavy-color);
}

.downpour {
  background: var(--rain-downpour-color);
}

.torrential {
  border: 3px solid yellow;
  color: yellow;
  background: var(--rain-torrential-color);
}

</style>
