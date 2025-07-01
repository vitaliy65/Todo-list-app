"use client";

import { TasksView } from "@/components/tasks/Tasks-view";
import React from "react";
import { getTasks } from "@/api/task/route";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { List, User } from "@/types/types";

export default function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => await getTasks(),
  });
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["user"]) as User;
  const lists = queryClient.getQueryData(["lists", user.id]) as
    | List[]
    | undefined;
  const selectedList = lists?.find((list: List) => list.id === id) as List;

  if (tasksQuery.isLoading) {
    return <div className="text-center p-8">Загрузка списка и задач...</div>;
  }

  if (tasksQuery.isError) {
    return (
      <div className="text-center p-8 text-red-500">
        {tasksQuery.error.message}
      </div>
    );
  }

  return <TasksView selectedList={selectedList} tasks={tasksQuery.data} />;
}
