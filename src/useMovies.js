import { useState, useEffect } from "react";

const KEY = "312224b7";

export function useMovies(query, callback){
    const [movies, setMovies] = useState([]);
    // const [watched, setWatched] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch movie data as component mounts ,dependency array:  [] ->  during initial render, [query] -> initial and when query state is changed
      useEffect(function() {
        callback?.();

        // To cancel multiple requests: e.g. inc, ince, incep -> only want last
        const controller = new AbortController();
    
        async function fetchMovies() {
          try {
            setIsLoading(true);
            setError('');
            const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal});
    
            if (!res.ok) throw new Error("Something went wrong with fetching movies");
    
            const data = await res.json();
            if (data.Response === 'False') throw new Error('Movie not found');
    
            setMovies(data.Search);
            setError("");
          } catch (err) {
            
            if(err.name !== "AbortError"){ 
              setError(err.message);
              console.log(err.message);
            }
          } finally {
            setIsLoading(false);
          }
        }
    
        if (query.length < 3){
          setMovies([]);
          setError('');
          return ;
        }
    
        
        fetchMovies();
    
        return function() {
          controller.abort();
        }
      }, [query]);

      return {movies, isLoading, error};
}