const inquirer = require('inquirer');
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
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});


//establish some basic getters with boolean options for id's
function getEmployees(id=false, cb){
  if (typeof id !== 'boolean') {
    cb(new Error(`Invalid argument for 'id', expected boolean, got ${typeof id}`), null);
    return;
  }

  let idQuery = "";
  if (id) {
    idQuery = "e.id, "
  }
 connection.query("SELECT " + idQuery + " CONCAT(e.first_name, \" \", e.last_name) AS name FROM employee e;",
  function (err, results) {
    if (err) {
      cb(err, null)
    } else {
      if(!id){
        let array = results.map( function(element){
          return element.name;
        });
        cb(null, array);
      } else {
        let array = results.map( function(element){
          let obj = {
          id: element.id,
          name: element.name
          }
          return obj;
        });
        cb(null, array);
      }
    }
  }
 )
}

function getRoles(id=false, cb){
  if (typeof id !== 'boolean') {
    cb(new Error(`Invalid argument for 'id', expected boolean, got ${typeof id}`), null);
    return;
  }

  let idQuery = "";
  if (id) {
    idQuery = " r.id,";
  }
connection.query("SELECT" + idQuery + " r.title AS name FROM role r WHERE r.id IS NOT NULL;",
 function (err, results) {
  if (err) {
    cb(err, null)
  } else {
    if(!id){
      let array = results.map( function(element){
        return element.name;
      });
      cb(null, array);
    } else {
      let array = results.map( function(element){
        let obj = {
        id: element.id,
        name: element.name
        }
        return obj;
      });
      cb(null, array);
    }
  }
}
)
}

function getDepartments(id=false, cb){
 if (typeof id !== 'boolean') {
    cb(new Error(`Invalid argument for 'id', expected boolean, got ${typeof id}`), null);
    return;
  }
 
  let idQuery = "";
  if (id) {
    idQuery = " d.id,";
  }
 connection.query("SELECT" + idQuery + " d.name FROM department d WHERE d.id IS NOT NULL;",
  function (err, results) {
    if (err) {
      cb(err, null)
    } else {
      if(!id){
        let array = results.map( function(element){
          return element.name;
        });
        cb(null, array);
      } else {
        let array = results.map( function(element){
          let obj = {
          id: element.id,
          name: element.name
          }
          return obj;
        });
        cb(null, array);
      }
    }
  }
 )
}

function getID(check, data){
  for (let i=0; i < data.length; i++){
    if (check === data[i].name){
      return data[i].id;
    }
  }
  return "error: id not found";

}
function validateString(text){
  return text !== '';
}
function validateNumber(num)
{
   var reg = /^\d+$/;
   return reg.test(num) || "Input should be a number!";
}

   //linked list and binary tree
   function doABunchOfAsyncThingsInParallel(asyncFns, cb){
    let output = [];
    resultLength = 0
    asyncFns.forEach( function(asyncFnktion, i){
      asyncFnktion(function(err, result){
        output[i] = result;
        if (++resultLength === asyncFns.length){
          cb(null, output);
        }
      })
    })
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
      message: "Would you like to [VIEW] employee data, [ADD] infor, [UPDATE] info, or [DELETE] info?",
      choices: ["VIEW", "ADD", "UPDATE", "DELETE", "EXIT"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.action === "VIEW") {
        viewDB();
      }
      else if (answer.action === "ADD") {
        addDB();
      }
      else if (answer.action === "UPDATE") {
        updateDB();
      }
      else if (answer.action === "DELETE") {
        deleteDB();
      } else {
        connection.end();
      }
    });
}

//view, update, delete

function viewDB() {
  inquirer
    .prompt({
      name: "view",
      type: "list",
      message: "Please select your view",
      choices: ["Employees", "Departments", "Roles", "Back"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.view === "Employees") {
        // query the database for all employees
        connection.query("SELECT e.id, e.first_name, e.last_name, e.role_id,  e.manager_id, m.first_name, m.last_name FROM employee e LEFT JOIN employee m ON e.manager_id = m.id ORDER BY e.id;",
          function (err, results) {
            if (err) throw err;
            console.table(results);
            viewDB()
          });
      }
      else if (answer.view === "Departments") {
        // query the database for all employees
        connection.query("SELECT d.id, d.name, COUNT(r.id), COUNT(e.id), SUM(r.salary) FROM department d LEFT JOIN role r ON d.id = r.department_id LEFT JOIN employee e on r.id = e.role_id GROUP BY d.id ORDER BY SUM(r.salary) DESC;",
          function (err, results) {
            if (err) throw err;
            console.table(results);
            viewDB()
          });
      }
      else if (answer.view === "Roles") {
        // query the database for all employees
        connection.query("SELECT r.id, r.title, r.salary, d.name AS department FROM role r LEFT JOIN department d ON r.department_id=d.id ORDER BY r.salary DESC;",
          function (err, results) {
            if (err) throw err;
            console.table(results);
            viewDB()
          });
      } else {
        start();
      }
    });
}

function addDB() {
  
  inquirer
    .prompt({
      name: "view",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add Employee", "Add Department", "Add Role", "Back"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.view === "Add Employee") {
        console.log('Selected Add Employee')
        doABunchOfAsyncThingsInParallel([getEmployees.bind(null,true), getRoles.bind(null,true)], function (err, [employees, roles]){
          // console.log('employees', employees)
          // console.log('roles', roles)

          inquirer
          .prompt([{
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
            choices: function(){
              let result = roles.map(a => a.name);
              return result;
            }
          },
          {
            name: "manager",
            type: "list",
            message: "Employee manager: ",
            choices: function(){
              let result = employees.map(a => a.name);
              return result;
            }
          }
        ])
          .then(function (answer) {
              // console.log(`role_id: ${getID(answer.role, roles)}`)
              // console.log(`manager_id: ${getID(answer.manager, employees)}`)
          // query the database for all employees
          connection.query("INSERT INTO employee SET ?;",
          {
            first_name: answer.first_name.trim(),
            last_name: answer.last_name.trim(),
            role_id: getID(answer.role, roles),
            manager_id: getID(answer.manager, employees) 
          },
            function (err, results) {
              if (err) throw err;
              console.log(results);
              addDB()
            });
          });
        
        })
    }
      else if (answer.view === "Add Department") {
        console.log('Selected Add Department')
        inquirer
        .prompt([{
          name: "name",
          type: "input",
          message: "Department name: ",
          validate: validateString
        }
      ])
        .then(function (answer) {
        connection.query("INSERT INTO department SET ?;",
        {
          name: answer.name.trim()
        },
          function (err, results) {
            if (err) throw err;
            console.log(results);
            addDB()
          });
        });
      }
      else if (answer.view === "Add Role") {
        console.log('Selected Add Role')
        getDepartments(true, function(err, departments){
          console.log(departments);
          inquirer
          .prompt([{
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
            choices: function(){
              let result = departments.map(a => a.name);
              return result;
            }
          }
        ])
          .then(function (answer) {
              console.log(`role_id: ${getID(answer.department, departments)}`)
          connection.query("INSERT INTO role SET ?;",
          {
            title: answer.title.trim(),
            salary: answer.salary,
            department_id: getID(answer.department, departments)
          },
            function (err, results) {
              if (err) throw err;
              console.log(results);
              addDB()
            });
          });
        })

      } else {
        start();
      }
    });
}

function updateDB() {
  inquirer
    .prompt({
      name: "view",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add Employee", "Add Employee", "Roles", "Back"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.view === "Employees") {
        // query the database for all employees
        connection.query("SELECT e.id, e.first_name, e.last_name, e.role_id,  e.manager_id, m.first_name, m.last_name FROM employee e INNER JOIN employee m ON e.manager_id = m.id;",
          function (err, results) {
            if (err) throw err;
            console.table(results);
            viewDB()
          });
      }
      else if (answer.view === "Departments") {
      
      }
      else if (answer.view === "Roles") {
        // query the database for all employees
        connection.query("SELECT r.id, r.title, r.salary, d.name AS department FROM role r LEFT JOIN department d ON r.department_id=d.id;",
          function (err, results) {
            if (err) throw err;
            console.table(results);
            viewDB()
          });
      } else {
        start();
      }
    });
}

function deleteDB() {
  inquirer
    .prompt({
      name: "view",
      type: "list",
      message: "Where would you like to delete from",
      choices: ["Employees", "Departments", "Roles", "Back"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.view === "Employees") {
        console.log('Selected Deleted from Employees')
        getEmployees(true, function(err, employees){
          // console.log(employees);
          inquirer
          .prompt([
          {
            name: "employee",
            type: "list",
            message: "Delete which Employee: ",
            choices: function(){
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
          .then(function (answer) {
            if (answer.confirm) {
          connection.query("DELETE FROM employee WHERE ?;",
          {
            id: getID(answer.employee, employees)
          },
            function (err, results) {
              if (err){
                console.log("Error: Cannot delete entry - ", err.sqlMessage)
              } else {
                console.log(results);
              }
              deleteDB()
            });
          } else {
            console.log("Delete aborted!");
            deleteDB()
          }
          });
        })
      }
      else if (answer.view === "Departments") {
        console.log('Selected Deleted from Departments')
        getDepartments(true, function(err, departments){
          // console.log(departments);
          inquirer
          .prompt([
          {
            name: "department",
            type: "list",
            message: "Delete which Department: ",
            choices: function(){
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
          .then(function (answer) {
            if (answer.confirm) {
          connection.query("DELETE FROM department WHERE ?;",
          {
            id: getID(answer.department, departments)
          },
            function (err, results) {
              if (err){
                console.log("Error: Cannot delete entry - ", err.sqlMessage)
              } else {
                console.log(results);
              }
              deleteDB()
            });
          } else {
            console.log("Delete aborted!");
            deleteDB()
          }
          });
        })
      }
      else if (answer.view === "Roles") {
        console.log('Selected Deleted from Roles')
        getRoles(true, function(err, roles){
          // console.log(roles);
          inquirer
          .prompt([
          {
            name: "role",
            type: "list",
            message: "Delete which Role: ",
            choices: function(){
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
          .then(function (answer) {
            if (answer.confirm) {
          connection.query("DELETE FROM role WHERE ?;",
          {
            id: getID(answer.role, roles)
          },
            function (err, results) {
              if (err){
                console.log("Error: Cannot delete entry - ", err.sqlMessage)
              } else {
                console.log(results);
              }
              deleteDB()
            });
          } else {
            console.log("Delete aborted!");
            deleteDB()
          }
          });
        })
      } else {
        start();
      }
    });
}