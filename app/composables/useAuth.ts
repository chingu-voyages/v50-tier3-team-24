import { ref } from "vue";
import { useRouter } from "vue-router";

const isAuthenticated = ref(false);
const user = ref(null);
const error = ref(null);

export function useAuth() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  async function login(email, password) {
    error.value = null;
    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) throw loginError;

      user.value = data.user;
      console.log("User UUID:", data.user.id);

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      if (userError) throw userError;

      console.log("user", userData);

      isAuthenticated.value = true;
      router.push("/about");
    } catch (err) {
      error.value = err.message;
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      isAuthenticated.value = false;
      user.value = null;
      router.push("/");
    } else {
      error.value = error.message;
    }
  }

  return {
    isAuthenticated,
    user,
    error,
    login,
    logout,
  };
}
