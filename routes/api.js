const express = require('express')
const router = express.Router()
const axios = require('axios')

// Fetching data from spotify

const getListeningData = async (type, access_token, time_range) => {
    try {
        const url = `https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=50`
        const response = await axios.get(url, {headers: {Authorization: `Bearer ${access_token}`}})

        return response.data.items
    } catch (error) {
        console.log(`API error while feetching ${type}:`, error.response?.data || error.message)
        throw new Error(`Failed to fetch ${type}.`)
    }
}

//Route for top tracks

router.get('/top_tracks', async (req, res) => {

    console.log("✅ API /top_tracks was called"); // ✅ Ensure this prints
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ No valid authorization header provided");
        return res.status(401).json({ error: 'Access token is required' });
    }
    
    const access_token = authHeader.split(' ')[1];
    
    const time_range = req.query.time_range || 'short_term'

    console.log(`Fetching tracks for time_range: ${time_range}`); // ✅ Debug log

    if (!access_token) return res.status(400).json({error: 'Access token is required, Please provide valid Access Token'})

    try {
        const topTracks = await getListeningData('tracks', access_token, time_range)
        console.log(`Top tracks fetched:`, topTracks.map(track => track.name)); // ✅ Log track names
        res.json(topTracks)
    } catch(error) {
        res.status(500).json({error: error.message })
    }
})

//Route for Top artists

router.get('/top_artists', async (req, res) => {
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ No valid authorization header provided");
        return res.status(401).json({ error: 'Access token is required' });
    }
    
    const access_token = authHeader.split(' ')[1];
    
    const time_range = req.query.time_range || 'short_term'

    if (!access_token) return res.status(400).json({error: 'Access token is required, Please provide valid Access Token'})

    try {
        const topArtists = await getListeningData('artists', access_token, time_range)
        console.log(`Top tracks fetched:`, topArtists.map(artist => artist.name)); // ✅ Log s names
        res.json(topArtists)
    } catch(error) {
        res.status(500).json({error: error.message })
    }
})

//Route to Top Genres

router.get('/top_genres', async (req, res) => {
    const access_token = req.headers.authorization?.split(' ')[1];
    const time_range = req.query.time_range || 'short_term';
    if (!access_token) return res.status(400).json({error: 'Access token is required, Please provide valid Access Token'})

    try {
        const topArtists = await getListeningData('artists', access_token, time_range)

        const genreCounts = {}
        topArtists.forEach(artist => {
            artist.genres.forEach(genre => {
                genreCounts[genre] = (genreCounts[genre] || 0)+1
            })
        })
        const sortedGenres = Object.entries(genreCounts)
        .sort((a,b)=> b[1] - a[1])
        .map(([genre, count]) => ({genre,count}))

        res.json(sortedGenres)
    } catch (error) {
        res.status(500).json({error: error.message})
    }

      })



module.exports = router

