import { useState, useRef } from 'react'
import Markdown from 'react-markdown'
import {
  Container,
  Stack,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { processQuestion } from './service';
import './App.css'
import { ContentCopy, Stop } from '@mui/icons-material';

const colors = {
  PRIMARY: "#21aff6",
  ERROR: "#fe6464"
}

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
  const [ isAskButtonDisabled, setIsAskButtonDisabled ] = useState(false)
  const stopStreamRef = useRef(false)

  const handleStopStream = () => {
    stopStreamRef.current = true
    setIsAskButtonDisabled(false)
    setIsStreamDone(true)
  }

  const handleClear = () => {
    setQuestion("")
    setLoading(false)
    setStreamedAnswer("")
    setDisplayQuestion("")
    setShowAnswerSection(false)
    setIsStreamDone(false)
    setIsAskButtonDisabled(false)
    stopStreamRef.current = false
  }

  const handleResponseStreaming = async data => {
    const reader = data.body.getReader();
    const textDecoder = new TextDecoder();
    setLoading(false)
    while (!stopStreamRef.current) {
      const { value, done } = await reader.read();
      if (done) {
        setIsAskButtonDisabled(false)
        setIsStreamDone(done)
        break;
      }
      const decodedChunk = textDecoder.decode(value, { stream: true });
      setStreamedAnswer((answer) => answer + decodedChunk);
    }
  }

  const handleClick = async e => {
    if (!question) {
      setSnackbarColor(colors.ERROR)
      setSnackBarMessage("Please enter a valid question")
      setShowSnackBar(true)
      return
    }
    try {
      setIsAskButtonDisabled(true)
      setStreamedAnswer("")
      setDisplayQuestion(question)
      setQuestion("")
      setShowAnswerSection(true)
      setLoading(true)
      stopStreamRef.current = false
      e.preventDefault()
      setIsStreamDone(false)
      const response = await processQuestion(question)
      await handleResponseStreaming(response)
    } catch (exception) {
      setSnackbarColor(colors.ERROR)
      setSnackBarMessage(exception.message)
      setShowSnackBar(true)
    } finally {
      setLoading(false)
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
        minHeight="100vh"
        sx={{
          paddingLeft: "10px"
        }}
      >
        <Stack mb={7}>
          <img
            style={{
              width: "300px",
              height: "130px"
            }}
            src="/images/logo2.png" 
          />
        </Stack>
        <TextField
          label="Enter your question"
          variant="outlined"
          value={question}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderRadius: '15px'
              },
            },
            width: "80vw",
            borderRadius: "20px",
            outline: "none"
          }}
          onChange={e => setQuestion(e.target.value)}
        />
        <Stack
          flexDirection="row"
          gap={3}
        >
          <Button
            variant="text"
            color="primary"
            sx={{ mt: 2, outline: "none" }}
            onClick={() => handleClear()}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 2, outline: "none", backgroundColor: colors.PRIMARY }}
            onClick={e => handleClick(e)}
            disabled={isAskButtonDisabled}
          >
            Ask Me
          </Button>
        </Stack>
        {
          showAnswerSection && (
            <Stack
              sx={{
                height: "fit-content",
                width: "80vw",
                padding: "15px",
                backgroundColor: "#dfecfa",
                borderRadius: "10px",
                textAlign: "left"
              }}
              mt={7}
            >
              <Stack flexDirection="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography>
                  According to <Typography sx={{ textDecoration: "underline" }} variant="span">OpenAI</Typography>
                </Typography>
                <Stack flexDirection="row">
                  {
                    (isStreamDone) && (
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(streamedAnswer)
                          setSnackbarColor(colors.PRIMARY)
                          setSnackBarMessage("Answer has been copied to the clipboard")
                          setShowSnackBar(true)
                        }}
                        aria-label="stop-stream"
                      >
                        <ContentCopy />
                      </IconButton>
                    )
                  }
                  {
                    !isStreamDone && (
                      <IconButton onClick={() => handleStopStream()} aria-label="stop-stream">
                        <Stop sx={{ color: "#fe6464" }} />
                      </IconButton>
                    )
                  }
                </Stack>
              </Stack>
              <Typography sx={{
                fontSize: "1.2em",
                marginTop: "10px"
              }}>
                <Typography variant="span" sx={{ fontWeight: 400 }}>
                  Question: 
                </Typography>
                <Typography variant="span" sx={{ fontWeight: 600, marginLeft: "5px" }}>
                  {displayQuestion}
                </Typography>
              </Typography>
              {
                loading
                  ? (
                    <Stack
                      flexDirection="column"
                      sx={{
                        justifyItems: "center",
                        alignItems: "center"
                      }}
                    >
                      <img
                        src="/images/loader.gif"
                        style={{
                          width: "250px",
                          height: "210px"
                        }}
                      />
                    </Stack>
                  )
                  : (
                    <Markdown>{streamedAnswer}</Markdown>
                  )
              }
            </Stack>
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
