<script>
import { defineComponent } from 'vue';

import localforage from "localforage";

export default defineComponent({
  data() {
    return {
      options: {
        normal: "Normal",
        half: "Half",
        quarter: "Quarter",
        off: "Off",
      },
      heartbeep: null,
    };
  },
  async mounted() {
    const savedvalue = await localforage.getItem("heartbeep");
    if (savedvalue) {
      this.heartbeep = savedvalue;
    }
  },
  methods: {
    patch(rom) {
      switch (this.heartbeep) {
        case "double":
          rom[0x180033] = 0x10;
          break;
        case "normal":
          rom[0x180033] = 0x20;
          break;
        case "half":
          rom[0x180033] = 0x40;
          break;
        case "quarter":
          rom[0x180033] = 0x80;
          break;
        case "off":
          rom[0x180033] = 0x00;
          break;
      }
    },
    async change() {
      await localforage.setItem("heartbeep", this.heartbeep);
    },
  },
});
</script>

<template>
  <div>
    Heart Beep Speed:
  </div>
  <div class="nav nav-pills nav-justified mt-2">
    <template v-for="value of Object.keys(options)">
      <input type="radio" class="btn-check" :name="heartbeep" :id="`heartbeep_${value}`"
          autocomplete="off" :value="value" v-model="heartbeep" @change="change" />
      <label class="btn btn-outline-primary nav-item m-1" :for="`heartbeep_${value}`">
        {{ options[value] }}
      </label>
    </template>
  </div>
</template>
