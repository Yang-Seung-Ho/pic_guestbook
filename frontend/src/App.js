import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Guestbook from './routes/Guestbook';
import Bubble from './routes/Bubble';
import Test from './routes/Test';

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <ul>
            <li>
              <Link to="/">방명록</Link>
            </li>
            <li>
              <Link to="/bubble">버블</Link>
            </li>
            <li>
              <Link to="/test">테스트</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Guestbook />} />
          <Route path="/bubble" element={<Bubble />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;