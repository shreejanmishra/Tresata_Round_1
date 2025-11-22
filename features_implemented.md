Build tool: Vite

npm run dev - start dev server
npm run build - build production ready dist folder (used in VM deployment)
npm run test - run Jest test suite

Features implemented:

Task List: Display a list of tasks. Each task should show the task title and its status (completed or not completed).
Add Task: Provide an input field and a button for adding new tasks. When a user enters a task title and clicks the add button, the task should be added to the task list
Advanced Task Styling: Completed tasks show strikethrough text with reduced opacity, hover effects on incomplete tasks, and visual state changes with color indicators.
Inline Task Editing: Edit task titles directly within the task list with save/cancel buttons, form validation to prevent empty updates.
Delete Task: Allow users to delete a task from the list.
State Management: Use React's state management to handle the addition, updating, and deletion of tasks.
Component Design: Break down the application into reusable components.
User Interface: Ensure the application has a clean and user-friendly interface. Used Tailwind CSS for styling.
Persisting Tasks: Implement a way to persist tasks between page reloads using local storage.
Task Filters: Add functionality to filter tasks by their status made different tabs (all, completed, incomplete)
Search Functionality: Implemented task search with debounced query (300ms) allowing users to filter tasks in real-time by title.
Task Statistics Dashboard: Display real-time counts of total tasks, completed tasks, and remaining incomplete tasks with visual indicators and icons.
Sorting Options: Multiple sort options including newest first(date created), oldest first(date created), name (A-Z), and name (Z-A).
Pagination: Implemented pagination with configurable items per page (5, 10, 25, or all) and navigation controls.
Task Timestamps: Each task tracks creation timestamp and displays formatted dates (today shows time, yesterday shows "Yesterday", older dates show relative date format).
Accessibility Features: Comprehensive ARIA labels, semantic HTML, keyboard-accessible buttons, and proper focus management for interactive elements.
Responsive Design: Mobile-friendly layout with responsive grid layouts and adaptive spacing for various screen sizes.
Custom Color Scheme: Light and dark mode support with OKLch-based color system for improved visual accessibility and modern design aesthetics.
Icon Integration: Used Lucide React icons (Search, Plus, Trash2, Edit2, Check, X, Circle, CheckCircle2, ChevronLeft, ChevronRight) for enhanced UI/UX.
Component Composition: Modular architecture with TaskManager (main container), TaskList, TaskItem, TaskAdder, and TaskFilters as reusable components.
Comprehensive Test Suite: Jest and React Testing Library with 24+ passing tests covering all components (App, TaskAdder, TaskFilters, TaskItem, TaskList, TaskManager).
Unit Tests: Individual component tests verifying correct rendering, prop handling, and event callbacks.
Integration Tests: TaskManager tests covering feature interactions like adding tasks, filtering, searching, and localStorage persistence.
Mock Setup: Mocked Lucide React icons and localStorage for reliable testing across environments.
Test Configuration: Jest configuration with JSDOM environment, module name mapping for CSS, and proper setupTests.js for test utilities.
Keyboard Support: Keyboard shortcuts including Enter to submit tasks and Escape to cancel edits.
