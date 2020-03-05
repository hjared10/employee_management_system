var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "thedagon26",
  database: "descended_industries_db"
});


connection.connect(function(err){
    if(!err){
      console.log(`Connected to database thread: ${connection.threadId}`)
      start();
    } 
});

function start() {inquirer.prompt({
        name: "whatdo",
        type: "list",
        message: "Credentials verified.  Welcome, operator.  Would you like to [A]dd personel, a role or department?  [V]iew information about the corp?  [U]pdate employee information?  or [Q]uit?",
        choices: ["A", "V", "U",'Q']
      })
      .then(function(answer) {
        if (answer.whatdo === "A") {
          addinfo();
        }
        else if(answer.whatdo === "V") {
          viewinfo();
        }
          else if(answer.whatdo === "U") {
            updateempinfo();
           
          } else if(answer.whatdo === "Q") {
               console.log('Understood.  See you soon, operator.');
               connection.end();
           } else{
          console.log('Invalid response.  Quitting.');
          connection.end();
        }})};

function addinfo(){
    inquirer.prompt({
        name:"finder",
        type:'list',
        message:'would you like to add [p]erson, [r]ole, or [d]epartment?',
        choices: ['p', 'r', 'd']
    })
    .then(function(answer) {
if (answer.finder === 'p') {addperson()}
else if(answer.finder === 'r') {addrole()}
else if(answer.finder === 'd') {adddep()}
else {
    console.log('invalid response.  Please try again.');
    addinfo();
}
    })
}

function addperson(){
    inquirer.prompt([{
        name:'padder',
        type:'input',
        message:'please input personel first name.'
    }]).then(function(answer){
        let fname = answer.padder;
        inquirer.prompt([{
            name:'padder',
            type:'input',
            message:'please input personel last name.'
        }]).then(function(answer){
            let lname = answer.padder;
            inquirer.prompt([{
                name:'padder',
                type:'input',
                message:'please input personel role id.  Numbers from one to twelve, please.'
            }]).then(function(answer){
                let rid = answer.padder;
                inquirer.prompt([{
                    name:'padder',
                    type:'input',
                    message:'please input manager id.  Again, numbers from one to twelve, please.'
                }]).then(function(answer){
                    let mid = answer.padder;
                    let mysqlquery = `INSERT INTO personel (first_name, last_name, role_id, manager_id) VALUES ('${fname}', '${lname}', ${rid}, ${mid})`;
                    connection.query(mysqlquery, function(err, res){
                        if (err) throw err;
                        console.log(res);
                        console.log('operation sucessful.  the service will now restart.');
                    start();
                    })
                })
            })
        })
    })
}

function addrole() {
    console.log('add a role!');
    start()
}
function adddep() {
    console.log('add a department!');
    start()
}

function viewinfo() {
    inquirer.prompt([{
        name:'selector',
        type:'choices',
        message:'would you like to view [p]ersonel, [d]epartments or [r]oles?',
        choices: ['p', 'r', 'd']
    }]).then(function(answer){
if (answer.selector === 'p') {
    connection.query(
        `select * from personel`, function(err, res){
            if (err) throw err;
        console.log(res);
        inquirer
      .prompt({
        name: "return",
        type: "list",
        message: "ready to return, operator?",
        choices: ["r"]
      })
      .then(function(answer) {
        if (answer.return === "r") {
    start();  
        }})})
    } else if (answer.selector === 'r') {
        connection.query(
            `select * from roles`, function(err, res){
                if (err) throw err;
            }
        )
    }
    })}