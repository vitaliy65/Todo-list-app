"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface CreateTaskFormProps {
  onCreateTask: (title: string, description: string) => void;
}

export function CreateTaskForm({ onCreateTask }: CreateTaskFormProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const handleSubmit = () => {
    if (newTaskTitle.trim() !== "") {
      onCreateTask(newTaskTitle.trim(), newTaskDescription.trim());
      setNewTaskTitle("");
      setNewTaskDescription("");
    }
  };

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Добавить задачу</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Название задачи"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            className="flex-1"
          />
          <Input
            placeholder="Описание задачи (необязательно)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" /> Добавить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
