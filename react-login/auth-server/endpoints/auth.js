// var low = require('lowdb');
// var FileSync = require('lowdb/adapters/FileSync')
// var adapter = new FileSync('./database.json')
// var db = low(adapter)
// const fs = require('fs');
const { write_to_json_db } = require('../addToDB_TEST');
const { validate_name_pass } = require('../validate_name_pass');
const { get_user } = require('../get_user');

function authenticate(req, res) {
    const { email, password } = req.body

    /////////////////////////////////////////////////////////////////////////////////////
    // TEST CODE FOR SENDING TO BACKEND AND TALKING TO TEST DATABASE
    const user_dto = {
        'email': email,
        'password': password
    }
    // write_to_json_db(user_dto);
    /////////////////////////////////////////////////////////////////////////////////////

    // look up user entry in database
    // fs.readFile('./database.json', 'utf8', (err, jsonData) => {
    //     if (err) {
    //         console.error('error reading file in writing to database: ', err);
    //         return;
    //     }

    //     let db_content = JSON.parse(jsonData);
    //     let user_exists = db_content.users.find((user) => {
    //         email === user.email;
    //     });
    const user = get_user(user_dto);
        if (!!user) {
            // if user does not exist, throw "username or password is wrong"
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        else {
            if (validate_name_pass(user_dto)) {
                // password and username are correct
                let loginData = {
                    email,
                    signInTime: Date.now(),
                    };
        
                    const token = jwt.sign(loginData, jwtSecretKey);
                    res.status(200).json({ message: 'success', token });
            }
        }
    // });

    

    // // Look up the user entry in the database
    // const user = db
    //   .get('users')
    //   .value()
    //   .filter((user) => email === user.email)
  
    // // If found, compare the hashed passwords and generate the JWT token for the user
    // if (user.length === 1) {
    //   bcrypt.compare(password, user[0].password, function (_err, result) {
    //     if (!result) {
    //       return res.status(401).json({ message: 'Invalid password' })
    //     } else {
    //       let loginData = {
    //         email,
    //         signInTime: Date.now(),
    //       }
  
    //       const token = jwt.sign(loginData, jwtSecretKey)
    //       res.status(200).json({ message: 'success', token })
    //     }
    //   })
    //   // If no user is found, hash the given password and create a new entry in the auth db with the email and hashed password
    // } else if (user.length === 0) {
    //   bcrypt.hash(password, 10, function (_err, hash) {
    //     console.log({ email, password: hash })
    //     database.get('users').push({ email, password: hash }).write()
  
    //     let loginData = {
    //       email,
    //       signInTime: Date.now(),
    //     }
  
    //     const token = jwt.sign(loginData, jwtSecretKey)
    //     res.status(200).json({ message: 'success', token })
    //   })
    // }
    
    
    return res;
}

module.exports = { authenticate };