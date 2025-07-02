"use client";

import { TasksView } from "@/components/tasks/Tasks-view";
import React from "react";
import { List } from "@/types/types";
import useList from "@/hooks/List";
import useTask from "@/hooks/Task";

export default function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { tasks, isTasksError, isTasksPending, tasksErrorMessage } = useTask();
  const { lists } = useList();
  const selectedList = lists?.find((list: List) => list.id === id) as List;

  if (isTasksPending) {
    return <div className="text-center p-8">Загрузка списка и задач...</div>;
  }

  if (isTasksError) {
    return (
      <div className="text-center p-8 text-red-500">{tasksErrorMessage}</div>
    );
  }

  return <TasksView selectedList={selectedList} tasks={tasks} />;
}
