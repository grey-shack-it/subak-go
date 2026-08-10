import { useEffect, useState } from "react";
import {
  getTopRankings,
  getAllRankings,
  getPeriodRankings,
} from "../lib/supabase";
import RankScreenBg from "../assets/RankScreen.webp";
import HomeBtn from "../assets/HomeBtn.webp";
import RankScreenBgEN from "../assets/RankScreen(en).webp";
import HomeBtnEN from "../assets/HomeBtn(en).webp";
import SelectedTab from "../assets/selected.webp";
import PressableImage from "../components/PressableImage";
import { showRankingBanner, hideRankingBanner } from "../utils/ads";
import { isKorean } from "../utils/locale";

type Period = "week" | "month" | "all";

type RankingScreenProps = {
  onHome: () => void;
};

const TAB_LABELS: Record<Period, { ko: string; en: string }> = {
  week: { ko: "주간", en: "Weekly" },
  month: { ko: "월간", en: "Monthly" },
  all: { ko: "G.O.A.T", en: "G.O.A.T" },
};

const TAB_ORDER: Period[] = ["week", "month", "all"];

export default function RankingScreen({ onHome }: RankingScreenProps) {
  const ko = isKorean();
  const [period, setPeriod] = useState<Period>("week");
  const [rankings, setRankings] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myNearbyRanks, setMyNearbyRanks] = useState<any[]>([]);

  useEffect(() => {
    showRankingBanner().catch((e) => console.error("배너 광고 표시 실패", e));
    return () => {
      hideRankingBanner();
    };
  }, []);

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const top50 =
          period === "all"
            ? await getTopRankings()
            : await getPeriodRankings(period, 50);
        setRankings(top50 ?? []);

        const nickname = localStorage.getItem("nickname");
        if (!nickname) {
          setMyRank(null);
          setMyNearbyRanks([]);
          return;
        }

        const all =
          period === "all"
            ? await getAllRankings()
            : await getPeriodRankings(period, 100000);

        const index = all.findIndex(
          (item: any) => item.nickname === nickname
        );

        if (index >= 0) {
          setMyRank(index + 1);
          const start = Math.max(0, index - 1);
          const end = Math.min(all.length, index + 2);
          setMyNearbyRanks(all.slice(start, end));
        } else {
          setMyRank(null);
          setMyNearbyRanks([]);
        }
      } catch (e) {
        console.error("랭킹 불러오기 실패", e);
      }
    };

    loadRanking();
  }, [period]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "100vh",
          aspectRatio: "9 / 16",
          containerType: "inline-size",
          overflow: "hidden",
        }}
      >
        {/* 배경 */}
        <img
          src={ko ? RankScreenBg : RankScreenBgEN}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />

        {/* 탭 바 */}
        <div
          style={{
            position: "absolute",
            top: "7.08%",
            left: "10.65%",
            width: "78.7%",
            height: "5.15%",
            display: "flex",
          }}
        >
          <img
            src={SelectedTab}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              top: "50%",
              left: `${TAB_ORDER.indexOf(period) * 33.33 + 2.5}%`,
              width: "28.3%",
              transform: "translateY(-50%)",
              transition: "left 0.2s ease",
              pointerEvents: "none",
            }}
          />

          {TAB_ORDER.map((p) => (
            <div
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "3.8cqw",
                fontWeight: "bold",
                color: period === p ? "#ffffff" : "#4a4a4a",
                zIndex: 1,
                transition: "color 0.2s ease",
              }}
            >
              {ko ? TAB_LABELS[p].ko : TAB_LABELS[p].en}
            </div>
          ))}
        </div>

        {/* 랭킹 영역 */}
        <div
          style={{
            position: "absolute",
            top: "23.3%",
            bottom: "35%",
            overflowY: "auto",
            left: "10%",
            width: "80%",
            color: "#02470b",
            fontWeight: "bold",
            fontSize: "4.5cqw",
            lineHeight: "1.3",
            textAlign: "left",
          }}
        >
          {rankings.map((item, index) => (
            <div
              key={item.id ?? `${item.nickname}-${index}`}
              style={{
                display: "grid",
                gridTemplateColumns: "12cqw 1fr 22cqw",
                alignItems: "center",
                padding: "0.5cqw 1cqw",
              }}
            >
              <div style={{ textAlign: "left" }}>{index + 1}</div>

              <div
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {item.nickname}
              </div>

              <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                {(item.time_ms / 1000).toFixed(2)}
                {ko ? "초" : "s"}
              </div>
            </div>
          ))}
        </div>

        {/* 내 순위 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "69%",
            bottom: "14%",
            transform: "translateX(-50%)",
            width: "80%",
            color: "#025e0f",
            textAlign: "center",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "6cqw",
              fontWeight: "bold",
              color: "#02470b",
              marginBottom: "5px",
            }}
          >
            {ko ? "내 순위" : "My Rank"} :{" "}
            {myRank ? (ko ? `${myRank}위` : `#${myRank}`) : "-"}
          </div>

          {myNearbyRanks.map((item, index) => {
            const startRank = Math.max(1, (myRank ?? 1) - 1);
            const realRank = startRank + index;

            return (
              <div
                key={item.id ?? `${item.nickname}-${index}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 8px",
                  fontSize:
                    item.nickname === localStorage.getItem("nickname")
                      ? "5.5cqw"
                      : "4.2cqw",
                  fontWeight: "bold",
                  color:
                    item.nickname === localStorage.getItem("nickname")
                      ? "#c91d1d"
                      : "#057914",
                }}
              >
                <span>{realRank}.</span>
                <span
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    flex: 1,
                    margin: "0 6px",
                  }}
                >
                  {item.nickname}
                </span>
                <span>
                  {(item.time_ms / 1000).toFixed(2)}
                  {ko ? "초" : "s"}
                </span>
              </div>
            );
          })}
        </div>

        {/* 홈 버튼 */}
        <PressableImage
          src={ko ? HomeBtn : HomeBtnEN}
          alt=""
          draggable={false}
          onClick={onHome}
          style={{
            position: "absolute",
            top: "2%",
            left: "4%",
            width: "18%",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
}