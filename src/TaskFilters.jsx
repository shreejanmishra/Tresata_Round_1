export default function TaskFilters({ currentFilter, onFilterChange }) {
  const filters = [
    { value: "all", label: "All Tasks" },
    { value: "incomplete", label: "Incomplete" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
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
