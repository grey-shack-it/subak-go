import watermelonSheet from "../assets/watermelon_sheet.webp";

type Props = {
  frame: number;
};

export default function WatermelonSprite({ frame }: Props) {
  const col = frame % 3;
  const row = Math.floor(frame / 3);

  return (
    <div
      style={{
        width: "120cqw",
        height: "120cqw",
        maxWidth: "480px",
        maxHeight: "480px",

        backgroundImage: `url(${watermelonSheet})`,
        backgroundRepeat: "no-repeat",

        backgroundSize: "300% 300%",

        backgroundPosition: `${col * 50}% ${row * 50}%`,
      }}
    />
  );
}