const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to: ${req.url}`);
    next();
});

// 1. Tell the app it is on the correct version
app.get('/Game/GetCurrentVersion.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send('2.200.60733');
});

// 2. The Place Launcher: Tells the phone where to find the game file
app.get('/Game/PlaceLauncher.ashx', (req, res) => {
    res.set('Content-Type', 'text/xml');
    const host = req.get('host');
    const xmlResponse = `<?xml version="1.0" encoding="utf-8" ?>
<PlayResponse>
    <Status>2</Status>
    <JoinUrl>https://${host}/Game/Join.ashx</JoinUrl>
    <AuthenticationUrl></AuthenticationUrl>
</PlayResponse>`;
    res.send(xmlResponse);
});

// 3. The Join Script: Tells the 2015 engine how to build the map locally
app.get('/Game/Join.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const host = req.get('host');
    
    // This Lua script tells the 2015 mobile engine to load a map directly from your server
    const luaScript = `
    -- 2015 Mobile Bootstrapper
    local game = game
    local workspace = game:GetService("Workspace")
    
    -- Load the map file from your Render server static path
    game:Load("https://${host}/asset/SwordFightOnTheHeightsIV.rbxl")
    
    -- Spawn the local player
    local players = game:GetService("Players")
    local player = players:CreateLocalPlayer(0)
    player:LoadCharacter()
    
    -- Set classic 2015 lighting
    game:GetService("Lighting").Outlines = false
    `;
    res.send(luaScript);
});

// Base Route
app.get('/', (req, res) => { res.send('Your 2015 Revival Server is Fully Active!'); });

app.listen(PORT, () => { console.log(`Server active on port ${PORT}`); });
