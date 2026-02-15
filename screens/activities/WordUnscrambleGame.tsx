import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { chaptersData } from '../../data/chaptersData';

const WordUnscrambleGame = ({ rangeId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scrambledWord, setScrambledWord] = useState([]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    const chapter1Quiz = chaptersData.find((chapter) => chapter.id === 1)?.quiz || [];
    setQuestions(chapter1Quiz);
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const word = currentQuestion.correct.toUpperCase();
      setScrambledWord(scramble(word.split('')));
      setUserAnswer(Array(word.length).fill(null));
    }
  }, [questions, currentQuestionIndex]);

  const scramble = (word) => {
    return word.sort(() => Math.random() - 0.5);
  };

  const handleLetterPress = (letter, index) => {
    const newScrambledWord = [...scrambledWord];
    newScrambledWord[index] = null;
    setScrambledWord(newScrambledWord);

    const newUserAnswer = [...userAnswer];
    const emptyIndex = newUserAnswer.findIndex((l) => l === null);
    newUserAnswer[emptyIndex] = letter;
    setUserAnswer(newUserAnswer);
  };

  const handleAnswerLetterPress = (letter, index) => {
    const newUserAnswer = [...userAnswer];
    newUserAnswer[index] = null;
    setUserAnswer(newUserAnswer);

    const newScrambledWord = [...scrambledWord];
    const emptyIndex = newScrambledWord.findIndex((l) => l === null);
    newScrambledWord[emptyIndex] = letter;
    setScrambledWord(newScrambledWord);
  };

  const checkAnswer = () => {
    const isAnswerCorrect =
      userAnswer.join('') === questions[currentQuestionIndex].correct.toUpperCase();
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          // Game finished
          alert('You finished the game!');
        }
        setIsCorrect(null);
      }, 1000);
    }
  };

  if (questions.length === 0) {
    return <Text>Loading...</Text>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{currentQuestion.question}</Text>
      <Text style={styles.wordToDefine}>{currentQuestion.wordToDefine}</Text>

      <View style={styles.answerContainer}>
        {userAnswer.map((letter, index) => (
          <TouchableOpacity
            key={index}
            style={styles.letterBox}
            onPress={() => handleAnswerLetterPress(letter, index)}>
            <Text style={styles.letter}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.scrambledWordContainer}>
        {scrambledWord.map((letter, index) => (
          <TouchableOpacity
            key={index}
            style={styles.letterBox}
            onPress={() => handleLetterPress(letter, index)}
            disabled={!letter}>
            <Text style={styles.letter}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.checkButton} onPress={checkAnswer}>
        <Text style={styles.checkButtonText}>Check</Text>
      </TouchableOpacity>

      {isCorrect === true && <Text style={styles.correctText}>Correct!</Text>}
      {isCorrect === false && <Text style={styles.incorrectText}>Incorrect!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  question: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  wordToDefine: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  answerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  scrambledWordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  letterBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  letter: {
    fontSize: 24,
  },
  checkButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    marginTop: 20,
  },
  checkButtonText: {
    fontSize: 20,
  },
  correctText: {
    color: 'green',
    fontSize: 20,
    marginTop: 10,
  },
  incorrectText: {
    color: 'red',
    fontSize: 20,
    marginTop: 10,
  },
});

export default WordUnscrambleGame;
