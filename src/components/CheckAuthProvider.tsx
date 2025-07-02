import { ReactNode, useEffect } from "react";
import Loading from "./Loading";
import useUser from "@/hooks/User";
import useList from "@/hooks/List";
import { usePathname, useRouter } from "next/navigation";

export default function CheckAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { isUserPending, isUserError } = useUser();
  const { isListsPending } = useList();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserError) {
      router.push("/login");
    }
  }, [isUserError, router]);

  // Не проверять авторизацию на страницах логина и регистрации
  if (pathname === "/login" || pathname === "/register") {
    return children;
  }

  if (isUserPending || isListsPending) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loading />
        <span>trying to authorize...</span>
      </div>
    );
  }

  return children;
}
