import {
    AdMob,
    BannerAdSize,
    BannerAdPosition,
    RewardAdPluginEvents,
} from "@capacitor-community/admob";

let initialized = false;

// 앱 시작 시 한 번만 호출하면 되는 AdMob SDK 초기화
export async function initAds() {
    if (initialized) return;
    initialized = true;
    await AdMob.initialize({
        initializeForTesting: true, // TODO: 프로덕션 출시 시 제거
    });
}

// ⚠️ 지금은 구글 공식 테스트 광고 단위 ID예요.
// 프로덕션(공개) 출시 직전에 AdMob 콘솔에서 만든 실제 광고 단위 ID로 반드시 교체하세요.
const BANNER_AD_ID = "ca-app-pub-3940256099942544/6300978111";
const REWARDED_AD_ID = "ca-app-pub-3940256099942544/5224354917";

// ===== 배너 광고 (랭킹화면 하단용) =====
export async function showRankingBanner() {
    await AdMob.showBanner({
        adId: BANNER_AD_ID,
        adSize: BannerAdSize.ADAPTIVE_BANNER, // 표준 배너보다 eCPM이 대체로 더 높음
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 30, // 네비게이션 바와 겹치지 않도록 하단 여백
        isTesting: true, // TODO: 프로덕션에서 제거
    });
}

export async function hideRankingBanner() {
    try {
        await AdMob.removeBanner();
    } catch {
        // 애초에 배너가 없던 경우 등은 무시해도 안전함
    }
}

// ===== 리워드 광고 (게임오버 팝업 - 씨앗 페널티 제거용) =====
export function loadRewardedAd() {
    return AdMob.prepareRewardVideoAd({
        adId: REWARDED_AD_ID,
        isTesting: true, // TODO: 프로덕션에서 제거
    });
}

// 광고를 끝까지 시청해서 보상을 받았을 때만 onRewarded가 호출돼요.
export async function watchRewardedAd(
    onRewarded: () => void,
    onFailed?: () => void
) {
    const rewardedListener = await AdMob.addListener(
        RewardAdPluginEvents.Rewarded,
        () => {
            rewardedListener.remove();
            failListener.remove();
            onRewarded();
        }
    );
    const failListener = await AdMob.addListener(
        RewardAdPluginEvents.FailedToShow,
        () => {
            rewardedListener.remove();
            failListener.remove();
            onFailed?.();
        }
    );

    try {
        await AdMob.showRewardVideoAd();
    } catch (e) {
        rewardedListener.remove();
        failListener.remove();
        console.error("리워드 광고 표시 실패", e);
        onFailed?.();
    }
}