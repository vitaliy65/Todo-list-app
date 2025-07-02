import {
  createList,
  deleteList,
  getLists,
  shareList,
  updateList,
} from "@/api/list/route";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUser from "./User";
import { List } from "@/types/types";

export default function useList() {
  const queryClient = useQueryClient();

  const { user } = useUser();

  const listsQuery = useQuery({
    queryKey: ["lists", user?.id], // Ключ теперь зависит от user.id
    queryFn: async () => await getLists(user?.id),
    enabled: !!user?.id, // Запрос выполняется только если user.id определён
  });

  const lists = listsQuery.data as List[];

  const updateListMutation = useMutation({
    mutationFn: async ({ listId, title }: { listId: string; title: string }) =>
      updateList({ listId, title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", user.id] });
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: async (listId: string) => deleteList(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", user.id] });
    },
  });

  const createNewList = useMutation({
    mutationFn: async ({
      title,
      ownerId,
      participants,
    }: {
      title: string;
      ownerId: string;
      participants: List["participants"];
    }) => createList({ title, ownerId, participants }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", user.id] });
    },
  });

  const shareQuery = useMutation({
    mutationFn: async ({
      listId,
      email,
      role,
    }: {
      listId: string;
      email: string;
      role: "admin" | "viewer";
    }) => shareList({ listId, email, role }),
  });

  return {
    // list data
    lists,

    // mutations
    updateList: updateListMutation.mutateAsync,
    deleteList: deleteListMutation.mutateAsync,
    createNewList: createNewList.mutateAsync,
    shareList: shareQuery.mutateAsync,

    // pending
    isListsPending: listsQuery.isPending,
    isUpdateListPending: updateListMutation.isPending,
    isDeleteListPending: deleteListMutation.isPending,
    isCreateNewListPending: createNewList.isPending,
    isShareListPending: shareQuery.isPending,

    // isError
    isListsError: listsQuery.isError,
    isUpdateListError: updateListMutation.isError,
    isDeleteListError: deleteListMutation.isError,
    isCreateNewListError: createNewList.isError,
    isShareListError: shareQuery.isError,

    // error messages
    ListsErrorMessage: listsQuery.error?.message,
    UpdateListErrorMessage: updateListMutation.error?.message,
    DeleteListErrorMessage: deleteListMutation.error?.message,
    CreateNewListErrorMessage: createNewList.error?.message,
    ShareListErrorMessage: shareQuery.error?.message,
  };
}
