<!-- <script setup>
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
</template> -->


<template>
  <div id="map" style="height: 500px; width: 100%; border-radius: 20px;"></div>
</template>

<script>
import L from "leaflet";
import api from "../../api/axios";

export default {
  name: "QuartierMap",
  async mounted() {
    const res = await api.get("/quartiers");
    const quartiers = res.data.data.data; // pagination

    const map = L.map("map").setView([6.1725, 1.2314], 12); // Lomé par défaut

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    quartiers.forEach((q) => {
      if (q.latitude && q.longitude) {
        const redIcon = new L.Icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        L.marker([q.latitude, q.longitude], { icon: redIcon })
          .addTo(map)
          .bindPopup(`<b>${q.nom}</b>`);
      }
    });
  },
};
</script>