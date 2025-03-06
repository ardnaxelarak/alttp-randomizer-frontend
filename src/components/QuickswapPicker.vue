<script>
import { defineComponent } from 'vue';

import localforage from "localforage";

export default defineComponent({
  data() {
    return {
      quickswap: true,
    };
  },
  async mounted() {
    const savedvalue = await localforage.getItem("quickswap");
    if (savedvalue != null) {
      this.quickswap = savedvalue;
    }
  },
  methods: {
    patch(rom) {
      if (this.quickswap) {
        rom[0x18004B] = 0x01;
      } else {
        rom[0x18004B] = 0x00;
      }
    },
    async change() {
      await localforage.setItem("quickswap", this.quickswap);
    },
  },
});
</script>

<template>
  <div class="form-check form-switch">
    <input type="checkbox" class="form-check-input toggle" id="quickswap"
        role="switch" v-model="quickswap" @change="change" />
    <label class="form-check-label" for="quickswap">Quickswap</label>
  </div>
</template>
