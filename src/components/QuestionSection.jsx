import React from 'react'
import { Stack, TextField, Button } from '@mui/material'
import { colors } from '../common/colors'

const QuestionSection = ({
  question,
  setQuestion,
  isActionButtonsDisabled,
  handleClear,
  handleSubmit
}) => {
  return (
    <Stack
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
    >
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
          disabled={isActionButtonsDisabled}
          onClick={() => handleClear()}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          sx={{ mt: 2, outline: "none", backgroundColor: colors.PRIMARY }}
          onClick={e => handleSubmit(e)}
          disabled={isActionButtonsDisabled}
        >
          Ask Me
        </Button>
      </Stack>
    </Stack>
  )
}

export default QuestionSection