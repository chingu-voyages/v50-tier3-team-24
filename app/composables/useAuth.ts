import { ref } from "vue";
import { useRouter } from "vue-router";

const error = ref(null);
const currentUser = ref<User | null>(null);

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

      currentUser.value = (await getCurrentUser())?.data!;

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

      currentUser.value = (await getCurrentUser())?.data!;

      router.push("/about");
    } catch (err: any) {
      error.value = err.message;
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    currentUser.value = null;
    if (!error) {
      router.push("/");
    }
  }

  async function getCurrentUser(): Promise<ApiResponse<User> | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const response = await fetch(`/api/users/${user.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData: ApiResponse<User> = await response.json();
        currentUser.value = userData.data!;
        return userData;
      } else {
        currentUser.value = null;
        return null;
      }
    } catch (err: any) {
      error.value = err.message;
      currentUser.value = null;
      return null;
    }
  }

  return {
    currentUser,
    error,
    signup,
    login,
    logout,
    getCurrentUser,
  };
}
