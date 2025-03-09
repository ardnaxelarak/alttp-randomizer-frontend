<script>
import { defineComponent } from 'vue';

import localforage from "localforage";
import settingsData from "@/data/settings.yaml";
import generatorSettings from "@/data/generator-settings.yaml";

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
    color: "primary",
    generator: null,
  },
  watch: {
    modelValue(newValue, oldValue) {
      this.selected = newValue;
    },
  },
  computed: {
    settings() {
      var generatorValue = generatorSettings[this.generator][this.name]
      if (generatorValue == "all") {
        return settingsData[this.name];
      } else if (Array.isArray(generatorValue)) {
        const { values, ...newObj } = settingsData[this.name];
        newObj.values = {};
        for (const value of generatorValue) {
          newObj.values[value] = values[value];
        }
        return newObj;
      } else {
        return generatorValue;
      }
    },
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
    <template v-for="value of settings.order ?? Object.keys(settings.values)">
      <template v-if="settings.values[value]">
        <input type="radio" class="btn-check" :name="name" :id="`${name}_${value}`"
            autocomplete="off" :value="value" v-model="selected" @change="change" />
        <label :class="`btn btn-outline-${color} nav-item m-1`" :for="`${name}_${value}`">
          {{ settings.values[value].display }}
        </label>
      </template>
    </template>
  </div>
</template>
