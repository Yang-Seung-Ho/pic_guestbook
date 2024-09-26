import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from "axios";
import Webcam from "react-webcam";
import { BASE_URL } from '../utils/constant';
import styled from 'styled-components';

const Main = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const InputHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const CameraContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const CapturedImage = styled.img`
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

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

const ProfileImage = styled.img`
  width: 100px;
  height: 75px;
  object-fit: cover;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
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

const DeleteButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

function Guestbook() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState([]);
  const [updateUI, setUpdateUI] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const webcamRef = useRef(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/entries`)
      .then((res) => {
        console.log(res.data);
        setEntries(res.data);
      });
  }, [updateUI]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setShowCamera(false);
  }, [webcamRef]);

  const addEntry = () => {
    if (!imgSrc) {
      alert("사진을 먼저 촬영해주세요!");
      return;
    }
    axios.post(`${BASE_URL}/create`, { name, message, image: imgSrc }).then((res) => {
      console.log(res.data);
      setName('');
      setMessage('');
      setImgSrc(null);
      setUpdateUI((prevState) => !prevState);
    });
  };

  const updateMode = (id, name, message, image) => {
    setName(name);
    setMessage(message);
    setImgSrc(image);
    setUpdateId(id);
  };

  const updateEntry = () => {
    axios.put(`${BASE_URL}/update/${updateId}`, { name, message, image: imgSrc }).then((res) => {
      console.log(res.data);
      setUpdateUI((prevState) => !prevState);
      setUpdateId(null);
      setName('');
      setMessage('');
      setImgSrc(null);
    });
  };

  const deleteEntry = (id) => {
    axios.delete(`${BASE_URL}/delete/${id}`).then((res) => {
      console.log(res.data);
      setUpdateUI((prevState) => !prevState);
    });
  };

  return (
    <Main>
      <Title>방명록</Title>
      <InputHolder>
        <Input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextArea
          placeholder="메시지"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <CameraContainer>
          {showCamera ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
          ) : (
            <Button onClick={() => setShowCamera(true)}>카메라 켜기</Button>
          )}
          {showCamera && <Button onClick={capture}>사진 촬영</Button>}
        </CameraContainer>
        {imgSrc && (
          <CapturedImage src={imgSrc} alt="captured" />
        )}
        <SubmitButton type='submit' onClick={updateId ? updateEntry : addEntry}>
          {updateId ? "수정하기" : "작성하기"}
        </SubmitButton>
      </InputHolder>
      <EntriesList>
        
        
        {entries.map((entry) => (
          <EntryItem key={entry._id}>
            <h3>{entry.name}</h3>
            <p>{entry.message}</p>
            {console.log(entry)}
            <ProfileImage src={entry.image} alt={`${entry.name}'s profile`} />
            <p>{new Date(entry.createdAt).toLocaleString()}</p>
            <ButtonContainer>
              <Button onClick={() => updateMode(entry._id, entry.name, entry.message, entry.image)}>수정</Button>
              <DeleteButton onClick={() => deleteEntry(entry._id)}>삭제</DeleteButton>
            </ButtonContainer>
          </EntryItem>
        ))}
      </EntriesList>
    </Main>
  );
}

export default Guestbook;
