<template>
  <div ref="mapContainer" class="map-container" style="height: 500px; width: 100%; border-radius: 20px;"></div>
</template>

<script>
import L from "leaflet";
import api from "../../api/axios";
import auth from "../../store/auth";

export default {
  name: "QuartierMap",
  data() {
    return {
      map: null
    };
  },
  async mounted() {
    // On attend un peu plus pour être sûr que le container est rendu
    setTimeout(async () => {
      try {
        const container = this.$refs.mapContainer;
        if (!container) {
          console.warn("Map container not found after timeout");
          return;
        }

        // Si une carte existe déjà, on la supprime
        if (this.map) {
          this.map.remove();
        }

        const res = await api.get("/quartiers");
        const quartiers = res.data.data?.data || res.data.data || [];

        // Définir la position initiale de la carte
        let centerLat = 6.1725;
        let centerLng = 1.2314;
        let zoom = 12;
        
        // Si on a des quartiers filtrés, centrer sur le premier
        if (quartiers.length > 0 && quartiers[0].latitude && quartiers[0].longitude) {
          centerLat = quartiers[0].latitude;
          centerLng = quartiers[0].longitude;
          zoom = 14;
        }

        this.map = L.map(container).setView([centerLat, centerLng], zoom);

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
    }, 500);
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
};
</script>

<style scoped>
.map-container {
  z-index: 1;
}
</style>
