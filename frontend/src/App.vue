<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="flex justify-between mb-10">
        <RouterLink to="/" class="text-xl hover:font-bold">Home</RouterLink>
        <RouterLink to="/math" class="text-xl hover:font-bold">Math</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
