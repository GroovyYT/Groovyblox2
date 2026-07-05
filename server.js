const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// HTML kod za sučelje s gumbom (izvučen u varijablu radi lakšeg korištenja)
const gamesHtmlLayout = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { background-color: #EEEEEE; font-family: sans-serif; text-align: center; padding: 20px; margin: 0; }
        .game-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: inline-block; width: 85%; max-width: 300px; margin-top: 30px; }
        .play-btn { background-color: #0084FF; color: white; border: none; padding: 12px 20px; font-size: 18px; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 15px; font-weight: bold; }
        h1 { color: #333; font-size: 24px; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>Groovyblox Games</h1>
    <div class="game-card">
        <h3 style="margin:0; color:#222;">Sword Fight On The Heights IV</h3>
        <p style="color:#666; font-size:14px; margin-top:8px;">Klikni ispod za ulazak u tvoju custom mapu!</p>
        <button class="play-btn" onclick="window.location.href='robloxmobile://placeID=1'">IGRAJ</button>
    </div>
</body>
</html>
`;

// 1. Logger: Prati zahtjeve u Render konzoli
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to: ${req.url}`);
    next();
});

// 2. Provjera verzije (Version Check)
app.get('/Game/GetCurrentVersion.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send('2.200.60733');
});

// 3. Pokretač mjesta (Place Launcher)
app.get('/Game/PlaceLauncher.ashx', (req, res) => {
    res.set('Content-Type', 'text/xml');
    const host = req.get('host');
    const xmlResponse = `<?xml version="1.0" encoding="utf-8" ?>\n<PlayResponse>\n    <Status>2</Status>\n    <JoinUrl>https://${host}/Game/Join.ashx</JoinUrl>\n    <AuthenticationUrl></AuthenticationUrl>\n</PlayResponse>`;
    res.send(xmlResponse);
});

// 4. Skripta za ulazak u igru (Join Script)
app.get('/Game/Join.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const host = req.get('host');
    const luaScript = `-- 2015 Mobile Bootstrapper\nlocal game = game\nlocal workspace = game:GetService("Workspace")\ngame:Load("https://${host}/asset/SwordFightOnTheHeightsIV.rblx")\nlocal players = game:GetService("Players")\nlocal player = players:CreateLocalPlayer(0)\nplayer:LoadCharacter()\ngame:GetService("Lighting").Outlines = false\n`;
    res.send(luaScript);
});

// 5. Glavna ruta '/'
app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send(gamesHtmlLayout);
});

// 6. Rezervna ruta '/games' (za svaki slučaj ako APK eksplicitno traži ovaj direktorij)
app.get('/games', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send(gamesHtmlLayout);
});

// 7. PAMETNI CATCH-ALL: Umjesto res.redirect, odmah šaljemo HTML izgled!
app.use((req, res, next) => {
    if (!req.url.includes('.ashx') && !req.url.includes('/asset/')) {
        res.set('Content-Type', 'text/html');
        return res.send(gamesHtmlLayout);
    }
    next();
});

// Pokretanje poslužitelja
app.listen(PORT, () => { 
    console.log(`Server running smoothly on port ${PORT}`); 
});
