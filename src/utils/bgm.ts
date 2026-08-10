import homeBgm from "../assets/sounds/HomeBGM.ogg";
import { getMuted, subscribeMute } from "./audio";
import { App } from "@capacitor/app";

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

// 홈/잠금화면으로 나가면 재생 중이었는지 기억해뒀다가 멈추고,
// 다시 앱으로 돌아오면 그 기록을 보고 이어서 재생
let wasPlayingBeforeBackground = false;

App.addListener("appStateChange", ({ isActive }) => {
    if (isActive) {
        if (wasPlayingBeforeBackground) {
            playHomeBgm();
        }
    } else {
        wasPlayingBeforeBackground = !homeAudio.paused;
        homeAudio.pause();
    }
});