import React from "react";
import Header from "../components/Header";
import SearchInput from "../components/SearchInput";
import { useState, useEffect } from "react";
import api from "../services/api";

const Home = () => {
  //Texto pesquisado
  const [text, setText] = useState("");
  //Dados da API
  const [dados, setDados] = useState(null);
  //Controle de ordenação
  const [ordemAlfabetica, setOrdemAlfabetica] = useState(true);

  function mudaOrdem() {
    setOrdemAlfabetica(!ordemAlfabetica);
  }

  // Carrega sempre que o text sofrer uma alteração
  useEffect(() => {
    api
      .get("characters?", {
        params: {
          nameStartsWith: text ? `${text}` : null,
          orderBy: ordemAlfabetica ? "name" : "-name",
        },
      })
      //text ? `nameStartsWith=${text}` : null)
      .then((response) => {
        setDados(response.data);
        console.log(dados);
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }, [text, ordemAlfabetica]);
  return (
    <>
      <Header />
      <SearchInput value={text} onChange={(search) => setText(search)} />
      <button onClick={() => mudaOrdem()}>A-Z</button>
      <ul>
        {dados?.data?.results?.map((item) => (
          <li key={item?.id}>
            <img
              src={`${item?.thumbnail?.path}.${item?.thumbnail?.extension}`}
              alt={`${item?.name}`}
            />
            <span>{item?.name}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
