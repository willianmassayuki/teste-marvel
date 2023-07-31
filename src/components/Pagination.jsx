import "../styles/components/pagination.scss";
// Número total de botões
const MAX_ITEMS = 9;
// Botões à esquerda
const MAX_LEFT = (MAX_ITEMS - 1) / 2;

// Limit: quantos itens por página
// Total de itens
// Skip/offset - quantos itens pular de acordo com a página
const Pagination = ({ limitItems, totalItems, offset, setOffset }) => {
  const currentPage = offset ? offset / limitItems + 1 : 1;
  // Total de páginas arredondando para cima
  const totalPages = Math.ceil(totalItems / limitItems);
  //Retorna o maior entre os dois argumentos para evitar páginas menores que 1
  const firstPage = Math.max(currentPage - MAX_LEFT, 1);

  return (
    <div className="pagination">
      <ul>
        {
          //Criar um array de número de páginas a partir de uma quantidade
          Array.from({ length: Math.min(MAX_ITEMS, totalPages) })
            .map((_, index) => index + firstPage)
            .map((page) => (
              <li key={page}>
                <button
                  className={page === currentPage ? "currentPage" : null}
                  onClick={() => setOffset((page - 1) * limitItems)}
                >
                  {page}
                </button>
              </li>
            ))
        }
      </ul>
    </div>
  );
};

export default Pagination;
