<script>
import { defineComponent } from 'vue';

import localforage from "localforage";

export default defineComponent({
  data() {
    return {
      msu_resume: true,
    };
  },
  async mounted() {
    const savedvalue = await localforage.getItem("msu_resume");
    if (savedvalue != null) {
      this.msu_resume = savedvalue;
    }
  },
  methods: {
    patch(rom) {
      if (this.msu_resume) {
        rom[0x18021D] = 0x08;
        rom[0x18021E] = 0x07;
      } else {
        rom[0x18021D] = 0x00;
        rom[0x18021E] = 0x00;
      }
    },
    async change() {
      await localforage.setItem("msu_resume", this.msu_resume);
    },
  },
});
</script>

<template>
  <div class="form-check form-switch">
    <input type="checkbox" class="form-check-input toggle" id="msu_resume"
        role="switch" v-model="msu_resume" @change="change" checked />
    <label class="form-check-label" for="msu_resume">MSU-1 Resume</label>
  </div>
</template>
