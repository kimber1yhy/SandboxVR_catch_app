import React, { useState, useEffect, useRef, useCallback } from "react";
import Catcher from "./Catcher";
import p1 from "../assets/p1.png";
import p2 from "../assets/p2.png";
import p3 from "../assets/p3.png";
import p4 from "../assets/p4.png";
import e1 from "../assets/e1.png";
import e2 from "../assets/e2.png";
import styled from "styled-components";
import bg1 from "../assets/bg1.png";
import StartMenu from "./StartMenu";
import axios from "axios";
import { v4 as uuid } from "uuid";
import Leaderboard from "./Leaderboard";

interface Image {
  id: string;
  src: string;
  top: number;
  left: number;
}

const Game: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [catcherPosition, setCatcherPosition] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [images, setImages] = useState<Image[]>([]);
  const [goBack, setGoBack] = useState<boolean>(false);
  const [goLeaderboard, setGoLeaderboard] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [isSave, setIsSave] = useState<boolean>(false);
  const [rank, setRank] = useState<number>(0);
  const [totalPlayerNumber, setTotalPlayerNumber] = useState<number>(0);

  const catcherRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!gameOver) {
      const catcherWidth = 100;
      const gameContainerWidth = event.currentTarget.offsetWidth;
      const gameContainerLeftOffset =
        event.currentTarget.getBoundingClientRect().left;
      const mouseX = event.clientX - gameContainerLeftOffset;
      const maxCatcherPosition = gameContainerWidth - catcherWidth;
      const newCatcherPosition = Math.min(
        Math.max(mouseX - catcherWidth / 2, 0),
        maxCatcherPosition
      );
      setCatcherPosition(newCatcherPosition);
    }
  };

  const getImageName = (index: number) => {
    const imagePaths = [p1, p2, p3, p4, e1, e2];

    if (index >= 1 && index <= imagePaths.length) {
      return imagePaths[index - 1];
    }
    return "";
  };

  const handleGoBack = useCallback(() => {
    setGoBack(true);
  }, []);

  const handleGoLeaderboard = useCallback(() => {
    setGoLeaderboard(true);
  }, []);

  const saveScoreToDatabase = async (name: string, scores: number) => {
    try {
      const saveData = await axios.post(
        `http://${process.env.REACT_APP_DB_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/saveData`,
        {
          name,
          scores,
        }
      );

      const playerId = saveData.data.id;

      setIsSave(true);
      const userData = await axios.get(
        `http://${process.env.REACT_APP_DB_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/getPlayerRank/${playerId}`
      );

      setRank(userData.data.rank);
      setTotalPlayerNumber(userData.data.totalRecords);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  // For timer
  useEffect(() => {
    const handleTimer = setInterval(() => {
      if (timeRemaining > 0 && !gameOver) {
        setTimeRemaining((prevTime) => prevTime - 1);
      } else {
        setGameOver(true);
      }
    }, 1000);

    const timerTimeout = setTimeout(() => {
      clearInterval(handleTimer);
    }, 60000);

    if (timeRemaining <= 0 && gameOver) {
      setTimeRemaining(60);
    }

    return () => {
      clearTimeout(timerTimeout);
      clearInterval(handleTimer);
    };
  }, [timeRemaining, gameOver, playerName, score]);

  // For setting items
  useEffect(() => {
    const handleItemPosition = setInterval(() => {
      const randomImage = Math.floor(Math.random() * 6) + 1;
      const randomPosition = Number(
        (Math.random() * window.innerWidth).toPrecision()
      );

      setImages((prevImages) => [
        ...prevImages,
        {
          id: uuid(),
          src: getImageName(randomImage),
          top: 0,
          left: randomPosition,
        },
      ]);
    }, 1500);

    return () => {
      clearInterval(handleItemPosition);
    };
  }, []);

  // For scoring & falling animation
  useEffect(() => {
    let animationFrame: number;

    const moveImages = () => {
      setImages((prevImages) => {
        const updatedImages = prevImages.map((image) => ({
          ...image,
          top: image.top + 5,
        }));

        const catcherWidth = 100;
        const catcherHeight = 10;
        const catcherTop = window.innerHeight - catcherHeight;
        const catcherLeft = catcherRef.current?.offsetLeft || 0;
        const catcherRight = catcherLeft + catcherWidth;

        updatedImages.forEach((image) => {
          const imageWidth = 50;
          const imageHeight = 50;
          const imageTop = image.top;
          const imageBottom = imageTop + imageHeight;
          const imageLeft = image.left;
          const imageRight = imageLeft + imageWidth;

          if (
            imageBottom >= catcherTop &&
            imageLeft <= catcherRight &&
            imageRight >= catcherLeft
          ) {
            let scoreChange = 0;

            if (
              image.src === p1 ||
              image.src === p2 ||
              image.src === p3 ||
              image.src === p4
            ) {
              scoreChange = 50;
            } else if (image.src === e1 || image.src === e2) {
              scoreChange = -100;
            }

            setScore((prevScore) => prevScore + scoreChange);

            // Remove the collided image from the array
            const index = updatedImages.findIndex((img) => img.id === image.id);
            updatedImages.splice(index, 1);
          }
        });

        return updatedImages.filter((image) => image.top < window.innerHeight);
      });
      animationFrame = requestAnimationFrame(moveImages);
    };

    const animationTimeout = setTimeout(() => {
      cancelAnimationFrame(animationFrame);
    }, 60000);

    animationFrame = requestAnimationFrame(moveImages);

    return () => {
      clearTimeout(animationTimeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [images]);

  return (
    <>
      {goBack ? (
        <StartMenu />
      ) : goLeaderboard ? (
        <Leaderboard />
      ) : (
        <GameWrapper>
          {gameOver && !isSave ? (
            <StyledPopup>
              <div>Save your result!</div> Your Score: {score}
              <div>
                <StyledInput
                  name="playerName"
                  placeholder={"Your name"}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
                <button onClick={() => saveScoreToDatabase(playerName, score)}>
                  &rarr;
                </button>
              </div>
            </StyledPopup>
          ) : gameOver && isSave ? (
            <StyledPopup>
              <div>Your Name: {playerName}</div>
              Your Rank: {rank} / {totalPlayerNumber}
              <ButtonContainer>
                <StyledButton onClick={handleGoBack}>&larr; Back</StyledButton>
                <StyledButton onClick={handleGoLeaderboard}>
                  Leaderboard &rarr;
                </StyledButton>
              </ButtonContainer>
            </StyledPopup>
          ) : (
            <GameContainer onMouseMove={handleMouseMove}>
              <TopContainer>
                <StyledButton onClick={handleGoBack}>&larr; Back</StyledButton>
                <InfoContainer>
                  <div>Score: {score}</div>
                  <RemainTime time={timeRemaining}>
                    Time Remaining: {timeRemaining}
                  </RemainTime>
                </InfoContainer>
              </TopContainer>
              {images.map((image) => (
                <ScoreItem
                  key={image.id}
                  src={image.src}
                  alt="Falling"
                  top={image.top}
                  left={image.left}
                />
              ))}
              <Catcher ref={catcherRef} position={catcherPosition} />
            </GameContainer>
          )}
        </GameWrapper>
      )}
    </>
  );
};

const GameWrapper = styled.div`
  background-image: url("${bg1}");
  background-position: center;
  background-repeat: "no-repeat";
  background-size: cover;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const TopContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: auto;
  background-color: #fff;
  opacity: 0.7;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 300px;
  margin: 10px;
`;

interface ScoreItemProps {
  top: number;
  left: number;
}

const ScoreItem = styled.img<ScoreItemProps>`
  position: absolute;
  top: ${(p) => `${p.top}px`};
  left: ${(p) => `${p.left}px`};
  width: 50px;
  height: auto;
`;

const StyledButton = styled.button`
  width: fit-content;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #5d6d7e;
  border: 0;
  background-color: transparent;
`;

interface RemainTimeProps {
  time: number;
}

const RemainTime = styled.div<RemainTimeProps>`
  color: ${(p) => (p.time <= 10 ? "#f72c22" : "#000")};
`;

const StyledPopup = styled.div`
  position: relative;
  background-color: #f8ecf2;
  width: 300px;
  height: 100px;
  padding: 10px;
  font-size: 18px;
  text-align: center;
`;

const StyledInput = styled.input`
  margin-top: 5px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  width: inherit;
  position: absolute;
  display: flex;
  justify-content: space-between;
  bottom: 10px;
`;

export default Game;
