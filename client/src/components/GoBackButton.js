import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GoBackButton.css';

const GoBackButton = () => {
  const navigate = useNavigate();
  return (
    <button className="go-back-btn" onClick={() => navigate(-1)}>
      ← Go Back
    </button>
  );
};

export default GoBackButton;
