<template>
  <div class="sidebar">
    <div class="logo">
      <img src="../../assets/images/logo.png" alt="Logo" />
      <span>EVENOU TAXE-AFRIQUE</span>
    </div>
    <nav>
      <ul>
       <li class="active"><a href="#"><i class="fas fa-tachometer-alt"></i> Tableau de Bord</a></li>
      <li><a href="#"><i class="fas fa-users"></i> Contribuables</a></li>
      <li><a href="#"><i class="fas fa-coins"></i> Taxes</a></li>
      <li><a href="#"><i class="fas fa-credit-card"></i> Paiements</a></li>
      <li><a href="#"><i class="fas fa-ticket-alt"></i> Tickets</a></li>
      <li><a href="#"><i class="fas fa-user-tie"></i> Agents</a></li>
      <li><a href="#"><i class="fas fa-user-check"></i> Agents Collecteurs</a></li>
      <li><a href="#"><i class="fas fa-cog"></i> Paramètres</a></li>
            </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
};
</script>

<style scoped>
/* .sidebar {
  width: 250px;
  background-color: #1e293b;
  color: #fff;
  padding: 20px;
} */
.sidebar {
  width: 250px;
  padding: 20px;
  color: #fff;
  position: relative;

  /* Dégradé vert sombre vers transparent + image */
  background-image: 
    linear-gradient(to bottom, rgba(0, 64, 32, 0.8), rgba(0, 64, 32, 0.3)),
    url('../../assets/images/sidebar.png');
    
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.logo img {
  width: 40px;
  margin-right: 10px;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

nav li {
  margin-bottom: 15px;
}

nav a {
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
}

nav i {
  margin-right: 10px;
}

nav li.active {
  background-color: #0ea5e9;
  border-radius: 5px;
  padding: 10px;
}
</style>
