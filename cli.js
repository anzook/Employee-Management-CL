const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
// let emp = require("/app.js");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "mysqlpain",
  database: "employee_CMS_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

//establish some basic getters with boolean options for id's
function getEmployees(id = false, cb) {
  if (typeof id !== "boolean") {
    cb(
      new Error(
        `Invalid argument for 'id', expected boolean, got ${typeof id}`
      ),
      null
    );
    return;
  }

  let idQuery = "";
  if (id) {
    idQuery = "e.id, ";
  }
  connection.query(
    "SELECT " +
      idQuery +
      ' CONCAT(e.first_name, " ", e.last_name) AS name FROM employee e;',
    function(err, results) {
      if (err) {
        cb(err, null);
      } else {
        if (!id) {
          let array = results.map(function(element) {
            return element.name;
          });
          cb(null, array);
        } else {
          let array = results.map(function(element) {
            let obj = {
              id: element.id,
              name: element.name
            };
            return obj;
          });
          cb(null, array);
        }
      }
    }
  );
}

function getRoles(id = false, cb) {
  if (typeof id !== "boolean") {
    cb(
      new Error(
        `Invalid argument for 'id', expected boolean, got ${typeof id}`
      ),
      null
    );
    return;
  }

  let idQuery = "";
  if (id) {
    idQuery = " r.id,";
  }
  connection.query(
    "SELECT" + idQuery + " r.title AS name FROM role r WHERE r.id IS NOT NULL;",
    function(err, results) {
      if (err) {
        cb(err, null);
      } else {
        if (!id) {
          let array = results.map(function(element) {
            return element.name;
          });
          cb(null, array);
        } else {
          let array = results.map(function(element) {
            let obj = {
              id: element.id,
              name: element.name
            };
            return obj;
          });
          cb(null, array);
        }
      }
    }
  );
}

function getDepartments(id = false, cb) {
  if (typeof id !== "boolean") {
    cb(
      new Error(
        `Invalid argument for 'id', expected boolean, got ${typeof id}`
      ),
      null
    );
    return;
  }

  let idQuery = "";
  if (id) {
    idQuery = " d.id,";
  }
  connection.query(
    "SELECT" + idQuery + " d.name FROM department d WHERE d.id IS NOT NULL;",
    function(err, results) {
      if (err) {
        cb(err, null);
      } else {
        if (!id) {
          let array = results.map(function(element) {
            return element.name;
          });
          cb(null, array);
        } else {
          let array = results.map(function(element) {
            let obj = {
              id: element.id,
              name: element.name
            };
            return obj;
          });
          cb(null, array);
        }
      }
    }
  );
}

function getID(check, data) {
  for (let i = 0; i < data.length; i++) {
    if (check === data[i].name) {
      return data[i].id;
    }
  }
  return "error: id not found";
}
function validateString(text) {
  return text !== "";
}
function validateNumber(num) {
  var reg = /^\d+$/;
  return reg.test(num) || "Input should be a number!";
}

//linked list and binary tree
function doABunchOfAsyncThingsInParallel(asyncFns, cb) {
  let output = [];
  resultLength = 0;
  asyncFns.forEach(function(asyncFnktion, i) {
    asyncFnktion(function(err, result) {
      output[i] = result;
      if (++resultLength === asyncFns.length) {
        cb(null, output);
      }
    });
  });
}

// module.exports = {
//   getEmployees
// }

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message:
        "Would you like to [VIEW] employee data, [ADD] infor, [UPDATE] info, or [DELETE] info?",
      choices: ["VIEW", "ADD", "UPDATE", "DELETE", "EXIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.action === "VIEW") {
        viewDB();
      } else if (answer.action === "ADD") {
        addDB();
      } else if (answer.action === "UPDATE") {
        updateDB();
      } else if (answer.action === "DELETE") {
        deleteDB();
      } else {
        connection.end();
      }
    });
}

//view, update, delete sections follow similar structure


// ***************** $VIEW menu **************************
function viewDB() {
  inquirer
    .prompt({
      name: "view",
      type: "list",
      message: "Please select your view",
      choices: ["Employees", "Departments", "Roles", "Back"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.view === "Employees") {
        // query the database for all employees
        connection.query(
          'SELECT e.id AS ID, CONCAT(e.first_name, " ", e.last_name) AS Name, e.role_id AS RoleID, e.manager_id AS MgrID, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id ORDER BY e.id;',
          function(err, results) {
            if (err) throw err;
            console.table(results);
            viewDB();
          }
        );
      } else if (answer.view === "Departments") {
        // query the database for all employees
        connection.query(
          "SELECT d.id AS ID, d.name AS Name, COUNT(r.id) AS Total_Roles, COUNT(e.id) AS Total_Employees, SUM(r.salary) AS Total_Salary FROM department d LEFT JOIN role r ON d.id = r.department_id LEFT JOIN employee e on r.id = e.role_id GROUP BY d.id ORDER BY SUM(r.salary) DESC;",
          function(err, results) {
            if (err) throw err;
            console.table(results);
            viewDB();
          }
        );
      } else if (answer.view === "Roles") {
        // query the database for all employees
        connection.query(
          "SELECT r.id AS ID, r.title AS Title, r.salary AS Salary, d.name AS Department FROM role r LEFT JOIN department d ON r.department_id=d.id ORDER BY r.salary DESC;",
          function(err, results) {
            if (err) throw err;
            console.table(results);
            viewDB();
          }
        );
      } else {
        start();
      }
    });
}


// ***************** $ADD menu **************************

function addDB() {
  inquirer
    .prompt({
      name: "view",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add Employee", "Add Department", "Add Role", "Back"]
    })
    .then(function(answer) {
      if (answer.view === "Add Employee") {
        console.log("Selected Add Employee");

        // ~~~~~~~~~~~~ $ADD employee ~~~~~~~~~~~~~~~~~~~~~~~
        doABunchOfAsyncThingsInParallel(
          [getEmployees.bind(null, true), getRoles.bind(null, true)],
          function(err, [employees, roles]) {
            // console.log('employees', employees)
            // console.log('roles', roles)

            inquirer
              .prompt([
                {
                  name: "first_name",
                  type: "input",
                  message: "First name: ",
                  validate: validateString
                },
                {
                  name: "last_name",
                  type: "input",
                  message: "Last name: ",
                  validate: validateString
                },
                {
                  name: "role",
                  type: "list",
                  message: "Employee role: ",
                  choices: function() {
                    let result = roles.map(a => a.name);
                    return result;
                  }
                },
                {
                  name: "manager",
                  type: "list",
                  message: "Employee manager: ",
                  choices: function() {
                    let result = employees.map(a => a.name);
                    return result;
                  }
                }
              ])
              .then(function(answer) {
                // console.log(`role_id: ${getID(answer.role, roles)}`)
                // console.log(`manager_id: ${getID(answer.manager, employees)}`)
                // query the database for all employees
                connection.query(
                  "INSERT INTO employee SET ?;",
                  {
                    first_name: answer.first_name.trim(),
                    last_name: answer.last_name.trim(),
                    role_id: getID(answer.role, roles),
                    manager_id: getID(answer.manager, employees)
                  },
                  function(err, results) {
                    if (err) throw err;
                    console.log(results);
                    addDB();
                  }
                );
              });
          }
        );
      } else if (answer.view === "Add Department") {

                // ~~~~~~~~~~~~ $ADD department ~~~~~~~~~~~~~~~~~~~~~~~
        console.log("Selected Add Department");
        inquirer
          .prompt([
            {
              name: "name",
              type: "input",
              message: "Department name: ",
              validate: validateString
            }
          ])
          .then(function(answer) {
            connection.query(
              "INSERT INTO department SET ?;",
              {
                name: answer.name.trim()
              },
              function(err, results) {
                if (err) throw err;
                console.log(results);
                addDB();
              }
            );
          });
      } else if (answer.view === "Add Role") {

                // ~~~~~~~~~~~~ $ADD role ~~~~~~~~~~~~~~~~~~~~~~~
        console.log("Selected Add Role");
        getDepartments(true, function(err, departments) {
          console.log(departments);
          inquirer
            .prompt([
              {
                name: "title",
                type: "input",
                message: "Role title: ",
                validate: validateString
              },
              {
                name: "salary",
                type: "number",
                message: "Salary: ",
                validate: validateNumber
              },
              {
                name: "department",
                type: "list",
                message: "Department: ",
                choices: function() {
                  let result = departments.map(a => a.name);
                  return result;
                }
              }
            ])
            .then(function(answer) {
              console.log(`role_id: ${getID(answer.department, departments)}`);
              connection.query(
                "INSERT INTO role SET ?;",
                {
                  title: answer.title.trim(),
                  salary: answer.salary,
                  department_id: getID(answer.department, departments)
                },
                function(err, results) {
                  if (err) throw err;
                  console.log(results);
                  addDB();
                }
              );
            });
        });
      } else {
        start();
      }
    });
}

// ***************** $UPDATE menu **************************

function updateDB() {
  inquirer
    .prompt({
      name: "view",
      type: "list",
      message: "What would you like to update?",
      choices: ["Employees", "Roles", "Departments", "Back"]
    })
    .then(function(answer) {
        if (answer.view === "Employees") {

                  // ~~~~~~~~~~~~ $UPDATE employee ~~~~~~~~~~~~~~~~~~~~~~~
          console.log("Selected Update Employee");
          doABunchOfAsyncThingsInParallel(
            [getEmployees.bind(null, true), getRoles.bind(null, true)],
            function(err, [employees, roles]) {
              // console.log('employees', employees)
              // console.log('roles', roles)

              // connection.query("SELECT e.id, e.first_name, e.last_name, e.role_id,  e.manager_id, m.first_name, m.last_name FROM employee e LEFT JOIN employee m ON e.manager_id = m.id ORDER BY e.id;",
              // function (err, results) {
              //   if (err) throw err;
              //   console.table(results);

              inquirer
                .prompt([
                  {
                    name: "employee",
                    type: "list",
                    message: "Employee to update: ",
                    choices: function() {
                      let result = employees.map(a => a.name);
                      return result;
                    }
                  },
                  {
                    type: "confirm",
                    name: "empName",
                    message: "Do you want to edit the employee's name?"
                  },
                  {
                    name: "first_name",
                    type: "input",
                    message: "First name: ",
                    validate: validateString,
                    when: function(answers) {
                      return answers.empName;
                    }
                  },
                  {
                    name: "last_name",
                    type: "input",
                    message: "Last name: ",
                    validate: validateString,
                    when: function(answers) {
                      return answers.empName;
                    }
                  },
                  {
                    type: "confirm",
                    name: "empRole",
                    message: "Do you want to edit the employee's role?"
                  },
                  {
                    name: "role",
                    type: "list",
                    message: "Employee role: ",
                    choices: function() {
                      let result = roles.map(a => a.name);
                      return result;
                    },
                    when: function(answers) {
                      return answers.empRole;
                    }
                  },
                  {
                    type: "confirm",
                    name: "empManager",
                    message: "Do you want to edit the employee's manager?"
                  },
                  {
                    name: "manager",
                    type: "list",
                    message: "Employee manager: ",
                    choices: function() {
                      let result = employees.map(a => a.name);
                      return result;
                    },
                    when: function(answers) {
                      return answers.empManager;
                    }
                  }
                ])
                .then(function(answer) {
                  let queryObj = {};
                  let managerCheck = true;
                  if (answer.empName) {
                    queryObj.first_name = answer.first_name.trim();
                    queryObj.last_name = answer.last_name.trim();
                  }
                  if (answer.empRole) {
                    queryObj.role_id = getID(answer.role, roles);
                  }
                  if (answer.empManager) {
                    if (answer.employee === answer.manager) {
                      console.log("Error: Employee cannot be their own manager, cannot update")
                        managerCheck = false;
                    } else {
                    queryObj.manager_id = getID(answer.manager, employees);
                  }
                  }

                 if (!managerCheck || !answer.empName && !answer.empRole && !answer.empManager){
                  updateDB();

                 } else {
                   let empID = {
                     id: getID(answer.employee, employees) };
                  console.log(queryObj);
                  console.log(empID);

                  connection.query(
                    "UPDATE employee SET ? WHERE ?;",
                    [queryObj,
                    empID],
                    function(err, results) {
                      if (err) throw err;
                      console.log(results);
                      updateDB();
                    }
                  );
                 }
                });
            }

          );
        } else if (answer.view === "Departments") {

          // ~~~~~~~~~~~~ $UPDATE department ~~~~~~~~~~~~~~~~~~~~~~~
          console.log("Selected Update Departments");
          getDepartments(true, function(err, departments) {
            // console.log(departments);
            inquirer
              .prompt([
                {
                  name: "department",
                  type: "list",
                  message: "Update which Department: ",
                  choices: function() {
                    let result = departments.map(a => a.name);
                    return result;
                  }
                },{
                  name: "name",
                  type: "input",
                  message: "Department name: ",
                  validate: validateString
                }

              ])
              .then(function(answer) {
                  connection.query(
                    "UPDATE department SET ? WHERE ?;",
                    [{
                      name: answer.name.trim()
                    },
                    {
                      id: getID(answer.department, departments)
                    }],
                    function(err, results) {
                      if (err) {
                        console.log(
                          "Error: Cannot update entry - ",
                          err.sqlMessage
                        );
                      } else {
                        console.log(results);
                      }
                      updateDB();
                    }
                  );
                
              });
          });

        } else if (answer.view === "Roles") {

           // ~~~~~~~~~~~~ $UPDATE role ~~~~~~~~~~~~~~~~~~~~~~~
          console.log("Selected Update Roles");
            doABunchOfAsyncThingsInParallel(
            [getDepartments.bind(null, true), getRoles.bind(null, true)],
            function(err, [departments, roles]) {
            // console.log(roles);
            inquirer
              .prompt([
                {
                  name: "role",
                  type: "list",
                  message: "Update which Role: ",
                  choices: function() {
                    let result = roles.map(a => a.name);
                    return result;
                  }
                },
                {
                  type: "confirm",
                  name: "roleTitle",
                  message: "Do you want to edit the role's title?"
                },
                {
                  name: "title",
                  type: "input",
                  message: "Role title: ",
                  validate: validateString,
                  when: function(answers) {
                    return answers.roleTitle;
                  }
                },
                {
                  type: "confirm",
                  name: "roleSalary",
                  message: "Do you want to edit the role's salary?"
                },
                {
                  name: "salary",
                  type: "number",
                  message: "Salary: ",
                  validate: validateNumber,
                  when: function(answers) {
                    return answers.roleSalary;
                  }
                },
                {
                  type: "confirm",
                  name: "roleDepartment",
                  message: "Do you want to edit the role's department?"
                },
                {
                  name: "department",
                  type: "list",
                  message: "Department: ",
                  choices: function() {
                    let result = departments.map(a => a.name);
                    return result;
                  },
                  when: function(answers) {
                    return answers.roleDepartment;
                  }
                }
              ])
              .then(function(answer) {
                let queryObj = {};
                if (answer.roleTitle) {
                  queryObj.title = answer.title.trim();
                }
                if (answer.roleSalary) {
                  queryObj.salary = answer.salary;
                }
                if (answer.roleDepartment) {
                  queryObj.department_id = getID(answer.department, departments)
                }

               if (!answer.roleTitle && !answer.roleSalary && !answer.roleDepartment){
                updateDB();

               } else {
                  connection.query(
                    "UPDATE role SET ? WHERE ?;",
                    [queryObj,
                    {
                      id: getID(answer.role, roles)
                    }],
                    function(err, results) {
                      if (err) {
                        console.log(
                          "Error: Cannot update entry - ",
                          err.sqlMessage
                        );
                      } else {
                        console.log(results);
                      }
                      updateDB();
                    }
                  )}
                });
              });
        } else {
          start();
        }
    });
}

// ***************** $DELETE menu **************************

function deleteDB() {
  inquirer
    .prompt({
      name: "view",
      type: "list",
      message: "Where would you like to delete from",
      choices: ["Employees", "Departments", "Roles", "Back"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.view === "Employees") {

         // ~~~~~~~~~~~~ $DELETE employee ~~~~~~~~~~~~~~~~~~~~~~~
        console.log("Selected Deleted from Employees");
        getEmployees(true, function(err, employees) {
          // console.log(employees);
          inquirer
            .prompt([
              {
                name: "employee",
                type: "list",
                message: "Delete which Employee: ",
                choices: function() {
                  let result = employees.map(a => a.name);
                  return result;
                }
              },
              {
                name: "confirm",
                type: "confirm",
                message: "Confirm deletion..."
              }
            ])
            .then(function(answer) {
              if (answer.confirm) {
                connection.query(
                  "DELETE FROM employee WHERE ?;",
                  {
                    id: getID(answer.employee, employees)
                  },
                  function(err, results) {
                    if (err) {
                      console.log(
                        "Error: Cannot delete entry - ",
                        err.sqlMessage
                      );
                    } else {
                      console.log(results);
                    }
                    deleteDB();
                  }
                );
              } else {
                console.log("Delete aborted!");
                deleteDB();
              }
            });
        });
      } else if (answer.view === "Departments") {

         // ~~~~~~~~~~~~ $DELETE department ~~~~~~~~~~~~~~~~~~~~~~~
        console.log("Selected Deleted from Departments");
        getDepartments(true, function(err, departments) {
          // console.log(departments);
          inquirer
            .prompt([
              {
                name: "department",
                type: "list",
                message: "Delete which Department: ",
                choices: function() {
                  let result = departments.map(a => a.name);
                  return result;
                }
              },
              {
                name: "confirm",
                type: "confirm",
                message: "Confirm deletion..."
              }
            ])
            .then(function(answer) {
              if (answer.confirm) {
                connection.query(
                  "DELETE FROM department WHERE ?;",
                  {
                    id: getID(answer.department, departments)
                  },
                  function(err, results) {
                    if (err) {
                      console.log(
                        "Error: Cannot delete entry - ",
                        err.sqlMessage
                      );
                    } else {
                      console.log(results);
                    }
                    deleteDB();
                  }
                );
              } else {
                console.log("Delete aborted!");
                deleteDB();
              }
            });
        });
      } else if (answer.view === "Roles") {

        // ~~~~~~~~~~~~ $DELETE role ~~~~~~~~~~~~~~~~~~~~~~~
        console.log("Selected Deleted from Roles");
        getRoles(true, function(err, roles) {
          // console.log(roles);
          inquirer
            .prompt([
              {
                name: "role",
                type: "list",
                message: "Delete which Role: ",
                choices: function() {
                  let result = roles.map(a => a.name);
                  return result;
                }
              },
              {
                name: "confirm",
                type: "confirm",
                message: "Confirm deletion..."
              }
            ])
            .then(function(answer) {
              if (answer.confirm) {
                connection.query(
                  "DELETE FROM role WHERE ?;",
                  {
                    id: getID(answer.role, roles)
                  },
                  function(err, results) {
                    if (err) {
                      console.log(
                        "Error: Cannot delete entry - ",
                        err.sqlMessage
                      );
                    } else {
                      console.log(results);
                    }
                    deleteDB();
                  }
                );
              } else {
                console.log("Delete aborted!");
                deleteDB();
              }
            });
        });
      } else {
        start();
      }
    });
}
