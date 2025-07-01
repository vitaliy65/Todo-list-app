"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { CreateTaskForm } from "@/components/tasks/Create-task-form";
import { TaskItem } from "@/components/tasks/Task-item";
import type { List, Task, User } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask, updateTask } from "@/api/task/route";
import { useState } from "react";

interface TasksViewProps {
  selectedList: List;
  tasks: Task[];
}

export function TasksView({ selectedList, tasks }: TasksViewProps) {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["user"]) as User | undefined;

  // Track loading and error states for all mutations
  const [errors, setErrors] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);

  // Simple back navigation
  const onBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const handleDeleteTask = useMutation({
    mutationFn: async (taskId: string) => await deleteTask(taskId),
    onMutate: () => {
      setIsPending(true);
      setErrors([]);
    },
    onError: (error) => {
      setErrors([error?.message || "Ошибка удаления задачи"]);
      setIsPending(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsPending(false);
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
    onMutate: () => {
      setIsPending(true);
      setErrors([]);
    },
    onError: (error) => {
      setErrors([error?.message || "Ошибка обновления задачи"]);
      setIsPending(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsPending(false);
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
    onMutate: () => {
      setIsPending(true);
      setErrors([]);
    },
    onError: (error) => {
      setErrors([error?.message || "Ошибка создания задачи"]);
      setIsPending(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsPending(false);
    },
  });

  const onCreateTask = (title: string, description: string) => {
    handleTaskCreate.mutate({
      title,
      description,
      listId: selectedList.id,
      authorId: user.id,
      isCompleted: false,
    });
  };

  const onToggleTask = (taskId: string) => {
    const taskToToggle = tasks.find((task) => task.id === taskId);
    if (taskToToggle) {
      handleEditTask.mutate({
        taskId,
        title: taskToToggle.title,
        description: taskToToggle.description,
        isCompleted: !taskToToggle.isCompleted,
      });
    }
  };

  const onDeleteTask = (taskId: string) => {
    handleDeleteTask.mutate(taskId);
  };

  const onEditTask = (
    taskId: string,
    newTitle: string,
    newDescription: string,
    isCompleted: boolean
  ) => {
    handleEditTask.mutate({
      taskId,
      title: newTitle,
      description: newDescription,
      isCompleted,
    });
  };

  const filteredTasks = tasks.filter((task) => task.listId === selectedList.id);

  if (!user || !user.id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к спискам
          </Button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">
                {selectedList.title}
              </h1>
            </div>
            <p className="text-gray-600">Управляйте задачами в этом списке</p>
          </div>
        </div>

        <CreateTaskForm
          onCreateTask={onCreateTask}
          participants={selectedList.participants}
          currentUserId={user.id}
        />

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Задачи</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isPending ? (
              <div className="p-8 text-center text-gray-500">
                <p>Загрузка задач...</p>
              </div>
            ) : errors.length > 0 ? (
              <div className="p-8 text-center text-red-500">
                <p>Ошибка: {errors.join(", ")}</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Пока нет задач</p>
                <p className="text-sm">Добавьте задачу выше, чтобы начать</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 divide-y divide-gray-200 ">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    participants={selectedList.participants}
                    onToggle={onToggleTask}
                    onDelete={onDeleteTask}
                    onEdit={onEditTask}
                    currentUserId={user.id}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
