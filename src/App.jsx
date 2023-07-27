import "./styles/app.scss";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Outlet />
      {/* 
        //Header
        Logo
        Titulo 
        descrição

        // Mostra default 20
        fazer um get ao carregar a página pela primeira vez
        SE text == '' carregar o default
        SENAO carregar de acordo com a busca

        //Busca e filtro
        <input value={text} onChange={(search) => setText(search)} >

        //Um componente que exibe 20 herois por vez
        <Heros />

        //footer
        Background com a cor da marca
      */}
    </>
  );
}

export default App;
