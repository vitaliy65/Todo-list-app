"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Pencil, Check } from "lucide-react";
import type { List } from "@/types/types";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface ListStats {
  total: number;
  completed: number;
}

interface TodoListCardProps {
  list: List;
  stats: ListStats;
  onSelect: (listId: string) => void;
  onDelete: (listId: string) => void;
  onEdit: (listId: string, newTitle: string) => void;
}

export function TodoListCard({
  list,
  stats,
  onSelect,
  onDelete,
  onEdit,
}: TodoListCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);

  useEffect(() => {
    if (!isEditing) {
      setEditedTitle(list.title);
    }
  }, [list, isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (editedTitle.trim() !== "" && editedTitle !== list.title) {
      onEdit(list.id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveClick();
    } else if (e.key === "Escape") {
      setEditedTitle(list.title);
      setIsEditing(false);
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
      onClick={() => onSelect(list.id)}
    >
      <CardContent className="p-6">
        <form className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 overflow-hidden">
            {isEditing ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleSaveClick}
                onKeyDown={handleKeyDown}
                autoFocus
                className="flex-grow min-w-0"
              />
            ) : (
              <>
                <h3
                  className="font-semibold text-lg text-gray-900 truncate"
                  title={list.title}
                >
                  {list.title}
                </h3>
              </>
            )}
          </div>
          <div className="flex flex-row">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isEditing) {
                  handleSaveClick();
                } else {
                  handleEditClick();
                }
              }}
              className="text-gray-500 hover:text-yellow-700 hover:bg-yellow-50"
            >
              {isEditing ? (
                <Check className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(list.id);
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </form>

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
                className={`h-2 rounded-full bg-blue-500 transition-all duration-300`}
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
