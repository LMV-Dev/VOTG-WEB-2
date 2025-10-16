import { Fragment, useEffect, useCallback, useState } from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { UuidTool } from 'uuid-tool'

/*MUI Element*/
import { styled } from '@mui/material/styles'
import { Box, IconButton, Typography, TextField, Tooltip, Divider, Select, MenuItem } from '@mui/material'

/*MUI Icon*/
import DragHandleIcon from '@mui/icons-material/DragHandle'

/*Transition*/
import { TransitionGroup, CSSTransition } from 'react-transition-group'

/*Custom Icon*/
import { IconSurveyDelete } from '@public/votg/IconSurveyDelete'

const Element_BottomIndicator = (props) => {
    const { mode, isFocusing, questionList, setQuestionList, questionsLength, questionItem, isEditing, currentSelected, duration } = props
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

    /* 선택지 내용 수정 */
    const onChangeLogicContents = useCallback(
        (selectedQuestionLogicNext, selectedQuestionIndex, answerIndex, answerId, nextQuestionId) => {
            console.log('onChangeLogicContents - selectedQuestionLogicNext', selectedQuestionLogicNext)
            console.log('onChangeLogicContents - selectedQuestionIndex', selectedQuestionIndex)
            console.log('onChangeLogicContents - answerIndex', answerIndex)
            console.log('onChangeLogicContents - answerId', answerId)
            console.log('onChangeLogicContents - nextQuestionId', nextQuestionId)
            let logicNextArray = []
            // if (answerIndex === questionItem.length) {
            //     selectedQuestionLogicNext[answerIndex] = {}
            // }

            questionList.map((q) => q.id).indexOf(questionItem.logicNext[questionItem?.answer?.length]?.questionId)

            if (selectedQuestionLogicNext == null || selectedQuestionLogicNext.length == 0) {
                logicNextArray = questionList[selectedQuestionIndex].answer.map((item) => {
                    // if (item.id === answerId) {
                    //     return { id: item.id, questionId: nextQuestionId }
                    // } else {
                    //     return { id: item.id, questionId: null }
                    // }
                    return { id: item.id, questionId: nextQuestionId }
                })
            } else {
                selectedQuestionLogicNext[answerIndex] = { id: answerId, questionId: nextQuestionId }
                logicNextArray = selectedQuestionLogicNext
            }

            const updateList = questionList.map((item, index) => {
                if (selectedQuestionIndex === index) {
                    let updateItem = { ...item, logicNext: logicNextArray }
                    return updateItem
                }
                return item
            })
            setQuestionList([...updateList])
        },
        [questionList],
    )

    useEffect(() => {
        // console.log('questionList length', questionList.length)

        if (questionItem.logicActive && questionItem.logicNext?.length > 0) {
            const changeLogicNextArray = questionItem.logicNext.map((item) => {
                if (questionList.map((q) => q.id).indexOf(item.questionId) < 0) {
                    return { ...item, questionId: '' }
                } else {
                    return item
                }
            })
            // console.log('changeLogicNextArray', changeLogicNextArray)
            const updateList = questionList.map((item, index) => {
                if (questionItem.id === item.id) {
                    let updateItem = { ...item, logicNext: changeLogicNextArray }
                    return updateItem
                }
                return item
            })
            // console.log('updateList', updateList)
            setQuestionList([...updateList])
        }
    }, [questionList.length])

    return (
        <>
            {/* <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 0.5,
                    mb: 1,
                }}
            >
                {!writeToggle && (
                    <Tooltip title="원하는 위치에 끌어다 놓으세요">
                        <DragHandleIcon color={'secondary'} sx={{ cursor: 'grab' }} />
                    </Tooltip>
                )}
            </Box> */}

            {questionItem.logicActive ? (
                <Box sx={{ my: 2 }}>
                    <Divider sx={{ my: 1.5 }} />
                    {questionsLength == 1 || questionList.map((q) => q.id).indexOf(questionItem.id) == questionsLength - 1 ? (
                        <>
                            <Typography
                                sx={{
                                    fontSize: '0.8rem',
                                    color: 'primary.main',
                                    fontWeight: 500,
                                }}
                            >
                                *로직을 사용하기 위해 다음 문항을 추가하세요.
                            </Typography>
                        </>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                // justifyContent: 'space-between',
                                alignItems: 'left',
                                mt: 1,
                                mb: 1.5,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'left',
                                    alignItems: 'center',
                                    mt: 1,
                                    mb: 1.5,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        color: 'primary.main',
                                        fontWeight: 500,
                                    }}
                                >
                                    *로직
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.5rem',
                                        color: 'secondary.main',
                                        fontWeight: 400,
                                        ml: 1,
                                    }}
                                >
                                    응답에 따라 이동할 다음 문항을 선택해 주세요.
                                </Typography>
                            </Box>
                            {isEditing ? (
                                <Box sx={{ px: 3 }}>
                                    <TransitionGroup>
                                        {questionItem.answer.map((a, aIndex) => {
                                            // console.log('a', a)
                                            const questionNumber = aIndex + 1
                                            return (
                                                <CSSTransition key={a.id} timeout={duration} classNames="fade">
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mt: 1,
                                                            mb: 1.5,
                                                            borderBottom: '1px solid #eee',
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'left',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '0.8rem',
                                                                    color: 'text.main',
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                {questionItem.type === 0 ? `${questionNumber}번 선택지 응답 후` : `응답 후`}
                                                            </Typography>
                                                        </Box>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                minWidth: '130px',
                                                            }}
                                                        >
                                                            {/* <TextField fullWidth name="option" onChange={(e) => console.log(e)} select SelectProps={{ native: true }} value={questionList[0].code}> */}
                                                            {/* <TextField
                                                                fullWidth
                                                                size="small"
                                                                name="option"
                                                                onChange={(e) => onChangeLogicContents(questionItem.logicNext, currentSelected, aIndex, a.id, e.target.value)}
                                                                // select={questionItem.logicNext?.length > 0 ? questionItem.logicNext[aIndex].questionId : null}
                                                                select
                                                                SelectProps={{ native: true }}
                                                                sx={{ mb: 1 }}
                                                            >
                                                                {questionList
                                                                    .filter((q, qIndex) => q.id !== questionItem.id && qIndex > questionList.map((q) => q.id).indexOf(questionItem.id))
                                                                    .map((q, qIndex) => (
                                                                        <option key={`q-list-${qIndex}`} value={q.id}>
                                                                            {questionList.map((q) => q.id).indexOf(q.id) + 1}번 문항
                                                                        </option>
                                                                    ))}
                                                            </TextField> */}

                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={questionItem.logicNext?.length > 0 ? questionItem.logicNext[aIndex]?.questionId : ''}
                                                                onChange={(e) => onChangeLogicContents(questionItem.logicNext, currentSelected, aIndex, a.id, e.target.value)}
                                                                sx={{ mb: 1 }}
                                                                size="small"
                                                                displayEmpty
                                                            >
                                                                <MenuItem value="">
                                                                    <em>선택하기</em>
                                                                </MenuItem>
                                                                {questionList
                                                                    .filter((q, qIndex) => q.id !== questionItem.id && qIndex > questionList.map((q) => q.id).indexOf(questionItem.id))
                                                                    .map((q, qIndex) => (
                                                                        <MenuItem key={`q-list-${qIndex}`} value={q.id}>
                                                                            {questionList.map((q) => q.id).indexOf(q.id) + 1}번 문항
                                                                        </MenuItem>
                                                                    ))}
                                                            </Select>
                                                        </Box>
                                                    </Box>
                                                </CSSTransition>
                                            )
                                        })}

                                        {questionItem.etcActive && (
                                            <CSSTransition timeout={duration} classNames="fade">
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        mt: 1,
                                                        mb: 1.5,
                                                        borderBottom: '1px solid #eee',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'left',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: '0.8rem',
                                                                color: 'text.main',
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {questionItem.type === 0 ? `기타 선택지 응답 후` : `응답 후`}
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            minWidth: '130px',
                                                        }}
                                                    >
                                                        {/* <TextField fullWidth name="option" onChange={(e) => console.log(e)} select SelectProps={{ native: true }} value={questionList[0].code}> */}
                                                        {/* <TextField
                                                                fullWidth
                                                                size="small"
                                                                name="option"
                                                                onChange={(e) => onChangeLogicContents(questionItem.logicNext, currentSelected, aIndex, a.id, e.target.value)}
                                                                // select={questionItem.logicNext?.length > 0 ? questionItem.logicNext[aIndex].questionId : null}
                                                                select
                                                                SelectProps={{ native: true }}
                                                                sx={{ mb: 1 }}
                                                            >
                                                                {questionList
                                                                    .filter((q, qIndex) => q.id !== questionItem.id && qIndex > questionList.map((q) => q.id).indexOf(questionItem.id))
                                                                    .map((q, qIndex) => (
                                                                        <option key={`q-list-${qIndex}`} value={q.id}>
                                                                            {questionList.map((q) => q.id).indexOf(q.id) + 1}번 문항
                                                                        </option>
                                                                    ))}
                                                            </TextField> */}

                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={questionItem.logicNext?.length > 0 ? questionItem.logicNext[questionItem.answer.length]?.questionId : ''}
                                                            onChange={(e) => onChangeLogicContents(questionItem.logicNext, currentSelected, questionItem.answer.length, `etc-${questionItem.id}`, e.target.value)}
                                                            sx={{ mb: 1 }}
                                                            size="small"
                                                            displayEmpty
                                                        >
                                                            <MenuItem value="">
                                                                <em>선택하기</em>
                                                            </MenuItem>
                                                            {questionList
                                                                .filter((q, qIndex) => q.id !== questionItem.id && qIndex > questionList.map((q) => q.id).indexOf(questionItem.id))
                                                                .map((q, qIndex) => (
                                                                    <MenuItem key={`q-list-${qIndex}`} value={q.id}>
                                                                        {questionList.map((q) => q.id).indexOf(q.id) + 1}번 문항
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    </Box>
                                                </Box>
                                            </CSSTransition>
                                        )}
                                    </TransitionGroup>
                                </Box>
                            ) : (
                                <Box sx={{ px: 3 }}>
                                    {questionItem.answer.map((a, aIndex) => {
                                        // console.log('a', a)
                                        const questionNumber = aIndex + 1
                                        return (
                                            <Box
                                                key={a.id}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mt: 1,
                                                    mb: 1.5,
                                                    borderBottom: '1px solid #eee',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'left',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '0.8rem',
                                                            color: 'text.main',
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {questionItem.type === 0 ? `${questionNumber}번 선택지 응답 후` : `응답 후`}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        minWidth: '130px',
                                                    }}
                                                >
                                                    {questionItem.logicNext?.length > 0 && questionItem.logicNext[aIndex]?.questionId !== '' ? (
                                                        <Typography
                                                            sx={{
                                                                fontSize: '1rem',
                                                                color: 'text.main',
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {`${questionList.map((q) => q.id).indexOf(questionItem.logicNext[aIndex]?.questionId) + 1}번 문항`}
                                                        </Typography>
                                                    ) : writeToggle ? (
                                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'error.light' }}>{`다음 문항이 선택되지 않았습니다.`}</Typography>
                                                    ) : (
                                                        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: 'text.secondary' }}>{`선택하기`}</Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        )
                                    })}
                                    {questionItem.etcActive && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mt: 1,
                                                mb: 1.5,
                                                borderBottom: '1px solid #eee',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'left',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '0.8rem',
                                                        color: 'text.main',
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {questionItem.type === 0 ? `기타 선택지 응답 후` : `응답 후`}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    minWidth: '130px',
                                                }}
                                            >
                                                {questionItem.logicNext[questionItem?.answer?.length]?.questionId !== '' ? (
                                                    <Typography
                                                        sx={{
                                                            fontSize: '1rem',
                                                            color: 'text.main',
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {`${questionList.map((q) => q.id).indexOf(questionItem.logicNext[questionItem?.answer?.length]?.questionId) + 1}번 문항`}
                                                    </Typography>
                                                ) : writeToggle ? (
                                                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'error.light' }}>{`다음 문항이 선택되지 않았습니다.`}</Typography>
                                                ) : (
                                                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: 'text.secondary' }}>{`선택하기`}</Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            ) : (
                <Box></Box>
            )}
        </>
    )
}

export default Element_BottomIndicator
