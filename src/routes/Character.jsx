import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";
import SearchInput from "../components/SearchInput";
import Footer from "../components/Footer";
import "../styles/character.scss";

const Character = () => {
  const location = useLocation();
  const characterId = location.pathname.split("/")[2]; // Obtém o ID do personagem da URL
  const [characterData, setCharacterData] = useState(null);
  const [comics, setComics] = useState(null);
  const [text, setText] = useState("");
  const [favoritos, setFavoritos] = useState([]);

  // Função para formatar a data no formato DD-MM-AAAA
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  // Mandar para a página principal iniciada com uma busca
  function handleSearch() {
    console.log(text);
  }

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
    }
  }, []);

  //Atualização do localstorage toda vez que favoritos for alterado
  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  // Traz os dados do personagem específico
  useEffect(() => {
    api
      .get(`characters/${characterId}`, {
        params: {
          limit: 10,
        },
      })
      .then((response) => {
        setCharacterData(response.data.data.results[0]);
      })
      .catch((err) => {
        console.error(
          "Ops! Ocorreu um erro ao obter dados do personagem:",
          err
        );
      });
  }, [characterId]);

  // Identifica o nome de dez lançamentos de quadrinhos do personage
  useEffect(() => {
    if (characterData) {
      const launchItems = characterData.comics.items.slice(0, 10);
      const launchData = launchItems.map((item) => item.resourceURI);

      // Pega o endpoint de cada quadrinho
      const transformedArray = launchData.map((url) => {
        const parts = url.split("/");
        return `comics/${parts[parts.length - 1]}`;
      });

      async function fetchComicsData() {
        try {
          const response = await api.get(`comics?`, {
            params: {
              orderBy: "-onsaleDate",
              limit: 10,
            },
          });
          setComics(response.data.data.results);
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

  return (
    <div className="main">
      <div className="alt-header">
        <Link to="/">
          <img
            className="top-logo"
            src="/assets/logo/Group.png"
            alt="Logo Marvel Search Heroes"
          />
        </Link>
        <SearchInput value={text} onChange={(search) => setText(search)} />
      </div>
      {characterData ? (
        <>
          <div className="body-container">
            <div className="upper-container">
              <div className="bg-name">
                <span>{characterData.name}</span>
              </div>
              <div className="left-container">
                <div className="left-container-title">
                  <h1>{characterData.name}</h1>
                  {favoritos.includes(characterData?.id) ? (
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
                  )}
                </div>
                <p>
                  {characterData.description &&
                  characterData.description.length > 0
                    ? characterData.description
                    : "Sem descrição"}
                </p>
                <div className="descriptio-item-container">
                  <div className="description-item">
                    <h4>Quadrinhos</h4>
                    <div className="info-item">
                      <img
                        src="/assets/icones/book/Group@1,5x.svg"
                        alt="Book icon"
                      />
                      <span>{characterData.comics.available}</span>
                    </div>
                  </div>
                  <div className="description-item">
                    <h4>Series</h4>
                    <div className="info-item">
                      <img
                        src="/assets/icones/video/Shape@1,5x.svg"
                        alt="Video icon"
                      />
                      <span>{characterData.series.available}</span>
                    </div>
                  </div>
                </div>
                <div className="rating">
                  <h4>Rating: </h4>
                  <img src="/assets/review/Path@1,5x.svg" alt="Review Star" />
                </div>
                <div className="last-release">
                  <h4>Último quadrinho:</h4>
                  <p>{formatDate(characterData.modified)}</p>
                </div>
              </div>
              <div className="pic-container">
                <img
                  src={`${characterData?.thumbnail?.path}.${characterData?.thumbnail?.extension}`}
                  alt={`${characterData?.name}`}
                />
              </div>
            </div>
          </div>
          <div className="bottom-container">
            <div className="title-container">
              <h2>Últimos lançamentos</h2>
            </div>
            <div className="comic-cards-container">
              {comics ? (
                comics.map((data) => (
                  <div className="comic-card" key={data.id}>
                    <img
                      src={`${data?.thumbnail?.path}.${data?.thumbnail?.extension}`}
                      alt={`${data?.title}`}
                    />
                    <p>{data.title}</p>
                  </div>
                ))
              ) : (
                <p>Carregando</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <h3>Carregando...</h3>
      )}
      <Footer />
    </div>
  );
};

export default Character;
