const helpers = require('../../helpers/helpers');
const mysqlConnection = require('../connection/connection');
const mailing = require('../../helpers/emailTemplates');


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
        for(let i = 0; i < items.length; i++){
            items[i].interested = []
            let interested = await mysqlConnection.query("SELECT email FROM `auction-app`.item_subscriptions WHERE item_id = ?",[items[i].id]);
            if(interested.length > 0){
                for(let j = 0; j < interested.length; j ++){
                    items[i].interested.push(interested[j].email);
                }

            }else{
                items[i].interested.push(" ");
            }
            
        }
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
        await mysqlConnection.query("INSERT INTO `auction-app`.item_subscriptions SET item_id = ?, email = ?", [item_id, email]);
        res.json("Added")
    },
    getAuction: async (req, res) => {
        let auctions = await mysqlConnection.query("SELECT `auction-app`.auctions.*, `auction-app`.items.name, `auction-app`.items.imgsrc FROM `auction-app`.auctions INNER JOIN `auction-app`.items on `auction-app`.items.id = `auction-app`.auctions.item_id");
        for(let i = 0; i < auctions.length; i++){
            auctions[i].bids = []
            let bids = await mysqlConnection.query("SELECT email FROM `auction-app`.bids WHERE auction_id = ?",[auctions[i].id]);
            if(bids.length > 0){
                for(let j = 0; j < bids.length; j ++){
                    auctions[i].bids.push(bids[j].email);
                }

            }else{
                auctions[i].bids.push(" ");
            }
            
        }
        res.json(auctions)
    },
    addAuction: async (req, res) => {
        const { item_id, price, startDate, endDate} = req.body;
        let data = { item_id: item_id.id, price, startDate, endDate};
        data.startDate = new Date(JSON.stringify(data.startDate).split('T')[0]);
        data.endDate = new Date(JSON.stringify(data.endDate).split('T')[0]);
        await mysqlConnection.query("INSERT INTO `auction-app`.auctions SET ?",[data]);
        await mysqlConnection.query("UPDATE `auction-app`.items SET available = 0 WHERE id = ?",[item_id.id]);
        res.json("Created")
    },
    addBid: async (req, res) => {
        const { auction_id, amount, user_id, email} = req.body;
        let data = { auction_id, amount, user_id, email};
        await mysqlConnection.query("INSERT INTO `auction-app`.bids SET ?",[data]);
        await mysqlConnection.query("UPDATE `auction-app`.auctions SET price = ? WHERE id = ?", [amount, auction_id])
        res.json("Created")
    },
    unsubscribeItem: async (req, res) => {
        const { item_id, email} = req.body;
        await mysqlConnection.query("DELETE FROM `auction-app`.item_subscriptions WHERE item_id = ? AND email = ?", [item_id, email]);
        res.json("Added")
    },

    endAuction: async (req, res) => {
        const { auction_id}  = req.body;
        await mysqlConnection.query("UPDATE `auction-app`.auctions SET status = 1 WHERE id = ? ", [auction_id]);
        let response = mailing.testMail();
        res.json("Ended")
    },

    sendSampleMail: (req,res) => {
        let response = mailing.testMail();
        res.json({ status: response != 0 ? 'SUCCESS':'FAILED'});
    },

}

module.exports = controller;
