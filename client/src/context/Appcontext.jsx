import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth, useUser } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [shows, setShows] = useState([]);
  const [favorites, setFavorites] = useState([]);
const [nowPlaying, setNowPlaying] = useState([]);

  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // ✅ HOME PAGE MOVIES
  const fetchshows = async () => {
    try {
      const { data } = await axios.get("/api/show/getmovies");
      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
// ✅ IMDB NOW PLAYING MOVIES (HOME PAGE)
const fetchNowPlaying = async () => {
  try {
    const { data } = await axios.get('/api/show/nowplaying', {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });

    console.log('NOW PLAYING:', data);

    if (data.success) {
      setNowPlaying(data.movies);
    }
  } catch (error) {
    console.log(error);
  }
};


  // ✅ USER FAVORITES (ONLY WHEN LOGGED IN)
  const fetchfavorites = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get("/api/user/getfavorites", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setFavorites(data.movies);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchshows();
  }, []);
useEffect(() => {
  fetchNowPlaying();
}, []);

  useEffect(() => {
    fetchfavorites();
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        axios,
        user,
        navigate,
        getToken,
        shows,
        favorites,
         nowPlaying, 
        setFavorites,
        fetchfavorites,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
