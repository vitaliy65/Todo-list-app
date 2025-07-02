"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Pencil, Check, Share } from "lucide-react";
import type { List } from "@/types/types";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import ShareListModal from "./Share-list-modal";
import { useRouter } from "next/navigation";
import ListCardLoading from "./Todo-lists-card-loading";
import useList from "@/hooks/List";

export function TodoListCard({ list }: { list: List }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const [openShareModel, setOpenShareModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {}, [isEditing]);
  const { updateList, deleteList } = useList();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (editedTitle.trim() !== "") {
      updateList({ listId: list.id, title: editedTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleSelectList = (listId: string) => {
    setIsLoading(true);
    router.push(`/tasks/${listId}`);
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
      className="relative cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
      onClick={() => handleSelectList(list.id)}
    >
      <CardContent className="p-6">
        <form className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 overflow-hidden">
            {isEditing ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onClick={(e) => e.stopPropagation()}
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
                {list.userRole && (
                  <Badge variant="outline" className="ml-2 capitalize">
                    {list.userRole}
                  </Badge>
                )}
              </>
            )}
          </div>
          {list.userRole !== "viewer" && (
            <div className="flex flex-row">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
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
                  deleteList(list.id);
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </form>
        {list.userRole !== "viewer" && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpenShareModal(true);
            }}
          >
            <Share />
          </Button>
        )}

        {openShareModel && (
          <ShareListModal
            listId={list.id}
            handleClose={() => setOpenShareModal(false)}
          />
        )}
      </CardContent>
      {isLoading && <ListCardLoading />}
    </Card>
  );
}
