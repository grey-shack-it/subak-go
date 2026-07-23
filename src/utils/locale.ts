// 폰의 언어 설정이 한국어인지 확인해요.
// 한국어면 true(한글 버전), 그 외 모든 언어는 false(영어 버전)로 처리해요.
export function isKorean(): boolean {
    const lang =
        navigator.language ||
        (navigator as unknown as { userLanguage?: string }).userLanguage ||
        "";
    return lang.toLowerCase().startsWith("ko");
}