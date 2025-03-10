<script>
import { defineComponent } from "vue";

export default defineComponent({
  computed: {
    uid() {
      return `accordion_item_${this.$.uid}`;
    },
  },
  props: {
    expanded: false,
  },
});
</script>

<template>
  <div class="accordion-item">
    <h2 v-if="$slots.header" class="accordion-header">
      <button class="accordion-button" :class="{collapsed: !expanded}"
          type="button" data-bs-toggle="collapse" :data-bs-target="`#${uid}`"
          :aria-expanded="expanded" :aria-controls="uid">
        <slot name="header"></slot>
      </button>
    </h2>
    <div :id="uid" class="accordion-collapse"
       :class="{collapse: $slots.header, show: expanded}">
      <div class="accordion-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
