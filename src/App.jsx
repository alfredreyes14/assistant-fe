import { useState } from 'react'
import { Container, Stack, TextField, Button, Box } from '@mui/material';
import './App.css'


function App() {
  const [ prompt, setPrompt ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const [ streamedAnswer, setStreamedAnswer ] = useState("")

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
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderRadius: '15px', // Adjust the value as needed
              },
            },
            width: "80vw",
            borderRadius: "20px"
          }}
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
          >
            Ask
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default App
