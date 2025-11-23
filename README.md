Making this repo for sharing convinience. I did not use the github at the time of creating, so can't track all the commits made during the initial stage while implementing the features 😞. <br/>

Took creative liberty for certain designs and layout where I felt I can do better than the Figma design provided.<br/>

My main aim was to keep the UI simple, highly accessible and very convinient to use.<br/>


#Key Features:<br/>
1. **Responsive Design:** A mobile-first layout utilizing CSS Grid for flexible, responsive grids and adaptive spacing to ensure optimal viewing and interaction across all device screen sizes, from desktops to smartphones.<br/>
2. **Accessibility Features:** Comprehensive ARIA labels for blind users, semantic HTML, keyboard-accessible buttons, and proper focus management for interactive elements.<br/>
3. **Multi-Select Functionality:** Enables bulk operations on selected tasks, allowing seamless state transitions from Pending to In Progress to Completed, along with a dedicated Delete option for efficient task management.<br/>
4. **Automated Timestamping:** Each task automatically captures its creation timestamp upon addition, eliminating manual input and providing precise tracking of task inception without user intervention.<br/>
5. **Performance Optimizations:** Implemented debouncing for real-time search inputs to reduce unnecessary re-renders and pagination for the task list, delivering smooth UI/UX performance even with large datasets.<br/>
6. **Data Persistence:** As a pure front-end application, all tasks are durably stored in the browser's localStorage, ensuring data integrity and availability across browser sessions and restarts—no backend server required.<br/>
7. **Robust Testing Suite:** A comprehensive test suite powered by Jest and React Testing Library, featuring 67 passing tests that validate functionality across all components, including unit, integration, and edge-case scenarios.<br/>
8. **Component Composition:** Modular architecture with TaskManager (main container), TaskList, TaskItem, TaskAdder, and TaskFilters as reusable components.<br/>

#For more details, refer the features_implemented.md file.<br/>


#Local setup instruction:<br/>
(in the base folder run the commands mentioned below)

**npm i**- install all the dependencies mentioned in package.json <br/>
**npm run dev** - start dev server<br/>
**npm run build** - build production ready dist folder (used in VM deployment)<br/>
**npm run test** - run Jest test suite<br/>

##The project has been hosted of this link: [Netlify](https://soft-gumdrop-787e95.netlify.app/)
