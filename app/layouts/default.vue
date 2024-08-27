<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="p-2 lg:flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
// Setup a global state for the username
const usernameState = useState("username");
const user = useSupabaseUser();

// Here is where we initialize the username state
await callOnce(async () => {
  if (user && user.value) {
    const { data: fetchedUser } = await $fetch<ApiResponse<Partial<User>>>(
      `/api/users/${user.value.id}`
    );
    if (fetchedUser) {
      usernameState.value = fetchedUser.username;
    }
  }
});
</script>

<style scoped>
@media only screen and (min-width: 1024px) {
  main {
    margin-left: 20%;
    margin-right: 20%;
  }
}
</style>
