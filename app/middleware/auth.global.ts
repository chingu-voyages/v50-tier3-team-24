export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  // Allow access to login and signup pages
  if (to.path === "/login" || to.path === "/signup" || to.path === "/") {
    return;
  }

  // Redirect to login if user is not authenticated
  if (!user.value) {
    return navigateTo("/login");
  }
});
