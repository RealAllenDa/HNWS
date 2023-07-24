<template>
  <div id="typhoon-select">
    <span style="font-size: 30px; vertical-align: middle;">台风选择：</span>
    <b-dropdown
      :text="typhoonNameList[currentTyphoon]">
      <b-dropdown-item
        v-for="(typhoon, index) in information"
        :key="index"
        @click="updateTyphoon(typhoon['tfid'])">{{ typhoon["name"] }}
      </b-dropdown-item>
    </b-dropdown>
    <span style="margin-left: 100px; font-size: 30px; vertical-align: middle;">预报/实况选择：</span>
    <template v-if="chinaTyphoonForecasts[selectedTyphoonTime] !== undefined && chinaTyphoonForecasts !== undefined">
      <b-dropdown :text="chinaTyphoonForecasts[selectedTyphoonTime]['time']">
        <template v-for="(forecast, index) in chinaTyphoonForecasts"
                  @click="updateInformationIndex(index)">
          <b-dropdown-item v-if="index === selectedTyphoonTime" :key="index" active
                           @click="updateInformationIndex(index)">{{ forecast["time"] }}
          </b-dropdown-item>
          <b-dropdown-item v-else :key="index" @click="updateInformationIndex(index)">{{
              forecast["time"]
            }}
          </b-dropdown-item>
        </template>
      </b-dropdown>
    </template>
  </div>
</template>

<script>
import {BDropdown, BDropdownItem} from "bootstrap-vue";

export default {
  name: "TyphoonSelection",
  components: {BDropdownItem, BDropdown},
  props: {
    // eslint-disable-next-line vue/require-default-prop
    information: Array,
    // eslint-disable-next-line vue/require-default-prop
    currentTyphoon: String,
    // eslint-disable-next-line vue/require-default-prop
    typhoonNameList: Object,
    // eslint-disable-next-line vue/require-default-prop
    chinaTyphoonForecasts: Array,
    // eslint-disable-next-line vue/require-default-prop
    selectedTyphoonTime: Number
  },
  data() {
    return {
      currentTyphoonId: 0,
      currentInformationIndex: 0
    }
  },
  methods: {
    updateTyphoon(id) {
      this.currentTyphoonId = id;
      this.$emit("updateTyphoonSelection", this.currentTyphoonId);
    },
    updateInformationIndex(id) {
      this.currentInformationIndex = id;
      this.$emit("updateTyphoonIndex", this.currentInformationIndex);
    }
  }
}
</script>

<style scoped>
#typhoon-select {
  width: 1920px;
  height: 60px;
  background: var(--interactive-color);
  text-align: center;
  padding-top: 5px;
}
</style>
