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
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref(null);
const router = useRouter();

const handleLogin = async () => {
  error.value = null;

  try {
    const response = await $fetch("/api/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    if (response.error) {
      throw new Error(response.error);
    }

    router.push("about");
  } catch (err) {
    error.value = err.message;
  }
};
</script>
