"use client";

import { List as ListIcon } from "lucide-react";
import { CreateListForm } from "./Create-list-form";
import { TodoListCard } from "./Todo-lists-card";
import { useList } from "@/hooks/useList";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Task } from "@/types/types"; // Assuming Task is also in types.ts
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

export function TodoListsView() {
  const {
    lists,
    isPending,
    handleFetchLists,
    handleCreateList,
    handleDeleteList,
    handleEditList,
  } = useList();
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.id) {
      handleFetchLists(auth.id);
    }
  }, [auth.id, handleFetchLists]);

  // Filter tasks for the selected list
  // This part assumes you have tasks available. If tasks are fetched per list, this logic needs adjustment.
  // For now, let's assume tasks are available globally or will be fetched when a list is selected.
  const tasks: Task[] = []; // Placeholder for tasks, will be fetched or managed elsewhere

  const getListStats = (listId: string) => {
    const listTasks = tasks.filter((task) => task.listId === listId);
    const completed = listTasks.filter((task) => task.isCompleted).length; // Changed to isCompleted
    return { total: listTasks.length, completed };
  };

  const handleSelectList = (listId: string) => {
    // setSelectedListId(listId);
    // TODO: Navigate to tasks view for this listId
    console.log("Selected list:", listId);
    router.push(`/tasks/${listId}`);
  };

  if (isPending) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Мои списки задач
          </h1>
          <p className="text-gray-600">Выберите список или создайте новый</p>
        </div>

        {auth.id && (
          <CreateListForm
            onCreateList={(title) => handleCreateList(title, auth.id)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <TodoListCard
              key={list.id}
              list={list}
              stats={getListStats(list.id)}
              onSelect={handleSelectList}
              onDelete={handleDeleteList}
              onEdit={handleEditList}
            />
          ))}
        </div>

        {lists.length === 0 && !isPending && (
          <div className="text-center py-12">
            <ListIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет списков задач
            </h3>
            <p className="text-gray-600">Создайте свой первый список выше</p>
          </div>
        )}
      </div>
    </div>
  );
}
