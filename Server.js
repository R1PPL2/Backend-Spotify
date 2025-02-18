
const express = require ('express')
const app = express () 
const cookieParser = require ('cookie-parser')
const port = process.env.PORT || 4000
const cors = require ('cors')

require ('dotenv') .config ()

// middleware

app.use (cors (
    {
        origin: 'https://r1ppl2.github.io/Spotify-Front/',
        credentials: true,
    }
))

app.use (cookieParser ())
app.use(express.json())
app.use(express.static('public'))
app.use(cors())
app.use(cors({ origin: 'https://r1ppl2.github.io/Spotify-Front/' }));


app.use((req, res, next) => {
    next();
});

// Imports routes 
const apiRoutes = require ('./routes/api')
const oauthRoutes = require ('./routes/Oauth')

app.use ('/api', apiRoutes)
app.use ('/oauth', oauthRoutes)


app.use(require('./routes/api'))
app.use(require('./routes/Oauth'))


//Start server

app.listen (port, () => {
    console.log (`Server is running on port ${[port]}`)
    })

    

    