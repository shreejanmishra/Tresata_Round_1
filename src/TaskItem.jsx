import { useState } from "react";
import { Check, X, Trash2, Edit2 } from "lucide-react";

export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdate(task.id, trimmed);
    }
    setIsEditing(false);
    setEditValue(task.title); // always reset to original
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(task.title);
  };

  const formatTaskDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const taskDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (taskDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }
    if (taskDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div
      className={`group flex flex-col gap-2 p-4 rounded-lg border transition-all ${
        task.completed
          ? "bg-secondary border-border opacity-75"
          : "bg-card border-border hover:border-primary"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(task.id)}
          aria-label={
            task.completed
              ? `Mark "${task.title}" as incomplete`
              : `Mark "${task.title}" as complete`
          }
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed
              ? "bg-green-500 border-green-500"
              : "border-primary hover:bg-primary hover:border-primary"
          }`}
        >
          {task.completed && <Check className="w-4 h-4 text-white" />}
        </button>

        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              aria-label="Edit task title"
              className="flex-1 px-3 py-1 rounded border border-primary bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              onClick={handleSave}
              aria-label="Save task changes"
              className="text-green-500 hover:text-green-600 transition-colors"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              aria-label="Cancel task edit"
              className="text-destructive hover:text-destructive/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <span
              className={`flex-1 text-lg ${
                task.completed
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
              data-testid="task-title"
            >
              {task.title}
            </span>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setEditValue(task.title);
                  setIsEditing(true);
                }}
                aria-label={`Edit "${task.title}"`}
                className="p-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                aria-label={`Delete "${task.title}"`}
                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="text-xs text-muted-foreground ml-9">
        Created: {formatTaskDate(task.createdAt)}
      </div>
    </div>
  );
}
