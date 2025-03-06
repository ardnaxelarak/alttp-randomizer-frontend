<script>
import { defineComponent } from 'vue';

import localforage from "localforage";

export default defineComponent({
  data() {
    return {
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
  <div class="btn-group mt-2" role="group">
    <input type="radio" class="btn-check" name="heartbeep" id="heartbeep_normal"
        autocomplete="off" value="normal" v-model="heartbeep" @change="change" />
    <label class="btn btn-outline-primary" for="heartbeep_normal">Normal</label>

    <input type="radio" class="btn-check" name="heartbeep" id="heartbeep_half"
        autocomplete="off" value="half" v-model="heartbeep" @change="change" />
    <label class="btn btn-outline-primary" for="heartbeep_half">Half</label>

    <input type="radio" class="btn-check" name="heartbeep" id="heartbeep_quarter"
        autocomplete="off" value="quarter" v-model="heartbeep" @change="change" />
    <label class="btn btn-outline-primary" for="heartbeep_quarter">Quarter</label>

    <input type="radio" class="btn-check" name="heartbeep" id="heartbeep_off"
        autocomplete="off" value="off" v-model="heartbeep" @change="change" />
    <label class="btn btn-outline-primary" for="heartbeep_off">Off</label>
  </div>
</template>
