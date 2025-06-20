import { useAuth } from "@/hooks/useAuth";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loading from "./Loading";
import { useDispatch } from "react-redux";
import { setAuthStateFromLocalStorage } from "@/store/slices/authSlice";

export default function CheckAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { checkAuth, auth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [isClientHydrated, setIsClientHydrated] = useState(false);

  // taking information about user from localstorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const serializedAuthState = localStorage.getItem("authState");
        if (serializedAuthState) {
          const storedState = JSON.parse(serializedAuthState);
          dispatch(setAuthStateFromLocalStorage(storedState));
        }
      } catch (e) {
        console.warn(
          "Could not load auth state from localStorage on client",
          e
        );
      }
      setIsClientHydrated(true);
    }
  }, [dispatch]);

  // checking if token is valid
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // validate access
  useEffect(() => {
    if (
      isClientHydrated &&
      !auth.token &&
      !auth.isPending &&
      (pathname === "/login" || pathname === "/")
    ) {
      router.push("/login");
    }
  }, [auth.isPending, auth.token, router, pathname, isClientHydrated]);

  if (auth.isPending || !isClientHydrated) {
    return <Loading />;
  }

  if (auth.id) {
    return children;
  }

  return null;
}
