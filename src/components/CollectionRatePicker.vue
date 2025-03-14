<script>
import { defineComponent } from 'vue';

import localforage from "localforage";

export default defineComponent({
  data() {
    return {
      show_cr: true,
    };
  },
  async mounted() {
    const savedvalue = await localforage.getItem("show_cr");
    if (savedvalue != null) {
      this.show_cr = savedvalue;
    }
  },
  methods: {
    patch(rom) {
      if (this.show_cr) {
        rom[0x180039] = 0x01;
      } else {
        rom[0x180039] = 0x00;
      }
    },
    async change() {
      await localforage.setItem("show_cr", this.show_cr);
    },
  },
});
</script>

<template>
  <div class="form-check form-switch">
    <input type="checkbox" class="form-check-input toggle" id="show_cr"
        role="switch" v-model="show_cr" @change="change" checked />
    <label class="form-check-label" for="show_cr">Show Collection Rate</label>
  </div>
</template>

