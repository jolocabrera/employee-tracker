// import dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");


require("dotenv").config();

//create database connection
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//start connection to server and initiate prompts
db.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + db.threadId);
  promptUser();
});


// Define Prompts
const promptUser = () => {
  inquirer.prompt([
    //declare prompts
    {
      type: "list",
      name: "choices",
      message: "What would you like to do?",
      choices: [
        "View all departments", 
        "View all roles",
        "View all employees", 
        "Add a department", 
        "Add a role", 
        "Add an employee", 
        "Update an employee role"
    ],
    },
  ])
  .then((answers) => {
    const {choices} = answers;

    if (choices === "View all departments") {
        showAllDepartments();
    }

    if (choices === "View all roles") {
        showAllRoles();
    }

    if (choices === "View all employees") {
        showAllEmployees();
    }

    if (choices === "Add a department") {
        addDepartment();
    }

    if (choices === "Add a role") {
        addRole();
    }

    if (choices === "Add an employee") {
        addEmployee();
    }

    if (choices === "Update an employee") {
        updateEmployee();
    };
  });
};


// Define functions

