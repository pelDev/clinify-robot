import "./avatar.style.scss";

interface AvatarProps {
  src: string;
  size: number;
  alt?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = "", size }) => {
  return (
    <img
      style={{ height: size, width: size }}
      src={src}
      alt={alt}
      className="avatar"
    />
  );
};

export default Avatar;
