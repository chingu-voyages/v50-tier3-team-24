import { ref } from "vue";
import { useRouter } from "vue-router";

const me = ref(null); // This variable stores the current logged in user data
const error = ref(null);

export function useAuth() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  async function signup(
    email: string,
    password: string,
    username: string,
    first_name: string,
    last_name: string
  ) {
    error.value = null;
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      const newUser = {
        user_id: data.user?.id,
        username,
        first_name,
        last_name,
        email,
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      router.push("/about");
    } catch (err: any) {
      error.value = err.message;
    }
  }

  async function login(email: string, password: string) {
    error.value = null;
    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) throw loginError;

      console.log("User UUID:", data.user.id); // Supabase's user auth ID

      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: data.user.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      router.push("/about");
    } catch (err: any) {
      error.value = err.message;
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      me.value = null;
      router.push("/");
    }
  }

  return {
    me,
    error,
    login,
    logout,
    signup,
  };
}
