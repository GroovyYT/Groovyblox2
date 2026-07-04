const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to log incoming requests from your patched APK
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to: ${req.url}`);
    next();
});

// 1. Version Check Endpoint
// Dictates whether the 2015 APK throws an "Update Required" error
app.get('/Game/GetCurrentVersion.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send('2.200.60733'); // Return your exact APK version to match
});

// 2. Place Launcher Endpoint
// Tells the client where to route its connection when joining a game
app.get('/Game/PlaceLauncher.ashx', (req, res) => {
    res.set('Content-Type', 'text/xml');
    
    // Replace with your actual Render URL when deployed
    const joinUrl = `https://onrender.com{req.query.placeId || 0}`;
    
    const xmlResponse = `<?xml version="1.0" encoding="utf-8" ?>
<PlayResponse>
    <Status>2</Status>
    <JoinUrl>${joinUrl}</JoinUrl>
    <AuthenticationUrl></AuthenticationUrl>
</PlayResponse>`;

    res.send(xmlResponse);
});

// 3. Game Join Endpoint
// Provides the configuration payload, character look, and security token
app.get('/Game/Join.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    
    // In 2015, this returns a block of Lua code telling the engine how to spin up
    const luaScript = `-- Legacy Join Script
    local client = game:GetService("NetworkClient")
    client:Connect("127.0.0.1", 53640) -- Replace with your game server IP/Port
    `;
    
    res.send(luaScript);
});

// Base Root Route for checking if Render is awake
app.get('/', (req, res) => {
    res.send('Revival backend is successfully online!');
});

app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});
