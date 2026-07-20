import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    global: {
      // WebView가 GET 요청(랭킹 조회 등)을 디스크에 캐싱해서
      // 서버 데이터가 바뀌어도 예전 응답을 그대로 재사용하는 문제를 방지
      fetch: (input, init) =>
        fetch(input, { ...init, cache: "no-store" }),
    },
  }
);

export async function isNicknameExists(nickname: string) {
  const { data, error } = await supabase
    .from("subakgo_rankings")
    .select("id")
    .eq("nickname", nickname)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

export async function saveRanking(
  nickname: string,
  timeMs: number
) {
  const oldRecord = await getRankingByNickname(nickname);

  // 처음 플레이
  if (!oldRecord) {
    const { error } = await supabase
      .from("subakgo_rankings")
      .insert({
        nickname,
        time_ms: timeMs,
      });

    if (error) throw error;
    return;
  }

  // 최고기록 갱신인 경우만 UPDATE
    if (timeMs < oldRecord.time_ms) {
  
    const { error } = await supabase
      .from("subakgo_rankings")
      .update({
        time_ms: timeMs,
      })
      .eq("id", oldRecord.id);

    if (error) throw error;
  }
}

export async function getTopRankings() {
  const { data, error } = await supabase
    .from("subakgo_rankings")
    .select("*")
    .order("time_ms", { ascending: true })
    .limit(50);

  if (error) throw error;

  return data;
}

export async function getRankingByNickname(nickname: string) {
  const { data, error } = await supabase
    .from("subakgo_rankings")
    .select("*")
    .eq("nickname", nickname)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function getAllRankings() {
  const { data, error } = await supabase
    .from("subakgo_rankings")
    .select("*")
    .order("time_ms", { ascending: true });

  if (error) throw error;

  return data ?? [];
}