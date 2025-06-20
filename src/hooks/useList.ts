import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchLists,
  createList,
  deleteList,
  editList,
} from "@/store/slices/listsSlice";
import { useAppSelector } from "@/store/hooks";
import { useCallback } from "react";

export const useList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { lists, isPending, errors } = useAppSelector(
    (state: RootState) => state.lists
  );

  const handleFetchLists = useCallback(
    (ownerId: string) => {
      dispatch(fetchLists({ ownerId }));
    },
    [dispatch]
  );

  const handleCreateList = useCallback(
    (title: string, ownerId: string) => {
      dispatch(createList({ title, ownerId }));
    },
    [dispatch]
  );

  const handleDeleteList = useCallback(
    (id: string) => {
      dispatch(deleteList({ id }));
    },
    [dispatch]
  );

  const handleEditList = useCallback(
    async (id: string, title: string) => {
      await dispatch(editList({ id, title }));
    },
    [dispatch]
  );

  return {
    lists,
    isPending,
    errors,
    handleFetchLists,
    handleCreateList,
    handleDeleteList,
    handleEditList,
  };
};
