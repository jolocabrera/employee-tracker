// import dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

require('dotenv').config();


//create database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});



//start connection to server
db.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + db.threadId);
    promptUser();
})

const promptUser = () => {
    inquirer.prompt ([
        //declare prompts
        {}
    ])
}