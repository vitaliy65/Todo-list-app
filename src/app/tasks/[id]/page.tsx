"use client";

import { TasksView } from "@/components/tasks/tasks-view";
import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useList } from "@/hooks/useList";
import { List } from "@/types/types";

export default function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const { lists, isPending, errors } = useList();
  const [selectedList, setSelectedList] = React.useState<List | undefined>(
    undefined
  );

  useEffect(() => {
    if (lists.length > 0) {
      const foundList = lists.find((list) => list.id === id);
      setSelectedList(foundList);
    }
  }, [lists, id]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (isPending) {
    return <div className="text-center p-8">Загрузка списка...</div>;
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

  return <TasksView selectedList={selectedList} onBack={handleBack} />;
}
