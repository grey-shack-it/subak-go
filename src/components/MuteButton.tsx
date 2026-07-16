import { toggleMute, useMuted } from "../utils/audio";

export default function MuteButton() {
    const muted = useMuted();

    return (
        <button
            onClick={toggleMute}
            aria-label={muted ? "음소거 해제" : "음소거"}
            style={{
                position: "fixed",
                top: 16,
                right: 16,
                zIndex: 999,
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                lineHeight: 1,
                cursor: "pointer",
            }}
        >
            {muted ? "🔇" : "🔊"}
        </button>
    );
}