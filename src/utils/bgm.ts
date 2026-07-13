import homeBgm from "../assets/sounds/HomeBGM.mp3";
import gameBgm from "../assets/sounds/GameBGM.mp3";

const homeAudio = new Audio(homeBgm);
const gameAudio = new Audio(gameBgm);

homeAudio.loop = true;
gameAudio.loop = true;

// 볼륨 (나중에 조절 가능)
homeAudio.volume = 0.35;
gameAudio.volume = 0.35;

export function playHomeBgm() {
    gameAudio.pause();
    gameAudio.currentTime = 0;

    if (homeAudio.paused) {
        homeAudio.currentTime = 0;
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

export function playGameBgm() {
    homeAudio.pause();
    homeAudio.currentTime = 0;

    gameAudio.currentTime = 0;
    gameAudio.play().catch(() => { });
}

export function stopGameBgm() {
    gameAudio.pause();
    gameAudio.currentTime = 0;
}