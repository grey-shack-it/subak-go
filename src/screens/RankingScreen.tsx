import { useEffect, useState } from "react";
import { getTopRankings, getAllRankings } from "../lib/supabase";
import RankScreenBg from "../assets/RankScreen.webp";
import HomeBtn from "../assets/HomeBtn.webp";
import RankScreenBgEN from "../assets/RankScreen(en).webp";
import HomeBtnEN from "../assets/HomeBtn(en).webp";
import PressableImage from "../components/PressableImage";
import { showRankingBanner, hideRankingBanner } from "../utils/ads";
import { isKorean } from "../utils/locale";

type RankingScreenProps = {
  onHome: () => void;
};

export default function RankingScreen({
  onHome,
}: RankingScreenProps) {
  const ko = isKorean();
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
        const top10 = await getTopRankings();
        setRankings(top10 ?? []);
        const nickname = localStorage.getItem("nickname");
        if (nickname) {
          const all = await getAllRankings();
          const index = all.findIndex(
            (item) => item.nickname === nickname
          );

          if (index >= 0) {
            setMyRank(index + 1);

            const start = Math.max(0, index - 1);
            const end = Math.min(all.length, index + 2);

            setMyNearbyRanks(all.slice(start, end));
          }
        }
      } catch (e) {
        console.error("랭킹 불러오기 실패", e);
      }
    };

    loadRanking();
  }, []);
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

        {/* 랭킹 영역 */}
        <div
          style={{
            position: "absolute",
            top: "20%",
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
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "12cqw 1fr 22cqw",
                alignItems: "center",
                padding: "0.5cqw 1cqw",
              }}
            >
              <div style={{ textAlign: "left" }}>
                {index + 1}
              </div>

              <div
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {item.nickname}
              </div>

              <div style={{ textAlign: "right", whiteSpace: "nowrap", }}>
                {(item.time_ms / 1000).toFixed(2)}{ko ? "초" : "s"}
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
            {ko ? "내 순위" : "My Rank"} : {myRank ? (ko ? `${myRank}위` : `#${myRank}`) : "-"}
          </div>

          {myNearbyRanks.map((item, index) => {
            const startRank = Math.max(1, myRank! - 1);
            const realRank = startRank + index;

            return (
              <div
                key={item.id}
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
                <span>{(item.time_ms / 1000).toFixed(2)}{ko ? "초" : "s"}</span>
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
            width: "22%",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
}