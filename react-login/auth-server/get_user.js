const fs = require('fs');

function get_user(dto_object) {
    fs.readFile('./database.json', 'utf8', (err, jsonData) => {
        if (err) {
            console.error('error reading file in writing to database: ', err);
            return;
        }

        let db_content = JSON.parse(jsonData);
        let user = db_content.users.find((user) => {
            return dto_object.email === user.email;
        });
        return user;
    });
}

module.exports = { get_user };