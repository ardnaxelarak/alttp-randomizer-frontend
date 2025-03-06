<script>
import { defineComponent } from 'vue';

import localforage from "localforage";

export default defineComponent({
  data() {
    return {
      reduce_flashing: true,
    };
  },
  async mounted() {
    const savedvalue = await localforage.getItem("reduce_flashing");
    if (savedvalue != null) {
      this.reduce_flashing = savedvalue;
    }
  },
  methods: {
    patch(rom) {
      if (this.reduce_flashing) {
        rom[0x18017F] = 0x01;
      } else {
        rom[0x18017F] = 0x00;
      }
    },
    async change() {
      await localforage.setItem("reduce_flashing", this.reduce_flashing);
    },
  },
});
</script>

<template>
  <div class="form-check form-switch">
    <input type="checkbox" class="form-check-input toggle" id="reduce_flashing"
        role="switch" v-model="reduce_flashing" @change="change" checked />
    <label class="form-check-label" for="reduce_flashing">Reduce Flashing</label>
  </div>
</template>
