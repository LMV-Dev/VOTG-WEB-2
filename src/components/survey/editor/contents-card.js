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

/* Components :: For Contetns Right Panel */
import Element_RightPanel from '../element/element-right-panel'

const ContetnsCard = (props) => {
    const {
        dragSnapshot,
        questionList,
        setQuestionList,
        questionsLength,
        questionItem,
        setQuestionItem,
        questionIndex,
        questionNumber,
        currentSelected,
        editModeController,
        onClickRemoveThisItem,
        onChangeEditThisItem_Value,
        onChangeEditThisItem_Type,
        onChangeEditThisItem_Func,
    } = props

    const [isEditing, setIsEditing] = useState(currentSelected === questionIndex)

    useEffect(() => {
        setIsEditing(currentSelected === questionIndex)
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
                <Grid item xs={8} xmd={8} md={9}>
                    <Card
                        onClick={(e) => editModeController(e, questionIndex, questionItem)}
                        sx={{
                            minHeight: '300px',
                            height: '100%',
                            px: 5,
                            pt: 1,
                            pb: 1,
                            border: isEditing ? '2px solid #1f296aA0' : dragSnapshot.isDragging ? '2px solid #1f296aA0' : '2px solid #fff',
                            '&:hover': currentSelected !== questionIndex && {
                                border: '2px solid #1f296a30',
                                cursor: 'pointer',
                                transition: 'all 0.5s',
                            },
                        }}
                    >
                        {/**
                         * 0. TOP INICATOR LINE
                         * */}
                        {/* 0-1. 선택지 정보 */}
                        <Element_TopIndicator mode="read" questionsLength={questionsLength} questionItem={questionItem} onClickRemoveThisItem={() => onClickRemoveThisItem(questionItem)} />
                        {/* 0-2. 질문 타이틀 */}
                        <Element_TopTitle mode="read" questionItem={questionItem} questionIndex={questionIndex} questionNumber={questionNumber} isEditing={isEditing} onChangeEditThisItem_Value={onChangeEditThisItem_Value} />

                        {/**
                         * 1. MID CONTENTS LINE
                         * */}
                        <Box>
                            {/* 1-0. 선택하지 않음 */}
                            {questionItem.type === null && <Element_MidEmpty mode="read" isEditing={isEditing} />}

                            {/* 1-1. 객관식 선택지 */}
                            {questionItem.type === 0 && (
                                <Element_MidChoice
                                    mode="read"
                                    duration={duration}
                                    questionList={questionList}
                                    setQuestionList={setQuestionList}
                                    questionItem={questionItem}
                                    questionIndex={questionIndex}
                                    questionNumber={questionNumber}
                                    isEditing={isEditing}
                                    currentSelected={currentSelected}
                                />
                            )}

                            {/* 1-2. 주관식 선택지 */}
                            {questionItem.type === 1 && <Element_MidEssay mode="read" questionItem={questionItem} />}

                            {/* 1-3. 행렬형 선택지 */}
                            {questionItem.type === 2 && (
                                <Element_MidTable
                                    mode="read"
                                    questionList={questionList}
                                    setQuestionList={setQuestionList}
                                    questionItem={questionItem}
                                    questionIndex={questionIndex}
                                    questionNumber={questionNumber}
                                    isEditing={isEditing}
                                    currentSelected={currentSelected}
                                />
                            )}

                            {/* 1-4. 별점형 선택지 */}
                            {questionItem.type === 3 && <Element_MidStar mode="read" questionItem={questionItem} />}

                            {/* 1-5. 연락처 선택지 */}
                            {questionItem.type === 4 && <Element_MidContact mode="read" questionItem={questionItem} />}
                        </Box>

                        {/**
                         *  2. BOTTOM INDICATOR LINE : 로직정보
                         * */}
                        <Element_BottomIndicator
                            mode="read"
                            questionList={questionList}
                            setQuestionList={setQuestionList}
                            questionsLength={questionsLength}
                            questionItem={questionItem}
                            isEditing={isEditing}
                            currentSelected={currentSelected}
                            duration={duration}
                        />
                    </Card>
                </Grid>

                {/**
                 *
                 *
                 * 2. Right Contents Type Setting Grd
                 *
                 *
                 * */}
                <Element_RightPanel
                    questionItem={questionItem}
                    questionIndex={questionIndex}
                    questionNumber={questionNumber}
                    isEditing={isEditing}
                    currentSelected={currentSelected}
                    onChangeEditThisItem_Type={onChangeEditThisItem_Type}
                    onChangeEditThisItem_Func={onChangeEditThisItem_Func}
                />
            </Grid>
        </>
    )
}

export default ContetnsCard
