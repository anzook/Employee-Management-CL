DROP DATABASE IF EXISTS employee_CMS_DB;
CREATE DATABASE employee_CMS_DB;

USE employee_CMS_DB;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary decimal,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);


--  seed
INSERT INTO department(name)
VALUES ("Marketing"), ("Management"), ("Shit-Shovelling");

INSERT INTO role(title, salary, department_id)
VALUES ("CEO", 9999999, 2), ("Janitor", 65000, 3), ("Designer", 87000, 1), ("Sales", 50000, 1);


INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("Dan", "Halder", 1, null), ("Jill", "Robertson", 4, 1), ("Rob", "Jillerson", 3, 1), ("Job", "Rillerson", 2, 2);


-- --  manager hierarchy

-- WITH RECURSIVE employee_paths (id, name, manager) AS
-- (
--   SELECT id, first_name, CAST(id AS CHAR(200))
--     FROM employee
--     WHERE manager_id IS NULL
--   UNION ALL
--   SELECT e.id, e.first_name, CONCAT(ep.id, ',', e.id)
--     FROM employee_paths AS ep JOIN employee AS e
--       ON ep.id = e.manager_id
-- )
-- SELECT * FROM employee_paths;

-- -- employee display
-- SELECT e.id, e.first_name, e.last_name, e.role_id,  e.manager_id, m.first_name, m.last_name 
-- FROM employee e INNER JOIN employee m ON e.manager_id = m.id;

-- -- department display with salary sums and counts
-- SELECT d.id, d.name, COUNT(r.id), COUNT(e.id), SUM(r.salary)
-- FROM department d 
-- LEFT JOIN role r ON d.id = r.department_id
-- LEFT JOIN employee e on r.id = e.role_id
-- GROUP BY d.id;

-- -- roles with department name
-- SELECT r.id, r.title, r.salary, d.name AS department
-- FROM role r
-- LEFT JOIN department d ON r.department_id=d.id;

-- -- update employee info
-- UPDATE employee
-- SET 
--     manager_id = 2
-- WHERE
--     id = 3;

-- -- get simplified employee list
-- SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS name
-- FROM employee e;

-- -- get department list
-- SELECT d.id, d.name
-- FROM department d
-- WHERE 
-- d.id IS NOT NULL 
-- AND d.id != "";

-- -- roles list
-- SELECT r.id, r.title
-- FROM role r
-- WHERE r.id IS NOT NULL;

-- -- add new employee
-- INSERT INTO employee(first_name, last_name, role_id, manager_id)
-- VALUES("Fred", "Tran", 3, 2);

-- -- add new role
-- INSERT INTO role(title, salary, department_id)
-- VALUES ("Researcher", 72500, 1);

-- -- add new department
-- INSERT INTO department(name)
-- VALUES("Finance");

-- -- remove employee
-- DELETE FROM employee 
-- WHERE id=5;

