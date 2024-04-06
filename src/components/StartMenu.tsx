import styled from "styled-components";
import bg2 from "../assets/bg2.png";
import { useState } from "react";
import Game from "./Game";
import Leaderboard from "./Leaderboard";

const StartMenu: React.FC = () => {
  const [goGame, setGoGame] = useState<boolean>(false);
  const [goLeaderboard, setGoLeaderboard] = useState<boolean>(false);

  const handleStartGameClick = () => {
    setGoGame(true);
  };

  const handleLeaderboardClick = () => {
    setGoLeaderboard(true);
  };

  return (
    <>
      {goGame ? (
        <Game />
      ) : goLeaderboard ? (
        <Leaderboard />
      ) : (
        <MenuContainer>
          <LinkContainer>
            <StyledButton onClick={handleStartGameClick}>
              Start Game
            </StyledButton>
            <StyledButton onClick={handleLeaderboardClick}>
              Leaderboard
            </StyledButton>
          </LinkContainer>
        </MenuContainer>
      )}
    </>
  );
};

const MenuContainer = styled.div`
  background-image: url("${bg2}");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LinkContainer = styled.div`
  height: 100px;
`;

const StyledButton = styled.button`
  text-align: center;
  background-color: #f8ecf2;
  width: 200px;
  height: 50px;
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #5d6d7e;
  text-decoration-line: none;
`;

export default StartMenu;
