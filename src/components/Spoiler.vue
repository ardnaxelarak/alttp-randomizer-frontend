<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    spoiler: {},
  },
});
</script>

<template>
  <div class="card content-div m-3">
    <div class="card-header">
      Playthrough
    </div>
    <table class="table table-striped table-hover">
      <template v-for="(items, sphere) in spoiler.playthrough">
        <template v-if="sphere == '0' && items.length > 0">
          <thead>
            <tr>
              <th colspan="2">Starting Items:</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, location) in items">
              <td></td>
              <td>{{ item }}</td>
            </tr>
          </tbody>
        </template>
        <template v-if="sphere != '0'">
          <thead>
            <tr>
              <th colspan="2">Sphere {{ sphere }}:</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, location) in items">
              <td>{{ location }}</td>
              <td>{{ item }}</td>
            </tr>
          </tbody>
        </template>
      </template>
    </table>
  </div>
</template>

<style scoped>
.table {
  --bs-table-striped-bg: rgba(var(--bs-emphasis-color-rgb), 0.04);
  --bs-table-hover-bg: rgba(var(--bs-emphasis-color-rgb), 0.2);
}

.table th, .table td {
  border-top: none;
  padding-top: 0;
  padding-bottom: 0;
  border-bottom: 1px dotted #ccc;
}

.table th {
  border-bottom: 1px solid #bbb;
  padding-top: 0.75rem;
}

.table tr:last-child td {
  border-bottom: none;
}
</style>
