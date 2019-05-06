var fs = require("fs");
const ADMIN_NAME_LIST_FILE = "/utils/adminfile";

function getAdminNames() {
    var contents = fs.readFileSync(ADMIN_NAME_LIST_FILE, 'utf8');
    return contents.split("\n");
}

function isAdmin(username) {
console.log(getAdminNames())
    return getAdminNames().indexOf(username) != -1;
}

module.exports = {isAdmin: isAdmin};