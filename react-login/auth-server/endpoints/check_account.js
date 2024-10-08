const fs = require('fs');

function check_account(req, res) {
    const { email } = req.body
  
    console.log(req.body)
    fs.readFile('./database.json', 'utf8', (err, jsonData) => {
        if (err) {
            console.error('error reading file in writing to database: ', err);
            return;
        }

        let db_content = JSON.parse(jsonData);
        let user_exists = db_content.users.find((user) => {
            email === user.email;
        });
        console.log(user)
        
        res.status(200).json({
          status: user_exists ? 'User exists' : 'User does not exist',
          userExists: user_exists,
        })
    });

}

module.exports = {check_account};