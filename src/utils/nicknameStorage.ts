const ACTIVE_KEY = "nickname";
const HISTORY_KEY = "nicknameHistory";

// 현재 활성화된(사용 중인) 닉네임
export function getActiveNickname(): string | null {
    return localStorage.getItem(ACTIVE_KEY);
}

// 이 기기에서 사용한 적 있는 닉네임 전체 목록
export function getNicknameHistory(): string[] {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        let history: string[] = raw ? JSON.parse(raw) : [];

        // 예전 버전 사용자 마이그레이션: 목록은 없고 활성 닉네임만 있으면 목록에 편입
        if (history.length === 0) {
            const active = localStorage.getItem(ACTIVE_KEY);
            if (active) {
                history = [active];
                localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
            }
        }

        return history;
    } catch {
        return [];
    }
}

export function isNicknameInHistory(nick: string): boolean {
    return getNicknameHistory().includes(nick);
}

// 새 닉네임 생성: 목록에 추가 + 활성 닉네임으로 지정
export function saveNewNickname(nick: string) {
    const history = getNicknameHistory();
    if (!history.includes(nick)) {
        history.push(nick);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
    localStorage.setItem(ACTIVE_KEY, nick);
}

// 이미 목록에 있는 닉네임으로 전환
export function switchToExistingNickname(nick: string) {
    localStorage.setItem(ACTIVE_KEY, nick);
}