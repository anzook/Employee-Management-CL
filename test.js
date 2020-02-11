// const inquirer = require('inquirer');
// const mysql = require("mysql");
const cTable = require("console.table");
// let emp = require("/app.js");

const cli = require("./cli.js");

cli.getEmployees(true, function(employees){
  console.log(employees);
});

