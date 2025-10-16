import { useEffect, useState, useRef, useCallback, Fragment, createRef } from 'react'

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

// 객관식 선택지
const Element_MidStar = (props) => {
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

    /**
     *
     *
     * 선택지 선택 여부에 대한 이벤트 OnChange
     * Preview 페이지 및 Answer 페이지  => Write Mode
     *
     *
     */

    // onChange : 04 Contact Element 연락처
    const onChangeContactAnswer = (event, selectedIndex, innerItem) => {
        event.stopPropagation()

        if (writeToggle) {
            // console.log('onChangeContactAnswer - selectedIndex', selectedIndex)
            // console.log('onChangeContactAnswer - innerItem', innerItem)
            // let innerItemList = questionList[selectedIndex].answer[0].filter((item) => item !== innerItem)
            const updateList = questionList.map((item, itemIndex) => {
                if (selectedIndex === itemIndex) {
                    let updateItem = {
                        ...item,
                        answer: [
                            {
                                ...questionList[selectedIndex].answer[0],
                                content: event.target.value,
                            },
                        ],
                    }
                    return updateItem
                }
                return item
            })
            // console.log('onChangeContactAnswer - type', updateList)
            setQuestionList([...updateList])
        }
    }

    return (
        <Box sx={{ pt: 0, mb: 3 }}>
            {questionItem.answer.map((a, aIndex) => {
                return (
                    <Fragment key={`question-contact-key-${aIndex}`}>
                        <FormControlLabel
                            value={aIndex + 1}
                            control={<></>}
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
                                <TextField
                                    multiline={false}
                                    variant="outlined"
                                    // error={
                                    //     questionItem.title?.length < 5 ||
                                    //     questionItem.title?.length > 51
                                    // }
                                    size={'large'}
                                    label=""
                                    margin="normal"
                                    name={`question-content-${aIndex}`}
                                    onChange={(e) => onChangeContactAnswer(e, questionIndex, a)}
                                    placeholder="연락처를 입력해주세요."
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
                                        mb: 1,
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
                            }
                        />
                    </Fragment>
                )
            })}
        </Box>
    )
}

export default Element_MidStar
