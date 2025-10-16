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
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

/*Transition*/
import { TransitionGroup, CSSTransition } from 'react-transition-group'

//TableView
const maxColumnIndex = 11

// 행렬형 선택지
const Element_MidTable = (props) => {
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

    // 행렬형 ROW/COLUMN 생성/삭제
    const setTableNumberControl = (event, mode, selectedIndex, type, editContent) => {
        event.stopPropagation()
        let editContentList = questionList[selectedIndex].answer[0].content.filter((item) => item !== editContent)
        // console.log('editContentList', editContentList)

        let newContent = null
        let newCheckArray = null
        if (type === 0) {
            if (mode == 'add') {
                newContent = [...questionList[selectedIndex].answer[0].content[type], { id: editContent.length, row: ``, edit: false }]
                // newCheckArray = [...questionList[selectedIndex].answer[0].content[2], { id: editContent.length, checked: null }]
                newCheckArray = newContent.map((row, rowIndex) => {
                    return { id: rowIndex, checked: null }
                })
                // newCheckArray = questionList[selectedIndex].answer[0].content[2].splice(questionList[selectedIndex].answer[0].content[2].length - 1, 0, { id: editContent.length, checked: null })
                editContentList = editContentList.splice(0, 1)
                // console.log('editContentList', editContentList)
                editContentList.splice(2, 0, [...newCheckArray])
            } else {
                newContent = questionList[selectedIndex].answer[0].content[type].splice(0, editContent.length - 1)
                newCheckArray = newContent.map((row, rowIndex) => {
                    return { id: rowIndex, checked: null }
                })
                editContentList = editContentList.splice(0, 1)
                editContentList.splice(2, 0, [...newCheckArray])
            }
        } else if (type === 1) {
            if (mode == 'add') {
                newContent = [...questionList[selectedIndex].answer[0].content[type], { id: editContent.length, column: '', level: editContent.length + 1, edit: false }]
            } else {
                newContent = questionList[selectedIndex].answer[0].content[type].splice(0, editContent.length - 1)
            }
        }
        editContentList.splice(type, 0, [...newContent])

        // console.log('newContentsList', newContentsList)
        const updateList = questionList.map((item, index) => {
            if (selectedIndex === index) {
                let updateItem = {
                    ...item,
                    answer: [
                        {
                            ...questionList[currentSelected].answer[0],
                            content: editContentList,
                        },
                    ],
                }
                return updateItem
            }
            return item
        })
        // console.log(`setTableNumberControl - ${mode}`, updateList)
        setQuestionList([...updateList])
    }

    //행렬형 각 셀 수정 모드 자동 변경
    const setTableAnswerEditModeControl = (currentSelectedQuestion, selectedIndex, type) => {
        let updateList = null
        if (selectedIndex === undefined) {
            // console.log('setTableAnswerEditModeControl', selectedIndex)
            updateList = questionList.map((item, index) => {
                if (item.type === 2) {
                    const newItem = item.answer[0].content.map((element, elementIndex) => {
                        if (elementIndex < 2) {
                            const newElement = element.map((cell, cellIndex) => {
                                return {
                                    ...cell,
                                    edit: false,
                                }
                            })
                            return newElement
                        } else {
                            return element
                        }
                    })
                    return {
                        ...item,
                        answer: [
                            {
                                ...questionList[currentSelectedQuestion].answer[0],
                                content: newItem,
                            },
                        ],
                    }
                } else {
                    return item
                }
            })
        } else {
            // console.log('setTableAnswerEditModeControl', selectedIndex)
            updateList = questionList.map((item, index) => {
                if (item.type === 2) {
                    const newItem = item.answer[0].content.map((element, elementIndex) => {
                        if (elementIndex === type) {
                            const newElement = element.map((cell, cellIndex) => {
                                // console.log('cellIndex === selectedIndex', cellIndex === selectedIndex)
                                if (cellIndex === selectedIndex) {
                                    return {
                                        ...cell,
                                        edit: true,
                                    }
                                } else {
                                    return {
                                        ...cell,
                                        edit: false,
                                    }
                                }
                            })
                            return newElement
                        } else {
                            return element
                        }
                    })
                    return {
                        ...item,
                        answer: [
                            {
                                ...questionList[currentSelectedQuestion].answer[0],
                                content: newItem,
                            },
                        ],
                    }
                } else {
                    return item
                }
            })
        }
        // console.log('setTableAnswerEditModeControl', updateList)
        setQuestionList([...updateList])
    }

    //행렬형 가로 새로 질문 수정
    // +++++++++
    /**
     *
     *
     * 선택지 선택 여부에 대한 이벤트 OnChange
     * Preview 페이지 및 Answer 페이지  => Write Mode
     *
     *
     */
    const onChangeTableAnswer = (event, mode, selectedIndex, innerItem, editContent, type, index, checkedIndex) => {
        event.stopPropagation()
        // console.log('innerItem', innerItem)
        // console.log('editContent', editContent)
        let editContentList = questionList[selectedIndex].answer[0].content.filter((item) => item !== editContent)
        let innerItemList = questionList[selectedIndex].answer[0].content[type].filter((item) => item !== innerItem)
        // console.log('editContentList', editContentList)
        // console.log('innerItemList', innerItemList)
        // answerList.splice(index, 0, { ...editAnswer, content: event.target.value })

        if (type === 0) {
            // console.log('answerList', '질문 row', index)
            if (mode == 'click') {
                innerItemList.splice(index, 0, { ...innerItem, edit: !innerItem.edit })
            } else if (mode == 'input') {
                innerItemList.splice(index, 0, { ...innerItem, row: event.target.value })
            }
            editContentList.splice(type, 0, [...innerItemList])
        } else if (type === 1) {
            // console.log('answerList', '선택지 column', index)
            if (mode == 'click') {
                innerItemList.splice(index, 0, { ...innerItem, edit: !innerItem.edit })
            } else if (mode == 'input') {
                innerItemList.splice(index, 0, { ...innerItem, column: event.target.value })
            }
            editContentList.splice(type, 0, [...innerItemList])
        } else if (type === 2) {
            // console.log('answerList', '라디오/체크박스', index)
            if (writeToggle) {
                if (mode == 'radio') {
                    innerItemList.splice(index, 0, { ...innerItem, checked: checkedIndex })
                } else if (mode == 'checkbox') {
                    // console.log('innerItem', innerItem)
                    // console.log('checkbox', checkedIndex)
                    if (innerItem.checked === null || !Array.isArray(innerItem.checked)) {
                        innerItemList.splice(index, 0, { ...innerItem, checked: [checkedIndex] })
                    } else {
                        if (innerItem.checked.includes(checkedIndex)) {
                            let saveArray = innerItem.checked.filter((data) => {
                                return data != checkedIndex
                            })
                            innerItemList.splice(index, 0, { ...innerItem, checked: [...saveArray].sort() })
                        } else {
                            innerItemList.splice(index, 0, { ...innerItem, checked: [...innerItem.checked, checkedIndex].sort() })
                        }
                    }
                }
            } else {
                innerItemList.splice(index, 0, { ...innerItem, checked: null })
            }
            editContentList.splice(type, 0, [...innerItemList])
        }

        // console.log('editContentList - last ', editContentList)
        // console.log('innerItemList - last ', innerItemList)

        const updateList = questionList.map((item, index) => {
            if (selectedIndex === index) {
                let updateItem = {
                    ...item,
                    answer: [
                        {
                            ...questionList[selectedIndex].answer[0],
                            content: editContentList,
                        },
                    ],
                }
                return updateItem
            }
            return item
        })
        // console.log('onChangeTableAnswer - click', updateList)
        setQuestionList([...updateList])
        if (mode == 'click') {
            setTableAnswerEditModeControl(selectedIndex, index, type)
        }
    }

    return (
        <Box sx={{ pt: 0, mb: 3 }}>
            {isEditing ? (
                <>
                    {/* Active Edit Mode*/}
                    {questionItem.answer.map((a, aIndex) => {
                        return (
                            <Box key={`table-wrapper-${aIndex}`} onClick={(e) => setTableAnswerEditModeControl(currentSelected)}>
                                {/* Add Column */}
                                <Table
                                    sx={{
                                        '& th': {
                                            paddingBlock: '10px',
                                            paddingInline: '5px',
                                            borderRight: '1px solid #ddd',
                                        },
                                        '& td': {
                                            paddingBlock: '3px',
                                            paddingInline: '5px',
                                        },
                                        '& td > span': {
                                            width: '100%',
                                        },
                                    }}
                                >
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ width: '43%', border: '0px solid #000' }}></TableCell>
                                            <TableCell sx={{ width: '57%', border: '0px solid #000' }} align="center">
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            flex: '1 1 auto',
                                                            width: '100%',
                                                            height: '1px',
                                                            background: '#ddd',
                                                        }}
                                                    />
                                                    {/* REMOVE : Type 1 = > column */}
                                                    <IconButton disabled={a.content[1].length === 1} onClick={(e) => setTableNumberControl(e, 'remove', currentSelected, 1, a.content[1])}>
                                                        <RemoveCircleOutlineIcon
                                                            size={18}
                                                            sx={{
                                                                color: '#000',
                                                                opacity: a.content[1].length === 1 ? 0.1 : 0.5,
                                                                transition: 'all 0.5s',
                                                                '&:hover': {
                                                                    opacity: 0.8,
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.5s',
                                                                },
                                                            }}
                                                        />
                                                    </IconButton>

                                                    <Typography sx={{ fontSize: '1rem', fontWeight: '700', mx: 1, border: '1 solid ' }}>{a.content[1].length}</Typography>

                                                    {/* ADD : Type 1 = > column */}
                                                    <IconButton disabled={a.content[1].length > 10} onClick={(e) => setTableNumberControl(e, 'add', currentSelected, 1, a.content[1])}>
                                                        <AddCircleIcon
                                                            size={18}
                                                            sx={{
                                                                color: '#000',
                                                                opacity: a.content[1].length > 10 ? 0.1 : 0.5,
                                                                transition: 'all 0.5s',
                                                                '&:hover': {
                                                                    opacity: 0.8,
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.5s',
                                                                },
                                                            }}
                                                        />
                                                    </IconButton>
                                                    <Box
                                                        sx={{
                                                            flex: '1 1 auto',
                                                            width: '100%',
                                                            height: '1px',
                                                            background: '#ddd',
                                                        }}
                                                    />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                {/* Main Table */}
                                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                    {/* Add Row */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                flex: '1 1 auto',
                                                width: '1px',
                                                height: '100%',
                                                background: '#ddd',
                                            }}
                                        />
                                        {/* REMOVE : Type 0 = > ROW */}
                                        <IconButton disabled={a.content[0].length === 1} onClick={(e) => setTableNumberControl(e, 'remove', currentSelected, 0, a.content[0])}>
                                            <RemoveCircleOutlineIcon
                                                size={18}
                                                sx={{
                                                    color: '#000',
                                                    opacity: a.content[0].length === 1 ? 0.1 : 0.5,
                                                    transition: 'all 0.5s',
                                                    '&:hover': {
                                                        opacity: 0.8,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.5s',
                                                    },
                                                }}
                                            />
                                        </IconButton>
                                        <Typography sx={{ fontSize: '1rem', fontWeight: '700', mx: 1, border: '1 solid ' }}>{a.content[0].length}</Typography>
                                        {/* ADD : Type 0 = > ROW */}
                                        <IconButton disabled={a.content[0].length > 49} onClick={(e) => setTableNumberControl(e, 'add', currentSelected, 0, a.content[0])}>
                                            <AddCircleIcon
                                                size={18}
                                                sx={{
                                                    color: '#000',
                                                    opacity: a.content[0].length > 49 ? 0.1 : 0.5,
                                                    transition: 'all 0.5s',
                                                    '&:hover': {
                                                        opacity: 0.8,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.5s',
                                                    },
                                                }}
                                            />
                                        </IconButton>
                                        {/* <Box
                                                sx={{
                                                    flex: '1 1 auto',
                                                    width: '1px',
                                                    height: '100%',
                                                    background: '#ddd',
                                                }}
                                            /> 
                                        */}
                                    </Box>
                                    {/* Table Contents */}
                                    <Box sx={{ width: '100%' }}>
                                        <Table
                                            sx={{
                                                '& th': {
                                                    paddingBlock: '10px',
                                                    paddingInline: '5px',
                                                    borderRight: '1px solid #ddd',
                                                },
                                                '& td': {
                                                    paddingBlock: '3px',
                                                    paddingInline: '5px',
                                                },
                                                '& td > span': {
                                                    width: '100%',
                                                },
                                            }}
                                        >
                                            <TableHead sx={{ visibility: 'visible' }}>
                                                <TableRow>
                                                    <TableCell sx={{ width: '40%' }}></TableCell>
                                                    {a.content[1].map((item, colIndex) => {
                                                        // console.log('item', item)
                                                        if (colIndex < maxColumnIndex) {
                                                            return (
                                                                <TableCell
                                                                    key={`table-head-row-cell-${aIndex}-${colIndex}`}
                                                                    sx={{
                                                                        width: `${60 / a.content[1].length}%`,
                                                                    }}
                                                                    onClick={(e) => {
                                                                        !item.edit ? onChangeTableAnswer(e, 'click', currentSelected, item, a.content[1], 1, colIndex) : e.stopPropagation()
                                                                    }}
                                                                >
                                                                    {!item.edit ? (
                                                                        <>
                                                                            {item.column?.length > 0 ? (
                                                                                <Typography
                                                                                    sx={{
                                                                                        lineHeight: '1.3',
                                                                                        fontSize: '0.8rem',
                                                                                        fontWeight: 500,
                                                                                        textAlign: 'center',
                                                                                    }}
                                                                                >
                                                                                    {item.column}
                                                                                </Typography>
                                                                            ) : (
                                                                                <Typography
                                                                                    sx={{
                                                                                        lineHeight: '1.3',
                                                                                        fontSize: '0.8rem',
                                                                                        fontWeight: 500,
                                                                                        color: 'text.secondary',
                                                                                        textAlign: 'center',
                                                                                    }}
                                                                                >
                                                                                    입력이 필요합니다.
                                                                                </Typography>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <TextField
                                                                            multiline={true}
                                                                            variant="outlined"
                                                                            size={'small'}
                                                                            label=""
                                                                            margin="normal"
                                                                            name={`cell-edit-head-${colIndex}`}
                                                                            onChange={(e) => {
                                                                                item.edit ? onChangeTableAnswer(e, 'input', currentSelected, item, a.content[1], 1, colIndex) : e.stopPropagation()
                                                                            }}
                                                                            placeholder="선택지를 입력해주세요"
                                                                            type="text"
                                                                            value={item.column}
                                                                            sx={{
                                                                                width: '100%',
                                                                                maxWidth: '100%',
                                                                                fontSize: '1rem',
                                                                                fontWeight: '400',
                                                                                // mt: 2.4,
                                                                                ml: 0,
                                                                                mt: 0.5,
                                                                                mb: 0,
                                                                                background: item.edit ? '#fff' : 'transparent',
                                                                            }}
                                                                            inputProps={{
                                                                                style: {
                                                                                    fontSize: '0.8rem',
                                                                                    fontWeight: '400',
                                                                                    lineHeight: '1.5',
                                                                                },
                                                                            }}
                                                                        />
                                                                    )}
                                                                </TableCell>
                                                            )
                                                        }
                                                    })}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {a.content[0].map((item, rowIndex) => {
                                                    // console.log('item', item)
                                                    return (
                                                        <TableRow key={`table-body-row-${aIndex}-${rowIndex}`}>
                                                            {/* 질문 */}
                                                            <TableCell
                                                                sx={{ borderRight: '1px solid #ddd' }}
                                                                onClick={(e) => {
                                                                    !item.edit ? onChangeTableAnswer(e, 'click', currentSelected, item, a.content[0], 0, rowIndex) : e.stopPropagation()
                                                                }}
                                                            >
                                                                {!item.edit ? (
                                                                    <>
                                                                        {item.row?.length > 0 ? (
                                                                            <Typography
                                                                                sx={{
                                                                                    lineHeight: '1.3',
                                                                                    fontSize: '0.8rem',
                                                                                    fontWeight: 500,
                                                                                    textAlign: 'left',
                                                                                    ml: '0.3rem',
                                                                                }}
                                                                            >
                                                                                {`${rowIndex + 1}.`} {item.row}
                                                                            </Typography>
                                                                        ) : (
                                                                            <Typography
                                                                                sx={{
                                                                                    lineHeight: '1.3',
                                                                                    fontSize: '0.8rem',
                                                                                    fontWeight: 500,
                                                                                    color: 'text.secondary',
                                                                                    textAlign: 'left',
                                                                                    ml: '0.3rem',
                                                                                }}
                                                                            >
                                                                                입력이 필요합니다.
                                                                            </Typography>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <TextField
                                                                        multiline={true}
                                                                        variant="outlined"
                                                                        size={'small'}
                                                                        label=""
                                                                        margin="normal"
                                                                        name={`cell-edit-body-${rowIndex}`}
                                                                        onChange={(e) => {
                                                                            item.edit ? onChangeTableAnswer(e, 'input', currentSelected, item, a.content[0], 0, rowIndex) : e.stopPropagation()
                                                                        }}
                                                                        placeholder="질문을 입력해주세요"
                                                                        type="text"
                                                                        value={item.row}
                                                                        sx={{
                                                                            width: '100%',
                                                                            maxWidth: '100%',
                                                                            fontSize: '1rem',
                                                                            fontWeight: '400',
                                                                            // mt: 2.4,
                                                                            ml: 1,
                                                                            mt: 0.5,
                                                                            mb: 0,
                                                                            pr: 1,
                                                                        }}
                                                                        inputProps={{
                                                                            style: {
                                                                                fontSize: '0.8rem',
                                                                                fontWeight: '400',
                                                                                lineHeight: '1.5',
                                                                            },
                                                                        }}
                                                                    />
                                                                )}
                                                            </TableCell>
                                                            {/* 질문별 선택지 */}
                                                            {a.content[1].map((item, colIndex) => {
                                                                // console.log('item', item)
                                                                if (colIndex < maxColumnIndex) {
                                                                    return (
                                                                        <TableCell key={`table-body-row-cell-${aIndex}-${colIndex}`} sx={{ maxWidth: '5rem' }}>
                                                                            {questionItem.duplicate ? <Checkbox checked={null} sx={{ '& span': { width: '100%' } }} /> : <Radio checked={null} />}
                                                                        </TableCell>
                                                                    )
                                                                }
                                                            })}
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                </Box>
                            </Box>
                        )
                    })}
                </>
            ) : (
                <>
                    {/* Disable Edit Mode*/}
                    {questionItem.answer.map((a, aIndex) => {
                        return (
                            <Box key={`table-wrapper-${aIndex}`} sx={{ width: '100%' }}>
                                <Table
                                    sx={{
                                        '& th': {
                                            paddingBlock: '10px',
                                            paddingInline: '5px',
                                            borderRight: '1px solid #ddd',
                                        },
                                        '& td': {
                                            paddingBlock: '3px',
                                            paddingInline: '5px',
                                        },
                                        '& td > span': {
                                            width: '100%',
                                        },
                                    }}
                                >
                                    <TableHead sx={{ visibility: 'visible' }}>
                                        <TableRow>
                                            <TableCell sx={{ width: '40%' }}></TableCell>
                                            {a.content[1].map((item, colIndex) => {
                                                // console.log('item', item)
                                                if (colIndex < maxColumnIndex) {
                                                    return (
                                                        <TableCell
                                                            key={`table-head-row-cell-${aIndex}-${colIndex}`}
                                                            sx={{
                                                                width: `${60 / a.content[1].length}%`,
                                                            }}
                                                        >
                                                            {item.column?.length > 0 ? (
                                                                <Typography
                                                                    sx={{
                                                                        lineHeight: '1.3',
                                                                        fontSize: '0.8rem',
                                                                        fontWeight: 500,
                                                                        textAlign: 'center',
                                                                    }}
                                                                >
                                                                    {item.column}
                                                                </Typography>
                                                            ) : (
                                                                <Typography
                                                                    sx={{
                                                                        lineHeight: '1.3',
                                                                        fontSize: '0.8rem',
                                                                        fontWeight: writeToggle ? 700 : 500,
                                                                        color: writeToggle ? 'error.light' : 'text.secondary',
                                                                        textAlign: 'center',
                                                                    }}
                                                                >
                                                                    {writeToggle ? `입력되지 않음` : `입력이 필요합니다.`}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    )
                                                }
                                            })}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {a.content[0].map((item, rowIndex) => {
                                            // console.log('item', item)
                                            return (
                                                <TableRow key={`table-body-row-${aIndex}-${rowIndex}`}>
                                                    {/* 질문 */}
                                                    <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                                                        {item.row?.length > 0 ? (
                                                            <Typography
                                                                sx={{
                                                                    lineHeight: '1.3',
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: 500,
                                                                    textAlign: 'left',
                                                                    ml: '0.3rem',
                                                                }}
                                                            >
                                                                {`${rowIndex + 1}.`} {item.row}
                                                            </Typography>
                                                        ) : (
                                                            <Typography
                                                                sx={{
                                                                    lineHeight: '1.3',
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: writeToggle ? 700 : 500,
                                                                    color: writeToggle ? 'error.light' : 'text.secondary',
                                                                    textAlign: 'left',
                                                                    ml: '0.3rem',
                                                                }}
                                                            >
                                                                {writeToggle ? `입력되지 않음` : `입력이 필요합니다.`}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    {/* 질문별 선택지 */}
                                                    {a.content[1].map((item, colIndex) => {
                                                        // console.log('item', item)
                                                        if (colIndex < maxColumnIndex) {
                                                            return (
                                                                <TableCell key={`table-body-row-cell-select-${aIndex}-${colIndex}`} sx={{ maxWidth: '5rem' }}>
                                                                    {questionItem.duplicate ? (
                                                                        <Checkbox
                                                                            sx={{ '& span': { width: '100%' } }}
                                                                            checked={writeToggle ? a.content[2][rowIndex].checked?.includes(colIndex) : null || false}
                                                                            onChange={(e) => onChangeTableAnswer(e, 'checkbox', questionIndex, a.content[2][rowIndex], a.content[2], 2, rowIndex, colIndex)}
                                                                        />
                                                                    ) : (
                                                                        <Radio
                                                                            checked={writeToggle ? a.content[2][rowIndex].checked === colIndex : null || false}
                                                                            onChange={(e) => onChangeTableAnswer(e, 'radio', questionIndex, a.content[2][rowIndex], a.content[2], 2, rowIndex, colIndex)}
                                                                        />
                                                                    )}
                                                                </TableCell>
                                                            )
                                                        }
                                                    })}
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </Box>
                        )
                    })}
                </>
            )}
        </Box>
    )
}

export default Element_MidTable
