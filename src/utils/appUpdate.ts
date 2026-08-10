import { AppUpdate, AppUpdateAvailability } from "@capawesome/capacitor-app-update";
import { Capacitor } from "@capacitor/core";

// 앱 시작 시 업데이트 가능 여부 확인 후, 가능하면 즉시 업데이트 진행
export async function checkAndUpdateApp() {
    // 안드로이드에서만 동작 (iOS는 스토어로 이동하는 방식만 지원)
    if (Capacitor.getPlatform() !== "android") return;

    try {
        const info = await AppUpdate.getAppUpdateInfo();

        if (info.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
            return; // 업데이트 없음
        }

        if (info.immediateUpdateAllowed) {
            await AppUpdate.performImmediateUpdate();
        } else {
            // 즉시 업데이트가 불가능한 경우(드묾) 스토어로 안내
            await AppUpdate.openAppStore();
        }
    } catch (e) {
        console.error("업데이트 확인 실패", e);
    }
}