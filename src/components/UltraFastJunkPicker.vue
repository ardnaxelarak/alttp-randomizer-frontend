<script>
import { defineComponent } from 'vue';

import localforage from "localforage";

export default defineComponent({
  props: {
    created: null,
  },
  data() {
    return {
      ultrafastjunk: false,
    };
  },
  computed: {
    valid_rom() {
      return this.created && this.created > 1757125000;
    }
  },
  async mounted() {
    const savedvalue = await localforage.getItem("ultrafastjunk");
    if (savedvalue != null) {
      this.ultrafastjunk = savedvalue;
    }
  },
  methods: {
    patch(rom) {
      if (this.valid_rom && this.ultrafastjunk) {
        rom[0x1800AF] = 0xD0;
      } else {
        rom[0x1800AF] = 0x10;
      }
    },
    async change() {
      await localforage.setItem("ultrafastjunk", this.ultrafastjunk);
    },
  },
});
</script>

<template>
  <div class="form-check form-switch" v-if="valid_rom">
    <input type="checkbox" class="form-check-input toggle" id="ultrafastjunk"
        role="switch" v-model="ultrafastjunk" @change="change" checked />
    <label class="form-check-label" for="ultrafastjunk">Shorten Junk Item Fanfares</label>
  </div>
</template>
