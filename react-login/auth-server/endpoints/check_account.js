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
        // console.log("database content:");
        // console.log(db_content);
        let user_exists = db_content.users.find((user) => {
            // console.log(email === user.email);
            return email === user.email;
        });
        // console.log("about to say if user exists");
        // if(user_exists) {
        //     console.log('success');
        // }
        // else {
        //     console.log('failure');
        // }
        // console.log('further testing');
        // console.log(!!user_exists);
        // console.log(user)
        
        res.status(200).json({
          status: !!user_exists ? 'User exists' : 'User does not exist',
          userExists: !!user_exists,
        })
    });

}

module.exports = {check_account};