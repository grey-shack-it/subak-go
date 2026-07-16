import { useEffect, useState } from "react";
import { getTopRankings, getAllRankings } from "../lib/supabase";
import RankScreenBg from "../assets/RankScreen.webp";
import HomeBtn from "../assets/HomeBtn.webp";
import PressableImage from "../components/PressableImage";
import { showRankingBanner, hideRankingBanner } from "../utils/ads";

type RankingScreenProps = {
  onHome: () => void;
};

export default function RankingScreen({
  onHome,
}: RankingScreenProps) {
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

            const start = Math.max(0, index - 2);
            const end = Math.min(all.length, index + 3);

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
          src={RankScreenBg}
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

              <div style={{ textAlign: "right", whiteSpace: "nowrap",}}>
                {(item.time_ms / 1000).toFixed(2)}초
              </div>
            </div>
          ))}
        </div>

        {/* 내 순위 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "16%",
            transform: "translateX(-50%)",
            width: "80%",
            color: "#025e0f",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "4.5cqw",
              fontWeight: "bold",
              color: "#02470b",
              marginBottom: "5px",
            }}
          >
            내 순위 : {myRank ? `${myRank}위` : "-"}
          </div>

          {myNearbyRanks.map((item, index) => {
            const startRank = Math.max(1, myRank! - 2);
            const realRank = startRank + index;

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "2px 8px",
                  fontSize: 
                    item.nickname === localStorage.getItem("nickname")
                      ? "4cqw"
                      : "4cqw",
                  fontWeight: "bold",                  
                  color:
                    item.nickname === localStorage.getItem("nickname")
                      ? "#c91d1d"
                      : "#057914",
                }}
              >
                <span>{realRank}.</span>
                <span>{item.nickname}</span>
                <span>{(item.time_ms / 1000).toFixed(2)}초</span>
              </div>
            );
          })}
        </div>

        {/* 홈 버튼 */}
        <PressableImage
          src={HomeBtn}
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