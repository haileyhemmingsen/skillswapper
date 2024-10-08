

function validate_name_pass(dto_object) {
    let db_content = JSON.parse(jsonData);
    return logged_user = db_content.users.find((user) => {
        user.password === dto_object.password && dto_object.email === user.email;
    });
    // if (logged_user)
    //     return true;
    // else
    //     return false;
}

module.exports = { validate_name_pass };