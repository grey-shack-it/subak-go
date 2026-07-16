import { useSyncExternalStore } from "react";

let muted = false;
const listeners = new Set<() => void>();

export function getMuted() {
    return muted;
}

export function toggleMute() {
    muted = !muted;
    listeners.forEach((fn) => fn());
    return muted;
}

export function subscribeMute(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

// 홈, 게임, 랭킹 화면 어디서든 이 훅 하나로 현재 음소거 상태를 구독 가능
export function useMuted() {
    return useSyncExternalStore(subscribeMute, getMuted);
}

// 효과음(SFX) 재생 전용 — 음소거 상태면 아예 재생하지 않음
export function playSfx(src: string) {
    if (muted) return;
    const audio = new Audio(src);
    audio.play().catch(() => {});
}