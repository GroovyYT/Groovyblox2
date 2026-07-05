const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// This is the logger line block
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to: ${req.url}`);
    next();
});

// The Catch-All Redirect: This forces the app to show your games page instead of a 404 error
app.use((req, res, next) => {
    if (!req.url.includes('.ashx') && req.url !== '/games' && req.url !== '/') {
        return res.redirect('/games');
    }
    next();
});

// 1. Version Check Endpoint
app.get('/Game/GetCurrentVersion.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send('2.200.60733');
});

// 2. Place Launcher Endpoint
app.get('/Game/PlaceLauncher.ashx', (req, res) => {
    res.set('Content-Type', 'text/xml');
    const host = req.get('host');
    const xmlResponse = `<?xml version="1.0" encoding="utf-8" ?>\n<PlayResponse>\n    <Status>2</Status>\n    <JoinUrl>https://${host}/Game/Join.ashx</JoinUrl>\n    <AuthenticationUrl></AuthenticationUrl>\n</PlayResponse>`;
    res.send(xmlResponse);
});

// 3. Game Join Script Endpoint
app.get('/Game/Join.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const host = req.get('host');
    const luaScript = `-- 2015 Mobile Bootstrapper\nlocal game = game\nlocal workspace = game:GetService("Workspace")\ngame:Load("https://${host}/asset/SwordFightOnTheHeightsIV.rbxl")\nlocal players = game:GetService("Players")\nlocal player = players:CreateLocalPlayer(0)\nplayer:LoadCharacter()\ngame:GetService("Lighting").Outlines = false\n`;
    res.send(luaScript);
});

// 4. Base Route
app.get('/', (req, res) => { 
    res.send('Your 2015 Revival Server is Fully Active!'); 
});

// 5. Custom Games Page
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
                <button class="play-btn" onclick="window.location.href='robloxmobile://placeID=1'">IGRAJ</button>
            </div>
        </body>
        </html>
    `);
});

// Start the server cleanly
app.listen(PORT, () => { 
    console.log(`Server running smoothly on port ${PORT}`); 
});
