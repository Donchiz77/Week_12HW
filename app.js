// const mysql = require('mysql');
// const inquirer = require('inquirer');
// require('console.table');


// const promptMessages = {
//     viewAllEmployees: "View All Employees",
//     viewByDepartment: "View All Employees By Department",
//     viewByManager: "View All Employees By ID",
//     addEmployee: "Add An Employee",
//     removeEmployee: "Remove An Employee",
//     updateRole: "Update Employee Role",
//     updateEmployeeManager: "Update Employee Manager",
//     viewAllRoles: "View All Roles",
//     exit: "Exit"
// };

// const connection = mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: 'Adonis_1996',
//     database: 'Employees_DB',
// });
// connection.connect(err => {
//     if (err) throw err;
//     prompt();
// });

// function prompt() {
//     inquirer
//         .prompt({
//             name: 'action',
//             type: 'list',
//             message: 'What would you like to do?',
//             choices: [
//                 promptMessages.viewAllEmployees,
//                 promptMessages.viewByDepartment,
//                 promptMessages.viewByManager,
//                 promptMessages.viewAllRoles,
//                 promptMessages.addEmployee,
//                 promptMessages.removeEmployee,
//                 promptMessages.updateRole,
//                 promptMessages.exit
//             ]
//         })
//         .then(answer => {
//             console.log('answer', answer);
//             switch (answer.action) {
//                 case promptMessages.viewAllEmployees:
//                     viewAllEmployees();
//                     break;

//                 case promptMessages.viewByDepartment:
//                     viewByDepartment();
//                     break;

//                 case promptMessages.viewByManager:
//                     viewByManager();
//                     break;

//                 case promptMessages.addEmployee:
//                     addEmployee();
//                     break;

//                 case promptMessages.removeEmployee:
//                     remove('delete');
//                     break;

//                 case promptMessages.updateRole:
//                     remove('role');
//                     break;

//                 case promptMessages.viewAllRoles:
//                     viewAllRoles();
//                     break;

//                 case promptMessages.exit:
//                     connection.end();
//                     break;
//             }
//         });
// };

// function viewAllEmployees() {
//     const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
//     FROM employee
//     LEFT JOIN employee manager on manager.id = employee.manager_id
//     INNER JOIN role ON (role.id = employee.role_id)
//     INNER JOIN department ON (department.id = role.department_id)
//     ORDER BY employee.id;`;
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         console.log('\n');
//         console.log('VIEW ALL EMPLOYEES');
//         console.log('\n');
//         console.table(res);
//         prompt();
//     });
// };

// function viewByDepartment() {
//     const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
//     FROM employee
//     LEFT JOIN role ON (role.id = employee.role_id)
//     LEFT JOIN department ON (department.id = role.department_id)
//     ORDER BY department.name;`;
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         console.log('\n');
//         console.log('VIEW EMPLOYEE BY DEPARTMENT');
//         console.log('\n');
//         console.table(res);
//         prompt();
//     });
// };

// function viewByManager() {
//     const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
//     FROM employee
//     LEFT JOIN employee manager on manager.id = employee.manager_id
//     INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
//     INNER JOIN department ON (department.id = role.department_id)
//     ORDER BY manager;`;
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         console.log('\n');
//         console.log('VIEW EMPLOYEE BY MANAGER');
//         console.log('\n');
//         console.table(res);
//         prompt();
//     });
// };

// function viewAllRoles() {
//     const query = `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
//     FROM employee
//     LEFT JOIN role ON (role.id = employee.role_id)
//     LEFT JOIN department ON (department.id = role.department_id)
//     ORDER BY role.title;`;
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         console.log('\n');
//         console.log('VIEW EMPLOYEE BY ROLE');
//         console.log('\n');
//         console.table(res);
//         prompt();
//     });

// };

// async function addEmployee() {
//     const addname = await inquirer.prompt(askName());
//     connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
//         if (err) throw err;
//         const { role } = await inquirer.prompt([
//             {
//                 name: 'role',
//                 type: 'list',
//                 choices: () => res.map(res => res.title),
//                 message: 'What is the employee role?: '
//             }
//         ]);
//         let roleId;
//         for (const row of res) {
//             if (row.title === role) {
//                 roleId = row.id;
//                 continue;
//             }
//         }
//         connection.query('SELECT * FROM employee', async (err, res) => {
//             if (err) throw err;
//             let choices = res.map(res => `${res.first_name} ${res.last_name}`);
//             choices.push('none');
//             let { manager } = await inquirer.prompt([
//                 {
//                     name: 'manager',
//                     type: 'list',
//                     choices: choices,
//                     message: 'Choose the employee Manager: '
//                 }
//             ]);
//             let managerId;
//             let managerName;
//             if (manager === 'none') {
//                 managerId = null;
//             } else {
//                 for (const data of res) {
//                     data.fullName = `${data.first_name} ${data.last_name}`;
//                     if (data.fullName === manager) {
//                         managerId = data.id;
//                         managerName = data.fullName;
//                         console.log(managerId);
//                         console.log(managerName);
//                         continue;
//                     }
//                 }
//             }
//             console.log('Employee has been added. Return to view all.');
//             connection.query(
//                 'INSERT INTO employee SET ?',
//                 {
//                     first_name: addname.first,
//                     last_name: addname.last,
//                     role_id: roleId,
//                     manager_id: parseInt(managerId)
//                 },
//                 (err, res) => {
//                     if (err) throw err;
//                     prompt();

//                 }
//             );
//         });
//     });

// };

// function remove(input) {
//     const promptQ = {
//         yes: "yes",
//         no: "no I don't (view all employees on main)"
//     };
//     inquirer.prompt([
//         {
//             name: "action",
//             type: "list",
//             message: "In order to proceed a employee ID must be entered. View all employees to get" +
//                 " the employee ID. Do you know the employee ID?",
//             choices: [promptQ.yes, promptQ.no]
//         }
//     ]).then(answer => {
//         if (input === 'delete' && answer.action === "yes") removeEmployee();
//         else if (input === 'role' && answer.action === "yes") updateRole();
//         else viewAllEmployees();



//     });
// };
// async function removeEmployee() {

//     const answer = await inquirer.prompt([
//         {
//             name: "first",
//             type: "input",
//             message: "Enter the employee ID to remove:  "
//         }
//     ]);

//     connection.query('DELETE FROM employee WHERE ?',
//         {
//             id: answer.first
//         },
//         function (err) {
//             if (err) throw err;
//         }
//     )
//     console.log('Employee has been removed!');
//     prompt();

// };
// function askId() {
//     return ([
//         {
//             name: "name",
//             type: "input",
//             message: "What is the employe ID?:  "
//         }
//     ]);
// }
// async function updateRole() {
//     const employeeId = await inquirer.prompt(askId());

//     connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
//         if (err) throw err;
//         const { role } = await inquirer.prompt([
//             {
//                 name: 'role',
//                 type: 'list',
//                 choices: () => res.map(res => res.title),
//                 message: 'What is the new employee role?: '
//             }
//         ]);
//         let roleId;
//         for (const row of res) {
//             if (row.title === role) {
//                 roleId = row.id;
//                 continue;
//             }
//         }
//         connection.query(`UPDATE employee 
//         SET role_id = ${roleId}
//         WHERE employee.id = ${employeeId.name}`, async (err, res) => {
//             if (err) throw err;
//             console.log('Role has been updated..')
//             prompt();
//         });
//     });
// }
// function askName() {
//     return ([
//         {
//             name: "first",
//             type: "input",
//             message: "Enter the first name: "
//         },
//         {
//             name: "last",
//             type: "input",
//             message: "Enter the last name: "
//         }
//     ]);
// };
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
require('dotenv').config();


//gets connection to database and portion
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Adonis_1996',
    database: 'employees_DB',
});

//viewing employees
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

//showing all roles
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

//showing all departments
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

//showing employee departments
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

//shoiwing employee by roles
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

//adding employee
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

//remove an employee
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

//employee update 
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

//adding department 
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

//adding role
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

//startin the app
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

//ends app
connection.connect((err) => {
    if (err) throw err;
    init();
});