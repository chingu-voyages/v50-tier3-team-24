import vClickOutside from "click-outside-vue3";
// This plugin helps with the context menu to hide it when clicked outside
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vClickOutside);
});
