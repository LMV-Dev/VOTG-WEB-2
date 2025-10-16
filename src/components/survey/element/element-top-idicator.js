import { Fragment, useEffect, useState } from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { UuidTool } from 'uuid-tool'

/*MUI Element*/
import { styled } from '@mui/material/styles'
import { Box, IconButton, Typography, Tooltip } from '@mui/material'

/*MUI Icon*/
import DragHandleIcon from '@mui/icons-material/DragHandle'

/*Custom Icon*/
import { IconSurveyDelete } from '@public/votg/IconSurveyDelete'

const Element_TopIndicator = (props) => {
    const { mode, isFocusing, questionsLength, questionItem, onClickRemoveThisItem } = props
    const [writeToggle, setWriteToggle] = useState(false)

    useEffect(() => {
        if (mode == undefined || mode == 'read') {
            setWriteToggle(false)
        } else if (mode == 'write') {
            setWriteToggle(true)
        }

        if (isFocusing !== true) {
            isFocusing = false
        }
    }, [])

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 1,
                    mb: 0.5,
                }}
            >
                {!writeToggle && (
                    <Tooltip title="원하는 위치에 끌어다 놓으세요">
                        <DragHandleIcon color={'secondary'} sx={{ cursor: 'grab' }} />
                    </Tooltip>
                )}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 1,
                    mb: 0.5,
                }}
            >
                {questionItem.required ? (
                    <Typography
                        sx={{
                            fontSize: '0.8rem',
                            color: 'primary.main',
                            fontWeight: 500,
                        }}
                    >
                        *필수
                    </Typography>
                ) : (
                    <Box></Box>
                )}
                {questionsLength > 1 && !writeToggle && (
                    // <IconButton onClick={(e) => onClickDeleteQuestionButton(e, q)}>
                    <Tooltip title="문항 삭제">
                        <IconButton onClick={onClickRemoveThisItem}>
                            <IconSurveyDelete
                                sx={{
                                    width: 21,
                                }}
                                customColor="#000"
                            />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </>
    )
}

export default Element_TopIndicator
