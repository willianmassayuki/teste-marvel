import "../styles/home.scss";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SearchInput from "../components/SearchInput";
import api from "../services/api";
import Pagination from "../components/pagination";
import Footer from "../components/Footer";
import BackTop from "../components/BackTop";

//Limite de itens por página
const limit = 20;

const Home = () => {
  //Para navegar até a página /character
  const navigate = useNavigate();

  const location = useLocation();

  // Obtém o texto de busca da URL
  let searchText = location.pathname.split("/")[2];

  //Texto pesquisado
  const [text, setText] = useState(searchText ? `${searchText}` : "");

  //Dados da API
  const [dados, setDados] = useState(null);

  //Controle de ordenação
  const [ordemAlfabetica, setOrdemAlfabetica] = useState(true);
  const [favoritos, setFavoritos] = useState([]);
  const [mostraFavoritos, setMostraFavoritos] = useState(false);

  //Paginação offset
  const [offset, setOffset] = useState(0);

  //Muda o sentido da ordem alfabética
  function mudaOrdem() {
    setOrdemAlfabetica(!ordemAlfabetica);
  }

  //Muda visualização entre favoritos e o padrão
  function handleFavoritos() {
    setMostraFavoritos(!mostraFavoritos);
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

  // Carrega sempre que o text sofrer uma alteração
  useEffect(() => {
    if (mostraFavoritos && favoritos.length > 0) {
      // Criar uma função assíncrona para poder usar o await na chamada da API
      async function fetchFavoritosData() {
        try {
          // Inicializar um array para guardar os dados de favoritos
          const favoritosData = [];

          // Fazer uma requisição para cada ID presente no array favoritos
          for (const id of favoritos) {
            const response = await api.get(`characters/${id}`);
            favoritosData.push(response.data);
          }

          // Atualizar o estado dos dados com os dados de favoritos obtidos
          setDados((prevDados) => ({
            data: {
              ...prevDados.data,
              results: [...favoritosData.map((item) => item.data.results[0])],
            },
          }));
        } catch (error) {
          console.error(
            "Ops! Ocorreu um erro ao obter dados de favoritos:",
            error
          );
        }
      }
      // Chamar a função que faz as requisições para cada ID de favoritos
      fetchFavoritosData();
    } else {
      api
        .get("characters?", {
          params: {
            nameStartsWith: text ? `${text}` : null,
            orderBy: ordemAlfabetica ? "name" : "-name",
            limit: limit,
            offset: offset,
          },
        })
        .then((response) => {
          setDados(response.data);
        })
        .catch((err) => {
          console.error("ops! ocorreu um erro" + err);
        });
    }
  }, [ordemAlfabetica, mostraFavoritos, text, offset]);

  return (
    <>
      <Header />
      <SearchInput
        value={text}
        onChange={(search) => setText(search)}
        searchText={searchText}
      />
      <div className="main-container">
        <div className="actions-container">
          <p>Encontrados {dados?.data?.results?.length} heróis</p>
          <button onClick={() => mudaOrdem()}>
            <img
              src="/assets/icones/heroi/noun_Superhero_2227044@1,5x.svg"
              alt="Hero icon"
            />
            <span className="central-span">
              <span className="desktop">Ordenar por nome -</span> A/Z
            </span>
            {ordemAlfabetica ? (
              <img src="/assets/toggle/Group 6@1,5x.svg" alt="A a Z Toggle" />
            ) : (
              <img src="/assets/toggle/Group 2.svg" alt="A a Z Toggle" />
            )}
          </button>
          <button onClick={() => handleFavoritos()}>
            {mostraFavoritos ? (
              <img
                src="/assets/icones/heart/Path.svg"
                alt="Mostrar Favoritos"
              />
            ) : (
              <img
                src="/assets/icones/heart/Path Copy 7.svg"
                alt="Mostrar Favoritos"
              />
            )}
            <span>Somente Favoritos</span>
          </button>
        </div>
        <div className="heroes-container">
          {dados ? (
            <ul>
              {dados?.data?.results?.map((item) => (
                <div className="hero-card" key={item?.id}>
                  <li>
                    <Link
                      to="#"
                      onClick={() => navigate(`/character/${item?.id}`)}
                    >
                      <div className="card-img">
                        <img
                          src={`${item?.thumbnail?.path}.${item?.thumbnail?.extension}`}
                          alt={`${item?.name}`}
                        />
                      </div>
                    </Link>
                    <div className="card-footer">
                      <span>{item?.name}</span>
                      {favoritos.includes(item?.id) ? (
                        <button onClick={() => toggleFav(item?.id)}>
                          <img
                            src="/assets/icones/heart/Path.svg"
                            alt="Mostrar Favoritos"
                          />
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleFav(item?.id)}
                          disabled={favoritos.length >= 5}
                        >
                          <img
                            src="/assets/icones/heart/Path Copy 2@1,5x.svg"
                            alt="Mostrar Favoritos"
                          />
                        </button>
                      )}
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          ) : (
            <h3>Carregando...</h3>
          )}
        </div>

        <Pagination
          limitItems={limit}
          totalItems={dados?.data?.total}
          offset={offset}
          setOffset={setOffset}
        />
      </div>
      <BackTop />
      <Footer />
    </>
  );
};

export default Home;
