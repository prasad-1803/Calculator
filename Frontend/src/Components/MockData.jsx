// src/__tests__/dummyLogs.js
const dummyLogs = [
    {
        id: 1,
        expression: "2 + 2",
        is_valid: true,
        output: "4",
        created_on: "2023-09-25T10:00:00Z",
    },
    {
        id: 2,
        expression: "5 * 3",
        is_valid: true,
        output: "15",
        created_on: "2023-09-25T11:00:00Z",
    },
    {
        id: 3,
        expression: "invalid expression",
        is_valid: false,
        output: "invalid expression",
        created_on: "2023-09-25T12:00:00Z",
    },
   
];

export default dummyLogs;
