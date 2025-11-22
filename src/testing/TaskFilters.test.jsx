import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskFilters from "../TaskFilters.jsx";

describe("TaskFilters", () => {
  it("renders all filter buttons", () => {
    const mockChange = jest.fn();
    render(<TaskFilters currentFilter="all" onFilterChange={mockChange} />);

    expect(screen.getByText("All Tasks")).toBeInTheDocument();
    expect(screen.getByText("Incomplete")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("highlights current filter", () => {
    const mockChange = jest.fn();
    render(
      <TaskFilters currentFilter="completed" onFilterChange={mockChange} />
    );

    const completed = screen.getByText("Completed");
    expect(completed).toHaveClass("bg-primary");
  });

  it("calls onFilterChange when button clicked", async () => {
    const mockChange = jest.fn();
    const user = userEvent.setup();
    render(<TaskFilters currentFilter="all" onFilterChange={mockChange} />);

    await user.click(screen.getByText("Incomplete"));

    expect(mockChange).toHaveBeenCalledWith("incomplete");
  });
});
