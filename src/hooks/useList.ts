import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchLists,
  createList,
  deleteList,
  editList,
} from "@/store/slices/listsSlice";
import { useAppSelector } from "@/store/hooks";

export const useList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { lists, isPending, errors } = useAppSelector(
    (state: RootState) => state.lists
  );

  const handleFetchLists = (ownerId: string) => {
    dispatch(fetchLists({ ownerId }));
  };

  const handleCreateList = (title: string, ownerId: string) => {
    dispatch(createList({ title, ownerId }));
  };

  const handleDeleteList = (id: string) => {
    dispatch(deleteList({ id }));
  };

  const handleEditList = (id: string, title: string) => {
    dispatch(editList({ id, title }));
  };

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
