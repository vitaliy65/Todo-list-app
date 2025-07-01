"use client";

import { List as ListIcon } from "lucide-react";
import { CreateListForm } from "./Create-list-form";
import { TodoListCard } from "./Todo-lists-card";
import { useQueryClient } from "@tanstack/react-query";
import { List, User } from "@/types/types";

export function TodoListsView() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["user"]) as User | undefined;
  const lists = queryClient.getQueryData(["lists", user?.id]) as
    | List[]
    | undefined;

  if (!user || !user.id) {
    return null;
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

        <CreateListForm />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists &&
            lists.map((list) => <TodoListCard key={list.id} list={list} />)}
        </div>

        {lists && lists.length === 0 && (
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
