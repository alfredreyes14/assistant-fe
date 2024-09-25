import { useState } from 'react'
import Markdown from 'react-markdown'
import { Container, Stack, TextField, Button, Box } from '@mui/material';
import './App.css'


function App() {
  const [ question, setQuestion ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const [ streamedAnswer, setStreamedAnswer ] = useState("")

  const handleClick = async e => {
    e.preventDefault()
    const response = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }), // server is expecting JSON
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const loopRunner = true;

    while (loopRunner) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      const decodedChunk = decoder.decode(value, { stream: true });
      setStreamedAnswer((answer) => answer + decodedChunk);
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
                borderRadius: '15px', // Adjust the value as needed
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
            Ask
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
