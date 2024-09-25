import { useState } from 'react'
import Markdown from 'react-markdown'
import {
  Container,
  Stack,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import { processQuestion } from './service';
import './App.css'

function App() {
  const [ question, setQuestion ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const [ streamedAnswer, setStreamedAnswer ] = useState("")
  const [ showAnswerSection, setShowAnswerSection ] = useState(false)

  const handleResponseStreaming = async data => {
    const reader = data.body.getReader();
    const textDecoder = new TextDecoder();
    const counter = true;
    setLoading(false)
    while (counter) {
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
        justifyContent="center"
        minHeight="100vh"
        sx={{
          paddingLeft: "10px"
        }}
      >
        <TextField
          label="Enter your question"
          variant="outlined"
          margin="normal"
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
            color="primary"
            sx={{ mt: 2, outline: "none" }}
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
              <Typography>
                According to <Typography sx={{ textDecoration: "underline" }} variant="span">OpenAI</Typography>
              </Typography>
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
                  ? <>Answering your question ...</>
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
