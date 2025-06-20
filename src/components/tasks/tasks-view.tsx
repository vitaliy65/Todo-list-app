"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { TaskItem } from "@/components/tasks/task-item";
import type { List } from "@/types/types";
import { useTask } from "@/hooks/useTask";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface TasksViewProps {
  selectedList: List;
  onBack: () => void;
}

export function TasksView({ selectedList, onBack }: TasksViewProps) {
  const {
    tasks,
    isPending,
    errors,
    handleFetchTasks,
    handleCreateTask,
    handleDeleteTask,
    handleEditTask,
  } = useTask();
  const { auth } = useAuth();

  useEffect(() => {
    if (selectedList.id && auth.id) {
      handleFetchTasks(auth.id);
    }
  }, [selectedList.id, auth.id, handleFetchTasks]);

  const completedCount = tasks.filter((task) => task.isCompleted).length;
  const totalCount = tasks.length;

  const onCreateTask = (title: string, description: string) => {
    if (auth.id) {
      handleCreateTask(title, description, selectedList.id, auth.id);
    }
  };

  const onToggleTask = (taskId: string) => {
    const taskToToggle = tasks.find((task) => task.id === taskId);
    if (taskToToggle) {
      handleEditTask(taskId, undefined, undefined, !taskToToggle.isCompleted);
    }
  };

  const onDeleteTask = (taskId: string) => {
    handleDeleteTask(taskId);
  };

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
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {completedCount}/{totalCount} выполнено
              </Badge>
            </div>
            <p className="text-gray-600">Управляйте задачами в этом списке</p>
          </div>
        </div>

        <CreateTaskForm onCreateTask={onCreateTask} />

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
            ) : tasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Пока нет задач</p>
                <p className="text-sm">Добавьте задачу выше, чтобы начать</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 divide-y divide-gray-200 ">
                {tasks
                  .filter((task) => task.listId === selectedList.id)
                  .map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {tasks.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              {completedCount === totalCount && totalCount > 0
                ? "🎉 Все задачи выполнены! Отличная работа!"
                : `Осталось ${totalCount - completedCount} задач${
                    totalCount - completedCount !== 1
                      ? totalCount - completedCount < 5
                        ? "и"
                        : ""
                      : "а"
                  }`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
