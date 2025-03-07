<script>
import { defineComponent } from 'vue';

import localforage from "localforage";

export default defineComponent({
  data() {
    return {
      selected: null,
    };
  },
  emits: [
    'update:modelValue'
  ],
  props: {
    modelValue: null,
    name: null,
    settings: {},
  },
  mounted() {
    this.selected = this.settings.default;
    this.change();
  },
  methods: {
    change() {
      this.$emit("update:modelValue", this.selected);
    },
  },
});
</script>

<template>
  <b>{{ settings.display ?? name }}:</b>
  <div class="nav nav-pills nav-fill mt-1 mb-1">
    <template v-for="value of Object.keys(settings.values)">
      <input type="radio" class="btn-check" :name="name" :id="`${name}_${value}`"
          autocomplete="off" :value="value" v-model="selected" @change="change" />
      <label class="btn btn-outline-primary nav-item m-1" :for="`${name}_${value}`">
        {{ settings.values[value].display }}
      </label>
    </template>
  </div>
</template>
