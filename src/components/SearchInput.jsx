import "../styles/components/searchInput.scss";
import { Link, useNavigate } from "react-router-dom";

const SearchInput = ({ value, onChange }) => {
  function handleChange(event) {
    onChange(event.target.value);
  }

  //Para navegar até a home com termo de busca
  const navigate = useNavigate();

  return (
    <div className="searchbar">
      <Link to="#" onClick={() => navigate(`/search/${value}`)}>
        <img src="/assets/busca/Lupa/Shape@1,5x.svg" alt="Search icon" />
      </Link>

      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Procure por heróis"
      />
    </div>
  );
};

export default SearchInput;
