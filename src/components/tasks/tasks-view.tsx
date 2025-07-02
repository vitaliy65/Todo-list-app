"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { CreateTaskForm } from "@/components/tasks/Create-task-form";
import { TaskItem } from "@/components/tasks/Task-item";
import type { List, Task } from "@/types/types";
import useUser from "@/hooks/User";
import useTask from "@/hooks/Task";

interface TasksViewProps {
  selectedList: List;
  tasks: Task[];
}

export function TasksView({ selectedList, tasks }: TasksViewProps) {
  const { user } = useUser();
  const {
    handleDeleteTask,
    handleEditTask,
    handleTaskCreate,
    isTasksPending,
    isTasksError,
    tasksErrorMessage,
  } = useTask();

  // Simple back navigation
  const onBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const onCreateTask = (title: string, description: string) => {
    handleTaskCreate({
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
      handleEditTask({
        taskId,
        title: taskToToggle.title,
        description: taskToToggle.description,
        isCompleted: !taskToToggle.isCompleted,
      });
    }
  };

  const onDeleteTask = (taskId: string) => {
    handleDeleteTask(taskId);
  };

  const onEditTask = (
    taskId: string,
    newTitle: string,
    newDescription: string,
    isCompleted: boolean
  ) => {
    handleEditTask({
      taskId,
      title: newTitle,
      description: newDescription,
      isCompleted,
    });
  };

  const filteredTasks = tasks.filter((task) => task.listId === selectedList.id);

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
            {isTasksPending ? (
              <div className="p-8 text-center text-gray-500">
                <p>Загрузка задач...</p>
              </div>
            ) : isTasksError ? (
              <div className="p-8 text-center text-red-500">
                <p>Ошибка: {tasksErrorMessage}</p>
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
