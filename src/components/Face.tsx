import face1 from "../assets/face1.webp";
import face2 from "../assets/face2.webp";
import face3 from "../assets/face3.webp";
import face4 from "../assets/face4.webp";

type Props = {
    state: 1 | 2 | 3 | 4;
};

export default function Face({ state }: Props) {
    const images = {
        1: face1,
        2: face2,
        3: face3,
        4: face4,
    };

    return (
        <img
            src={images[state]}
            alt="face"
            draggable={false}
            style={{
                width: "30cqw",
                maxWidth: "150px",
                userSelect: "none",
                pointerEvents: "none",
            }}
        />
    );
}