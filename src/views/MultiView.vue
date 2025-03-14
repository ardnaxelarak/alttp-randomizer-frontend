<script>
import { defineComponent } from 'vue';

import Multi from "@/components/Multi.vue";

export default defineComponent({
  components: {
    Multi,
  },
});
</script>

<template>
  <Multi :id="$route.params.id" />
</template>
