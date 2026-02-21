import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/Appcontext'

const MovieFeatured = () => {
  const { shows } = useAppContext()
  const navigate = useNavigate()

  return (
    <div className="px-6 md:px-8 lg:px-16 xl:px-20 py-10">
      <div className="relative flex items-center justify-between pt-20 pb-5">
        <BlurCircle top="0" right="-40px" />
        <p className="text-gray-300 font-medium text-lg">
          Now Showing
        </p>
        <button
          onClick={() => navigate('/movies')}
          className="flex items-center gap-2 text-sm text-gray-300"
        >
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-8 mt-8">
        {shows.length === 0 && (
          <p className="text-gray-400">
            No shows available
          </p>
        )}

        {shows.slice(0, 4).map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

export default MovieFeatured
