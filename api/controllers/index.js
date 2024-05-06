const helpers = require('../../helpers/helpers');
const mysqlConnection = require('../connection/connection');

let controller = {

    example: (req, res) => {
        res.send("This API works!")
    },

    encript: async (req, res) => {
        if (req.body.password) {
            let encriptedPass = await helpers.encryptPassword(req.body.password);
            res.send({ "response": encriptedPass });
        } else {
            res.status(404).send("Not provided a password");
        }

    },
    login: async (req, res) => {
        const email = req.body.email;
        const password = await helpers.encryptPassword(req.body.password);
        try {
            // Fetch user data with hashed password
            const userData = await mysqlConnection.query(
                `SELECT user.user_id, user.name, user.lastname, user.email, role.label AS role_label, role.value AS role_value FROM user 
                INNER JOIN role ON user.role_id = role.role_id WHERE user.email = ? and user.password=?`,
                [email, password]
            );

            if (userData.length === 0) {
                return res.status(401).json({ error: "User not found" });
            }

            const user = userData[0];

            // Fetch additional user data based on role
            let additionalUserData;

            if (user.role_value === 'internal') {
                // Fetch internal user data
                additionalUserData = await mysqlConnection.query(
                    "SELECT * FROM internal_user WHERE user_id = ?",
                    [user.user_id]
                );
            } else if (user.role_value === 'external') {
                // Fetch external user data
                additionalUserData = await mysqlConnection.query(
                    "SELECT * FROM external_user WHERE user_id = ?",
                    [user.user_id]
                );
            }

            // Merge user data with additional user data
            const mergedUserData = { ...user, additionalUserData };

            // Send merged user data
            res.status(200).json(mergedUserData);
        } catch (error) {
            console.error("Error logging in:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    getEvents: async (req, res) => {
        try {
            const events = await mysqlConnection.query(`
                SELECT 
                    e.event_id,
                    e.name AS event_name,
                    e.description AS event_description,
                    e.date AS event_date,
                    e.location AS event_location,
                    e.start_time AS event_start_time,
                    e.kit_pickup_location AS event_kit_pickup_location,
                    e.kit_pickup_date AS event_kit_pickup_date,
                    b.business_id,
                    b.name AS business_name,
                    b.email AS business_email,
                    b.ruc AS business_ruc,
                    b.phone AS business_phone,
                    b.address AS business_address,
                    et.event_type_id,
                    et.label AS event_type_label,
                    et.value AS event_type_value,
                    et.description AS event_type_description
                FROM 
                    event e
                INNER JOIN 
                    business b ON e.business_id = b.business_id
                INNER JOIN 
                    event_type et ON e.event_type_id = et.event_type_id
            `);

            res.status(200).json({ events });
        } catch (error) {
            console.error("Error fetching events:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    getEventCategories: async (req, res) => {
        const eventId = req.body.eventId; // Assuming eventId is passed as a parameter
        try {
            // Fetch categories for the given event
            const categories = await mysqlConnection.query(
                "SELECT * FROM `category` WHERE event_id = ?",
                [eventId]
            );

            res.status(200).json({ categories });
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },


    registerUserToEvent: async (req, res) => {
        const { external_user_id, event_id, category_id, running_number, status, payment_method } = req.body;

        try {
            // Insert registration data into the register table
            const result = await mysqlConnection.query(
                "INSERT INTO `register` (external_user_id, event_id, category_id, running_number, registration_date, status, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [external_user_id, event_id, category_id, running_number, new Date(), status, payment_method]
            );

            const registrationId = result.insertId;

            res.status(201).json({ registration_id: registrationId, message: "Registration successful" });
        } catch (error) {
            console.error("Error registering user to event:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    getResultsByEventId: async (req, res) => {
        const eventId = req.body.eventId;

        try {
            // Fetch results for the given event_id from the result_view
            const results = await mysqlConnection.query(
                "SELECT * FROM result_view WHERE event_id = ?",
                [eventId]
            );

            res.status(200).json({ results });
        } catch (error) {
            console.error("Error fetching results:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }






}

module.exports = controller;
