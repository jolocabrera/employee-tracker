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
  inquirer
    .prompt([
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
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;

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

      if (choices === "Update an employee role") {
        updateEmployee();
      }

      if (choices === "Exit") {
        db.end();
      }
    });
};

// Define functions

const showAllDepartments = () => {
  console.log("All Departments: ");
  let sql = `SELECT department.id AS id, department.name AS department FROM department`;

  db.promise()
    .query(sql)
    .then(([rows]) => {
      console.table(rows);
      promptUser();
    })
    .catch((err) => {
      throw err;
    });
};

const showAllRoles = () => {
  console.log("All Roles:");
  let sql = `SELECT role.id, role.title, department.name AS department FROM role
    INNER JOIN department ON role.department_id = department.id`;

  db.promise()
    .query(sql)
    .then(([rows]) => {
      console.table(rows);
      promptUser();
    })
    .catch((err) => {
      throw err;
    });
};

const showAllEmployees = () => {
  console.log("All Employees:");
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title,
    department.name AS department,role.salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.promise()
    .query(sql)
    .then(([rows]) => {
      console.table(rows);
      promptUser();
    })
    .catch((err) => {
      throw err;
    });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDept",
        message: "What department would you like to add?",
        validate: (addDept) => {
          if (addDept) {
            return true;
          } else {
            console.log("Department Name Required");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO department (name) VALUES (?)`;

      db.query(sql, answer.addDept, (err, result) => {
        if (err) throw err;
        console.log("Added " + answer.addDept + " to departments!");

        showAllDepartments();
      });
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What role would you like to add?",
        validate: (addRole) => {
          if (addRole) {
            return true;
          } else {
            console.log("Role Name Required");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of this role?",
      },
    ])
    .then((answer) => {
      let params = [answer.role, answer.salary];

      // grab dept from department table
      let roleSql = `SELECT name, id FROM department`;

      db.promise()
        .query(roleSql)
        .then(([data]) => {
          let dept = data.map(({ name, id }) => ({ name: name, value: id }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "dept",
                message: "What department is this role in?",
                choices: dept,
              },
            ])
            .then((deptChoice) => {
              let dept = deptChoice.dept;
              params.push(dept);

              let sql = `INSERT INTO role (title, salary, department_id)
                                VALUES (?, ?, ?)`;

              db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log("Added" + answer.role + " to roles!");

                showAllRoles();
              });
            });
        })
        .catch((err) => {
          throw err;
        });
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
        validate: (addFirst) => {
          if (addFirst) {
            return true;
          } else {
            console.log("First Name Required.");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: (addLast) => {
          if (addLast) {
            return true;
          } else {
            console.log("Last Name Required");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      let params = [answer.firstName, answer.lastName];

      let roleSql = `SELECT role.id, role.title FROM role`;

      db.promise()
        .query(roleSql)
        .then(([data]) => {
          let roles = data.map(({ id, title }) => ({ name: title, value: id }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roles,
              },
            ])
            .then((roleChoice) => {
              let role = roleChoice.role;
              params.push(role);

              let managerSql = `SELECT * FROM employee`;

              db.promise()
                .query(managerSql)
                .then(([data]) => {
                  let managers = data.map(({ id, first_name, last_name }) => ({
                    name: first_name + " " + last_name,
                    value: id,
                  }));

                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "manager",
                        message: "Who is the employee's manager?",
                        choices: managers,
                      },
                    ])
                    .then((managerChoice) => {
                      let manager = managerChoice.manager;
                      params.push(manager);

                      let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?,?,?,?)`;

                      db.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee has been added!");

                        showAllEmployees();
                      });
                    });
                })
                .catch((err) => {
                  throw err;
                });
            });
        })
        .catch((err) => {
          throw err;
        });
    });
};

const updateEmployee = () => {
  let employeeSql = `SELECT * FROM employee`;

  db.promise()
    .query(employeeSql)
    .then(([data]) => {
      let employees = data.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "name",
            message: "Which employee would you like to update?",
            choices: employees,
          },
        ])
        .then((empChoice) => {
          let employee = empChoice.name;
          let params = [];
          params.push(employee);

          let roleSql = `SELECT * FROM role`;

          db.promise()
            .query(roleSql)
            .then(([data]) => {
              let roles = data.map(({ id, title }) => ({
                name: title,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "role",
                    message: "What is the employee's new role?",
                    choices: roles,
                  },
                ])
                .then((roleChoice) => {
                  let role = roleChoice.role;
                  params.push(role);

                  let employee = params[0];
                  params[0] = role;
                  params[1] = employee;

                  let sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                  db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Employee has been updated!");

                    showAllEmployees();
                  });
                });
            })
            .catch((err) => {
              throw err;
            });
        });
    })
    .catch((err) => {
      throw err;
    });
};
