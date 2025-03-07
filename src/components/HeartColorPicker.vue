<script>
import { defineComponent } from 'vue';

import localforage from "localforage";

export default defineComponent({
  data() {
    return {
      options: {
        red: {display: "Red", class: "btn-outline-danger"},
        blue: {display: "Blue", class: "btn-outline-primary"},
        green: {display: "Green", class: "btn-outline-success"},
        yellow: {display: "Yellow", class: "btn-outline-warning"},
      },
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
  <div class="nav nav-pills nav-justified mt-1">
    <template v-for="value of Object.keys(options)">
      <input type="radio" class="btn-check" :name="heartcolor" :id="`heartcolor_${value}`"
          autocomplete="off" :value="value" v-model="heartcolor" @change="change" />
      <label :class="`btn ${options[value].class} nav-item m-1`" :for="`heartcolor_${value}`">
        {{ options[value].display }}
      </label>
    </template>
  </div>
</template>
