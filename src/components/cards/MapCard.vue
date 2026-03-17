<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'

onMounted(() => {
  const map = L.map('map').setView([6.1725, 1.2314], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    .addTo(map)

  L.marker([6.1725, 1.2314]).addTo(map)
})
</script>

<template>
  <div id="map" style="height:300px;"></div>
</template>