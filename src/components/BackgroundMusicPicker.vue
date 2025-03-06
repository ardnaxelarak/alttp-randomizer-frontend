<script>
import { defineComponent } from 'vue';

import localforage from "localforage";

export default defineComponent({
  data() {
    return {
      bgm: true,
    };
  },
  async mounted() {
    const savedvalue = await localforage.getItem("bgm");
    if (savedvalue != null) {
      this.bgm = savedvalue;
    }
  },
  methods: {
    patch(rom) {
      if (this.bgm) {
        rom[0x18021A] = 0x00;
      } else {
        rom[0x0CFE18] = 0x00;
        rom[0x0CFEC1] = 0x00;
        rom[0x0D0000] = 0x00;
        rom[0x0D0001] = 0x00;
        rom[0x0D00E7] = 0xC4;
        rom[0x0D00E8] = 0x58;
        rom[0x18021A] = 0x01;
      }
    },
    async change() {
      await localforage.setItem("bgm", this.bgm);
    },
  },
});
</script>

<template>
  <div class="form-check form-switch">
    <input type="checkbox" class="form-check-input toggle" id="bgm"
        role="switch" v-model="bgm" @change="change" checked />
    <label class="form-check-label" for="bgm">Background Music</label>
  </div>
</template>
