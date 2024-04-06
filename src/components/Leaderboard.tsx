import styled from "styled-components";
import bg2 from "../assets/bg2.png";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import StartMenu from "./StartMenu";

type RankDataType = {
  id: string;
  name: string;
  scores: number;
};

const Leaderboard = () => {
  const [goBack, setGoBack] = useState<boolean>(false);
  const [rankData, setRankData] = useState<RankDataType[]>([]);

  const fetchRankData = () => {
    axios
      .get(
        `http://${process.env.REACT_APP_DB_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/list`
      )
      .then((response) => {
        setRankData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFetchDataPeriodically = useCallback(() => {
    const fetchDataInterval = setInterval(fetchRankData, 1000); // Fetch data every 5 seconds

    return () => clearInterval(fetchDataInterval);
  }, []);

  useEffect(() => {
    fetchRankData();
    const stopDataFetching = handleFetchDataPeriodically();

    return () => stopDataFetching();
  }, [handleFetchDataPeriodically]);

  return (
    <>
      {goBack ? (
        <StartMenu />
      ) : (
        <BoardWrapper>
          <MainWapper>
            TOP 100 PLAYERS
            <RankContainer>
              <RankList>
                <thead>
                  <tr key={"rankTableHead"}>
                    <th key={"Rank"}>RANK</th>
                    <th key={"Name"}>NAME</th>
                    <th key={"Scores"}>SCORE</th>
                  </tr>
                </thead>
                <RankBody>
                  {rankData.map((data, index) => (
                    <tr key={`${data.id}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{data.name}</td>
                      <td>{data.scores}</td>
                    </tr>
                  ))}
                </RankBody>
              </RankList>
            </RankContainer>
            <StyledButton onClick={() => setGoBack(true)}>
              &larr; Back
            </StyledButton>
          </MainWapper>
        </BoardWrapper>
      )}
    </>
  );
};

const BoardWrapper = styled.div`
  background-image: url("${bg2}");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const MainWapper = styled.div`
  width: 500px;
  height: 500px;
  background-color: #fff;
  opacity: 0.8;
  position: relative;
  padding: 20px;
  text-align: center;
  font-size: 30px;
  color: #b3443e;
`;

const RankContainer = styled.div`
  height: 450px;
  max-height: 450px;
  overflow-y: scroll;
  font-size: 16px;
  color: #000;
`;

const RankList = styled.table`
  width: 100%;
  table-layout: fixed;
  text-align: center;
  border-collapse: collapse;
`;

const RankBody = styled.tbody`
  margin-top: 20px;

  tr:nth-child(-n + 3) {
    background-color: #f77871;
  }
`;

const StyledButton = styled.button`
  position: absolute;
  margin-top: 10px;
  margin-left: -250px;
  color: #000;
  position: absolute;
  border: 0;
  background-color: transparent;
`;

export default Leaderboard;
