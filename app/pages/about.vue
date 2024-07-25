<script setup>
import { useAuth } from "../composables/useAuth";

const { currentUser } = useAuth();
</script>

<template>
  <div v-if="currentUser">Welcome, {{ currentUser.data.username }}!</div>
</template>
