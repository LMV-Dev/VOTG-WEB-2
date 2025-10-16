import { Fragment, useEffect, useState } from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { UuidTool } from 'uuid-tool'

/*MUI Element*/
import { styled } from '@mui/material/styles'
import { Box, Tooltip, TextField, Typography, Divider } from '@mui/material'

const Element_TopTItle = (props) => {
    const { mode, questionItem, questionIndex, questionNumber, isFocusing, isEditing, onChangeEditThisItem_Value } = props
    const [writeToggle, setWriteToggle] = useState(false)

    useEffect(() => {
        if (mode == undefined || mode == 'read') {
            setWriteToggle(false)
        } else if (mode == 'write') {
            setWriteToggle(true)
        }

        if (isEditing !== true) {
            isEditing = false
        }
        if (isFocusing !== true) {
            isFocusing = false
        }
    }, [])

    return (
        <>
            <Box sx={{ py: 0 }}>
                {isEditing ? (
                    // Edit mode == Not View Mode
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'top',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                }}
                            >{`${questionNumber}.`}</Typography>
                            <Typography
                                // ref={(el) => (titleRef.current[questionIndex] = el)}
                                sx={{
                                    visibility: 'hidden',
                                    position: 'absolute',
                                }}
                            >
                                {questionItem.title}
                            </Typography>

                            <Tooltip arrow title="문항 제목 입력해주세요" placement="right" sx={{ my: 0 }}>
                                <TextField
                                    focused={questionItem.title?.length === 0}
                                    multiline={true}
                                    variant="standard"
                                    // error={
                                    //     questionItem.title?.length < 5 ||
                                    //     questionItem.title?.length > 51
                                    // }
                                    size={'small'}
                                    label=""
                                    margin="normal"
                                    name={'title'}
                                    onChange={(e) => onChangeEditThisItem_Value(questionIndex, e)}
                                    placeholder="문항 제목을 입력해주세요"
                                    type="text"
                                    value={questionItem.title}
                                    sx={{
                                        // minWidth: '250px',
                                        // width: 'calc(100% - 50px)',
                                        width: '100%',
                                        maxWidth: '100%',
                                        fontSize: '0.8rem',
                                        fontWeight: '700',
                                        // mt: 2.4,
                                        ml: 1,
                                        mt: 0,
                                        mb: 0,
                                    }}
                                    inputProps={{
                                        style: {
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            lineHeight: '1.5',
                                        },
                                    }}
                                />
                            </Tooltip>
                        </Box>
                        {/* </Tooltip> */}
                        <Divider sx={{ mt: 1.3, visibility: 'hidden' }} />
                    </>
                ) : (
                    // Not Edit mode == View Mode
                    <>
                        <Box sx={{ pt: 0, pb: 1 }}>
                            {questionItem.title?.length > 0 ? (
                                <>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'top',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                            }}
                                        >{`${questionNumber}.`}</Typography>
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'pre-wrap', ml: 1 }}>{`${questionItem.title}`}</Typography>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    {writeToggle ? (
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'error.light' }}>{`${questionNumber}. 문항 제목이 입력되지 않았습니다.`}</Typography>
                                    ) : (
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'text.secondary' }}>{`${questionNumber}. 문항 제목을 입력해주세요`}</Typography>
                                    )}
                                </>
                            )}
                            <Divider sx={{ mt: 1 }} />
                        </Box>
                    </>
                )}
            </Box>
        </>
    )
}

export default Element_TopTItle
