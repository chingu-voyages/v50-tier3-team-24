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
        created_at: new Date(),
        updated_at: new Date(),
      };

      const { data: insertedData, error: insertError } = await supabase
        .from("users")
        .insert(newUser);

      if (insertError) throw insertError;

      me.value = insertedData![0];
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
