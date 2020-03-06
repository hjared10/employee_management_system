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
        message: "Credentials verified.  Welcome, operator.  Would you like to [A]dd personel, a role or department?  [V]iew information about the corp?  [U]pdate employee role information?  or [Q]uit?",
        choices: ["A", "V", "U",'Q']
      })
      .then((answer) => {
        if (answer.whatdo === "A") {
          addinfo();
        }
        else if(answer.whatdo === "V") {
          viewinfo();
        }
          else if(answer.whatdo === "U") {
            updateemproles();
           
          } else if(answer.whatdo === "Q") {
               console.log('Understood.  See you soon, operator.');
               connection.end();
           } else{
          console.log('Invalid response.  Quitting.');
          connection.end();
        }
    })
};

function addinfo(){
    inquirer.prompt({
        name:"finder",
        type:'list',
        message:'would you like to add [p]erson, [r]ole, or [d]epartment?',
        choices: ['p', 'r', 'd']
    })
    .then((answer) => {
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
        }]).then((answer) => {
            let lname = answer.padder;
            inquirer.prompt([{
                name:'padder',
                type:'input',
                message:'please input personel role id.  numbers from one to twelve, please.'
            }]).then((answer) => {
                let rid = answer.padder;
                inquirer.prompt([{
                    name:'padder',
                    type:'input',
                    message:'please input manager id.  again, numbers from one to twelve, please.'
                }]).then((answer) => {
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
    inquirer.prompt([{
        name:'rtitle',
        type:'input',
        message:'please input role title.'
    }]).then((answer) => {
let title = answer.rtitle;
inquirer.prompt([{
    name:'rsalary',
    type: 'input',
    message:'please enter desired salary.'
}]).then((answer) => {
    let rsalary = answer.rsalary;
    inquirer.prompt([{
        name:'rdepart',
        type:'input',
        message:'please enter department id.'
    }]).then((answer) => {
        let rdepart = answer.rdepart;
        let mysqlquery = `insert into roles (title, salary, department_id) values ('${title}', '${rsalary}', '${rdepart}')`
        connection.query(mysqlquery, function (err, res){
            if (err) throw err;
            console.log(res);
            console.log('operation sucessful.  the service will now restart.');
            start();
                })
            })
        })
    })
};

//i wanted to store questions as variables, but couldnt get it to work.
// var depaddquestions = [{
//     name:'depname',
//     type:'input',
//     message:'please enter name of new department.'
// }, {
//     name:'depid',
//     type:'input',
//     message: 'please enter department id.'
// }]

function adddep() {
    inquirer
    .prompt({
        name:'depname',
    type:'input',
    message:'please enter name of new department.'
    }).then((answern) => {
    console.log(answern);
    let depname = answern.depname;
    inquirer.prompt({
        name:'depid',
    type:'input',
    message: 'please enter department id.'}).then((answerd) => {
    let depid = answerd.depid;
    let mysqlquery = `insert into departments (name, department_id) values ('${depname}', '${depid}' )`;   
    connection.query(mysqlquery, function (err, res){
    if (err) throw err;
    console.log(res);
    console.log('operation has succeeded.  the service will now resume.');
    start()  
            })
        })
    }
)}

function viewinfo() {
    inquirer.prompt([{
        name:'selector',
        type:'choices',
        message:'would you like to view [p]ersonel, [d]epartments or [r]oles?',
        choices: ['p', 'r', 'd']
    }]).then((answer) => {
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
      .then((answer) => {
        if (answer.return === "r") {
    start();  
        }})})
    } else if (answer.selector === 'r') {
        connection.query(
            `select * from roles`, function(err, res){
                if (err) throw err;
                console.log(res);
                console.log('operation sucessful, operator.  returning.');
                start();
            }
        )
    }
    else if (answer.selector ==='d') {
        connection.query(
            `select * from departments`, function (err, res) {
                if (err) throw err;
                console.log(res);
                console.log('operator, opertionation suceeded. returning.');
                start();
            }
        )
    }
})}

function updateemproles() {
    connection.query(`select * from roles`, function(err, res){
            if (err) throw err;
            console.log(res)});
    inquirer.prompt({
    name:'roleupdater',
    type:'input',
    message: 'operator, please enter id of role to be updated.'
}).then((answer) => {
    let rid = answer.roleupdater;
console.log(answer.roleupdater);
inquirer.prompt({
    name:'roleupdaternext',
    type:'list',
    message:'would you like to update role [t]itle?  [s]alary?  or [d]epartment id?',
    choices:['t', 's', 'd']
}).then((answer) => {
    if (answer.roleupdaternext === 't') {
        inquirer.prompt ({
            name:'roleupdatername',
            type: 'input',
            message:'what do you want the new name to be?'
        }).then((answer) => {
            let nrolename = answer.roleupdatername;
            let mysqlquery = `update roles set title = '${nrolename}' where id ='${rid}'`
            connection.query(mysqlquery, function (err, res){
                if (err) throw err;
                console.log(res);
                console.log('operation successful operator, restarting.');
                start();
            })
        })
    }
   else if (answer.roleupdaternext === 's') {
       inquirer.prompt ({
           name:'rolesalaryupdater',
           type: 'input',
           message: 'what would you like the new salary to be?'
       }).then((answer) => {
           let rolesalaryupdater = answer.rolesalaryupdater;
           let mysqlquery = `update roles set salary = '${rolesalaryupdater}' where id='${rid}'`
           connection.query(mysqlquery, function (err, res) {
               if (err) throw err;
               console.log(res);
               console.log('operation succeed, opreator.  restarting.');
               start();
           })
       })
   }
    else if (answer.roleupdaternext === 'd') {
        inquirer.prompt({
            name:'roledepartmentchanger',
            type: 'input',
            message:'what would you like the new department id to be?'
        }).then((answer) => {
let roledepartmentchanger = answer.roledepartmentchanger;
let mysqlquery = `update roles set department_id='${roledepartmentchanger}' where id='${rid}'`
connection.query(mysqlquery, function (err, res) {
    if (err) throw err,
    console.log(res);
    console.log('operator, operation has succeeded.  restarting.');
    start();
})
        })
    }

    else {
        console.log('operator, you gave an invalid response.  howd you even do that?  i gave you choises!  oh well, lets just restart.');
        start();
    }
})
})
}