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

    getItems: async (req, res) => {
        let items = await mysqlConnection.query("SELECT * FROM `auction-app`.items");
        res.json(items)
    },
    addItem: async (req, res) => {
        const { name, imgsrc, des, available, starting_price} = req.body;
        let data = { name, imgsrc, des, available, starting_price};
        data.imgsrc = data.imgsrc.replace(/'/g, '');
        await mysqlConnection.query("INSERT INTO `auction-app`.items SET ?",[data]);
        res.json("Created")
    }
    ,
    editItem: async (req, res) => {
        const { id, name, imgsrc, des, available, starting_price} = req.body;
        let data = { name, imgsrc, des, available, starting_price};
        data.imgsrc = data.imgsrc.replace(/'/g, '');
        await mysqlConnection.query("UPDATE `auction-app`.items SET ? WHERE id = ?",[data, id]);
        res.json("Created");
    },
    subscribeItem: async (req, res) => {
        const { item_id, email} = req.body;
        await mysqlConnection.query("INSERT INTO `auction-app`.items_subscriptions SET item_id = ?, email = ?", [item_id, email]);
        res.json("Added")
    },

}

module.exports = controller;
