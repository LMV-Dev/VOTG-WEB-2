import { Fragment, useEffect, useState } from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { UuidTool } from 'uuid-tool'

/*MUI Element*/
import { styled } from '@mui/material/styles'
import { useMediaQuery, AppBar, Avatar, Badge, Box, Button, ButtonBase, Card, Grid, IconButton, Toolbar, Tooltip, Typography, TextField, Divider } from '@mui/material'

/*MUI Icon*/
import LogoutIcon from '@mui/icons-material/Logout'

/*Custom Icon*/
import { IconSurvey } from '@public/votg/IconSurvey'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'

/* Survey Id Creater*/
import { createResourceCode } from '@utils/create-resource-id'
/* Survey Schema */
import { answerType } from '@schema/element-schema'

/*Transition Style*/
const duration = 300

/* Components :: For Contetns Top */
import Element_TopIndicator from '../element/element-top-idicator'
import Element_TopTitle from '../element/element-top-title'
import Element_BottomIndicator from '../element/element-bottom-idicator'

/* Components :: For Contents Mid */
import Element_MidEmpty from '../element/element-mid-empty'
import Element_MidChoice from '../element/element-mid-choice'
import Element_MidEssay from '../element/element-mid-essay'
import Element_MidTable from '../element/element-mid-table'
import Element_MidStar from '../element/element-mid-star'
import Element_MidContact from '../element/element-mid-contact'

const PContetnsCard = (props) => {
    const { questionList, setQuestionList, questionsLength, questionItem, setQuestionItem, questionIndex, questionNumber, currentSelected, focusingController } = props

    const [isFocusing, setIsFocusing] = useState(currentSelected === questionIndex)

    useEffect(() => {
        // console.log('currentSelected', currentSelected)
        // console.log('questionIndex', questionIndex)
        setIsFocusing(currentSelected === questionIndex)
    }, [currentSelected, questionIndex])

    return (
        <>
            <Grid container spacing={1}>
                {/**
                 *
                 *
                 * 1. Contents Card Setting Grid
                 *
                 *
                 * */}
                <Grid item xs={12} xmd={12} md={12}>
                    <Card
                        onClick={(e) => focusingController(e, questionIndex, questionItem)}
                        sx={{
                            minHeight: '200px',
                            height: '100%',
                            px: 5,
                            pt: 1,
                            pb: 1,
                            border: isFocusing ? '2px solid #eee' : '2px solid #fff',
                            ...(isFocusing && { boxShadow: (theme) => theme.shadows[15] }),
                            '&:hover': currentSelected !== questionIndex && {
                                border: '2px solid #eee',
                                cursor: 'pointer',
                                transition: 'all 0.5s',
                            },
                        }}
                    >
                        {/**
                         * 0. TOP INICATOR LINE
                         * */}
                        {/* 0-1. 선택지 정보 */}
                        <Element_TopIndicator mode="write" questionsLength={questionsLength} questionItem={questionItem} />
                        {/* 0-2. 질문 타이틀 */}
                        <Element_TopTitle mode="write" questionItem={questionItem} questionIndex={questionIndex} questionNumber={questionNumber} isFocusing={isFocusing} />

                        {/**
                         * 1. MID CONTENTS LINE
                         * */}
                        <Box>
                            {/* 1-0. 선택하지 않음 */}
                            {questionItem.type === null && <Element_MidEmpty mode="write" isFocusing={isFocusing} />}

                            {/* 1-1. 객관식 선택지 */}
                            {questionItem.type === 0 && (
                                <Element_MidChoice
                                    mode="write"
                                    duration={duration}
                                    questionList={questionList}
                                    setQuestionList={setQuestionList}
                                    questionItem={questionItem}
                                    questionIndex={questionIndex}
                                    questionNumber={questionNumber}
                                    isFocusing={isFocusing}
                                    currentSelected={currentSelected}
                                />
                            )}

                            {/* 1-2. 주관식 선택지 */}
                            {questionItem.type === 1 && (
                                <Element_MidEssay
                                    mode="write"
                                    duration={duration}
                                    questionList={questionList}
                                    setQuestionList={setQuestionList}
                                    questionItem={questionItem}
                                    questionIndex={questionIndex}
                                    questionNumber={questionNumber}
                                    isFocusing={isFocusing}
                                    currentSelected={currentSelected}
                                />
                            )}

                            {/* 1-3. 행렬형 선택지 */}
                            {questionItem.type === 2 && (
                                <Element_MidTable
                                    mode="write"
                                    questionList={questionList}
                                    setQuestionList={setQuestionList}
                                    questionItem={questionItem}
                                    questionIndex={questionIndex}
                                    questionNumber={questionNumber}
                                    isFocusing={isFocusing}
                                    currentSelected={currentSelected}
                                />
                            )}

                            {/* 1-4. 별점형 선택지 */}
                            {questionItem.type === 3 && (
                                <Element_MidStar
                                    mode="write"
                                    questionList={questionList}
                                    setQuestionList={setQuestionList}
                                    questionItem={questionItem}
                                    questionIndex={questionIndex}
                                    questionNumber={questionNumber}
                                    isFocusing={isFocusing}
                                    currentSelected={currentSelected}
                                />
                            )}

                            {/* 1-5. 연락처 선택지 */}
                            {questionItem.type === 4 && (
                                <Element_MidContact
                                    mode="write"
                                    questionList={questionList}
                                    setQuestionList={setQuestionList}
                                    questionItem={questionItem}
                                    questionIndex={questionIndex}
                                    questionNumber={questionNumber}
                                    isFocusing={isFocusing}
                                    currentSelected={currentSelected}
                                />
                            )}
                        </Box>
                        {/* 2-1. BOTTOM INDICATOR LINE */}
                        <Element_BottomIndicator mode="write" questionList={questionList} setQuestionList={setQuestionList} questionsLength={questionsLength} questionItem={questionItem} currentSelected={currentSelected} duration={duration} />
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default PContetnsCard
