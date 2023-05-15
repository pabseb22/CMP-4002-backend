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
        const email = req.body[0]
        const password = req.body[1]
        log_data = await mysqlConnection.query("SELECT users.name,users.lastname,users.type,users.email FROM `auction-app`.users WHERE users.email=? and users.password=?",
            [email, password]);
        if (log_data.length > 0) {
            res.json({ log_data });
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
