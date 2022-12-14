import "./MoviesCard.css";
import "../Button/Button.css";

import { useEffect, useState, useContext } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { URL_IMG_MOVIE } from "../../constants/constants";

import moviesCardDelete from "../../images/movies-card-delete.svg";
import moviesCardMark from "../../images/movies-card-mark.svg";

function MoviesCard({
  movie,
  saveButton,
  deleteSavedMovie,
  handleMovieSave,
  handleMovieDelete
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { savedMovies } = useContext(CurrentUserContext);

  const handleMouseOver = () => {
    setIsVisible(true);
  }
  const handleMouseOut = () => {
    setIsVisible(false);
  }

  const handleClick = (e) => {
    if (e.target.className === "movie-card__image") {
      window.open(movie.trailerLink);
    }
  }

  // обработка кнопки Сохранить
  const handleSaveButton = () => {
    handleMovieSave(movie)
      .then(() => {
        setIsSaved(true)
      })
      .catch(err => console.log(err));
  }

  // получение _id сохраненного фильма 
  // по нажатию на карточку без поля _id
  const getCardId = () => {
    const movieToDelete = savedMovies.find(el => el.id === movie.id);
    return movieToDelete._id;
  }

  // обработка кнопки Удалить
  const handleDeleteButton = () => {
    const cardId = getCardId();

    handleMovieDelete(cardId)
      .then(() => {
        setIsSaved(false);
        // удаление фильма из DOM странице Сохраненных фильмов
        // без кнопки Сохранить
        !saveButton && deleteSavedMovie(cardId);
      })
      .catch(err => console.log(err));
    setIsSaved(false)
  }

  // отображение кнопки сохранено/удаление
  useEffect(() => {
    const savedMoviesIds = savedMovies.map(el => { return el.id });
    (savedMoviesIds.includes(movie.id) ? true : false) && setIsSaved(true);
  }, [savedMovies])

  return (
    <li
      className="movies-card"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={handleClick}
    >
      <button
        type="button"
        aria-label={"Сохранить"}
        className={`button movies-card__button movies-card__button_save 
        ${(saveButton && isVisible && !isSaved) && "movies-card__button_visible"}`}
        onClick={handleSaveButton}
      >
        Сохранить
      </button>
      <button
        type="button"
        aria-label="Удалить"
        className={`button movies-card__button movies-card__button_${(saveButton) ? "saved" : "delete"} 
        ${((saveButton && isSaved) || (!saveButton && isVisible)) && "movies-card__button_visible"}`}
        onClick={handleDeleteButton}
      >
        {saveButton
          ? <img className="movies-card__mark" src={moviesCardMark} alt="Отметка" />
          : <img className="movies-card__delete" src={moviesCardDelete} alt="Отметка" />
        }
      </button>
      <div className="movie-card__image-container" >
        <img
          className="movie-card__image"
          src={`${saveButton ? URL_IMG_MOVIE + movie.image.url : movie.image}`}
          alt={movie.nameEN}
        />
      </div >
      <div className="movie-card__lable">
        <p className="movie-card__name">{movie.nameRU}</p>
        <p className="movie-card__duraiton">{Math.floor(movie.duration / 60)}ч {movie.duration % 60}м</p>
      </div>
    </li >
  );
}

export default MoviesCard;
