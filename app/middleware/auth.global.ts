export default defineNuxtRouteMiddleware((to, _from) => {
  // Skip middleware for signup page
  if (to.path === "/signup") {
    return;
  }

  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo("/login");
  }
});
