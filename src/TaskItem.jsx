import { useState } from "react";
import { Check, X, Trash2, Edit2 } from "lucide-react";

export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  const handleSave = () => {
    if (editValue.trim() && editValue !== task.title) {
      onUpdate(task.id, editValue.trim());
    }
    setIsEditing(false);
    setEditValue(task.title);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(task.title);
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
        task.completed
          ? "bg-secondary border-border opacity-75"
          : "bg-card border-border hover:border-primary"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          task.completed
            ? "bg-green-500 border-green-500"
            : "border-primary hover:bg-primary hover:border-primary"
        }`}
      >
        {task.completed && <Check className="w-4 h-4 text-white" />}
      </button>

      {/* Task Title or Edit Input */}
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 px-3 py-1 rounded border border-primary bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="text-green-500 hover:text-green-600 transition-colors"
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            onClick={handleCancel}
            className="text-destructive hover:text-destructive/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <span
          className={`flex-1 text-lg ${
            task.completed
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {task.title}
        </span>
      )}

      {/* Edit and Delete Buttons */}
      {!isEditing && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-100">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
