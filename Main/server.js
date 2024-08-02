
const inquirer = require("inquirer");
const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  password: 'Theman176764',
  host: 'localhost',
  database: 'employee_db',
});

const menu = () => {
  inquirer.prompt({
    name: "action",
    message: "What would you like to do?",
    type: "list",
    choices:
      ["Add Department",
        "Add Role",
        "Add Employee",
        "View Department",
        "View Role",
        "View Employee",
        "Exit Database"
      ],
  })
    .then(res => {
      if (res.action === "Add Department") {
        inquirer.prompt([{
          name: "addDep",
          message: "What is the department name?",
          type: "input",
        }])
          .then((result) => {
            let addDep = `INSERT INTO department (name) VALUES ($1)`;
            pool.query(addDep, [result.addDep], (err, result) => {
              if (err) {
                console.log(err)
                return;
              }
              console.log("Success! Department Added!");
              menu();
            });
          })
      }

      if (res.action === "Add Role") {
        inquirer.prompt([{
          name: "addTitle",
          message: "What is the Role's title?",
          type: "input",
        },
        {
          name: "addSalary",
          message: "What is the Role's Salary?",
          type: "input",
        },
        {
          name: "addDepartment",
          message: "What is the Role's Department?",
          type: "input",
        }
        ])
          .then((result) => {
            let addRole = `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *`;
            pool.query(addRole, [result.addTitle, result.addSalary, result.addDepartment]).then(({rows}) => console.log(rows)).then(()=>menu())
          })
      }

      if (res.action === "Add Employee") {
        inquirer.prompt([{
          name: "addFirst",
          message: "What is the Employee's first name?",
          type: "input",
        },
        {
          name: "addLast",
          message: "What is the Employee's last name?",
          type: "input",
        },
        {
          name: "addRole",
          message: "What is the Employee's role?",
          type: "input",
        },
        {
          name: "addMan",
          message: "Who is the employee's manager?",
          type: "input",
        }
        ])
          .then((result) => {
            const addEmp = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *`;
            pool.query(addEmp, [result.addFirst, result.addLast, result.addRole, result.addMan]).then(({rows}) => console.log(rows)).then(()=>menu())
          })
      }

      if (res.action === "View Department") {
        const viewDep = `SELECT * FROM department`;
        pool.query(viewDep, (err, { rows }) => {
          if (err) {
            console.log(err)
            return;
          }
          console.table(rows)
          menu()
        });
      }

      if (res.action === "View Role") {
        const viewRole = `SELECT * FROM role`;
        pool.query(viewRole, (err, { rows }) => {
          if (err) {
            console.log(err)
            return;
          }
          console.table(rows)
          menu()
        });
      }

      if (res.action === "View Employee") {
        const viewEmp = `SELECT * FROM employee`;
        pool.query(viewEmp, (err, { rows }) => {
          if (err) {
            console.log(err)
            return;
          }
          console.table(rows)
          menu()
        });
      }

      if (res.action === "Exit Databaste") {
      }

    })
}
menu()