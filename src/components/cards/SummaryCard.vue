<template>
  <div class="summary-card" :style="{ backgroundColor: color }">
    <div class="title">{{ title }}</div>
    <div class="value">{{ value }}</div>
  </div>
</template>

<script>
export default {
  name: 'SummaryCard',
  props: {
    title: String,
    value: String,
    color: String,
  },
};
</script>

<style scoped>
.summary-card {
  padding: 20px;
  border-radius: 10px;
  color: #fff;
  text-align: center;
}

.title {
  font-size: 16px;
  margin-bottom: 10px;
}

.value {
  font-size: 28px;
  font-weight: bold;
}
</style>
