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

    // onChange : 03 Rating Element 별점형
    const onChangeStartAnswer = (event, selectedIndex, innerItem) => {
        event.stopPropagation()
        if (writeToggle) {
            // console.log('onChangeStartAnswer - selectedIndex', selectedIndex)
            // console.log('onChangeStartAnswer - innerItem', innerItem)
            // let innerItemList = questionList[selectedIndex].answer[0].filter((item) => item !== innerItem)

            const updateList = questionList.map((item, itemIndex) => {
                if (selectedIndex === itemIndex) {
                    let updateItem = {
                        ...item,
                        answer: [
                            {
                                ...questionList[selectedIndex].answer[0],
                                content: { value: parseInt(event.target.value) },
                            },
                        ],
                    }
                    return updateItem
                }
                return item
            })
            // console.log('onChangeStartAnswer - click', updateList)
            setQuestionList([...updateList])
        }
    }

    return (
        <Box sx={{ pt: 0, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <Rating size="large" value={questionItem.answer[0].content.value} onChange={(e) => onChangeStartAnswer(e, questionIndex, questionItem?.answer[0].content)} />
            </Box>
        </Box>
    )
}

export default Element_MidStar
