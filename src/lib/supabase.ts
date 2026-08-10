import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    global: {
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
  // 매 플레이 기록을 방명록(play_history)에 저장 — 주간/월간 랭킹 계산용
  const { error: historyError } = await supabase
    .from("subakgo_play_history")
    .insert({ nickname, time_ms: timeMs });

  if (historyError) {
    console.error("플레이 기록 저장 실패", historyError);
  }

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

// 주간/월간 랭킹 조회 (limit 크게 주면 "내 순위" 계산용 전체 리스트로도 사용 가능)
export async function getPeriodRankings(
  period: "week" | "month",
  limit = 50
) {
  const { data, error } = await supabase.rpc("get_period_rankings", {
    period,
    limit_count: limit,
  });

  if (error) throw error;

  return data ?? [];
}