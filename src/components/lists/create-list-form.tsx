"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FolderPlus } from "lucide-react";
import useList from "@/hooks/List";
import useUser from "@/hooks/User";

export function CreateListForm() {
  const [listTitle, setListTitle] = useState("");
  const { user } = useUser();
  const { createNewList } = useList();

  const handleSubmit = (title: string) => {
    if (listTitle.trim() !== "") {
      createNewList({
        title,
        ownerId: user.id,
        participants: [{ userId: user.id, role: "admin" }],
      });
      setListTitle("");
    }
  };

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderPlus className="h-5 w-5" />
          Создать новый список
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="Название списка..."
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(listTitle);
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={() => handleSubmit(listTitle)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
