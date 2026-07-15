import homeBgm from "../assets/sounds/HomeBGM.ogg";

const homeAudio = new Audio(homeBgm);

homeAudio.loop = true;

// 볼륨
homeAudio.volume = 0.35;

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