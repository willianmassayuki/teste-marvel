import "../styles/components/BackTop.scss";
import { BiArrowToTop } from "react-icons/bi";

const BackTop = () => {
  return (
    <div className="back-top">
      <button onClick={() => window.scrollTo(0, 0)}>
        <BiArrowToTop />
      </button>
    </div>
  );
};

export default BackTop;
