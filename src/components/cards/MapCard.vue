<template>
  <div ref="mapContainer" class="map-container" style="height: 500px; width: 100%; border-radius: 20px;"></div>
</template>

<script>
import L from "leaflet";
import api from "../../api/axios";

export default {
  name: "QuartierMap",
  data() {
    return {
      map: null
    };
  },
  async mounted() {
    this.$nextTick(async () => {
      try {
        // On s'assure que le container existe
        if (!this.$refs.mapContainer) return;

        const res = await api.get("/quartiers");
        const quartiers = res.data.data?.data || res.data.data || [];

        this.map = L.map(this.$refs.mapContainer).setView([6.1725, 1.2314], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

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
              .addTo(this.map)
              .bindPopup(`<b>${q.nom}</b>`);
          }
        });
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte:", error);
      }
    });
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  }
};
</script>

<style scoped>
.map-container {
  z-index: 1;
}
</style>
