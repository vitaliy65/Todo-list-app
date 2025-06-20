"use client";

import { TasksView } from "@/components/tasks/Tasks-view";
import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useList } from "@/hooks/useList";
import { useAuth } from "@/hooks/useAuth";
import { useTask } from "@/hooks/useTask";
import { List } from "@/types/types";

export default function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const { lists, isPending: isListsPending, errors: listErrors } = useList();
  const { auth } = useAuth();
  const {
    tasks,
    isPending: isTasksPending,
    errors: taskErrors,
    handleFetchTasks,
  } = useTask();
  const [selectedList, setSelectedList] = React.useState<List | undefined>(
    undefined
  );

  useEffect(() => {
    if (lists.length > 0) {
      const foundList = lists.find((list) => list.id === id);
      setSelectedList(foundList);
    }
    if (auth.id) {
      const participantListIds = lists
        .filter(
          (list) =>
            list.ownerId === auth.id ||
            list.participants.some((p) => p.userId === auth.id)
        )
        .map((list) => list.id);
      handleFetchTasks(auth.id, participantListIds);
    }
  }, [lists, id, auth.id, handleFetchTasks]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const isLoading = isListsPending || isTasksPending;
  const errors = [...listErrors, ...taskErrors];

  if (isLoading) {
    return <div className="text-center p-8">Загрузка списка и задач...</div>;
  }

  if (errors.length > 0) {
    return (
      <div className="text-center p-8 text-red-500">
        Ошибка: {errors.join(", ")}
      </div>
    );
  }

  if (!selectedList) {
    return <div className="text-center p-8">Список не найден.</div>;
  }

  return (
    <TasksView
      selectedList={selectedList}
      onBack={handleBack}
      tasks={tasks}
      isPending={isLoading}
      errors={errors}
    />
  );
}
