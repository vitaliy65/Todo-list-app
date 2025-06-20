import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchTasks,
  createTask,
  deleteTask,
  editTask,
} from "../store/slices/tasksSlice";
import { useCallback } from "react";

export const useTask = () => {
  const dispatch = useAppDispatch();
  const { tasks, isPending, errors } = useAppSelector((state) => state.tasks);

  const handleFetchTasks = useCallback(
    (authorId: string) => {
      dispatch(fetchTasks({ authorId }));
    },
    [dispatch]
  );

  const handleCreateTask = useCallback(
    (title: string, description: string, listId: string, authorId: string) => {
      dispatch(createTask({ title, description, listId, authorId }));
    },
    [dispatch]
  );

  const handleDeleteTask = useCallback(
    (id: string) => {
      dispatch(deleteTask({ id }));
    },
    [dispatch]
  );

  const handleEditTask = useCallback(
    async (
      id: string,
      title?: string,
      description?: string,
      isCompleted?: boolean
    ) => {
      await dispatch(editTask({ id, title, description, isCompleted }));
    },
    [dispatch]
  );

  return {
    tasks,
    isPending,
    errors,
    handleFetchTasks,
    handleCreateTask,
    handleDeleteTask,
    handleEditTask,
  };
};
