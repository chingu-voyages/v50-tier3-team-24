<template>
  <div class="container px-4 py-8 mx-auto">
    <h1 class="mb-8 text-4xl font-bold text-teal-700 ml-4">{{ currentUser?.username }}</h1>
    <div v-if="isBusy" class="flex justify-center">
      <VueSpinner size="20" color="teal" />
    </div>
    <div v-else class="mb-12 bg-gray-100 p-8 rounded-sm">
      <!-- Readonly, show the member since and e-mail address -->
      <div class="flex"><p class="font-bold">E-mail:</p> <p class="ml-4">{{ currentUser?.email }}</p></div>
      <div class="flex"><p class="font-bold">Member since:</p> <p class="ml-4">{{ userCreatedTimeStamp }}</p></div>
    </div>
    <div class="mb-12 bg-gray-100 p-8 rounded-sm">
      <div v-if="isBusy" class="flex justify-center">
        <VueSpinner size="20" color="teal" />
      </div>
      <div v-else class="mb-4 flex items-center gap-x-2">
        <!-- username will be updated on clickaway. Error messages will revert the username to the original one -->
        <label for="username" class="block font-bold w-36">Username:</label>
        <input maxlength="200" :disabled="isBusy" type="text" id="username" class="w-full p-2 border border-gray-300 rounded" v-model="username" v-click-outside="handleUsernameClickOutside" />
      </div>
      <div v-if="usernameError" class="text-red-500">
        <p class="text-sm">
          {{ usernameError }}
        </p>
      </div>
    </div>
    <div class="mb-12 bg-gray-100 p-8 rounded-sm">
      <div v-if="isBusy" class="flex justify-center">
        <VueSpinner size="20" color="teal" />
      </div>
      <form v-else @submit.prevent="handleSubmitUpdatePassword">
        <div class="mb-4 flex items-center gap-x-2">
          <label for="password1" class="block font-bold w-36">New password:</label>
          <input type="password" id="password1" class="w-full p-2 border border-gray-300 rounded" v-model="password1" />
        </div>
        <div class="mb-4 flex items-center gap-x-2">
          <label for="password2" class="block font-bold w-36">Confirm password:</label>
          <input type="password" id="password2" class="w-full p-2 border border-gray-300 rounded" v-model="password2" />
        </div>
        <div class="mb-4">
          <p class="text-sm text-teal-700">*Note: Changing your password will end your session, and will require you to sign in again.</p>
        </div>
        <div v-if="passwordError" class="text-red-500">
          <p class="text-sm">{{ passwordError }}</p></div>
          <SpinnerButton 
            :isBusy="isBusy" 
            :disabled="isInvalidPassword"
            type="submit"
            title="Update password" 
            class="px-4 py-2 bg-teal-700 text-white rounded mt-4 disabled:bg-gray-400 disabled:opacity-70 w-full lg:w-max"
          />
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { VueSpinner } from 'vue3-spinners';
  const usernameGlobalState = useState("username");
  // We should allow the user to update their username and password
  useHead({
    title: "Annote | Profile",
    meta: [
      {
        name: "Profile Page",
        content: "Update your profile information"
      }
    ]
  });

  const currentUser = ref<User | null | undefined>(null);
  const { getCurrentUser } = useAuth();
  const username = ref("");
  const password1 = ref("");
  const password2 = ref("");
  
  const usernameError = ref<string | null>(null);
  const passwordError = ref<string | null>(null);

  const isBusy = ref(false);
  const isInvalidPassword = ref(true);

  const { logout } = useAuth();
  
  let originalUsername: string | null = null;

  onMounted(async () => {
    isBusy.value = true;
    await refreshCurrentUser();
    username.value = currentUser.value?.username || "";
    originalUsername = currentUser.value?.username || "";
    isBusy.value = false;
  });

  async function refreshCurrentUser () {
    isBusy.value = true;
    currentUser.value = (await getCurrentUser())?.data;
    username.value = currentUser.value?.username || "";
    originalUsername = currentUser.value?.username || "";
    usernameGlobalState.value = currentUser.value?.username || "";
    isBusy.value = false;
  }

  const userCreatedTimeStamp = computed<string>(() => {
    if (currentUser.value) {
      return new Date(currentUser.value?.created_at).toLocaleDateString();
    }
    return "";
  })

  async function handleUsernameClickOutside() {
    usernameError.value = null;

    if (username.value === originalUsername) return;

    if (!isUsernameValid(username.value)) {
      usernameError.value = "Please provide a username";
      username.value = originalUsername || "";
      return;
    }
    
    await updateUsername();
  }

  function isUsernameValid(input: string) {
    if (!input) return false;
    if (!input.match(/^[a-z\d\-_]+$/i)) return false;
    if (input.trim().length < 3) return false;
    
    return true;
  }

  
  function getPasswordInvalid(): boolean {
    // This function will be used to disable the submit button if the passwords are invalid
    if (!password1.value || !password2.value) return true;
    if (password1.value.trim().length < 8) return true;
    if (password2.value.trim().length < 8) return true;
    if (password1.value !== password2.value) return true;

    return false;
  }

  watch(password1, () => {
    isInvalidPassword.value = getPasswordInvalid();
  });
  watch(password2, () => {
    isInvalidPassword.value = getPasswordInvalid();
  });

  async function updateUsername() {
    isBusy.value = true;
    try {
      await $fetch(`/api/users/profile`, {
        method: "PATCH",
        body: JSON.stringify({ username: username.value }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      await refreshCurrentUser();
    } catch (error) {
      usernameError.value = "Failed to update username";
      username.value = originalUsername || "";
      console.error(error);
    } finally {
      isBusy.value = false;
    }
  }
  async function handleSubmitUpdatePassword() {
    isBusy.value = true;
    // Update the user's password
    try {
      await $fetch(`/api/users/profile`, {
        method: "PATCH",
        body: JSON.stringify({ password: password1.value }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      // Reset the inputs
      password1.value = "";
      password2.value = "";

      await logout();
    } catch (error: any) {
      passwordError.value = error.message;
    } finally {
      isBusy.value = false;
    }
  }
</script>