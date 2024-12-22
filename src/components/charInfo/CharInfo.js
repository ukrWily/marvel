import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";
import "./charInfo.scss";
import MarvelService from "../../services/MarvelService";

const CharInfo = (props) => {
  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    updateChar();
  }, []);

  useEffect((prevProps) => {
    if (this.props.charId !== prevProps.charId) updateChar();
  });

  /**
   *  хук життевого циклу
   * запускається коли компонент создан на сторінці
   */
  // componentDidMount() {
  //   this.updateChar();
  // }
  // componentDidUpdate(prevProps) {
  //   /**
  //    * Перевіряємо чи змінився ID щоб не було безкінечного циклу
  //    */
  //   if (this.props.charId !== prevProps.charId) {
  //     this.updateChar();
  //   }
  // }

  const updateChar = () => {
    const { charId } = props;
    if (!charId) {
      return;
    }

    onCharLoading();

    marvelService.getCharacter(charId).then(onCharLoaded).catch(onError);
  };

  const onCharLoaded = (char) => {
    this.setState({
      char,
      loading: false,
    });
  };

  const onCharLoading = () => {
    setLoading(false);
  };

  const onError = () => {
    setLoading(false);
    setError(true);
  };

  const skeleton = char || loading || error ? null : <Skeleton />;

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <div className="char__info">
      {skeleton}
      {errorMessage}
      {spinner}
      {content}
    </div>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, Wiki, comics } = char;

  let imgStyle = thumbnail.includes("not_available")
    ? { objectFit: "contain" }
    : {};
  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} style={imgStyle} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={Wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : "No comics available"}
        {comics.map((item, i) => {
          if (i < 10) {
            return (
              <li key={i} className="char__comics-item">
                {item.name}
              </li>
            );
          }
        })}
      </ul>
    </>
  );
};

/**
 * props validation
 */
CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;
