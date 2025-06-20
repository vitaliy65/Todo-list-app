"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar } from "lucide-react";
import type { List } from "@/types/types";

interface ListStats {
  total: number;
  completed: number;
}

interface TodoListCardProps {
  list: List;
  stats: ListStats;
  onSelect: (listId: string) => void;
  onDelete: (listId: string) => void;
}

export function TodoListCard({
  list,
  stats,
  onSelect,
  onDelete,
}: TodoListCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
      onClick={() => onSelect(list.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${list.color}`}></div>
            <h3 className="font-semibold text-lg text-gray-900">
              {list.title}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(list.id);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Задач:</span>
            <Badge variant="secondary">{stats.total}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Выполнено:</span>
            <Badge
              variant="secondary"
              className={
                stats.completed === stats.total && stats.total > 0
                  ? "bg-green-100 text-green-800"
                  : ""
              }
            >
              {stats.completed}/{stats.total}
            </Badge>
          </div>
          {stats.total > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full ${list.color} transition-all duration-300`}
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              ></div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          {new Date(list.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
