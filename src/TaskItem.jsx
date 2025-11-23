import { useState } from "react";
import { Check, X, Trash2, Edit2, ChevronUp, ChevronDown } from "lucide-react";

export default function TaskItem({
  task,
  onToggle,
  onUpdate,
  onDelete,
  isSelected,
  onToggleSelection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ""
  );
  const [showDescription, setShowDescription] = useState(false);

  const handleSave = () => {
    if (
      editTitle.trim() &&
      (editTitle !== task.title || editDescription !== task.description)
    ) {
      onUpdate(task.id, editTitle.trim(), editDescription.trim());
    }
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const formatTaskDate = (dateString) => {
    const date = new Date(dateString);

    const timeString = date.toLocaleTimeString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const dateFormatString = date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return { timeString, dateFormatString };
  };

  const getStatusColor = () => {
    switch (task.status) {
      case "pending":
        return "bg-[#D0D0D0]/20 border-[#D0D0D0]";
      case "in-progress":
        return "bg-[#FFB03C]/20 border-[#FFB03C]";
      case "completed":
        return "bg-[#368A04]/20 border-[#368A04] opacity-75";
      default:
        return "bg-card border-[#D0D0D0]";
    }
  };

  return (
    <div
      className={`group flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border transition-all ${getStatusColor()}`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="flex-shrink-0 flex items-start pt-1">
          <button
            onClick={() => {
              const statuses = ["pending", "in-progress", "completed"];
              const currentIndex = statuses.indexOf(task.status || "pending");
              const nextStatus = statuses[(currentIndex + 1) % statuses.length];
              onToggle(task.id, nextStatus);
            }}
            aria-label={`Change task status from "${
              task.status || "pending"
            }" - cycle through Pending, In Progress, Completed`}
            className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all text-sm cursor-pointer ${
              task.status === "completed"
                ? "bg-[#368A04] border-[#368A04]"
                : task.status === "in-progress"
                ? "bg-[#FFB03C] border-[#FFB03C]"
                : "border-[#D0D0D0] hover:bg-[#D0D0D0] hover:border-[#D0D0D0]"
            }`}
          >
            {task.status === "completed" && (
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            )}
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          {isEditing ? (
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex gap-1 sm:gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancel();
                  }}
                  aria-label="Edit task title"
                  className="flex-1 px-2 sm:px-3 py-1 sm:py-2 rounded border-2 border-[oklch(0.4365_0.1509_256.72)] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.4365_0.1509_256.72)] text-sm sm:text-base"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  aria-label="Save task changes"
                  className="p-1 sm:p-2 text-green-500 hover:text-green-600 transition-colors flex-shrink-0"
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleCancel}
                  aria-label="Cancel task edit"
                  className="p-1 sm:p-2 text-destructive hover:text-destructive/80 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Task description (optional)..."
                aria-label="Edit task description"
                className="flex-1 px-2 sm:px-3 py-1 sm:py-2 rounded border-2 border-[oklch(0.4365_0.1509_256.72)] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.4365_0.1509_256.72)] resize-none h-16 sm:h-20 text-xs sm:text-sm"
              />
            </div>
          ) : (
            <>
              <span
                className={`flex-1 text-base sm:text-lg break-words ${
                  task.status === "completed"
                    ? "line-through text-muted-foreground"
                    : "text-[oklch(0.4365_0.1509_256.72)]"
                }`}
                data-testid="task-title"
              >
                {task.title}
              </span>

              {task.description && (
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex items-center gap-2 text-xs sm:text-sm font-medium transition-all py-1 px-2 rounded cursor-pointer w-fit"
                  aria-label={
                    showDescription ? "Hide description" : "Show description"
                  }
                >
                  {showDescription ? (
                    <ChevronUp className="w-4 h-4 text-[#034EA2]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#034EA2]" />
                  )}
                  Description
                </button>
              )}

              {showDescription && task.description && (
                <pre className="p-2 sm:p-3 bg-background rounded text-xs sm:text-sm text-foreground border border-border/50 max-h-48 overflow-y-auto text-wrap">
                  {task.description}
                </pre>
              )}

              <div className="text-xs text-muted-foreground">
                Created: {formatTaskDate(task.createdAt).timeString}
                <br />
                {formatTaskDate(task.createdAt).dateFormatString}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-1 items-end">
          <div className="flex gap-1 sm:gap-2 opacity-100 transition-opacity">
            <label className="flex items-center cursor-pointer p-1 sm:p-1.5 hover:bg-background/50 rounded transition-colors">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelection(task.id)}
                aria-label={`Select task: ${task.title}`}
                className="w-5 h-5 rounded border-2 border-border cursor-pointer accent-primary"
              />
            </label>
            <button
              onClick={() => {
                setEditTitle(task.title);
                setIsEditing(true);
              }}
              aria-label={`Edit "${task.title}"`}
              className="p-1 sm:p-1.5 text-muted-foreground hover:text-[oklch(0.4365_0.1509_256.72)] focus:text-[oklch(0.4365_0.1509_256.72)] transition-colors rounded hover:bg-background/50 cursor-pointer"
            >
              <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <button
            onClick={() => onDelete(task.id)}
            aria-label={`Delete "${task.title}"`}
            className="p-1 sm:p-1.5 text-muted-foreground hover:text-destructive focus:text-destructive transition-colors rounded hover:bg-background/50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
