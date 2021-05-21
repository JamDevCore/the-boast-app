import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Select = styled.select`
  min-width: 200px;
  max-width: 300px;
  height: 40px;
  border: 1px solid grey;
  background: white;
  margin: 0 auto 10px 0;
  border-radius: 3px;
  padding: 10px;
  font-family: Quicksand;
`

const Button = styled.button`
  border: none;
  background-color:#4bb543;
  padding: 5px 10px;
  font-family: Quicksand;
  border-radius: 6px;
  min-width: 120px;
  max-width: 300px;
  color: white;
`

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid grey;
  background: white;
  margin: 0 auto 10px 0;
  border-radius: 3px;
  padding: 10px;
  font-family: Quicksand;
`

const Question = (props) => (
  <div className="Question">
    <h4>Question</h4>
    <Input />
  </div>
);

Question.propTypes = {

};

Question.defaultProps = {

};

export default Question;
