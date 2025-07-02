import { ReactNode } from "react";
import Loading from "./Loading";
import useUser from "@/hooks/User";
import useList from "@/hooks/List";

export default function CheckAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { isUserPending } = useUser();
  const { isListsPending } = useList();

  if (isUserPending || isListsPending) {
    return <Loading />;
  }

  return children;
}
