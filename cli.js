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
function getEmployees(id=false){
  let res ={};
  let idQuery = "";
  if (id) {
    idQuery = "e.id, ";
  }
 connection.query("SELECT" + idQuery + " CONCAT(e.first_name, \" \", e.last_name) AS name FROM employee e;",
  function (err, results) {
    if (err) throw err;
   res = results;
  })
    return res;
}

function getRoles(id=false){
  let idQuery = "";
  if (id) {
    idQuery = "r.id, ";
  }
 return connection.query("SELECT" + idQuery + " r.title AS name FROM role r WHERE r.id IS NOT NULL;",
  function (err, results) {
    if (err) throw err;
   return results;
  });
}

function getDepartments(id=false){
  let idQuery = "";
  if (id) {
    idQuery = "d.id, ";
  }
  return connection.query("SELECT" + idQuery + " d.name FROM department d WHERE d.id IS NOT NULL AND d.id != \"\";",
  function (err, results) {
    if (err) throw err;
   return results;
  });
}

function getID(name, data){
  for (let i=0; i < data.length; i++){
    if (name === data[i].name){
      return data[i].id;
    } else {
      return "error: id not found";
    }
  }
}



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
        connection.query("SELECT e.id, e.first_name, e.last_name, e.role_id,  e.manager_id, m.first_name, m.last_name FROM employee e INNER JOIN employee m ON e.manager_id = m.id;",
          function (err, results) {
            if (err) throw err;
            console.table(results);
            viewDB()
          });
      }
      else if (answer.view === "Departments") {
        // query the database for all employees
        connection.query("SELECT d.id, d.name, COUNT(r.id), COUNT(e.id), SUM(r.salary) FROM department d LEFT JOIN role r ON d.id = r.department_id LEFT JOIN employee e on r.id = e.role_id GROUP BY d.id;",
          function (err, results) {
            if (err) throw err;
            console.table(results);
            viewDB()
          });
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
        inquirer
        .prompt([{
          name: "first_name",
          type: "input",
          message: "First name: ",
        },
        {
          name: "last_name",
          type: "input",
          message: "Last name: ",
        },
        {
          name: "role",
          type: "list",
          message: "Employee role: ",
          choices: getRoles()
        },
        {
          name: "manager",
          type: "list",
          message: "Employee manager: ",
          choices: getEmployees()
        }
      ])
        .then(function (answer) {
        // query the database for all employees
        connection.query("INSERT INTO employee SET ?;",
        {
          first_name: answer.first_name.trim(),
          last_name: answer.last_name.trim(),
          role_id: getID(answer.role, getRoles(true)),
          manager_id: getID(answer.manager, getEmployees(true)) 
        },
          function (err, results) {
            if (err) throw err;
            console.log(results);
            addDB()
          });
        });
      }
      else if (answer.view === "Add Department") {
        // query the database for all employees
       console.log(getEmployees());
      }
      else if (answer.view === "Add Role") {
        // query the database for all employees
        console.log(getRoles(true));
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
        // query the database for all employees
        connection.query("SELECT d.id, d.name, COUNT(r.id), COUNT(e.id), SUM(r.salary) FROM department d LEFT JOIN role r ON d.id = r.department_id LEFT JOIN employee e on r.id = e.role_id GROUP BY d.id;",
          function (err, results) {
            if (err) throw err;
            console.table(results);
            viewDB()
          });
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
      message: "Please select your view",
      choices: ["Employees", "Departments", "Roles", "Back"]
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
        // query the database for all employees
        connection.query("SELECT d.id, d.name, COUNT(r.id), COUNT(e.id), SUM(r.salary) FROM department d LEFT JOIN role r ON d.id = r.department_id LEFT JOIN employee e on r.id = e.role_id GROUP BY d.id;",
          function (err, results) {
            if (err) throw err;
            console.table(results);
            viewDB()
          });
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