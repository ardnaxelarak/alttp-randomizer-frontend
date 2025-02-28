<script>
import { defineComponent } from 'vue';

import Seed from '../components/Seed.vue';

export default defineComponent({
  components: {
    Seed,
  },
});
</script>

<template>
  <Seed :id="$route.params.id" />
</template>
