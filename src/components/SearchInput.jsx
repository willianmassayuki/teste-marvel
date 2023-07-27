import "../styles/components/searchInput.scss";

const SearchInput = ({ value, onChange }) => {
  function handleChange(event) {
    onChange(event.target.value);
  }
  return (
    <div className="searchbar">
      <img src="/assets/busca/Lupa/Shape@1,5x.svg" alt="Search icon" />
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
