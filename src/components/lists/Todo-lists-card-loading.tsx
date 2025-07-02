// loading in the form of 3 swivel points
import React from "react";

export default function ListCardLoading({ dots = 3 }: { dots?: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-lg shadow-md p-6 cursor-default">
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: dots }).map((_, index) => (
          <div
            key={index}
            className="w-3 h-3 bg-black rounded-full animate-bounce"
            style={{ animationDelay: `${index * 0.2}s` }}
          ></div>
        ))}
      </div>
      <p className="text-black text-sm mt-2">Загрузка...</p>
    </div>
  );
}
