export default function TaskFilters({ currentFilter, onFilterChange }) {
  const filters = [
    { value: "all", label: "All Tasks" },
    { value: "incomplete", label: "Incomplete" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="flex gap-2" role="group" aria-label="Task Filters">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          aria-current={currentFilter === f.value ? "true" : "false"}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
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
