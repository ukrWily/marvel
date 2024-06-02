import { createRoot } from "react-dom/client";
import App from "./components/app/App";
import MarvelService from "./services/MarvelService";
import "./style/style.scss";

const container = document.getElementById("root");
const root = createRoot(container);
const marvelService = new MarvelService();
marvelService
  .getAllCharacters()
  .then((res) =>
    console.log(res.data.results.forEach((item) => console.log(item.name)))
  );

root.render(<App />);
