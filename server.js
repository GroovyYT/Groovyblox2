const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Logger Tracker: Prints mobile traffic live into your Render dashboard logs
app.use((req, res, next) => {
    console.log(`[App Connection] Mobile phone pinging endpoint path: ${req.url}`);
    next();
});

// 2. Client Version Authorization: Keeps the 2015 app unlocked
app.get('/Game/GetCurrentVersion.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send('2.200.60733');
});

// 3. The Core Joint Script Bootstrapper: Compiles your custom level map structure
app.get('/Game/Join.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const host = req.get('host');
    
    const luaScript = `
    -- 2015 Mobile Engine Initializer
    local game = game
    local workspace = game:GetService("Workspace")
    
    -- Stream map binaries straight from your GitHub asset directory
    game:Load("https://${host}/asset/SwordFightOnTheHeightsIV.rblx")
    
    -- Generate local player character configuration properties
    local players = game:GetService("Players")
    local player = players:CreateLocalPlayer(0)
    player:LoadCharacter()
    
    -- Optimize rendering performance pipelines
    game:GetService("Lighting").Outlines = false
    `;
    res.send(luaScript);
});

// 4. THE ULTIMATE AUTO-PLAY BYPASS: Forces any standard webpage requests to immediately trigger game execution!
app.use((req, res, next) => {
    // If the old app is asking for the base index page, home layouts, or asset category menus...
    if (!req.url.includes('Join.ashx') && !req.url.includes('GetCurrentVersion.ashx') && !req.url.includes('/asset/')) {
        console.log(`[Auto-Play Trigger] Forcing game launch sequence on input request: ${req.url}`);
        
        // Return the precise XML schema that initiates client map generation natively
        res.set('Content-Type', 'text/xml');
        const host = req.get('host');
        const xmlResponse = `<?xml version="1.0" encoding="utf-8" ?>\n<PlayResponse>\n    <Status>2</Status>\n    <JoinUrl>https://${host}/Game/Join.ashx</JoinUrl>\n    <AuthenticationUrl></AuthenticationUrl>\n</PlayResponse>`;
        return res.send(xmlResponse);
    }
    next();
});

// Launch container listener engine smoothly
app.listen(PORT, () => { 
    console.log(`Server running smoothly on port ${PORT}`); 
});
