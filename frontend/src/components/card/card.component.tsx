import "./card.style.scss";

interface CardProps {
  children: JSX.Element[];
}

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="card">{children}</div>;
};

export default Card;
