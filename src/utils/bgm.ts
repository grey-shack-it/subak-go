import homeBgm from "../assets/sounds/HomeBGM.ogg";
import { getMuted, subscribeMute } from "./audio";

const homeAudio = new Audio(homeBgm);

homeAudio.loop = true;

// 볼륨
homeAudio.volume = 0.35;
homeAudio.muted = getMuted();

// 음소거 버튼 누를 때마다 현재 재생 중인 BGM에도 바로 반영
subscribeMute(() => {
    homeAudio.muted = getMuted();
});

export function playHomeBgm() {
    if (homeAudio.paused) {
        homeAudio.play().then(() => {
            console.log("HOME BGM PLAY");
        }).catch((err) => {
            console.error("HOME BGM ERROR", err);
        });
    }
}

export function stopHomeBgm() {
    homeAudio.pause();
    homeAudio.currentTime = 0;
}