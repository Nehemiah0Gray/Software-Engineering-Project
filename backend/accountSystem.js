// The datrabase will be setup later in mysql

// express is used to create the web server and API routes.
const webSrvr = require("express");
// hashFunc is used to securely hash passwords and compare passwords.
const hashFunc = require("hashFunc");
// Sessions allow the server to remember which user is logged in.
const userSession = require("express-session");
// This keeps the database code separate from the server code.
const db = require("./database");
const expressApp = webSrvr();
// This allows users to send their account information in the request body, including emails, passwords, and location information.
expressApp.use(webSrvr.json());


// Configuring sessions.
expressApp.use(
    session({
    // a secret key used to sign the session ID cookie, which is stored in the user's browser.
    sKey: "your-hidden-key",
    // Prevents the session from being saved again if nothing has changed.
    resave: false,
    // Prevents empty sessions from being created.
    saveEmpty: false
    })
);
// Register setup:
// Allows users to create an account
expressApp.post("/api/register", async (request, response) => {
    const {
        username,
        email,
        password,
        city,
        state,
        zip_code
    } = request.body;
// try catch block used to handle any errors that may occur during the registration process.
    try {
    // Hash the user's password
    const hashedPassword = await hashFunc.hash(password, 10);
    //Database setup will come here later
    // Send a successful indicator for account creation.
        response.json({
            successMessage: "Account has been created successfully."
        });

    } catch (error) {
        // If something goes wrong, send a server error.
        response.status(500).json({
            failureMessage: "Server error."
        });
    }
});

// Login setup
// This allows an existing user to log into their account.
expressApp.post("/api/login", async (request, response) => 
    {
    const {
        email,
        password
    } = request.body;
    // More database setup will be implemented here when the datase is created in mysql.
    // This is only here to show where the database information would be used.
    const user = {
        userID: 1,
        username: "ExUser",
        passwordHash: "database-password-hash"
    };
    // Compare the entered password with the hashed password stored in the database.
    const validPassword = await hashFunc.compare(
        password,
        user.passwordHash
    );
    // If the passwords don't match, the server will deny the login.
    if (!validPassword) {
        return response.status(401).json({
            failureMessage: "Invalid email or password."
        });
    }
    // Allows the server to remember that the user is logged in by storing their user ID in the session.
    request.session.userId = user.user_id;
    // Indicates the successful login and sends the username back to the database
    response.json({
        successMessage: "Login successful.",
        username: user.username
    });
});

// Logout setup

// This post setup allows a logged-in user to log out of their account.
expressApp.post("/api/logout", (request, response) => {

    // End the user's current session.
    request.session.destroy((err) => {
    // If there was an error destroying/ending the session, send an error response.
        if (err) {
            return response.status(500).json({
                failureMessage: "Unable to log out."
            });
        }
        response.json({
            successMessage: "You have logged out successfully."
        });
    });
});

// Update Account Information Setup
// Allows logged in users to update account information
expressApp.put("/api/account", (request, response) => {
    // Check whether the user is logged in or logged out.
    if (!request.session.userId) {
        return response.status(401).json({
            failureMessage: "You must be logged in."
        });
    }
    // Gets the updated information from the database that the user has entered prior to the update.
    const {
        username,
        email,
        city,
        state,
        zip_code
    } = request.body;
    response.json({
        successMessage: "Account updated successfully."
    });
});


// Password reset Setup

// This route would start the password reset process.
expressApp.post("/api/forgot-password", (request, response) => {
    // Get the email address entered by the user.
    const {
        email
    } = request.body;
    // The database will be used to determine whether this email belongs to an account.
    // A password reset token would be generated here in the JavaScript code, and it would be stored in the database along with an expiration time.
    // This token is then sent to the user's email address with a link to reset their password.
    // Send a response indicating that the password reset process has started.
    response.json({
        successMessage: "If an account exists with that email, a response link will be sent."
    });
});

// Starting the server 
app.listen(3000, () => {
    // Displays the server URL.
    console.log("Server running at http://localhost:3000");
});
