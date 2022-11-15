import "./MoviesCardList.css";
import "../List/List.css";
import "../Button/Button.css";
import "../Hidden/Hidden.css";

import { useState, useEffect } from "react";
import MoviesCard from "../MoviesCard/MoviesCard";

function MoviesCardList({
  movies,
  isFilterOn,
  isLoading,
  setIsEmpty,
  showAllList,
  saveButton,
  deleteSavedMovie
}) {
  const [isAllShown, setIsAllShown] = useState(false);
  const [lessThenThree, setLessThenThree] = useState(false);
  const [moviesShown, setMoviesShown] = useState([]);
  const [moviesFiltered, setMoviesFiltered] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [cardsToShow, setCardsToShow] = useState({});

  // установить ширину экрана
  const getWindowWidth = () => {
    setTimeout(() => {
      setWindowWidth(window.innerWidth);
    }, 200);
  }

  //добавить ряд карточек 
  //при нажатии на кнопку Еще
  const handleMoreButton = () => {
    setCardsToShow({
      ...cardsToShow,
      current: cardsToShow.current + cardsToShow.add,
    })
  }

  // вычисление количества оборажаемых фильмов при изменении ширины
  const setNumberToShow = (initial, add) => {
    let number;

    //проверяем количество уже показанных карточек
    if (moviesShown.length > initial) {
      // если больше начального значения
      // проверяем кратность подгружаемым карточкам
      ((moviesShown.length - initial) % add) === 0
        // если кратно, выведем количество показанных карточек
        ? number = moviesShown.length
        // если не кратно, выведем количество показанных
        // с дополнением до целого ряда
        : number = initial + add * Math.ceil((moviesShown.length - initial) / add)
    } else {
      // если меньше начального значения
      //выведем начальное значение
      number = initial;
    }

    return number;
  }

  // задать количество выводимых карточек
  // в зависимости от ширины экрана
  useEffect(() => {
    switch (true) {
      case (windowWidth < 580):
        setCardsToShow({
          ...cardsToShow,
          current: setNumberToShow(5, 2),
          add: 2,
        })
        break;
      case (windowWidth < 995):
        setCardsToShow({
          ...cardsToShow,
          current: setNumberToShow(8, 2),
          add: 2,
        })
        break;
      default:
        setCardsToShow({
          ...cardsToShow,
          current: setNumberToShow(12, 3),
          add: 3,
        })
    }
  }, [windowWidth]);

  // задать массив отфильтрованных фильмов
  // и случатель размера экрана
  useEffect(() => {
    setMoviesShown([]);
    showAllList && setCardsToShow({ current: movies.length })
    isFilterOn
      ? setMoviesFiltered(movies.filter((element) => element.duration <= 40))
      : setMoviesFiltered(movies);

    window.addEventListener("resize", getWindowWidth);

    return () => window.removeEventListener("resize", getWindowWidth);
  }, [movies, isFilterOn]);

  // рендер выводимых фильмов
  useEffect(() => {
    setMoviesShown(moviesFiltered.slice(0, cardsToShow.current));
    moviesFiltered.length === 0
      ? setIsEmpty(true)
      : setIsEmpty(false);
  }, [moviesFiltered, cardsToShow]);

  // отображение кнопки Еще и меньше 3 карточек
  useEffect(() => {
    moviesShown.length === moviesFiltered.length
      ? setIsAllShown(true)
      : setIsAllShown(false);
    moviesShown.length < 3
      ? setLessThenThree(true)
      : setLessThenThree(false);
  }, [moviesShown]);

  return (
    <div className="movies-cards">
      <ul className={`list movies-card-list ${lessThenThree && "movies-card-list_less-then-three"} ${isLoading && "hidden"}`}>
        {moviesShown.map((element) => (
          <MoviesCard
            key={element.id || element._id}
            movie={element}
            saveButton={saveButton}
            deleteSavedMovie={deleteSavedMovie}
          />
        ))}
      </ul>
      <button
        className={`button movies-cards__more ${(isAllShown || isLoading) && "hidden"}`}
        type="button"
        onClick={handleMoreButton}>Ещё</button>
    </div >
  );
}

export default MoviesCardList;
