require('dotenv').config()
const express = require('express')
const querystring = require('querystring')
const axios = require('axios')


const router = express.Router()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI || 'https://backend-spotify-1lz3.onrender.com/oauth/callback'


// Generate a random string for security

const randomString = (length) => {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

// login route

router.get('/login', (req, res) => {
    const state = randomString(16)
    res.cookie('spotify_auth_state', state)

    console.log("REDIRECT_URI sent to Spotify:", REDIRECT_URI);


    const scope = 'user-read-private user-read-email user-read-recently-played user-top-read'
    const authURL = `https://accounts.spotify.com/authorize?` +

        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
            state: state
        })
    res.redirect(authURL)
    })

// callback Route (exchanges Auth code for Token)

router.get('/callback', async (req, res) => {
    const code = req.query.code || null
    const state = req.query.state || null
    const storedState = req.cookies ? req.cookies['spotify_auth_state'] : null



    if (state === null || state !== storedState) {
        res.clearCookie('spotify_auth_state')
        return res.redirect('http://localhost:3000?error=state_mismatch')

    }

    res.clearCookie('spotify_auth_state')

        try {

            const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })



            const { access_token, refresh_token } = tokenResponse.data

            const FRONTEND_URL = process.env.FRONTEND_URL || 'https://r1ppl2.github.io/Spotify-Front/';
            res.redirect(`${FRONTEND_URL}#access_token=${access_token}&refresh_token=${refresh_token}`);
            

                
        } catch (error) {
            console.error("Error exchanging code for token", error)
            res.redirect('http://localhost:3000?error=invalid_token')
        }
 
})

// Refreshing the Access Token 


router.get('/refresh_token', async (req, res) => {
    const  refresh_token  = req.query.refresh_token

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            refresh_token: refresh_token,
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        }), {
            headers: {
                Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        
        res.json({ access_token })
    } catch (error) {
        console.error(error.response?.data, error)
        res.status(400).json({ error: 'Failed to refresh access token' })
    }
})

module.exports = router