import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // async / await
  // to useEffect with this function as dependency we need to useCallback
  // with useCallback - we make sure that function
  // is not recreated unnecessarily
  const asyncMoviesHandler = useCallback(async () => {
    // async function asyncMoviesHandler() {
    setIsLoading(true);
    setError(null);

    // handling http errors
    try {
      const response = await fetch("https://swapi.dev/api/films/");

      // in async await we need to manually check status
      // and check error
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      const transformedMovies = data.results.map((movie) => {
        return {
          id: movie.episode_id,
          title: movie.title,
          openingText: movie.opening_crawl,
          releaseDate: movie.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    // finally
    setIsLoading(false);
  }, []);

  // fetch api
  // function fetchMoviesHandler() {
  // fetch("https://swapi.dev/api/films/")
  // .then((response) => {
  // return response.json();
  // })
  // .then((data) => {
  // const transformedMovies = data.results.map((movie) => {
  // return {
  // id: movie.episode_id,
  // title: movie.title,
  // openingText: movie.opening_crawl,
  // releaseDate: movie.release_date,
  // };
  // });
  // setMovies(transformedMovies);
  // });
  // }

  useEffect(() => {
    // call it not from useEffect - will create infinite loop
    // loop of rendering and re-evaluation
    // setting asyncMoviesHandler as a dependency
    // will prevent from not needed func executions
    asyncMoviesHandler();
  }, [asyncMoviesHandler]);

  let content = <p>Found no movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={asyncMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
        {/* {!isLoading && movies.length > 0 && !error && (<MoviesList movies={movies} />)}
{!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
{isLoading && <p>Loading...</p>}
{!isLoading && error && <p>{error}</p>} */}
      </section>
    </React.Fragment>
  );
}

export default App;
