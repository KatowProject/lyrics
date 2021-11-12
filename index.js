const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const genius = new (require('genius-lyrics')).Client("rNig9l_7BgfsqLwbKHK_yWjS8sv5U1aC8UgQVd0YHaFD_LgNKZXo-rUY2VAPGuJC");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Rest-API'
    });
});

app.get('/search/:query', async (req, res) => {
    const temp = [];
    const query = req.params.query;
    const length = req.query.length;

    const response = await genius.songs.search(query);
    if (typeof parseInt(length) === 'number' && length > 0 && length <= response.length) {
        const songs = response.slice(0, length);
        for (const song of songs) {
            song.raw.lyrics = await song.lyrics();
            temp.push(song.raw);
        }

        return res.json({
            success: true,
            data: temp
        });
    }

    for (const song of response) {
        song.raw.lyrics = await song.lyrics();
        temp.push(song.raw);
    }

    return res.json({
        success: true,
        data: temp
    });
});

app.listen(process.env.PORT || 3010, () => console.log('Server started on port 3010'));