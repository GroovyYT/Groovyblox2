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
    
    // This Lua script tells the 2015 mobile engine to load your uploaded map file
    const luaScript = `
    -- 2015 Mobile Bootstrapper
    local game = game
    local workspace = game:GetService("Workspace")
    
    -- Load the map file from your Render server asset path
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
// 4. Stranica s igrama (Games Page) koja popravlja 404 grešku
app.get('/games', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { background-color: #EEEEEE; font-family: sans-serif; text-align: center; padding: 20px; }
                .game-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: inline-block; width: 80%; max-width: 300px; margin-top: 20px; }
                .play-btn { background-color: #0084FF; color: white; border: none; padding: 10px 20px; font-size: 18px; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 15px; }
                h1 { color: #333; font-size: 22px; }
            </style>
        </head>
        <body>
            <h1>Groovyblox Games</h1>
            <div class="game-card">
                <h3 style="margin:0;">Moj Prvi 2015 Server</h3>
                <p style="color:#666; font-size:14px;">Klikni ispod za ulazak u tvoju custom mapu!</p>
                <!-- Ovaj gumb šalje signal aplikaciji da pokrene join skriptu -->
                <button class="play-btn" onclick="window.location.href='robloxmobile://placeID=1'">IGRAJ</button>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => { console.log(`Server active on port ${PORT}`); });
