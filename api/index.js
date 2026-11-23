require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '150kb' }));

app.use('/api', require('../lib/helpers/router'));

app.use(
    express.static(path.resolve(__dirname, '..'), {
        dotfiles: 'ignore',
        index: 'index.html'
    })
);

app.use('/api', (req, res) =>
    res.status(404).json({ error: 'API endpoint not found' })
);

app.use((req, res) =>
    res.status(404).sendFile(path.resolve(__dirname, '../404.html'))
);

// Error-handling middleware must remain after the routes.
app.use((err, req, res, next) => {
    console.error('\n=== ZIVARA ERROR ===');
    console.error('Method:', req.method);
    console.error('URL:', req.originalUrl);
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('Detail:', err.detail);
    console.error('Position:', err.position);
    console.error('Where:', err.where);
    console.error('Stack:', err.stack);

    if (res.headersSent) {
        return next(err);
    }

    res.status(
        err.status || (err.code === '23503' ? 400 : 500)
    ).json({
        error: err.status
            ? err.message
            : err.code === '23503'
                ? 'Invalid linked record'
                : 'Server error. Check database configuration or logs.'
    });
});

if (require.main === module) {
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`Zivara Jewellery running on port ${port}`);
    });
}

module.exports = app;