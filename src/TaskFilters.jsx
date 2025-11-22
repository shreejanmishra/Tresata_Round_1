export default function TaskFilters({
  currentFilter,
  onFilterChange,
  allCount = 0,
  pendingCount = 0,
  inProgressCount = 0,
  completedCount = 0,
}) {
  const filters = [
    { value: "all", label: "All", count: allCount },
    {
      value: "pending",
      label: "Pending",
      count: pendingCount,
    },
    {
      value: "in-progress",
      label: "In Progress",
      count: inProgressCount,
    },
    {
      value: "completed",
      label: "Completed",
      count: completedCount,
    },
  ];

  return (
    <div
      className="flex gap-1 sm:gap-2 flex-wrap"
      role="group"
      aria-label="Filter tasks by status"
    >
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          aria-current={currentFilter === f.value ? "true" : "false"}
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
            currentFilter === f.value
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-foreground hover:border-primary"
          }`}
        >
          {f.label}{" "}
          <span className="text-xs opacity-75 font-bold ">({f.count})</span>
        </button>
      ))}
    </div>
  );
}
