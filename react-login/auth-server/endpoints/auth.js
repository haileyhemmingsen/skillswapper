// var low = require('lowdb');
// var FileSync = require('lowdb/adapters/FileSync')
// var adapter = new FileSync('./database.json')
// var db = low(adapter)

function authenticate(req, res) {
    const { email, password } = req.body
  
    // Look up the user entry in the database
    const user = db
      .get('users')
      .value()
      .filter((user) => email === user.email)
  
    // If found, compare the hashed passwords and generate the JWT token for the user
    if (user.length === 1) {
      bcrypt.compare(password, user[0].password, function (_err, result) {
        if (!result) {
          return res.status(401).json({ message: 'Invalid password' })
        } else {
          let loginData = {
            email,
            signInTime: Date.now(),
          }
  
          const token = jwt.sign(loginData, jwtSecretKey)
          res.status(200).json({ message: 'success', token })
        }
      })
      // If no user is found, hash the given password and create a new entry in the auth db with the email and hashed password
    } else if (user.length === 0) {
      bcrypt.hash(password, 10, function (_err, hash) {
        console.log({ email, password: hash })
        db.get('users').push({ email, password: hash }).write()
  
        let loginData = {
          email,
          signInTime: Date.now(),
        }
  
        const token = jwt.sign(loginData, jwtSecretKey)
        res.status(200).json({ message: 'success', token })
      })
    }
    
    
    return res;
}

module.exports = { authenticate };