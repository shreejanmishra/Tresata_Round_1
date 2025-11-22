export default function TaskFilters({ currentFilter, onFilterChange }) {
  const filters = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div
      className="flex gap-2 flex-wrap"
      role="group"
      aria-label="Filter tasks by status"
    >
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          aria-current={currentFilter === f.value ? "true" : "false"}
          className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
            currentFilter === f.value
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-foreground hover:border-primary"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
