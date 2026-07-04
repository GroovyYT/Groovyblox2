const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to: ${req.url}`);
    next();
});

app.get('/Game/GetCurrentVersion.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send('2.200.60733');
});

app.get('/Game/PlaceLauncher.ashx', (req, res) => {
    res.set('Content-Type', 'text/xml');
    const joinUrl = `https://${req.get('host')}/Game/Join.ashx?placeId=${req.query.placeId || 0}`;
    const xmlResponse = `<?xml version="1.0" encoding="utf-8" ?>\n<PlayResponse>\n    <Status>2</Status>\n    <JoinUrl>${joinUrl}</JoinUrl>\n    <AuthenticationUrl></AuthenticationUrl>\n</PlayResponse>`;
    res.send(xmlResponse);
});

app.get('/Game/Join.ashx', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const luaScript = `-- Legacy Join Script\nlocal client = game:GetService("NetworkClient")\nclient:Connect("127.0.0.1", 53640)\n`;
    res.send(luaScript);
});

app.get('/', (req, res) => {
    res.send('Revival backend is successfully online!');
});

app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});
