<script>
import { defineComponent } from 'vue';

import localforage from "localforage";

export default defineComponent({
  data() {
    return {
      heartcolor: null,
    };
  },
  async mounted() {
    const savedvalue = await localforage.getItem("heartcolor");
    if (savedvalue) {
      this.heartcolor = savedvalue;
    }
  },
  methods: {
    patch(rom) {
      switch (this.heartcolor) {
        case "red":
          rom[0x187020] = 0;
          break;
        case "blue":
          rom[0x187020] = 1;
          break;
        case "green":
          rom[0x187020] = 2;
          break;
        case "yellow":
          rom[0x187020] = 3;
          break;
      }
    },
    async change() {
      await localforage.setItem("heartcolor", this.heartcolor);
    },
  },
});
</script>

<template>
  <div>
    Heart Color:
  </div>
  <div class="btn-group mt-2" role="group">
    <input type="radio" class="btn-check" name="heartcolor" id="heartcolor_red"
        autocomplete="off" value="red" v-model="heartcolor" @change="change" />
    <label class="btn btn-outline-danger" for="heartcolor_red">Red</label>

    <input type="radio" class="btn-check" name="heartcolor" id="heartcolor_blue"
        autocomplete="off" value="blue" v-model="heartcolor" @change="change" />
    <label class="btn btn-outline-primary" for="heartcolor_blue">Blue</label>

    <input type="radio" class="btn-check" name="heartcolor" id="heartcolor_green"
        autocomplete="off" value="green" v-model="heartcolor" @change="change" />
    <label class="btn btn-outline-success" for="heartcolor_green">Green</label>

    <input type="radio" class="btn-check" name="heartcolor" id="heartcolor_yellow"
        autocomplete="off" value="yellow" v-model="heartcolor" @change="change" />
    <label class="btn btn-outline-warning" for="heartcolor_yellow">Yellow</label>
  </div>
</template>
