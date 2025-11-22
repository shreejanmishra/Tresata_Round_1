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

  it("trims whitespace", async () => {
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
});
