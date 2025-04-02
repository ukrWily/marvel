import { useHttp } from "../hooks/http.hook";

// Кастомний хук для роботи з API Marvel
const useMarvelService = () => {
  // Використовуємо кастомний хук useHttp для виконання HTTP-запитів
  const { loading, request, error, clearError } = useHttp();
  // Базовий URL для API Marvel
  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  // Ваш API-ключ для доступу до Marvel API (цей ключ може бути неактивним)
  const _apiKey = "apikey=c378525808b888c20f7a8738851c9a68";
  // Базове значення offset для пагінації
  const _baseOffset = 210;

  // Функція для отримання списку всіх персонажів з API
  const getAllCharacters = async (offset = _baseOffset) => {
    // Виконуємо запит до API з вказаним offset
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
    );
    // Повертаємо трансформовані дані персонажів
    return res.data.results.map(_transformCharacter);
  };

  // Функція для отримання даних конкретного персонажа за його ID
  const getCharacter = async (id) => {
    // Виконуємо запит до API для отримання даних персонажа
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    // Повертаємо трансформовані дані персонажа
    return _transformCharacter(res.data.results[0]);
  };

  // Приватна функція для трансформації даних персонажа у зручний формат
  const _transformCharacter = (char) => {
    return {
      id: char.id, // ID персонажа
      name: char.name, // Ім'я персонажа
      description: char.description
        ? `${char.description.slice(0, 210)}...` // Обрізаємо опис до 210 символів
        : "There is no description for this character", // Якщо опису немає, повертаємо повідомлення
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension, // URL до зображення персонажа
      homepage: char.urls[0].url, // Посилання на домашню сторінку персонажа
      wiki: char.urls[1].url, // Посилання на сторінку персонажа у Wiki
      comics: char.comics.items, // Список коміксів, у яких з'являється персонаж
    };
  };

  // Повертаємо об'єкт із станами та функціями для роботи з API
  return {
    loading, // Стан завантаження
    error, // Стан помилки
    getAllCharacters, // Функція для отримання всіх персонажів
    getCharacter, // Функція для отримання конкретного персонажа
  };
};

export default useMarvelService; // Експортуємо хук для використання в інших компонентах
