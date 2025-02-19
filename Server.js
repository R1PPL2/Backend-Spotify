
const express = require ('express')
const app = express () 
const cookieParser = require ('cookie-parser')
const port = process.env.PORT || 4000
const cors = require ('cors')

require ('dotenv') .config ()

// middleware


const allowedOrigins = [
    'http://localhost:3000',  // ✅ Allow local testing
    'https://r1ppl2.github.io',  // ✅ Allow GitHub Pages
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


// ✅ Manually Add CORS Headers for All Responses
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Allow preflight requests
    }
    next();
});



app.use (cookieParser ())
app.use(express.json())
app.use(express.static('public'))
app.use(cors())
app.use(cors({ origin: 'https://r1ppl2.github.io/Spotify-Front/' }));




app.use((req, res, next) => {
    next();
});

a

// ✅ Check if CORS Headers Are Applied Correctly
app.get('/test-cors', (req, res) => {
    res.json({ message: 'CORS is working!' });
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

    

    