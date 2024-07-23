<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";

const email = ref("Jdoe@gmail.com");
const password = ref("Password");

const { login, error } = useAuth();

const handleLogin = async () => {
  await login(email.value, password.value);
};
</script>
