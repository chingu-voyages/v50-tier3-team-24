<template>
  <div>
    <h1>Sign Up</h1>
    <form @submit.prevent="handleSignup">
      <input v-model="username" type="text" placeholder="Username" required />
      <input
        v-model="first_name"
        type="text"
        placeholder="First Name"
        required
      />
      <input v-model="last_name" type="text" placeholder="Last Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Sign Up</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const first_name = ref("");
const last_name = ref("");
const email = ref("");
const password = ref("");
const error = ref(null);
const router = useRouter();

const handleSignup = async () => {
  error.value = null;

  try {
    const response = await $fetch("/api/signup", {
      method: "POST",
      body: {
        username: username.value,
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        password: password.value,
      },
    });

    if (response.error) {
      throw new Error(response.error);
    }

    router.push("/login");
  } catch (err) {
    error.value = err.message;
  }
};
</script>
