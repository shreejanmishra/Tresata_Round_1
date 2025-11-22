import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskAdder from "../TaskAdder.jsx";

describe("TaskAdder", () => {
  it("renders input and button", () => {
    const mockAdd = jest.fn();
    render(<TaskAdder onAddTask={mockAdd} />);

    expect(
      screen.getByPlaceholderText("Add a new task...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("renders form with correct aria-label", () => {
    const mockAdd = jest.fn();
    render(<TaskAdder onAddTask={mockAdd} />);

    const form = screen.getByRole("form", { hidden: false });
    expect(form).toHaveAttribute("aria-label", "Add new task form");
  });

  it("input has correct aria-label", () => {
    const mockAdd = jest.fn();
    render(<TaskAdder onAddTask={mockAdd} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    expect(input).toHaveAttribute("aria-label", "Enter task title");
  });

  it("button has correct aria-label", () => {
    const mockAdd = jest.fn();
    render(<TaskAdder onAddTask={mockAdd} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Add new task");
  });

  it("adds a task on submit", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Test task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(mockAdd).toHaveBeenCalledWith("Test task");
    expect(input).toHaveValue("");
  });

  it("adds a task on Enter key press", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Test task{Enter}");

    expect(mockAdd).toHaveBeenCalledWith("Test task");
    expect(input).toHaveValue("");
  });

  it("trims whitespace from task title", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "  test  ");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(mockAdd).toHaveBeenCalledWith("test");
  });

  it("does not add empty task", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(mockAdd).not.toHaveBeenCalled();
  });

  it("does not add task with only whitespace", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "   ");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(mockAdd).not.toHaveBeenCalled();
  });

  it("clears input after successful task submission", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "New Task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(input).toHaveValue("");
  });

  it("input has correct CSS classes for styling", () => {
    const mockAdd = jest.fn();
    render(<TaskAdder onAddTask={mockAdd} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    expect(input).toHaveClass("flex-1", "px-4", "py-3", "rounded-lg");
  });

  it("button has correct CSS classes for styling", () => {
    const mockAdd = jest.fn();
    render(<TaskAdder onAddTask={mockAdd} />);

    const button = screen.getByRole("button", { name: /add/i });
    expect(button).toHaveClass("px-6", "py-3", "bg-primary", "rounded-lg");
  });
});
