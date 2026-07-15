import { Button } from "@toss/tds-mobile";
import { playHomeBgm } from "../utils/bgm";
import { useEffect, useState } from "react";
import HomeScreenBg from "../assets/HomeScreen.webp";
import StartBtn from "../assets/StartBtn.webp";
import RankBtn from "../assets/RankBtn.webp";
import NicknamePop from "../assets/NicnamePop.webp";
import NewnicBtn from "../assets/NewnicBtn.webp";
import UsednicBtn from "../assets/UsednicBtn.webp";
import UsednicBtnUn from "../assets/UsednicBtnUn.webp";
import { isNicknameExists } from "../lib/supabase";

type HomeScreenProps = {
  onStart: () => void;
  onRanking: () => void;
};

export default function HomeScreen({
  onStart,
  onRanking,
}: HomeScreenProps) {
  const handleUseNickname = () => {
    playHomeBgm();
    setShowPopup(false);
  };

  const handleCreateNickname = async () => {
    const nick = nickname.trim();

    if (!nick) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const exists = await isNicknameExists(nick);

    if (exists) {
      alert("이미 사용중인 닉네임입니다.");
      return;
    }

    localStorage.setItem("nickname", nick);

    playHomeBgm();

    setShowPopup(false);
  };
  const [showPopup, setShowPopup] = useState(true);
  const [nickname, setNickname] = useState("");
  const [hasSavedNickname, setHasSavedNickname] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("nickname");

    if (saved) {
      setNickname(saved);
      setHasSavedNickname(true);
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
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
          overflow: "hidden",
        }}
      >
        {/* 홈 배경 */}
        <img
          src={HomeScreenBg}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center center",
          }}
        />

        {/* 게임 시작 버튼 */}
        <img
          src={StartBtn}
          alt=""
          draggable={false}
          onClick={onStart}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "30%",
            transform: "translateX(-50%)",
            width: "70%",
            cursor: "pointer",
          }}
        />

        {/* 랭킹 버튼 */}
        <img
          src={RankBtn}
          alt=""
          draggable={false}
          onClick={onRanking}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "18%",
            transform: "translateX(-50%)",
            width: "70%",
            cursor: "pointer",
          }}
        />

        {/* 닉네임 팝업 */}
        {showPopup && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,.45)",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              paddingBottom: "0px",
              zIndex: 999,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "75%",
                maxWidth: "400px",
                aspectRatio: "864 / 979",
              }}
            >
              <img
                src={NicknamePop}
                alt=""
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                }}
              />

              <input
                className="nickname-input"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력해주세요"
                maxLength={12}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  width: "75%",
                  fontSize: "clamp(10px, 3vw, 30px)",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  textAlign: "center",
                  color: "black",
                }}
              />

              {/* 기존 닉네임 */}
              <img
                onClick={hasSavedNickname ? handleUseNickname : undefined}
                src={hasSavedNickname ? UsednicBtn : UsednicBtnUn}
                alt=""
                draggable={false}
                style={{
                  position: "absolute",
                  left: "3.5%",
                  bottom: "17%",
                  width: "45%",
                  cursor: hasSavedNickname ? "pointer" : "default",
                }}
              />

              {/* 새 닉네임 */}
              <img
                onClick={handleCreateNickname}
                src={NewnicBtn}
                alt=""
                draggable={false}
                style={{
                  position: "absolute",
                  right: "3.5%",
                  bottom: "17%",
                  width: "45%",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}