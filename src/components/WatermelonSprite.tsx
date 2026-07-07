import watermelonSheet from "../assets/watermelon_sheet.png";

type Props = {
  frame: number;
};

const DISPLAY_SIZE = 480;     // 화면에 보여줄 크기

export default function WatermelonSprite({ frame }: Props) {
  const col = frame % 3;
  const row = Math.floor(frame / 3);

  return (
    <div
      style={{
        width: DISPLAY_SIZE,
        height: DISPLAY_SIZE,        
        backgroundImage: `url(${watermelonSheet})`,
        backgroundRepeat: "no-repeat",

        // 원본(3072x3072)을 화면 크기에 맞게 축소
        backgroundSize: `${DISPLAY_SIZE * 3}px ${DISPLAY_SIZE * 3}px`,

        // 원하는 칸만 보여주기
        backgroundPosition: `-${col * DISPLAY_SIZE}px -${row * DISPLAY_SIZE}px`,
      }}
    />
  );
}