import { useState, useRef } from 'react'
import Markdown from 'react-markdown'
import {
  Container,
  Stack,
  TextField,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { processQuestion } from './service';
import './App.css'
import { ContentCopy, Stop } from '@mui/icons-material';

function App() {
  const [ question, setQuestion ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const [ streamedAnswer, setStreamedAnswer ] = useState("")
  const [ showAnswerSection, setShowAnswerSection ] = useState(false)
  const stopStreamRef = useRef(false)

  const handleStopStream = () => {
    stopStreamRef.current = true
  }

  const handleResponseStreaming = async data => {
    const reader = data.body.getReader();
    const textDecoder = new TextDecoder();
    setLoading(false)
    while (!stopStreamRef.current) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      const decodedChunk = textDecoder.decode(value, { stream: true });
      setStreamedAnswer((answer) => answer + decodedChunk);
    }
  }

  const handleClick = async e => {
    try {
      setStreamedAnswer("")
      setShowAnswerSection(true)
      setLoading(true)
      stopStreamRef.current = false
      e.preventDefault()
      const response = await processQuestion(question)
      await handleResponseStreaming(response)
    } catch (exception) {
      console.log(exception.message)
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
        <Stack>
          <img
            style={{
              width: "350px",
              height: "330px"
            }}
            src="/images/logo.png" 
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
          >
            Clear
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 2, outline: "none", backgroundColor: "#21aff6" }}
            onClick={e => handleClick(e)}
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
                  <IconButton aria-label="stop-stream">
                    <ContentCopy />
                  </IconButton>
                  <IconButton onClick={() => handleStopStream()} aria-label="stop-stream">
                    <Stop sx={{ color: "#fe6464" }} />
                  </IconButton>
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
                  {question}
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
    </Container>
  )
}

export default App
