import { ref } from "vue";
import { useRouter } from "vue-router";

const me = ref(null);
const error = ref(null);

export function useAuth() {
  const supabase = useSupabaseClient();
  const router = useRouter();

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

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      me.value = userData;
      console.log(me.value);

      if (userError) throw userError;

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
    } else {
      error.message;
    }
  }

  return {
    me,
    error,
    login,
    logout,
  };
}
