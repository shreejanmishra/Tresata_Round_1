Build tool: Vite

npm i- install all the dependencies mentioned in package.json
npm run dev - start dev server
npm run build - build production ready dist folder (used in VM deployment)
npm run test - run Jest test suite

Features implemented:

1. Task List: Display a list of tasks. Each task should show the task title and its status (completed or not completed).

2. Add Task: Provide an input field and a button for adding new tasks. When a user enters a task title and clicks the add button,
   the task should be added to the task list

3. Advanced Task Styling: Completed tasks show strikethrough text with reduced opacity, hover effects on incomplete tasks, and visual state changes with color indicators.

4. Inline Task Editing: Edit task titles directly within the task list with save/cancel buttons, form validation to prevent empty updates.

5. Delete Task: Allow users to delete a task from the list.

6. State Management: Use React's state management to handle the addition, updating, and deletion of tasks.

7. Component Design: Break down the application into reusable components.

8. User Interface: Ensure the application has a clean and user-friendly interface. Used Tailwind CSS for styling.

9. Persisting Tasks: Implement a way to persist tasks between page reloads using local storage.

10. Task Filters: Add functionality to filter tasks by their status made different tabs (all, completed, incomplete). Click the circle icon before the task to change the status of the task.

11. Search Functionality: Implemented task search with debounced query (300ms) allowing users to filter tasks in real-time by title.

12. Task Statistics Dashboard: Display real-time counts of total tasks, completed tasks, and remaining incomplete tasks with visual indicators and icons.

13. Sorting Options: Multiple sort options including newest first(date created), oldest first(date created), name (A-Z), and name (Z-A).

14. Pagination: Implemented pagination with configurable items per page (5, 10, 25, or all) and navigation controls.

15. Task Timestamps: Each task tracks creation timestamp and displays formatted dates (today shows time, yesterday shows "Yesterday",
    older dates show relative date format).

16. Accessibility Features: Comprehensive ARIA labels, semantic HTML, keyboard-accessible buttons, and proper focus management for interactive elements.

17. Responsive Design: Mobile-friendly layout with responsive grid layouts and adaptive spacing for various screen sizes.

18. Custom Color Scheme: Light and dark mode support with OKLch-based color system for improved visual accessibility and modern design aesthetics.

19. Icon Integration: Used Lucide React icons (Search, Plus, Trash2, Edit2, Check, X, Circle, CheckCircle2, ChevronLeft, ChevronRight) for enhanced UI/UX.

20. Component Composition: Modular architecture with TaskManager (main container), TaskList, TaskItem, TaskAdder, and TaskFilters as reusable components.

21. Comprehensive Test Suite: Jest and React Testing Library with 67 passing tests covering all components (App, TaskAdder, TaskFilters, TaskItem, TaskList, TaskManager).

22. Unit Tests: Individual component tests verifying correct rendering, prop handling, and event callbacks across TaskAdder, TaskItem, TaskFilters, and TaskList components.

23. Integration Tests: TaskManager tests covering feature interactions like adding tasks, filtering by status, searching, sorting, pagination, and localStorage persistence.

24. Test Coverage for New Features:

    - Description field auto-show when user enters task title
    - Task selection with checkbox and multi-select functionality
    - Description visibility toggle with ChevronUp/ChevronDown icons
    - Status cycling through pending → in-progress → completed
    - Strikethrough styling for completed tasks
    - Edit workflow with save/cancel via button or Escape key
    - Task creation date formatting and display

25. Mock Setup: Mocked Lucide React icons and localStorage for reliable testing across environments.

26. Test Configuration: Jest configuration with JSDOM environment, module name mapping for CSS, and proper setupTests.js for test utilities.

27. DOM Selector Best Practices: Tests use proper aria-label queries for semantic identification, className inspection for Tailwind arbitrary values, and role-based queries for accessibility compliance.

28. Keyboard Support: Keyboard shortcuts including Enter to submit tasks and Escape to cancel edits.

29. Task Description: Optional task descriptions with auto-reveal UI when user starts typing the title. Full CRUD operations on descriptions with validation.

30. Task Selection: Checkbox-based task selection system with individual task and "select all visible tasks" functionality for bulk operations.

31. Status Indicators: Visual status representation using CSS-based colored circles (pending: gray, in-progress: orange, completed: green) with appropriate styling and icons.
