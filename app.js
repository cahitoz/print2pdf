const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.get('/pdf', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Bitte gib eine URL an. Beispiel: ?url=https://example.com');
    }

    try {
        // Startet den Headless Browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Wichtig für Docker
        });

        const page = await browser.newPage();
        
        // Öffnet die Ziel-URL und wartet, bis das Netzwerk ruhig ist
        await page.goto(targetUrl, { waitUntil: 'networkidle2' });

        // Generiert das PDF (entspricht "Drucken als PDF")
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // Lädt Hintergrundfarben und Bilder mit
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
        });

        await browser.close();

        // Sendet das PDF direkt an den Browser zurück
        res.contentType("application/pdf");
        res.send(pdfBuffer);

    } catch (error) {
        console.error(error);
        res.status(500).send('Fehler bei der PDF-Generierung: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`PDF-Generator läuft auf http://localhost:${port}`);
});