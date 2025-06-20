"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Trash2, CheckCircle2, Circle, Edit2 } from "lucide-react";
import type { Task } from "@/types/types";
import { useState } from "react";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newTitle: string, newDescription: string) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleSave = () => {
    onEdit(task.id, editedTitle, editedDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setIsEditing(false);
  };

  return (
    <div className="p-4 flex flex-col gap-3 mx-4 rounded-xl bg-black/5">
      <div
        className={`flex items-center gap-3 rounded-md px-2 hover:bg-gray-50 transition-colors ${
          task.isCompleted ? "bg-gray-50/50" : ""
        }`}
      >
        <Checkbox
          id={`task-${task.id}`}
          checked={task.isCompleted}
          onCheckedChange={() => onToggle(task.id)}
          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 cursor-pointer"
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-sm font-medium"
            />
          ) : (
            <label
              htmlFor={`task-${task.id}`}
              className={`block text-sm font-medium cursor-pointer ${
                task.isCompleted
                  ? "text-gray-500 line-through"
                  : "text-gray-900"
              }`}
            >
              {task.title}
            </label>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                aria-label="Сохранить изменения"
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                aria-label="Отменить изменения"
              >
                <Circle className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              {task.isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                aria-label={`Редактировать задачу: ${task.title}`}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                aria-label={`Удалить задачу: ${task.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <label className="text-gray-400 text-sm" htmlFor={`task-${task.id}`}>
          Task description:
        </label>
        {isEditing ? (
          <Input
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="text-sm font-medium"
          />
        ) : (
          <p id={`task-${task.id}`} className={`font-medium break-words`}>
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
}
