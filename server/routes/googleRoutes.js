const express = require("express");
const router = express.Router();
const googleController = require("../controllers/googleController");

// Route to start the authentication process
router.get("/auth/google", googleController.startAuthentication);

// Route to handle the callback from Google after authentication
router.get("/oauth2callback", googleController.handleAuthCallback);

// Route to create a calendar event
router.post("/events", googleController.createEvent);

module.exports = router;
