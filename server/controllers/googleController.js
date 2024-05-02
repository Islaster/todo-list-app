const { google } = require("googleapis");
const OAuth2Data = require("../config/google_keys.json");

const oauth2Client = new google.auth.OAuth2(
  OAuth2Data.web.client_id,
  OAuth2Data.web.client_secret,
  OAuth2Data.web.redirect_uris[0]
);

// Include 'email' and 'profile' scopes to access user profile info
const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const startAuthentication = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent", // Ensure refresh tokens are received
  });
  res.redirect(authUrl);
};

const handleAuthCallback = async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code);
  console.log("Tokens received: ", tokens);
  if (tokens) {
    req.session.tokens = tokens;
    req.session.save((err) => {
      if (err) {
        console.error("Failed to save session after receiving tokens: ", err);
      } else {
        console.log("store", req.session.store);
        console.log("Tokens saved to session successfully.", req.session);
        res.redirect("http://localhost:3000/");
      }
    });
  }
};

const createEvent = async (req, res) => {
  if (req.session.tokens) {
    oauth2Client.setCredentials(req.session.tokens);
  } else {
    console.log(req.session);
    return res
      .status(401)
      .json({ error: "No authentication tokens available." });
  }

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const task = req.body;

  const event = {
    summary: task.description,
    description: `Priority: ${task.priority}`,
    start: {
      dateTime: new Date(task.date).toISOString(),
      timeZone: "America/New_York",
    },
    end: {
      dateTime: new Date(new Date(task.date).getTime() + 3600000).toISOString(),
      timeZone: "America/New_York",
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    console.log("Event created: %s", response.data.htmlLink);
    res.status(200).json({
      message: "Event created successfully",
      link: response.data.htmlLink,
    });
  } catch (error) {
    console.error("Error creating event: ", error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

module.exports = {
  startAuthentication,
  handleAuthCallback,
  createEvent,
};
