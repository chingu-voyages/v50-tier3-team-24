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
          <SpinnerButton :isBusy="isBusy" title="Sign up" />
        </div>
      </form>
      <p v-if="error" class="mt-2 text-sm text-center text-red-600">
        {{ error }}
      </p>
      <p class="text-sm text-center text-gray-600">
        Already have an account?
        <NuxtLink to="/login" class="text-blue-500 hover:underline"
          >Log in</NuxtLink
        >
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
const isBusy = ref(false);
useHead({ title: "Sign up | Annote" });

const handleSignup = async () => {
  isBusy.value = true;
  await signup(
    email.value,
    password.value,
    username.value,
    first_name.value,
    last_name.value
  );
};
</script>
