<template>
  <div class="flex items-center justify-center">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg">
      <h1 class="text-3xl font-bold text-center">Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="text-sm font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            required
            class="relative w-full px-3 py-2 border focus:z-10 sm:text-sm"
          />
        </div>
        <div>
          <label for="password" class="text-sm font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            required
            class="relative w-full px-3 py-2 border rounded-sm focus:z-10 sm:text-sm"
          />
        </div>
        <SpinnerButton :isBusy="isBusy" title="Login" />
      </form>
      <p v-if="error" class="text-sm text-center text-red-600">{{ error }}</p>
      <p class="text-sm text-center text-gray-600">
        Don't have an account?
        <NuxtLink to="/signup" class="text-teal-600 hover:underline"
          >Sign up here</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";

const email = ref("");
const password = ref("");

const { login, error } = useAuth();
const isBusy = ref(false);
useHead({ title: "Sign in | Annote" });

const handleLogin = async () => {
  isBusy.value = true;
  await login(email.value, password.value);
};
</script>
