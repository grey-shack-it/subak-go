import { useState } from "react";
import type { CSSProperties, ImgHTMLAttributes } from "react";

type PressableImageProps = ImgHTMLAttributes<HTMLImageElement> & {
    pressedScale?: number;
};

// 기존 <img onClick={...} style={{...}} /> 버튼들을 그대로 대체해서 쓰는 컴포넌트예요.
// 기존 transform(위치 이동 등)은 유지한 채, 누르는 동안만 살짝 축소되는 효과를 더해줘요.
export default function PressableImage({
    style,
    pressedScale = 0.92,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    ...rest
}: PressableImageProps) {
    const [pressed, setPressed] = useState(false);

    const baseTransform = (style as CSSProperties | undefined)?.transform ?? "";

    return (
        <img
            {...rest}
            style={{
                ...style,
                transform: `${baseTransform} ${pressed ? `scale(${pressedScale})` : "scale(1)"}`.trim(),
                transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onMouseDown={(e) => {
                setPressed(true);
                onMouseDown?.(e);
            }}
            onMouseUp={(e) => {
                setPressed(false);
                onMouseUp?.(e);
            }}
            onMouseLeave={(e) => {
                setPressed(false);
                onMouseLeave?.(e);
            }}
            onTouchStart={(e) => {
                setPressed(true);
                onTouchStart?.(e);
            }}
            onTouchEnd={(e) => {
                setPressed(false);
                onTouchEnd?.(e);
            }}
        />
    );
}