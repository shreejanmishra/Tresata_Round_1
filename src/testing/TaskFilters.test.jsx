import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskFilters from "../TaskFilters.jsx";

describe("TaskFilters", () => {
  it("renders all filter buttons", () => {
    const mockChange = jest.fn();
    render(<TaskFilters currentFilter="all" onFilterChange={mockChange} />);

    expect(screen.getByText("All Tasks")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("highlights current filter button with bg-primary class", () => {
    const mockChange = jest.fn();
    render(
      <TaskFilters currentFilter="completed" onFilterChange={mockChange} />
    );

    const completedButton = screen.getByText("Completed");
    expect(completedButton).toHaveClass("bg-primary");
    expect(completedButton).toHaveClass("text-primary-foreground");
  });

  it("does not highlight inactive filter buttons", () => {
    const mockChange = jest.fn();
    render(<TaskFilters currentFilter="all" onFilterChange={mockChange} />);

    const pendingButton = screen.getByText("Pending");
    expect(pendingButton).not.toHaveClass("bg-primary");
    expect(pendingButton).toHaveClass("bg-card");
  });

  it("calls onFilterChange with 'all' when All Tasks clicked", async () => {
    const mockChange = jest.fn();
    const user = userEvent.setup();
    render(<TaskFilters currentFilter="pending" onFilterChange={mockChange} />);

    await user.click(screen.getByText("All Tasks"));

    expect(mockChange).toHaveBeenCalledWith("all");
  });

  it("calls onFilterChange with 'pending' when Pending clicked", async () => {
    const mockChange = jest.fn();
    const user = userEvent.setup();
    render(<TaskFilters currentFilter="all" onFilterChange={mockChange} />);

    await user.click(screen.getByText("Pending"));

    expect(mockChange).toHaveBeenCalledWith("pending");
  });

  it("calls onFilterChange with 'in-progress' when In Progress clicked", async () => {
    const mockChange = jest.fn();
    const user = userEvent.setup();
    render(<TaskFilters currentFilter="all" onFilterChange={mockChange} />);

    await user.click(screen.getByText("In Progress"));

    expect(mockChange).toHaveBeenCalledWith("in-progress");
  });

  it("calls onFilterChange with 'completed' when Completed clicked", async () => {
    const mockChange = jest.fn();
    const user = userEvent.setup();
    render(<TaskFilters currentFilter="all" onFilterChange={mockChange} />);

    await user.click(screen.getByText("Completed"));

    expect(mockChange).toHaveBeenCalledWith("completed");
  });

  it("has proper ARIA attributes for filter buttons", () => {
    const mockChange = jest.fn();
    render(<TaskFilters currentFilter="all" onFilterChange={mockChange} />);

    const allButton = screen.getByText("All Tasks");
    const pendingButton = screen.getByText("Pending");
    const completedButton = screen.getByText("Completed");

    expect(allButton).toHaveAttribute("aria-current", "true");
    expect(pendingButton).toHaveAttribute("aria-current", "false");
    expect(completedButton).toHaveAttribute("aria-current", "false");
  });

  it("has filter group role", () => {
    const mockChange = jest.fn();
    render(<TaskFilters currentFilter="all" onFilterChange={mockChange} />);

    const filterGroup = screen.getByRole("group", { name: /Task Filters/i });
    expect(filterGroup).toBeInTheDocument();
  });
});
