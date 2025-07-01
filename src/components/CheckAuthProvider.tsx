import { ReactNode } from "react";
import Loading from "./Loading";
import { useQuery } from "@tanstack/react-query";
import { AuthUser } from "@/api/auth/route";
import { getLists } from "@/api/list/route";
import { User } from "@/types/types";

export default function CheckAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryUser = useQuery({
    queryKey: ["user"],
    queryFn: async () => await AuthUser(),
  });

  const user = queryUser.data as User;

  const listsQuery = useQuery({
    queryKey: ["lists", user?.id], // Ключ теперь зависит от user.id
    queryFn: async () => await getLists(user.id),
    enabled: !!user?.id, // Запрос выполняется только если user.id определён
  });

  if (queryUser.isPending || listsQuery.isPending) {
    return <Loading />;
  }

  return children;
}
