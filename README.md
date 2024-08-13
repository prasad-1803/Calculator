# ASSIGNMENT-4 Adding additional functionality to current calculator logs table [React State Management]

- This project is a simple calculator application that includes both frontend and backend components. The frontend is built using React + vite, while the backend is developed using node/expressjs & MySQL with Sequelize as the ORM. The backend also includes logging functionality implemented with Winston.

PART A) 
Tasks ->
1. Create a column with all rows as checkbox. 
2. If the header column checkbox is selected it means it is select-all (all rows will be selected). 
   For any other row checkbox selection that particular row will be selected.
3. Add filter icon to each column. Using the filter icon perform client side filtering on that specific column data.
4. Add client side pagination. Each page should have 10 rows.
 
PART B)
Tasks ->
1. Convert the above table into a reusable component.
2. The component will accept rows and columns as props. example -> (rows = data source / calculator logs) and columns being the column definitions (id, expression etc..) (check Antd table for more info)
3. Using the reusable component create two different dummy tables. (the columns should be completely different for each) 
4. All functionalities should work as is. (Make sure nothing is hardcoded, this component should work for any data source)
 
BONUS->
1. Create a delete API which accepts an array of id's to be deleted.
2. Create a delete button on the UI. Disable it if no rows selected. enable it if any row is selected. 
    On button click call the delete API with selected row id's.
 