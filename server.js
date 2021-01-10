require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIES = require('./movies-data-small.json');

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
console.log(process.env.API_TOKEN);

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;
    console.log('validate bearer token middleware');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
             return res.status(401).json({ error: 'Unauthorized request' });
           }

    // move to the next middleware
    next();
})

function handleGetMovies(req, res) {
    let response = MOVIES;
    if (req.query.genre) {
        response = response.filter(movie =>
          // case insensitive searching
          movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        );
      }
    
    // filter our movie by country if country query param is present
    if (req.query.country) {
      response = response.filter(movie =>
        movie.country.toLowerCase().includes(req.query.country.toLowerCase())
      );
    }

    if (req.query.avg_vote) {
      response = response.filter(movie =>
        movie.avg_vote >= Number(req.query.avg_vote)
      );
    }
    
      res.json(response);
    }

app.get('/movie', handleGetMovies);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})