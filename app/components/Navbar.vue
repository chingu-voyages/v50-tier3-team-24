<template>
  <nav class="app-surface app-theme-transition relative border-b-2 p-4">
    <div class="container mx-auto">
      <div class="flex flex-wrap items-center justify-between">
        <div class="flex w-full justify-between lg:w-1/2">
          <NuxtLink to="/" class="flex items-center text-3xl no-underline">
            <img :src="documentIcon" alt="Icon" class="mr-2 h-8 w-8" />
            <p>Annote</p>
          </NuxtLink>


        </div>
        <div :class="[
          'lg:flex',
          { hidden: !isMenuOpen },
          'app-surface app-theme-transition absolute left-0 top-full z-50 w-full items-center space-x-6 rounded-b-xl p-4 text-md lg:relative lg:w-auto lg:rounded-none',
        ]">
          <ul class="flex flex-col lg:flex-row lg:space-x-6 lg:space-y-0">
            <li v-for="item in menuItems" :key="item.to">
              <NuxtLink :to="item.to" class="flex items-center pt-4 no-underline lg:pt-0" :class="item.class"
                @click="isMenuOpen = false">
                <img :src="item.icon" alt="Icon" class="mr-2 h-8 w-8" />{{
                  item.text
                }}
              </NuxtLink>
            </li>
            <li v-if="user" class="relative">
              <button @click="toggleDropdown" class="accountBtnColor flex items-center pt-4 no-underline lg:pt-0">
                <img :src="accountIcon" alt="Icon" class="mr-2 h-8 w-8" />
                {{ currentUsername }}
              </button>
              <div v-if="isDropdownOpen" class="app-surface z-10 mt-4 w-48 lg:absolute lg:rounded-md lg:shadow-lg">
                <NuxtLink to="/profile" @click="isDropdownOpen = false"
                  class="block w-full px-4 py-2 text-left text-sm text-gray-700 no-underline hover:bg-gray-100">
                  Profile
                </NuxtLink>
                <button @click="handleLogout"
                  class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            </li>
            <li v-else class="relative">
              <NuxtLink to="/login" class="accountBtnColor flex items-center pt-4 no-underline lg:pt-0"
                @click="isMenuOpen = false">
                <img :src="accountIcon" alt="Icon" class="mr-2 h-8 w-8" /> Sign
                In
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div class="flex items-center gap-2">
          <button class="themeToggleBtn flex h-10 w-10 items-center justify-center rounded-full border"
            :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
            :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggleTheme">
            <Icon :name="isDarkMode ? 'mdi:white-balance-sunny' : 'mdi:weather-night'" size="1.2rem" />
          </button>

          <button class="lg:hidden" @click="toggleMenu">
            <span class="sr-only">Toggle menu</span>
            <Icon name="mdi:menu" size="1.8rem" />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import accountIcon from "@/public/assets/icons/account_circle.svg";
import addCircleIcon from "@/public/assets/icons/add_circle.svg";
import documentIcon from "@/public/assets/icons/edit_document.svg";
import homeIcon from "@/public/assets/icons/help_clinic.svg";
import bookIcon from "@/public/assets/icons/library_books.svg";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useAuth } from "../composables/useAuth";

const user = useSupabaseUser();
const { logout } = useAuth();
const isDropdownOpen = ref(false);
const isMenuOpen = ref(false);

const themePreference = useCookie("annote-theme");
const themeMode = useState("theme-mode", () =>
  themePreference.value === "dark" ? "dark" : "light"
);
const isDarkMode = computed(() => themeMode.value === "dark");

useHead(() => ({
  htmlAttrs: {
    "data-theme": themeMode.value,
  },
}));


const currentUsername = useState("username");

const menuItems = [
  { to: "/about", icon: homeIcon, text: "About", class: "homeBtnColor" },
  {
    to: "/library",
    icon: bookIcon,
    text: "Library",
    class: "libraryBtnColor",
  },
  { to: "/new", icon: addCircleIcon, text: "New", class: "newBtnColor" },
];

const syncThemeToDom = (theme) => {
  if (import.meta.client) {
    document.documentElement.setAttribute("data-theme", theme);
  }
};

const applyTheme = (theme) => {
  themeMode.value = theme;
  themePreference.value = theme;
};

const toggleTheme = () => {
  applyTheme(isDarkMode.value ? "light" : "dark");
};

const handleLogout = () => {
  logout();
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleMenu = (event) => {
  event.stopPropagation();
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenuOnClickOutside = (event) => {
  if (isMenuOpen.value && !event.target.closest("nav")) {
    isMenuOpen.value = false;
  }

  if (isDropdownOpen.value && !event.target.closest(".relative")) {
    isDropdownOpen.value = false;
  }
};

watch(themeMode, syncThemeToDom, { immediate: true });

onMounted(() => {
  if (!themePreference.value && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  }

  document.addEventListener("click", closeMenuOnClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenuOnClickOutside);
});
</script>

<style scoped>
.homeBtnColor {
  color: #821eb1;
}

.libraryBtnColor {
  color: #e3b205;
}

.newBtnColor {
  color: #03a58d;
}

.accountBtnColor {
  color: #f1607d;
}

.themeToggleBtn {
  border-color: var(--app-border);
  background-color: var(--app-surface-soft);
  color: var(--app-text);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.themeToggleBtn:hover {
  background-color: rgba(3, 165, 141, 0.12);
}

@media (max-width: 1023px) {
  .absolute {
    box-shadow: var(--app-shadow);
  }
}
</style>
