const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// fixo-baileys is an ES Module ("type": "module"). Using require() on it throws
// ERR_REQUIRE_ESM, so we load it once with dynamic import() before the bot starts.
(async () => {
    try {
        global.baileys = await import('fixo-baileys');
    } catch (e) {
        console.error('❌ Failed to load fixo-baileys:', e);
        process.exit(1);
    }
    const pairRouter = require('./main');
    app.use('/', pairRouter);
    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });
})();

module.exports = app;
