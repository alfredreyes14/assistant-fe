import React from 'react'
import { Stack, Typography, IconButton, } from '@mui/material'
import { ContentCopy, Stop } from '@mui/icons-material';
import Markdown from 'react-markdown'
import { colors } from '../common/colors';

const AnswerSection = ({
  isStreamDone,
  streamedAnswer,
  displayQuestion,
  loading,
  handleStopStream,
  setSnackBarDetails
}) => {
  return (
    <Stack
      sx={{
        height: "fit-content",
        width: "80vw",
        padding: "15px",
        backgroundColor: colors.SECONDARY,
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
                  setSnackBarDetails(colors.PRIMARY, "Answer has been copied to the clipboard", true)
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
                <Stop sx={{ color: colors.ERROR }} />
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

export default AnswerSection