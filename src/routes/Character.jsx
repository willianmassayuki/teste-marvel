import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";
import SearchInput from "../components/SearchInput";
import "../styles/character.scss";

const Character = () => {
  const location = useLocation();
  const characterId = location.pathname.split("/")[2]; // Obtém o ID do personagem da URL
  const [characterData, setCharacterData] = useState(null);
  const [lancamentos, setLancamentos] = useState([]);
  const [comics, setComics] = useState(null);

  //Refatorar
  const [text, setText] = useState("");
  const [favoritos, setFavoritos] = useState([]);

  // Refatorar
  // Adiciona ou retira um id e personagem da lista de favoritos
  function toggleFav(id) {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((favId) => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  }

  // Se existirem dados armazenados, converter de volta para objeto e definir no estado favoritos
  useEffect(() => {
    const dadosArmazenados = localStorage.getItem("favoritos");
    if (dadosArmazenados) {
      setFavoritos(JSON.parse(dadosArmazenados));
      console.log(dadosArmazenados);
    }
  }, []);

  //Atualização do localstorage toda vez que favoritos for alterado
  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    console.log(favoritos);
  }, [favoritos]);

  // Identifica o nome de dez lançamentos de quadrinhos do personagem
  useEffect(() => {
    if (characterData) {
      const launchItems = characterData.comics.items.slice(0, 10);
      const launchData = launchItems.map((item) => item.resourceURI);
      setLancamentos(launchData);

      // Pega o endpoint de cada quadrinho
      const transformedArray = launchData.map((url) => {
        const parts = url.split("/");
        return `comics/${parts[parts.length - 1]}`;
      });

      async function fetchComicsData() {
        try {
          // Inicializar um array para guardar os dados de comics
          const comicsData = [];

          // Fazer uma requisição para cada Endpoint presente no array comics
          for (const endpoint of transformedArray) {
            const response = await api.get(`${endpoint}`);
            comicsData.push(response.data);
          }

          // Atualizar o estado dos dados com os dados de comics obtidos
          setComics((prevComics) => ({
            data: {
              ...prevComics,
              results: [...comicsData.map((item) => item.data.results[0])],
            },
          }));
          console.log(comics.data.results);
          //setDados(comicsData);
          //console.log(comicsData[0].data?.results);
        } catch (error) {
          console.error(
            "Ops! Ocorreu um erro ao obter dados de comics:",
            error
          );
        }
      }

      fetchComicsData();
    }
  }, [characterData]);

  // Traz os dados do personagem específico
  useEffect(() => {
    api
      .get(`characters/${characterId}`)
      .then((response) => {
        setCharacterData(response.data.data.results[0]);
        console.log(characterData);
      })
      .catch((err) => {
        console.error(
          "Ops! Ocorreu um erro ao obter dados do personagem:",
          err
        );
      });
  }, [characterId]);

  return (
    <>
      <div className="alt-header">
        <img
          className="top-logo"
          src="/assets/logo/Group.png"
          alt="Logo Marvel Search Heroes"
        />
        <SearchInput value={text} onChange={(search) => setText(search)} />
      </div>
      {characterData ? (
        <div className="body-container">
          <div className="upper-container">
            <div className="left-container">
              <h1>{characterData.name}</h1>

              {
                //Refatorar
                favoritos.includes(characterData?.id) ? (
                  <button onClick={() => toggleFav(characterData?.id)}>
                    <img
                      src="/assets/icones/heart/Path.svg"
                      alt="Mostrar Favoritos"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => toggleFav(characterData?.id)}
                    disabled={favoritos.length >= 5}
                  >
                    <img
                      src="/assets/icones/heart/Path Copy 2@1,5x.svg"
                      alt="Mostrar Favoritos"
                    />
                  </button>
                )
              }

              <p>
                {characterData.description != ""
                  ? characterData.description
                  : "Sem descrição"}
              </p>
              <div className="description-item">
                <h4>Quadrinhos</h4>
                <img src="/assets/icones/book/Group@1,5x.svg" alt="Book icon" />
                <span>{characterData.comics.available}</span>
              </div>
              <div className="description-item">
                <h4>Series</h4>
                <img
                  src="/assets/icones/video/Shape@1,5x.svg"
                  alt="Video icon"
                />
                <span>{characterData.series.available}</span>
              </div>
              <div className="rating">
                <h4>Rating: </h4>
                <img src="/assets/review/Path@1,5x.svg" alt="Review Star" />
              </div>
            </div>
            <div className="pic-container">
              <img
                src={`${characterData?.thumbnail?.path}.${characterData?.thumbnail?.extension}`}
                alt={`${characterData?.name}`}
              />
            </div>
          </div>
          <div className="bottom-container">
            <div className="title-container">
              <h2>Últimos lançamentos</h2>
            </div>

            {comics.data.results.map((data) => (
              <div className="launch-card" key={data?.id}>
                <p>{data?.title}</p>
                <img
                  src={`${data?.thumbnail?.path}.${data?.thumbnail?.extension}`}
                  alt={`${data?.title}`}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h3>Carregando...</h3>
      )}
    </>
  );
};

export default Character;
