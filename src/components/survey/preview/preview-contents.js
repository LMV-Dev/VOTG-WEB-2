import { Fragment, useEffect, useState } from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { UuidTool } from 'uuid-tool'

/*MUI Element*/
import { styled } from '@mui/material/styles'
import { useMediaQuery, AppBar, Avatar, Badge, Box, Button, ButtonBase, Card, Grid, IconButton, Toolbar, Tooltip, Typography, Divider } from '@mui/material'

/*MUI Icon*/

/*Custom Icon*/

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'

/* Component */
import { Scrollbar } from '@components/layout/scrollbar'
import PContetnsInfo from '@components/survey/preview/p-contents-info'
import PContetnsCard from '@components/survey/preview/p-contents-card'

const PreviewContents = (props) => {
    const { focusingController, mainItemInfo, setMainItemInfo, mainItemList, setMainItemList, currentSelected, setCurrentSelected, targets } = props

    // isFocusing
    // 설문 응답에 대한 자동 스크롤 or 머문시간을 체킹하기 위한 선택형태를 정의함.

    return (
        <>
            <Scrollbar sx={{ mb: '200px' }}>
                {/**
                 * 1. Survey Contents Infomation
                 * Sruvey Infomation Title & Description
                 * */}
                <>
                    <Box
                        sx={{ margin: '0 auto', my: 2, mx: 1 }}
                        // Sidebar Click Auto Scroll Focus ref Event
                        ref={(el) => (targets.current[-1] = el)}
                    >
                        <PContetnsInfo mainItemInfo={mainItemInfo} currentSelected={currentSelected} focusingController={focusingController} />
                    </Box>
                </>
                {/**
                 * 2. Contents Card
                 * Sruvey Infomation Title & Description
                 * */}
                <Box>
                    {mainItemList.map((q, qIndex) => {
                        const qNumber = qIndex + 1
                        return (
                            <Box
                                key={q.id}
                                sx={{ my: 2, mx: 1 }}
                                // Sidebar Click Auto Scroll Focus ref Event
                                ref={(el) => (targets.current[qIndex] = el)}
                            >
                                <PContetnsCard
                                    questionList={mainItemList}
                                    setQuestionList={setMainItemList}
                                    questionsLength={mainItemList.length}
                                    questionItem={q}
                                    setQuestionItem={setMainItemInfo}
                                    questionIndex={qIndex}
                                    questionNumber={qNumber}
                                    currentSelected={currentSelected}
                                    focusingController={focusingController}
                                />
                            </Box>
                        )
                    })}
                </Box>
            </Scrollbar>
        </>
    )
}

export default PreviewContents
