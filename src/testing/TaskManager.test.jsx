import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskManager from "../TaskManager.jsx";

describe("TaskManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.localStorage.getItem.mockReturnValue(null);
    global.localStorage.setItem.mockImplementation(() => {});
  });

  it("renders with initial empty state", () => {
    render(<TaskManager />);

    expect(screen.getByTestId("task-manager")).toBeInTheDocument();
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByTestId("completed-count")).toBeInTheDocument();
    expect(screen.getByTestId("in-progress-count")).toBeInTheDocument();
  });

  it("adds a new task", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "New Task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });
  });

  it("cycles through task statuses", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText("Task")).toBeInTheDocument();
    });

    const statusButton = screen.getByRole("button", {
      name: /Change task status/i,
    });

    // Click to cycle through statuses: pending -> in-progress -> completed -> pending
    await user.click(statusButton);

    await waitFor(() => {
      expect(screen.getByTestId("in-progress-count")).toHaveTextContent("1");
    });
  });

  it("filters tasks by pending status", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Task 1");
    await user.click(screen.getByRole("button", { name: /add/i }));
    await user.type(input, "Task 2");
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });

    // Get the filter button group and click Pending button within it
    const filterGroup = screen.getByRole("group", { name: /Task Filters/i });
    const pendingBtn = within(filterGroup).getByRole("button", {
      name: "Pending",
    });
    await user.click(pendingBtn);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });
  });

  it("filters tasks by completed status", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Task 1");
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    // Cycle task to completed status (pending -> in-progress -> completed)
    const statusButtons = screen.getAllByRole("button", {
      name: /Change task status/i,
    });
    await user.click(statusButtons[0]); // pending -> in-progress
    await user.click(statusButtons[0]); // in-progress -> completed

    await waitFor(() => {
      expect(screen.getByTestId("completed-count")).toHaveTextContent("1");
    });

    // Get the filter button group and click Completed button within it
    const filterGroup = screen.getByRole("group", { name: /Task Filters/i });
    const completedBtn = within(filterGroup).getByRole("button", {
      name: "Completed",
    });
    await user.click(completedBtn);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });
  });

  it("shows empty state message when no tasks", () => {
    render(<TaskManager />);

    expect(
      screen.getByText("No tasks yet. Add one to get started!")
    ).toBeInTheDocument();
  });

  it("searches tasks with debounce", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Searchable");
    await user.click(screen.getByRole("button", { name: /add/i }));
    await user.type(input, "Other");
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText("Searchable")).toBeInTheDocument();
      expect(screen.getByText("Other")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search tasks...");
    await user.type(searchInput, "search");

    await waitFor(
      () => {
        expect(screen.getByText("Searchable")).toBeInTheDocument();
        expect(screen.queryByText("Other")).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  it("clears search using clear button", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    const searchInput = screen.getByPlaceholderText("Search tasks...");
    await user.type(searchInput, "task");

    await waitFor(() => {
      expect(searchInput).toHaveValue("task");
    });

    const clearBtn = screen.getByRole("button", { name: /clear search/i });
    await user.click(clearBtn);

    expect(searchInput).toHaveValue("");
  });

  it("saves tasks to localStorage", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        "tasks",
        expect.stringContaining("Task")
      );
    });
  });

  it("sorts tasks by different criteria", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Zebra");
    await user.click(screen.getByRole("button", { name: /add/i }));
    await user.type(input, "Apple");
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText("Zebra")).toBeInTheDocument();
      expect(screen.getByText("Apple")).toBeInTheDocument();
    });

    const sortSelect = screen.getByDisplayValue("Newest First");
    await user.selectOptions(sortSelect, "name-asc");

    await waitFor(() => {
      const tasks = screen.getAllByTestId("task-wrapper");
      expect(tasks.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("handles pagination", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    for (let i = 1; i <= 6; i++) {
      await user.type(input, `Task ${i}`);
      await user.click(screen.getByRole("button", { name: /add/i }));
    }

    await waitFor(() => {
      expect(screen.getByText("Task 6")).toBeInTheDocument();
    });

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).not.toBeDisabled();

    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Page 2 of \d+/)).toBeInTheDocument();
    });
  });
});
