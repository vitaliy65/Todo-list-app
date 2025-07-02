import { AuthUser, Login, Register } from "@/api/auth/route";
import { User } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface LoginInputs {
  email: string;
  password: string;
}

export interface RegisterInputs {
  name: string;
  email: string;
  password: string;
}

export default function useUser() {
  const queryClient = useQueryClient();

  const queryUser = useQuery({
    queryKey: ["user"],
    queryFn: async () => await AuthUser(),
  });

  const user = queryUser.data as User;

  const login = useMutation({
    mutationFn: async ({ email, password }: LoginInputs) =>
      await Login({ email, password }),
    onSuccess: () => {
      console.log("User logged in successfully! ");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const register = useMutation({
    mutationFn: async (data: RegisterInputs) => Register(data),
  });

  return {
    // data user info
    user,

    // functions
    loginMutation: login.mutateAsync,
    registerMutation: register.mutateAsync,

    //pending states
    isUserPending: queryUser.isPending,
    isLoginPending: login.isPending,
    isRegisterPending: register.isPending,

    //error states
    isUserError: queryUser.isError,
    isLoginError: login.isError,
    isRegisterError: register.isError,

    //error messages
    loginErrorMessage: login.error?.message,
    registerErrorMessage: register.error?.message,
    UserErrorMessage: queryUser.error?.message,

    //success states
    isLoggedIn: !!user,
  };
}
