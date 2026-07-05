const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Logger: Prati što točno mobitel traži
app.use((req, res, next) => {
    console.log(`[Klijent Traži]: ${req.url}`);
    next();
});

// 2. Glavni v2015 Bootstrapper - Popravlja zamrzavanje početnog ekrana!
app.get('/Setting/QuietGet/ClientAppSettings/', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send({
        "FFlagConnectMobileToCustomServer": "True",
        "DFFlagDisableNewInGameChat": "True"
    });
});

// 3. Provjera verzije (Version Check)
app.get('/Game/GetCurrentVersion.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send('2.200.60733');
});

// 4. Place Launcher: Automatski presreće "Play Now" i pokreće igru
app.get('/Game/PlaceLauncher.ashx', (req, res) => {
    res.set('Content-Type', 'text/xml');
    const host = req.get('host');
    res.send(`<?xml version="1.0" encoding="utf-8" ?>\n<PlayResponse>\n    <Status>2</Status>\n    <JoinUrl>https://${host}/Game/Join.ashx</JoinUrl>\n    <AuthenticationUrl></AuthenticationUrl>\n</PlayResponse>`);
});

// 5. Join Script: Učitava tvoj SwordFight file s GitHuba
app.get('/Game/Join.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const host = req.get('host');
    const luaScript = `-- 2015 Mobile Initializer\nlocal game = game\nlocal workspace = game:GetService("Workspace")\ngame:Load("https://${host}/asset/SwordFightOnTheHeightsIV.rblx")\nlocal players = game:GetService("Players")\nlocal player = players:CreateLocalPlayer(0)\nplayer:LoadCharacter()\ngame:GetService("Lighting").Outlines = false\n`;
    res.send(luaScript);
});

// 6. Catch-All Web: Što god aplikacija zatraži na webu, šaljemo joj XML za pokretanje igre!
app.use((req, res, next) => {
    if (!req.url.includes('.ashx') && !req.url.includes('/asset/') && req.url !== '/Setting/QuietGet/ClientAppSettings/') {
        res.set('Content-Type', 'text/xml');
        const host = req.get('host');
        return res.send(`<?xml version="1.0" encoding="utf-8" ?>\n<PlayResponse>\n    <Status>2</Status>\n    <JoinUrl>https://${host}/Game/Join.ashx</JoinUrl>\n    <AuthenticationUrl></AuthenticationUrl>\n</PlayResponseblank>`);
    }
    next();
});

app.listen(PORT, () => { 
    console.log(`Server running smoothly on port ${PORT}`); 
});
