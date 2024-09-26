import { useState, useRef } from 'react'
import {
  Container,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { processQuestion } from './service';
import { colors } from './common/colors';
import './App.css'
import Logo from './components/Logo';
import QuestionSection from './components/QuestionSection';
import AnswerSection from './components/AnswerSection';

function App() {
  const [ question, setQuestion ] = useState("")
  const [ displayQuestion, setDisplayQuestion ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const [ streamedAnswer, setStreamedAnswer ] = useState("")
  const [ showAnswerSection, setShowAnswerSection ] = useState(false)
  const [ showSnackBar, setShowSnackBar ] = useState(false)
  const [ snackbarMessage, setSnackBarMessage ] = useState("")
  const [ snackbarColor, setSnackbarColor ] = useState(colors.PRIMARY)
  const [ isStreamDone, setIsStreamDone ] = useState(false)
  const [ isActionButtonsDisabled, setIsActionButtonDisabled ] = useState(false)
  const stopStreamRef = useRef(false)

  const handleStopStream = () => {
    stopStreamRef.current = true
    setIsActionButtonDisabled(false)
    setIsStreamDone(true)
  }

  const handleClear = () => {
    setQuestion("")
    setLoading(false)
    setStreamedAnswer("")
    setDisplayQuestion("")
    setShowAnswerSection(false)
    setIsStreamDone(false)
    setIsActionButtonDisabled(false)
    stopStreamRef.current = false
  }

  const setSnackBarDetails = (color, message, show) => {
    setSnackbarColor(color)
    setSnackBarMessage(message)
    setShowSnackBar(show)
  }

  const handleResponseStreaming = async data => {
    const reader = data.body.getReader();
    const textDecoder = new TextDecoder();
    setLoading(false)
    while (!stopStreamRef.current) {
      const { value, done } = await reader.read();
      if (done) {
        setIsActionButtonDisabled(false)
        setIsStreamDone(done)
        break;
      }
      const decodedChunk = textDecoder.decode(value, { stream: true });
      setStreamedAnswer((answer) => answer + decodedChunk);
    }
  }

  const handleSubmit = async e => {
    if (!question) {
      setSnackBarDetails(colors.ERROR, "Please enter a valid question", true)
      return
    }
    try {
      e.preventDefault()
      setIsActionButtonDisabled(true)
      setStreamedAnswer("")
      setDisplayQuestion(question)
      setQuestion("")
      setShowAnswerSection(true)
      setLoading(true)
      stopStreamRef.current = false
      setIsStreamDone(false)
      const response = await processQuestion(question)
      await handleResponseStreaming(response)
    } catch (exception) {
      setSnackBarDetails(colors.ERROR, exception.message, true)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = async e => {
    if (e.key === 'Enter' && !isActionButtonsDisabled) {
      handleSubmit(e)
    }
  }

  return (
    <Container
      sx={{
        width: "100%"
      }}
      disableGutters={true}
      maxWidth="lg"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="50vh"
        sx={{
          paddingLeft: "10px"
        }}
      >
        <Logo />
        <QuestionSection
          question={question}
          setQuestion={setQuestion}
          isActionButtonsDisabled={isActionButtonsDisabled}
          handleClear={handleClear}
          handleSubmit={handleSubmit}
          handleKeyDown={handleKeyDown}
        />
        {
          showAnswerSection && (
            <AnswerSection
              isStreamDone={isStreamDone}
              streamedAnswer={streamedAnswer}
              displayQuestion={displayQuestion}
              loading={loading}
              handleStopStream={handleStopStream}
              setSnackBarDetails={setSnackBarDetails}
            />
          )
        }
      </Box>
      <Snackbar
        open={showSnackBar}
        autoHideDuration={3000}
        onClose={() => setShowSnackBar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowSnackBar(false)}
          variant="filled"
          sx={{ width: '100%', backgroundColor: snackbarColor }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default App
