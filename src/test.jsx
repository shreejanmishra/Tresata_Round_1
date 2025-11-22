import { useState } from "react";

import { Divider, Radio, Table, Checkbox } from "antd";

const data = [
  {
    task: "make a table",
    id: 1,
    checked: true,
  },
  {
    task: "status of task",
    id: 2,
    checked: false,
  },
  {
    task: "ability to add task to the task list, needs an input field",
    id: 3,
    checked: true,
  },
  {
    task: "ability to edit existing task",
    id: 4,
    checked: true,
  },
  {
    task: "delete a task",
    id: 5,
    checked: true,
  },
];

const myData = [...data];
// console.log(myData.map((data, index) => data.checked[index] === false));

const TaskTable = () => {
  const [checked, setChecked] = useState();
  const onCheck = () => {
    setChecked();
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Tasks</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((tableRow, index) => (
          <tr key={index}>
            <td>{tableRow.task}</td>
            <td>
              <input
                type="checkbox"
                checked={tableRow.checked}
                // onChange={}
              >
                {console.log(tableRow.checked)}
              </input>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskTable;
