const helpers = require('../../helpers/helpers');
const mysqlConnection = require('../connection/connection');


const jwt = require('jsonwebtoken');

let controller = {

    example: (req, res) => {
        res.send("This API works!")
    },

    encript: async (req, res) => {
        if (req.body.password) {
            let encriptedPass = await helpers.encryptPassword(req.body.password);
            res.send({ "response": encriptedPass });
        } else {
            res.status(404).send("Not provieded a password");
        }

    },

    login: async (req, res) => {
        const { email, password, time } = req.body;
        let encryptedPass = await helpers.encryptPassword(password);
        log_data = await mysqlConnection.query(`SELECT user.id, user.name, user.lastname, role.description as role, user.email, user.is_active FROM user INNER JOIN role
         on role.role = user.role WHERE user.email=? and user.password=?`,
            [email, encryptedPass]);
        if (log_data.length > 0) {
            let data_permissions = await mysqlConnection.query(`SELECT GROUP_CONCAT(idlog) as permissions FROM loguser
            WHERE iduser = ${log_data[0].id}`);

            log_data[0].permissions = data_permissions[0].permissions;
            let data = JSON.stringify(log_data[0]);
            const token = jwt.sign({ data }, 'outdoorspopi', { expiresIn: time });

            res.json({ token });
        } else {
            res.json('error');
        }

    },

}

module.exports = controller;
