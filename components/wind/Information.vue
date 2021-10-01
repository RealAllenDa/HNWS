<template>
  <div class='information'>
    <div>
      <div v-for='(i, j) in WARNING_LEVEL_WIND' :key='j'>
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
      windState: this.$store.getters['wind/getWindState'],
      areaState: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
      },
      WARNING_LEVEL_WIND: {
        5: {
          'id': 'downpour',
          'name': '大于12级'
        },
        4: {
          'id': 'heavy',
          'name': '10-12级'
        },
        3: {
          'id': 'big',
          'name': '7-10级'
        },
        2: {
          'id': 'medium',
          'name': '4-7级'
        },
        1: {
          'id': 'little',
          'name': '1-4级'
        }
      }
    }
  },
  watch: {
    '$store.state.wind.windState'() {
      this.windState = this.$store.getters['wind/getWindState']
      this.initializeInformation()
    }
  },
  mounted() {
    this.initializeInformation()
  },
  methods: {
    initializeInformation() {
      this.parseWindAreas()
    },
    parseWindAreas() {
      this.areaState = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
      }
      for (const i in this.windState.wind) {
        this.windState.wind[i].forEach(content => {
          if (!this.areaState[content.level].includes(content.name)) {
            if (this.areaState[content.level].length > 9) {
              return;
            }
            if (this.areaState[content.level].length > 8) {
              this.areaState[content.level][8] = "more"
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
