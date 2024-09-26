import React, { useEffect, useState } from 'react';
import axios from "axios";
import styled from 'styled-components';
import { BASE_URL } from '../utils/constant';

const EntriesList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const EntryItem = styled.li`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const VoteInfo = styled.div`
  margin-top: 10px;
`;

const randomQuestions = [
  "공부를 가장 잘할 것 같은 사람은?",
  "가장 재미있는 사람은?",
  "가장 친절한 사람은?"
];

function Bubble() {
  const [entries, setEntries] = useState([]);
  const [randomQuestion, setRandomQuestion] = useState("");

  useEffect(() => {
    // Fetch entries with votes
    axios.get(`${BASE_URL}/entries`)
      .then((res) => {
        setEntries(res.data);  // Now entries have votes associated
        setRandomQuestion(randomQuestions[Math.floor(Math.random() * randomQuestions.length)]);
      });
  }, []);  // Initial fetch when component mounts

  const voteForEntry = (entryId) => {
    axios.post(`${BASE_URL}/vote`, { entryId, question: randomQuestion })
      .then((res) => {                
        console.log("투표 성공:", res.data);
        
        // Option A: Re-fetch entries after a successful vote
        axios.get(`${BASE_URL}/entries`)
          .then((res) => {
            setEntries(res.data);  // Update the entries with fresh vote data
          });

      })
      .catch((err) => {
        console.error("투표 실패:", err);
      });
  };

  return (
    <div>
      <h2>버블 페이지</h2>
      <h3>{randomQuestion}</h3>
      <EntriesList>
        {entries.map((entry) => (
          <EntryItem key={entry._id}>
            <h4>{entry.name}</h4>
            <p>{entry.message}</p>

            {/* Display vote information */}
            <VoteInfo>
              <h5>투표 결과:</h5>
              
              {entry.votes && entry.votes.length > 0 ? (
                entry.votes.map((vote, index) => (
                  <p key={index}>
                    {vote.question}: {vote.count}표
                  </p>
                ))
              ) : (
                <p>아직 투표가 없습니다.</p>
              )}
            </VoteInfo>

            <Button onClick={() => voteForEntry(entry._id)}>
              이 사람을 선택
            </Button>
          </EntryItem>
        ))}
      </EntriesList>
    </div>
  );
}

export default Bubble;
