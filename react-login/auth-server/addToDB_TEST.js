const fs = require('fs');

function write_to_json_db(data) {
    console.log('made it to writing to json function');
    fs.readFile('./database.json', 'utf8', (err, jsonData) => {
        if (err) {
            console.error('error reading file in writing to database: ', err);
            return;
        }

        let db_content = JSON.parse(jsonData);

        if(!db_content.users) {
            db_content.users = [];
        }
        db_content.users.push(data);

        const new_JSON = JSON.stringify(db_content, null, 2);

        fs.writeFile('./database.json', new_JSON, 'utf8', (err) => {
            if (err) {
                console.error('unable to write to database: ', err);
            }
            else {
                console.log('data written successfully to db');
            }
        })
    })
}

module.exports = { write_to_json_db };