<script>
import { Tooltip } from 'bootstrap'
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
    prefix: null,
  },
  watch: {
    async modelValue(newValue, oldValue) {
      this.selected = newValue;
      await this.updateLocalForage();
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
  async mounted() {
    this.$refs.tips?.forEach(el => new Tooltip(el));
    if (this.settings) {
      this.selected = await localforage.getItem(`${this.prefix}setting_${this.name}`) ?? this.settings.default;
      this.change();
    }
  },
  methods: {
    async change() {
      this.$emit("update:modelValue", String(this.selected));
      await this.updateLocalForage();
    },
    async updateLocalForage() {
      await localforage.setItem(`${this.prefix}setting_${this.name}`, this.selected);
    },
  },
});
</script>

<template>
  <template v-if="settings">
    <b>{{ settings.display ?? name }}:</b>
    <div class="nav nav-pills nav-fill mt-1 mb-1">
      <template v-for="value of settings.order ?? Object.keys(settings.values)">
        <template v-if="settings.values[value]">
          <input type="radio" class="btn-check" :name="`${prefix}${name}`" :id="`${prefix}${name}_${value}`"
              autocomplete="off" :value="value" v-model="selected" @change="change" />
          <label :class="`btn btn-outline-${color} nav-item m-1`" :for="`${prefix}${name}_${value}`" data-bs-toggle="tooltip" data-bs-placement="bottom" :title="settings.values[value].tip" ref="tips">
            {{ settings.values[value].display }}
          </label>
        </template>
      </template>
    </div>
  </template>
</template>
