//----Modules and configuration----//
const express = require("express");
const router = express.Router();
const profiles = require("../controllers/profilesController");

//----Endpoints----//
router.route("/contacts").post(profiles.migrateContacts);
router.route("/contacts").get(profiles.saveProfiles);

module.exports = router;
