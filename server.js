const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.get('/pdf', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Error: Please provide a URL. Example: /pdf?url=https://example.com');
    }

    let browser;
    try {
        // Launch headless browser (no-sandbox is required for running inside Docker)
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true
        });

        const page = await browser.newPage();
        
        // Go to the URL and wait for network connections to finish
        await page.goto(targetUrl, { waitUntil: 'networkidle0' });

        // Generate the PDF
        const pdf = await page.pdf({ format: 'A4', printBackground: true });

        // Send the PDF back to the client
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdf.length
        });
        res.send(pdf);

    } catch (error) {
        console.error(error);
        res.status(500).send(`Error generating PDF: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(port, () => {
    console.log(`PDF Generator listening on port ${port}`);
});