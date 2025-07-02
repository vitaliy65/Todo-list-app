import { createTask, deleteTask, getTasks, updateTask } from "@/api/task/route";
import { Task } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useTask() {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => await getTasks(),
  });

  const tasks = tasksQuery.data as Task[];

  const handleDeleteTask = useMutation({
    mutationFn: async (taskId: string) => await deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleEditTask = useMutation({
    mutationFn: async ({
      taskId,
      title,
      description,
      isCompleted,
    }: {
      taskId: string;
      title?: string;
      description?: string;
      isCompleted?: boolean;
    }) => await updateTask({ taskId, title, description, isCompleted }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleTaskCreate = useMutation({
    mutationFn: async (data: {
      listId: string;
      title: string;
      description?: string;
      isCompleted: boolean;
      authorId: string;
    }) => await createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    //task data
    tasks,

    // mutations
    handleDeleteTask: handleDeleteTask.mutateAsync,
    handleEditTask: handleEditTask.mutateAsync,
    handleTaskCreate: handleTaskCreate.mutateAsync,

    // pending
    isTasksPending: tasksQuery.isPending,
    isDeleteTaskPending: handleDeleteTask.isPending,
    ishandleEditTaskPending: handleEditTask.isPending,
    isCreateTaskPending: handleTaskCreate.isPending,

    // isError
    isDeleteTaskError: handleDeleteTask.isError,
    ishandleEditTaskError: handleEditTask.isError,
    isCreateTaskError: handleTaskCreate.isError,

    // error messages
    deleteTaskErrorMessage: handleDeleteTask.error?.message,
    handleEditTaskErrorMessage: handleEditTask.error?.message,
    createTaskErrorMessage: handleTaskCreate.error?.message,

    isTasksError: tasksQuery.isError,
    tasksErrorMessage: tasksQuery.error?.message,
  };
}
