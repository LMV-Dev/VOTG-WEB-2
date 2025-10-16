import { useEffect, useState, useRef, useCallback, Fragment, createRef } from 'react'
import { UuidTool } from 'uuid-tool'

import {
    useMediaQuery,
    Box,
    Button,
    IconButton,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    Container,
    Divider,
    Grid,
    MenuItem,
    Tooltip,
    TextField,
    Toolbar,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    FormControlLabel,
    RadioGroup,
    Radio,
    Checkbox,
    Collapse,
    Rating,
} from '@mui/material'

/* M Icon */
import AddIcon from '@mui/icons-material/Add'

/*Transition*/
import { TransitionGroup, CSSTransition } from 'react-transition-group'

/* Survey Id Creater*/
import { createResourceCode } from '@utils/create-resource-id'
/* Survey Schema */
import { answerType } from '@schema/element-schema'

// 객관식 선택지
const Element_MidChoice = (props) => {
    const { mode, duration, questionList, setQuestionList, questionItem, questionIndex, questionNumber, isFocusing, isEditing, currentSelected } = props

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

    /* 선택지 추가 */
    const onClickAddQuestionAnswer = (selectedIndex) => {
        const updateList = questionList.map((item, index) => {
            if (selectedIndex === index) {
                let updateItem = { ...item, answer: [...item.answer, { id: UuidTool.newUuid().replace(/-/g, ''), ...answerType[item.type] }] }

                // console.log('updateItem', updateItem)
                return updateItem
            }
            return item
        })
        // console.log('onAddQuestionAnswer', updateList)
        setQuestionList([...updateList])
    }
    /* 선택지 내용 수정 */
    const onChangeQuestionAnswer = (selectedIndex, event, editAnswer, index) => {
        // console.log('onChangeQuestionAnswer - name', event.target.name)
        // console.log('onChangeQuestionAnswer - value', event.target.value)
        const answerList = questionList[selectedIndex].answer.filter((item) => item.id !== editAnswer.id)
        answerList.splice(index, 0, { ...editAnswer, content: event.target.value })
        const updateList = questionList.map((item, index) => {
            if (selectedIndex === index) {
                let updateItem = { ...item, answer: answerList }
                return updateItem
            }
            return item
        })
        setQuestionList([...updateList])
    }
    /* 선택지 삭제 */
    const onClickDeleteQuestionAnswer = (selectedIndex, deleteAnswer) => {
        const answerList = questionList[selectedIndex].answer.filter((item) => item.id !== deleteAnswer.id)
        let logicList
        if (questionList[selectedIndex].logicActive) {
            logicList = questionList[selectedIndex].logicNext.filter((item) => item.id !== deleteAnswer.id)
        }
        // console.log('answerList', answerList)
        const updateList = questionList.map((item, index) => {
            if (selectedIndex === index) {
                let updateItem = !questionList[selectedIndex].logicActive ? { ...item, answer: answerList } : { ...item, answer: answerList, logicNext: logicList }

                // console.log('updateItem', updateItem)
                return updateItem
            }
            return item
        })
        // console.log('onDeleteQuestionAnswer', updateList)
        setQuestionList([...updateList])
    }

    /* ETC 선택지 활성화*/
    const onClickActiveEtcAnswer = (selectedIndex) => {
        const updateList = questionList.map((item, index) => {
            if (selectedIndex === index) {
                let updateItem = { ...item, etcActive: true, etcAnswer: answerType[1] }
                return updateItem
            }
            return item
        })
        setQuestionList([...updateList])
    }

    /* ETC 선택지 삭제*/
    const onClickDisableQuestionEtcAnswer = (selectedIndex) => {
        const updateList = questionList.map((item, index) => {
            if (selectedIndex === index) {
                let updateItem = { ...item, etcActive: false, etcAnswer: null }
                // console.log('updateItem', updateItem)
                return updateItem
            }
            return item
        })
        // console.log('onClickRemoveQuestionEtcAnswer', updateList)
        setQuestionList([...updateList])
    }

    /**
     *
     *
     * 선택지 선택 여부에 대한 이벤트 OnChange
     * Preview 페이지 및 Answer 페이지  => Write Mode
     *
     *
     */

    // onChange : 00 Choice Element 객관식
    const onChangeChoiceAnswer = (event, mode, selectedIndex, innerItem, rowIndex) => {
        event.stopPropagation()
        if (writeToggle) {
            // console.log('onChangeChoiceAnswer - selectedIndex', selectedIndex)
            // console.log('onChangeChoiceAnswer - innerItem', innerItem)
            // console.log('onChangeChoiceAnswer - rowIndex', rowIndex)
            let updateList = null
            if (mode === 'radio') {
                let innerItemList = questionList[selectedIndex].answer.filter((item) => item !== innerItem)

                innerItemList = innerItemList.map((choice, cIndex) => {
                    choice.checked = false
                    return choice
                })

                innerItemList.splice(rowIndex, 0, { ...innerItem, checked: true })

                updateList = questionList.map((item, itemIndex) => {
                    if (selectedIndex === itemIndex) {
                        let updateItem = {
                            ...item,
                            checked: rowIndex,
                            answer: [...innerItemList],
                            etcAnswer: null,
                        }
                        return updateItem
                    }
                    return item
                })
            } else if (mode === 'checkbox') {
                let innerItemList = questionList[selectedIndex].answer.filter((item) => item !== innerItem)

                if (innerItem.checked) {
                    innerItemList.splice(rowIndex, 0, { ...innerItem, checked: false })
                } else {
                    innerItemList.splice(rowIndex, 0, { ...innerItem, checked: true })
                }

                let saveArray = []
                if (questionList[selectedIndex].checked === null || !Array.isArray(questionList[selectedIndex].checked)) {
                    saveArray = [rowIndex]
                } else {
                    if (questionList[selectedIndex].checked.includes(rowIndex)) {
                        saveArray = questionList[selectedIndex].checked.filter((data) => {
                            return data != rowIndex
                        })
                    } else {
                        saveArray = [...questionList[selectedIndex].checked, rowIndex]
                    }
                }

                updateList = questionList.map((item, itemIndex) => {
                    if (selectedIndex === itemIndex) {
                        let updateItem = {
                            ...item,
                            checked: saveArray.sort(),
                            answer: [...innerItemList],
                        }
                        return updateItem
                    }
                    return item
                })
            } else if (mode === 'etc') {
                if (questionList[selectedIndex].duplicate === false) {
                    let innerItemList = questionList[selectedIndex].answer.map((choice, cIndex) => {
                        choice.checked = false
                        return choice
                    })
                    updateList = questionList.map((item, itemIndex) => {
                        if (selectedIndex === itemIndex) {
                            let updateItem = {
                                ...item,
                                checked: rowIndex,
                                answer: [...innerItemList],
                            }
                            return updateItem
                        }
                        return item
                    })
                } else {
                    let saveArray = []
                    if (questionList[selectedIndex].checked === null || !Array.isArray(questionList[selectedIndex].checked)) {
                        saveArray = [rowIndex]
                    } else {
                        if (questionList[selectedIndex].checked.includes(rowIndex)) {
                            saveArray = questionList[selectedIndex].checked.filter((data) => {
                                return data != rowIndex
                            })
                        } else {
                            saveArray = [...questionList[selectedIndex].checked, rowIndex]
                        }
                    }

                    updateList = questionList.map((item, itemIndex) => {
                        if (selectedIndex === itemIndex) {
                            let updateItem = {
                                ...item,
                                checked: saveArray.sort(),
                                etcAnswer: null,
                            }
                            return updateItem
                        }
                        return item
                    })
                }
            }
            // console.log('onChangeChoiceAnswer - click', updateList)
            setQuestionList([...updateList])
        }
    }

    // onChange : 00 Choice Element 객관식 기타 응답
    const onChangeChoiceEtcAnswer = (event, selectedIndex) => {
        event.stopPropagation()
        if (writeToggle) {
            let updateList = questionList.map((item, itemIndex) => {
                if (selectedIndex === itemIndex) {
                    let updateItem = {
                        ...item,
                        etcAnswer: { content: event.target.value, type: 'TextField' },
                    }
                    return updateItem
                }
                return item
            })
            setQuestionList([...updateList])
        }
    }

    return (
        <Box sx={{ pt: 0, mb: 3 }}>
            {isEditing ? (
                <>
                    {/* Active Edit Mode*/}
                    <RadioGroup aria-labelledby="answer-radio-group-label" name="answer-radio-group">
                        <TransitionGroup>
                            {/* Default Answer  */}
                            {questionItem.answer.map((a, aIndex) => {
                                // console.log('a', a)
                                return (
                                    <CSSTransition key={a.id} timeout={duration} classNames="fade">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <FormControlLabel
                                                value={aIndex + 1}
                                                control={questionItem.duplicate ? <Checkbox checked={null} sx={{ pr: '1px' }} /> : <Radio checked={null} sx={{ pr: '1px' }} />}
                                                sx={{
                                                    width: '100%',
                                                    '.MuiFormControlLabel-label': {
                                                        width: '100%',
                                                    },
                                                    '.MuiBox-root': {
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    },
                                                }}
                                                label={
                                                    <Box>
                                                        <TextField
                                                            multiline={true}
                                                            variant="outlined"
                                                            // error={
                                                            //     questionItem.title?.length < 5 ||
                                                            //     questionItem.title?.length > 51
                                                            // }
                                                            size={'small'}
                                                            label=""
                                                            margin="normal"
                                                            name={`question-content-${aIndex}`}
                                                            // onChange={(e) => console.log('question-content', e.target)}
                                                            onChange={(e) => onChangeQuestionAnswer(currentSelected, e, a, aIndex)}
                                                            placeholder="선택지를 입력해주세요"
                                                            type="text"
                                                            value={a.content}
                                                            sx={{
                                                                width: '100%',
                                                                maxWidth: '100%',
                                                                fontSize: '1rem',
                                                                fontWeight: '400',
                                                                // mt: 2.4,
                                                                ml: 1,
                                                                mt: 0,
                                                                mb: 0,
                                                                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: '#F3F4F6',
                                                                },
                                                                '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: '#F3F4F6',
                                                                },
                                                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                    border: '1px solid #9CA3AF',
                                                                },
                                                            }}
                                                            inputProps={{
                                                                style: {
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: '400',
                                                                    lineHeight: '1.5',
                                                                },
                                                            }}
                                                        />
                                                        {questionItem.answer.length > 1 && (
                                                            <Button variant="text" size="small" sx={{ mx: 1 }} onClick={(e) => onClickDeleteQuestionAnswer(currentSelected, a)}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: '0.8rem',
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    삭제
                                                                </Typography>
                                                            </Button>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </Box>
                                    </CSSTransition>
                                )
                            })}
                            {/* ETC Answer */}
                            {questionItem.etcActive && (
                                <CSSTransition key={questionItem.answer.length + 1} timeout={duration} classNames="fade">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            my: 1,
                                        }}
                                    >
                                        <FormControlLabel
                                            value={questionItem.answer.length + 1}
                                            control={questionItem.duplicate ? <Checkbox checked={null} sx={{ pr: '1px' }} /> : <Radio checked={null} sx={{ pr: '1px' }} />}
                                            sx={{
                                                width: '100%',
                                                '.MuiFormControlLabel-label': {
                                                    width: '100%',
                                                },
                                                '.MuiBox-root': {
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                },
                                            }}
                                            label={
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Typography sx={{ fontSize: '0.8rem', minWidth: '2rem', ml: 2 }}>기타:</Typography>
                                                    <TextField
                                                        multiline={true}
                                                        variant="standard"
                                                        // error={
                                                        //     questionItem.title?.length < 5 ||
                                                        //     questionItem.title?.length > 51
                                                        // }
                                                        size={'small'}
                                                        label=""
                                                        margin="normal"
                                                        name={`question-content-etc-${questionIndex}`}
                                                        // onChange={(e) => console.log('question-content-type-1', e.target)}
                                                        placeholder="기타 답변을 입력해주세요."
                                                        type="text"
                                                        value={questionItem.etcAnswer?.content}
                                                        sx={{
                                                            width: '100%',
                                                            maxWidth: '100%',
                                                            fontSize: '1rem',
                                                            fontWeight: '400',
                                                            // mt: 2.4,
                                                            ml: 1,
                                                            mt: 0.5,
                                                            mb: 0,
                                                        }}
                                                        inputProps={{
                                                            style: {
                                                                fontSize: '0.8rem',
                                                                fontWeight: '400',
                                                                lineHeight: '1.5',
                                                            },
                                                        }}
                                                    />
                                                    <Button variant="text" size="small" sx={{ mx: 1 }} onClick={(e) => onClickDisableQuestionEtcAnswer(currentSelected)}>
                                                        <Typography
                                                            sx={{
                                                                fontSize: '0.8rem',
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            삭제
                                                        </Typography>
                                                    </Button>
                                                </Box>
                                            }
                                        />
                                    </Box>
                                </CSSTransition>
                            )}
                        </TransitionGroup>
                    </RadioGroup>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', my: 2 }}>
                        <AddIcon size={18} sx={{ color: '#FF8264' }} />
                        <Button size="small" onClick={(e) => onClickAddQuestionAnswer(currentSelected)}>
                            <span style={{ color: '#FF8264', fontSize: '0.8rem', fontWeight: 500 }}>선택지 추가</span>
                        </Button>
                        {!questionItem.etcActive && (
                            <>
                                <Typography sx={{ color: '#FF8264', fontSize: '0.8rem', fontWeight: 500 }}>또는</Typography>
                                <Button size="small" onClick={(e) => onClickActiveEtcAnswer(currentSelected)}>
                                    <span style={{ color: '#FF8264', fontSize: '0.8rem', fontWeight: 500 }}>기타추가</span>
                                </Button>
                            </>
                        )}
                    </Box>
                </>
            ) : (
                <>
                    {/* Disable Edit Mode*/}
                    <RadioGroup aria-labelledby="answer-radio-group-label" name="answer-radio-group">
                        {questionItem.answer.map((a, aIndex) => {
                            return (
                                <Fragment key={`question-key-${aIndex}`}>
                                    <FormControlLabel
                                        value={aIndex + 1}
                                        control={
                                            questionItem.duplicate ? (
                                                <Checkbox checked={writeToggle ? a.checked : null || false} onChange={(e) => onChangeChoiceAnswer(e, 'checkbox', questionIndex, a, aIndex)} />
                                            ) : (
                                                <Radio checked={writeToggle ? a.checked : null || false} onChange={(e) => onChangeChoiceAnswer(e, 'radio', questionIndex, a, aIndex)} />
                                            )
                                        }
                                        label={
                                            <>
                                                {a.content?.length > 0 ? (
                                                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{a.content}</Typography>
                                                ) : (
                                                    <>
                                                        {writeToggle ? (
                                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: '0.8rem',
                                                                        fontWeight: 700,
                                                                        color: 'error.light',
                                                                    }}
                                                                >
                                                                    선택지가 입력되지 않았습니다.
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: 500,
                                                                    color: 'text.secondary',
                                                                }}
                                                            >
                                                                선택지를 입력해주세요
                                                            </Typography>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        }
                                    />
                                </Fragment>
                            )
                        })}

                        {questionItem.etcActive && (
                            <FormControlLabel
                                value={questionItem.answer.length + 1}
                                control={
                                    questionItem.duplicate ? (
                                        <Checkbox checked={writeToggle ? questionItem.checked?.includes(questionItem.answer.length) : undefined} onChange={(e) => onChangeChoiceAnswer(e, 'etc', questionIndex, null, questionItem.answer.length)} />
                                    ) : (
                                        <Radio checked={writeToggle ? questionItem.checked == questionItem.answer.length : undefined} onChange={(e) => onChangeChoiceAnswer(e, 'etc', questionIndex, null, questionItem.answer.length)} />
                                    )
                                }
                                sx={{
                                    width: '100%',
                                    '.MuiFormControlLabel-label': {
                                        width: '100%',
                                    },
                                    '.MuiBox-root': {
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    },
                                }}
                                label={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '0.8rem', minWidth: '2rem', ml: 0 }}>기타:</Typography>
                                        <TextField
                                            multiline={true}
                                            variant="standard"
                                            size={'small'}
                                            label=""
                                            margin="normal"
                                            name={`question-content-etc-${questionIndex}`}
                                            disabled={questionItem.duplicate ? !questionItem.checked?.includes(questionItem.answer.length) : questionItem.checked !== questionItem.answer.length}
                                            onChange={(e) => onChangeChoiceEtcAnswer(e, questionIndex)}
                                            placeholder="기타 답변을 입력해주세요."
                                            type="text"
                                            value={questionItem.etcAnswer?.content}
                                            sx={{
                                                width: '100%',
                                                maxWidth: '100%',
                                                fontSize: '1rem',
                                                fontWeight: '400',
                                                // mt: 2.4,
                                                ml: 1,
                                                mt: 0.5,
                                                mb: 0,
                                            }}
                                            inputProps={{
                                                style: {
                                                    fontSize: '0.8rem',
                                                    fontWeight: '400',
                                                    lineHeight: '1.5',
                                                },
                                            }}
                                        />
                                    </Box>
                                }
                            />
                        )}
                    </RadioGroup>
                </>
            )}
        </Box>
    )
}

export default Element_MidChoice
