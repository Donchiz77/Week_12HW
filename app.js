const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
require('dotenv').config();


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Adonis_1996',
    database: 'employees_DB',
});

const employees = () => {
    console.log('Showing Employee Data');
    connection.query(
        `SELECT employees.first_name, employees.last_name, role_id, manager_id
        FROM employees`,

        (err, results) => {
            if (err) throw err;
            console.table(results);
            init();
        }
    );
};

const showRoles = () => {
    console.log('Showing roles');
    connection.query(
        `SELECT title, salary, department_id
        FROM role`,

        (err, results) => {
            if (err) throw err; console.table(results);
            init();
        }
    );
};

const showDepartments = () => {
    console.log('Showing departments');
    connection.query(
        `SELECT department_name
        FROM department`,

        (err, results) => {
            if (err) throw err; console.table(results);
            init();
        }
    )
}

const employeeDep = () => {
    connection.query(
        "SELECT * FROM department",

        (err, results) => {
            if (err) throw err;

            const departments = results.map((department) => {
                return department.department_name;
            });

            inquirer.prompt({
                    name: 'department',
                    type: 'list',
                    message: 'Which department would you like to show?',
                    choices: departments
                })
                .then((answer) => {
                    console.log('Showing Employees by Department');
                    connection.query(
                        `SELECT title, first_name, last_name, department_name 
                    FROM department 
                    INNER JOIN role ON role.department_id = department.id 
                    INNER JOIN employees ON employees.role_id = role.id 
                    WHERE ?`,
                        {
                            department_name: answer.department,
                        },

                        (err, results) => {
                            if (err) throw err;
                            console.table(results);
                            init();
                        }
                    );
                });
        }
    );
};

const employeeRoles = () => {
    connection.query(
        "SELECT * FROM role",

        (err, results) => {
            if (err) throw err;

            const roles = results.map((role) => {
                return role.title;
            });

            inquirer.prompt({
                    name: "role",
                    type: "list",
                    message: "Select which role you would like to view.",
                    choices: roles,
                })
                .then((answer) => {
                    console.log("Viewing employees by role");
                    connection.query(
                        `
        SELECT title, first_name, last_name 
        FROM role 
        INNER JOIN employees ON employees.role_id = role.id
        WHERE ?`,
                        {
                            title: answer.role,
                        },

                        (err, results) => {
                            if (err) throw err;
                            console.table(results);
                            init();
                        }
                    );
                });
        }
    );
};

const addEmployee = () => {
    connection.query(
        `SELECT * FROM employees`,

        (err, employResults) => {
            if (err) throw err;

            const employees = employResults.map((employee) => {
                return {
                    name: employee.first_name + " " + employee.last_name,
                    value: employee.id,
                };
            });
            employees.push({ name: "No Manager", value: null });

            connection.query(
                `SELECT * FROM role`,

                (err, results) => {
                    if (err) throw err;

                    const roles = results.map((role) => {
                        return { name: role.title, value: role.id };
                    });

                    inquirer.prompt([
                            {
                                name: "first_name",
                                type: "input",
                                mesage: "Please enter employee's first name.",
                            },
                            {
                                name: "last_name",
                                type: "input",
                                mesage: "Please enter employee's last name.",
                            },
                            {
                                name: "role_id",
                                type: "list",
                                message: "Please enter role ID number.",
                                choices: roles,
                            },
                            {
                                name: "manager_id",
                                type: "list",
                                message: "Please enter manager name",
                                choices: employees,
                            },
                        ])
                        .then((answer) => {
                            connection.query(
                                `INSERT INTO employees SET ?`,
                                {
                                    first_name: answer.first_name,
                                    last_name: answer.last_name,
                                    role_id: answer.role_id,
                                    manager_id: answer.manager_id,
                                },
                                (err, res) => {
                                    if (err) throw err;
                                    console.log("Employee Added");
                                    init();
                                }
                            );
                        });
                }
            );
        });
}

const removeEmployee = () => {
    connection.query(
        `SELECT * FROM employees`,
        (err, employeeResults) => {
            if (err) throw err;

            const employees = employeeResults.map((employee) => {
                return {
                    name: employee.first_name + " " + employee.last_name,
                    value: employee.id,
                };
            });
            inquirer.prompt([
                    {
                        name: "employee",
                        type: "list",
                        message: "Please choose and employee to remove",
                        choices: employees,
                    },
                ])
                .then((answer) => {
                    connection.query(
                        `DELETE FROM employees WHERE ?`,
                        {
                            id: answer.employee,
                        },
                        (err, res) => {
                            if (err) throw err;
                            console.log("Employee removed");
                            init();
                        }
                    );
                });
        });
};
 
const update = () => {
    connection.query(
        `SELECT * FROM employees`, (err, employeeResults) => {
            if (err) throw err;

            const employees = employeeResults.map((employee) => {
                return {
                    name: employee.first_name + " " + employee.last_name,
                    value: employee.id,
                };
            });
            connection.query(
                `SELECT * FROM role`,

                (err, results) => {
                    if (err) throw err;

                    const roles = results.map((role) => {
                        return { name: role.title, value: role.id };
                    });

                    inquirer.prompt([
                            {
                                name: "update",
                                type: "list",
                                message: "Please choose employee to update",
                                choices: employees,
                            },
                            {
                                name: "role",
                                type: "list",
                                message: "Please choose new role",
                                choices: roles,
                            },
                        ])
                        .then((answer) => {
                            connection.query(
                                `UPDATE employees SET ? WHERE ?`,
                                [
                                    {
                                        role_id: answer.role_id,
                                    },
                                    {
                                        id: answer.update,
                                    },
                                ],
                                (err, res) => {
                                    if (err) throw err;
                                    console.log("Employee updated");
                                    init();
                                }
                            );
                        });
                }
            );
        });
};

const departmentAdd = () => {
    inquirer.prompt([
            {
                name: "department",
                type: "input",
                message: "Please enter new department",
            },
        ])
        .then((answer) => {
            connection.query(
                `INSERT INTO department SET ?`,
                {
                    department_name: answer.department,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log("Department added");
                    init();
                }
            );
        });
};

const addRole = () => {
    connection.query(
        `SELECT * FROM department`,

        (err, results) => {
            if (err) throw err;

            const departments = results.map((department) => {
                return { name: department.department_name, value: department.id };
            });

            inquirer.prompt([
                    {
                        name: "title",
                        type: "input",
                        message: "Please enter new role",
                    },
                    {
                        name: "salary",
                        type: "number",
                        message: "Please enter the salary number",
                    },
                    {
                        name: "department_id",
                        type: "list",
                        message: "Please enter employee department",
                        choices: departments,
                    },
                ])
                .then((answer) => {
                    connection.query(
                        `INSERT INTO role SET ?`,
                        {
                            title: answer.title,
                            salary: answer.salary,
                            department_id: answer.department_id,
                        },
                        (err, res) => {
                            if (err) throw err;
                            console.log("Role Added");
                            init();
                        }
                    );
                });
        }
    );
};

const init = () => {
    inquirer.prompt({
            name: 'response',
            type: 'list',
            message: 'What do you want to do?',
            choices: [
                "Show Employees",
                "Show Roles",
                "Show Departments",
                "Show Employees by Departments",
                "Show Employees by Roles",
                "Add Employee",
                "Remove Employee",
                "Update Employee",
                "Add Department",
                "Add Role",
                "Exit",
            ],
        })
        .then((answer) => {
            switch (answer.response) {
                case "Show Employees":
                    employees();
                    break;

                case "Show Roles":
                    showRoles();
                    break;

                case "Show Departments":
                    showDepartments();
                    break;

                case "Show Employees by Departments":
                    employeeDep();
                    break;

                case "Show Employees by Roles":
                    employeeRoles();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;

                case "Update Employee":
                    update();
                    break;

                case "Add Department":
                    departmentAdd();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
};

connection.connect((err) => {
    if (err) throw err;
    init();
});