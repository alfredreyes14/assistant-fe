import { useState } from 'react'
import Markdown from 'react-markdown'
import { Container, Stack, TextField, Button, Box } from '@mui/material';
import { processQuestion } from './service';
import './App.css'

function App() {
  const [ question, setQuestion ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const [ streamedAnswer, setStreamedAnswer ] = useState("")

  const handleResponseStreaming = async data => {
    const reader = data.body.getReader();
    const textDecoder = new TextDecoder();
    const counter = true;

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
      setLoading(true)
      e.preventDefault()
      const response = await processQuestion(question)
      await handleResponseStreaming(response)
    } catch (exception) {
      console.log(exception.message)
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
            sx={{ mt: 2 }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={e => handleClick(e)}
          >
            Ask Me
          </Button>
        </Stack>
        <Stack mt={7}>
          <Markdown>{streamedAnswer}</Markdown>
        </Stack>
      </Box>
    </Container>
  )
}

export default App
