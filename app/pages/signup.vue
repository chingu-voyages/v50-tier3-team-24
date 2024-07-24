<template>
  <div class="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-3xl font-extrabold text-center">
          Create your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <input
              v-model="username"
              type="text"
              required
              class="relative w-full px-3 py-2 border rounded-none rounded-t-md focus:z-10 sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div>
            <input
              v-model="first_name"
              type="text"
              required
              class="relative w-full px-3 py-2 border rounded-none focus:z-10 sm:text-sm"
              placeholder="First Name"
            />
          </div>
          <div>
            <input
              v-model="last_name"
              type="text"
              required
              class="relative w-full px-3 py-2 border rounded-none focus:z-10 sm:text-sm"
              placeholder="Last Name"
            />
          </div>
          <div>
            <input
              v-model="email"
              type="email"
              required
              class="relative w-full px-3 py-2 border rounded-none focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <input
              v-model="password"
              type="password"
              required
              class="relative w-full px-3 py-2 border rounded-none rounded-b-md focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </div>
      </form>
      <p v-if="error" class="mt-2 text-sm text-center text-red-600">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";

const username = ref("");
const first_name = ref("");
const last_name = ref("");
const email = ref("");
const password = ref("");
const { signup, error } = useAuth();

const handleSignup = async () => {
  await signup(
    email.value,
    password.value,
    username.value,
    first_name.value,
    last_name.value
  );
};
</script>
