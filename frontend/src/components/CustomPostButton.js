import { Link } from "react-router-dom";
import { BLOG_URL_PREFIX } from "../constants/routes";
function CustomPostButton({ alt, blog_url, name, icon, ...props }) {
  return (
    <div
      className="border-0 my-shadow-light rounded-4 overflow-hidden hover mx-3 custom-post-button"
      {...props}
    >
      <Link className="py-4 px-2" to={BLOG_URL_PREFIX + blog_url}>
        <img className="postb-img mb-2" alt="blog" src={icon} />
        <h5>{name}</h5>
        <div className="cpb-link d-flex flex-row align-items-center">
          <p className="learn-more ml-2">Learn More</p>
          <img src={"../icons/link.svg"} height={16} width={16} alt="link" />
        </div>
      </Link>
    </div>
  );
}

export default CustomPostButton;
