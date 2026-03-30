<template>
  <div class="bottom-bar">
    <div class="item">
      <span></span>
      <span>Tableau de bord</span>
    </div>
    <!-- <div class="item">
      <span>Paleés</span>
      <span>200 Jol</span>
    </div>
    <div class="item">
      <span>24,0,000</span>
    </div>
    <div class="item">
      <span>Felat</span>
      <span>320,000</span>
    </div>
    <div class="item">
      <span>32,500,000</span>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'BottomBar',
};
</script>

<style scoped>
.bottom-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px;
  
  color: #fff;
  border-top: 1px solid #334155;
   /* Dégradé vert sombre vers transparent + image */
  background-image: 
    linear-gradient(to bottom, rgba(0, 64, 32, 0.8), rgba(0, 64, 32, 0.3)),
    url('../../assets/images/sidebar.png');
    
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.sidebar {
  width: 250px;
  padding: 20px;
  color: #fff;
  position: relative;

 
}


.item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item span:first-child {
  font-size: 14px;
  color: #94a3b8;
}

.item span:last-child {
  font-size: 18px;
  font-weight: bold;
}
</style>
