import axios from 'axios'
import Movie from '../models/Movie.js'
import Show from '../models/Show.js'
import { inngest } from '../Inngest/index.js'
import 'dotenv/config';
// ===============================
// Get 250 top movies from IMDB
// ===============================
export const getnowplayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://imdb236.p.rapidapi.com/api/imdb/most-popular-movies',
      {
        headers: {
          'x-rapidapi-host': 'imdb236.p.rapidapi.com',
          'x-rapidapi-key': process.env.X_RAPIAPI_KEY,
        },
      }
    )

    res.json({ success: true, movies: data })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// ===============================
// Admin: Add show
// ===============================

export const addshow = async (req, res) => {
  try {

    const { movieId, showsInput, showprice } = req.body

    // 1️⃣ Find movie in DB (movieId = IMDB id)
    let movie = await Movie.findById(movieId)

    // 2️⃣ If movie not found, fetch from IMDB & save
    if (!movie) {
      const moviedataResponse = await axios.get(
        `https://imdb236.p.rapidapi.com/api/imdb/${movieId}`,
        {
          headers: {
            'x-rapidapi-host': 'imdb236.p.rapidapi.com',
            'x-rapidapi-key': process.env.X_RAPIAPI_KEY,
          },
        }
      )

      const moviedata = moviedataResponse.data

      movie = await Movie.create({
        _id: moviedata.id, // IMDB id saved as _id
        originalTitle: moviedata.originalTitle,
        description: moviedata.description,
        primaryImage: moviedata.primaryImage,
        thumbnails: moviedata.thumbnails,
        trailer: moviedata.trailer,
        releaseDate: moviedata.releaseDate,
        original_language: moviedata.spokenLanguages,
        genres: moviedata.genres,
        casts: moviedata.cast,
        averageRating: moviedata.averageRating,
        runtime: moviedata.runtimeMinutes,
        numVotes: moviedata.numVotes,
      })
    }

    // 3️⃣ Create shows (IMPORTANT FIX HERE)
    const showstoCreate = showsInput.map((show) => {
      const datetimeString = `${show.date}T${show.time}`

      return {
        movie: movieId,  
        showDateTime: new Date(datetimeString),
        showprice,
        occupiedSeats: {},
      }
    })

    // 4️⃣ Insert shows
    await Show.insertMany(showstoCreate)

    // 5️⃣ Inngest event (video-style)
    await inngest.send({
      name: 'app/show.added',
      data: { movieId: movie._id },
    })

    res.json({ success: true, message: 'Show(s) added successfully.' })
  } catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
  }
}

// ===============================
// Get all unique movies with future shows
// ===============================
export const getmovies = async (req, res) => {
  try {
    const shows = await Show.find({
      showDateTime: { $gte: new Date() },
    })
      .populate('movie')
      .sort({ showDateTime: 1 })

    const uniqueMovies = [
      ...new Map(shows.map((s) => [s.movie._id.toString(), s.movie])).values(),
    ]

    res.json({ success: true, shows: uniqueMovies })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// ===============================
// Get single movie + its shows
// ===============================
export const getmovie = async (req, res) => {
  try {
    const { movieId } = req.params

    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    })

    const movie = await Movie.findById(movieId)

    const datetime = {}

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split('T')[0]
      if (!datetime[date]) datetime[date] = []
      datetime[date].push({
        time: show.showDateTime,
        showId: show._id,
      })
    })

    res.json({ success: true, movie, datetime })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
