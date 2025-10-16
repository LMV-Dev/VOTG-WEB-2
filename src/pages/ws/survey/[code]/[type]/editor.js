import { useEffect, useState, useRef } from 'react'
import NextLink from 'next/link'
import Head from 'next/head'
import axios from 'axios'
import API from '@utils/API'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
import fetcherWithParams from '@utils/fetcherWithParams'
import { debounce, throttle } from 'lodash'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { AuthGuard } from '@components/auth/auth-guard'

//ELEMENT
const PAGE_TITLE_00 = '설문지 제작하기'
const PAGE_TITLE_01 = '설문지 수정하기'

/*Improt Layouts*/
import LayoutWithServiceMenu from '@layouts/ws/layout-with-service-menu'
import LayoutSurveyProgressMenu from '@layouts/ws/layout-survey-progress-menu'
/*Import Components*/
import EditorContents from '@components/survey/editor/editor-contents'
import EditorSidebar from '@components/survey/editor/editor-sidebar'

/* Survey Schema */
import { surveyForm, elementInfo, elementPnls, elementReward, elementType, elementFunction, elementQuestions, defaultQuestion, answerType } from '@schema/element-schema'

/* getServerSideProps */
import { getServerSideProps } from '@components/survey/get-survey-data'
export { getServerSideProps }

const Survey_Editor = (props) => {
    const { user } = useAuth()
    /*Router*/
    const router = useRouter()
    // Path Check
    const { asPath, pathname } = router // asPath = /realdata , pathname = /[code]
    // Param Check
    const { code, type } = router.query

    if (code == null || code == undefined) {
        router.push('/ws/manager').catch(console.error)
    }
    /* */

    /* getServerSideProps */
    const { surveyDataFromDB, editMode } = props
    const [routingCheck, setRoutingCheck] = useState(false)
    useEffect(() => {
	if (surveyDataFromDB !== null && (surveyDataFromDB.UserCode.data && user?.code.data && surveyDataFromDB.UserCode.data.toString() !== user?.code.data.toString())) {
            router.push('/ws/manager').catch(console.error)
        } else {
            setRoutingCheck(true)
        }
    }, [user])

    const PAGE_TITLE = !editMode ? PAGE_TITLE_00 : PAGE_TITLE_01
    // console.log(`${PAGE_TITLE} :: surveyDataFromDB`, surveyDataFromDB)
    // console.log(`${PAGE_TITLE} :: editMode`, editMode)
    const [surveyLoadData, setSurveyLoadData] = useState(surveyDataFromDB !== null ? JSON.parse(surveyDataFromDB?.survey) : surveyDataFromDB)
    /* */

    /* 사이드바 관리*/
    // 사이드바 보기
    const [isSidebarOpen, setSidebarOpen] = useState(true)

    /* 질문 아이템 포커스 스크롤 관리 */
    // 클릭 이벤트 Scroll Ref
    const targets = useRef([])

    /**
     * Routing Type
     * 설문조사 종류에 따라서
     *  1. 온라인 설문조사 t = nml
     *  2. 커스텀 설문조사 t = cnvt
     */

    /**설문조사 데이터 관리 */
    /* Question Edit State */
    const [currentSelectedQuestion, setCurrentSelectedQuestion] = useState(-1)
    /* Question Load */
    const [questionInfo, setQuestionInfo] = useState(elementInfo)
    /* Question Load */
    const [questionList, setQuestionList] = useState(elementQuestions)
    /* Question Temp Data */
    const [questionTempData, setQuestionTempData] = useState({})

    /* Init Another Data */
    /* Panels Type State */
    const [selectedPanels, setSelectedPanels] = useState(null)

    /* Reward Type State */
    const [selectedReward, setSelectedReward] = useState(null)

    /** 설문조사 요소들 수정여부 */
    /* Element Editable */
    const onClickEditModeActiveController = (event, selectedIndex, selectedData) => {
        // console.log('onClickEditModeActiveController')
        // console.log('currentSelectedQuestion', selectedIndex)
        event.stopPropagation()
        if (selectedData !== questionTempData) {
            setCurrentSelectedQuestion(selectedIndex)
            setQuestionTempData(selectedData)
            if (currentSelectedQuestion !== -2 && selectedIndex === -2) {
                if (questionList[currentSelectedQuestion]?.type === 2) {
                    let updateList = questionList.map((item, index) => {
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
                    setQuestionList([...updateList])
                }
            }
        }
    }

    /** 설문조사 요소들 사이드바를 통한 선택 */
    /* Element Select AutoScroll */
    const onClickSideElementAutoScroll = (selectedIndex) => {
        // console.log('currentSelected - index', selectedIndex)
        // console.log('currentSelected -  targets', targets.current[selectedIndex])
        setCurrentSelectedQuestion(selectedIndex)
        targets.current[selectedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    /**
     *
     * 설문조사 데이터 초기 데이터 반영 :: 새로 제작 or 수정 진행
     *
     */

    const SURVEY_CODE = `svcd-${code}`
    // 1. 세션이 존재하는 경우 => 최우선으로 화면표시
    // 2. 세션이 없을경우는 2가지 경우가 생김
    // 2-1. 세션이 없음 && 데이터 베이스에도 없음 => 신규로 데이터 생성이 필요 => 세션스토리지에 더미데이터로 등록
    // 2-2. 세션이 없음 but 데이서 테이스에는 있음 => 신규로 데이터 생성 x => 데이터 베이스에 있는 데이터를 불러와 세션스토리지에 등록
    // 2-2-1. 수정이 발생함 => 원본 데이터베이스에 있는 데이터 들은 데이터베이스 원본으로 세션스토리지를 만들어 별도로 관리하여 불러올 수 있도록함
    // 2-2-2. 수정이 발생함 => 세션스토리지 메인 가지에서만 계속해서 저장
    // 2-2 => 1. 세션이 존재하는 경우 => 동일하게 최우선으로 화면 설정할 수 있도록 함.

    useEffect(() => {
        if (type === 'nml') {
            let surveySessionStorageData = globalThis.sessionStorage.getItem(SURVEY_CODE)
            // console.log('surveySessionStorageData - Init Data', surveySessionStorageData)
            if (surveySessionStorageData === undefined || surveySessionStorageData === null) {
                //신규 설정
                globalThis.sessionStorage.setItem(SURVEY_CODE, JSON.stringify(surveyForm))
                if (surveyDataFromDB !== null) {
                    //session storage에는 없지만, 저장된 데이터가 서버에 있으면 세팅
                    setQuestionInfo({ title: surveyLoadData?.title || surveyLoadData?.info?.title, description: surveyLoadData?.info?.description, logoImage: surveyLoadData?.info?.logoImage })
                    setQuestionList(surveyLoadData?.question || surveyLoadData?.questions)
                    setSelectedPanels(surveyLoadData?.pnls)
                    setSelectedReward(surveyLoadData?.reward)
                }
            } else {
                let jsonConvertSessionStorageData = JSON.parse(surveySessionStorageData)
                //이미 로딩되어진 global session stroage의 데이터를 받아와서 세팅
                setQuestionInfo(jsonConvertSessionStorageData.info)
                setQuestionList(jsonConvertSessionStorageData.questions)
                setSelectedPanels(jsonConvertSessionStorageData.pnls)
                setSelectedReward(jsonConvertSessionStorageData.reward)
            }
        } else {
            let surveySessionStorageData = globalThis.sessionStorage.getItem(SURVEY_CODE)
            let createCheck = globalThis.sessionStorage.getItem('convert-survey-question-init-check')
            let convertCreateSureveyData = JSON.parse(globalThis.sessionStorage.getItem('convert-survey-question'))
            if (convertCreateSureveyData === null) {
                alert(`작성 중인 설문 정보가 없습니다.`)
                router.push('/ws/manager').catch(console.error)
            }

            if (surveySessionStorageData === undefined || surveySessionStorageData === null) {
                //신규 설정
                globalThis.sessionStorage.setItem(SURVEY_CODE, JSON.stringify(surveyForm))
                if (surveyDataFromDB !== null) {
                    //session storage에는 없지만, 저장된 데이터가 서버에 있으면 세팅
                    setQuestionInfo({ title: surveyLoadData?.title || surveyLoadData?.info?.title, description: surveyLoadData?.info?.description, logoImage: surveyLoadData?.info?.logoImage })
                    setQuestionList(surveyLoadData?.question || surveyLoadData?.questions)
                    setSelectedPanels(surveyLoadData?.pnls)
                    setSelectedReward(surveyLoadData?.reward)
                }
            } else {
                let jsonConvertSessionStorageData = JSON.parse(surveySessionStorageData)
                //이미 로딩되어진 global session stroage의 데이터를 받아와서 세팅
                setQuestionInfo(jsonConvertSessionStorageData.info)
                setQuestionList(jsonConvertSessionStorageData.questions)
                setSelectedPanels(jsonConvertSessionStorageData.pnls)
                setSelectedReward(jsonConvertSessionStorageData.reward)
            }

            if (createCheck === 'false') {
                setQuestionList(convertCreateSureveyData)
                globalThis.sessionStorage.setItem('convert-survey-question-init-check', true)
            }
        }
    }, [])

    /**
     *
     *
     * 설문조사 데이터 수정시 Session Storage 반영
     *
     */
    /*
        const throttled = useRef(throttle((newValue) => console.log(newValue), 100))
        useEffect(() => throttled.current(value), [value])
    */

    /* 1. 설문 안내 정보(questionInfo) 수정시 세션 반영 */
    const updateQuestionInfo = useRef(
        throttle((questionInfo) => {
            let surveySessionStorageData = globalThis.sessionStorage.getItem(SURVEY_CODE)
            // console.log('questionInfo', questionInfo)
            if (surveySessionStorageData !== undefined && surveySessionStorageData !== null) {
                //기존 데이터 로드
                let jsonConvertSessionStorageData = JSON.parse(surveySessionStorageData)
                // console.log('jsonConvertSessionStorageData - info', jsonConvertSessionStorageData)
                //업데이트
                jsonConvertSessionStorageData.info = questionInfo
                globalThis.sessionStorage.setItem(SURVEY_CODE, JSON.stringify(jsonConvertSessionStorageData))
                // console.log('surveySessionStorageData - Edit :: questionInfo ', questionInfo)
            }
        }, 1000),
    )
    useEffect(() => updateQuestionInfo.current(questionInfo), [questionInfo])

    /* 2. 설문  세션 반영 */
    const updateQuestionList = useRef(
        throttle((questionList) => {
            let surveySessionStorageData = globalThis.sessionStorage.getItem(SURVEY_CODE)
            // console.log('questionList', questionList)
            if (surveySessionStorageData !== undefined && surveySessionStorageData !== null) {
                //기존 데이터 로드
                let jsonConvertSessionStorageData = JSON.parse(surveySessionStorageData)
                // console.log('jsonConvertSessionStorageData - questions', jsonConvertSessionStorageData)
                //업데이트
                jsonConvertSessionStorageData.questions = questionList
                globalThis.sessionStorage.setItem(SURVEY_CODE, JSON.stringify(jsonConvertSessionStorageData))
                // console.log('surveySessionStorageData - Edit :: questionInfo ', surveySessionStorageData)
            }
        }, 1000),
    )
    useEffect(() => updateQuestionList.current(questionList), [questionList])

    /* 3. 설문 패널 선택 정보(selectedPanels) 수정시 세션 반영 */
    const updateSelectedPanels = useRef(
        throttle((selectedPanels) => {
            let surveySessionStorageData = globalThis.sessionStorage.getItem(SURVEY_CODE)
            // console.log('questionInfo', questionInfo)
            if (surveySessionStorageData !== undefined && surveySessionStorageData !== null) {
                //기존 데이터 로드
                let jsonConvertSessionStorageData = JSON.parse(surveySessionStorageData)
                // console.log('jsonConvertSessionStorageData - pnls', jsonConvertSessionStorageData)
                //업데이트
                jsonConvertSessionStorageData.pnls = selectedPanels
                globalThis.sessionStorage.setItem(SURVEY_CODE, JSON.stringify(jsonConvertSessionStorageData))
                // console.log('surveySessionStorageData - Edit :: questionInfo ', questionInfo)
            }
        }, 1000),
    )
    useEffect(() => updateSelectedPanels.current(selectedPanels), [selectedPanels])

    /* 4. 리워드  선택 정보(selectedReward) 수정시 세션 반영 */
    const updateSelectedReward = useRef(
        throttle((selectedReward) => {
            let surveySessionStorageData = globalThis.sessionStorage.getItem(SURVEY_CODE)
            // console.log('questionInfo', questionInfo)
            if (surveySessionStorageData !== undefined && surveySessionStorageData !== null) {
                //기존 데이터 로드
                let jsonConvertSessionStorageData = JSON.parse(surveySessionStorageData)
                //업데이트
                jsonConvertSessionStorageData.reward = selectedReward
                globalThis.sessionStorage.setItem(SURVEY_CODE, JSON.stringify(jsonConvertSessionStorageData))
                // console.log('surveySessionStorageData - Edit :: questionInfo ', questionInfo)
            }
        }, 1000),
    )
    useEffect(() => updateSelectedReward.current(selectedReward), [selectedReward])

    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 인공지능 기반 건축설계 자동화 기술개발 연구단</title>
            </Head>

            {routingCheck && (
                <LayoutSurveyProgressMenu editMode={editMode}>
                    {/* 전체 배경 */}
                    <Box
                        component="main"
                        sx={{
                            minHeight: '100vh',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                            position: 'relative',
                            display: 'flex',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `
                                    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                                    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                                    radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.2) 0%, transparent 50%)
                                `,
                                pointerEvents: 'none',
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                right: '-20%',
                                width: '100%',
                                height: '200%',
                                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
                                transform: 'rotate(15deg)',
                                animation: 'shimmer 8s ease-in-out infinite',
                                pointerEvents: 'none',
                            },
                            '@keyframes shimmer': {
                                '0%, 100%': {
                                    transform: 'rotate(15deg) translateX(-100%)',
                                    opacity: 0,
                                },
                                '50%': {
                                    transform: 'rotate(15deg) translateX(100%)',
                                    opacity: 1,
                                },
                            },
                        }}
                    >
                        <EditorSidebar
                            sidebarToggleHandler={() => setSidebarOpen(!isSidebarOpen)}
                            open={isSidebarOpen}
                            autoScrollController={onClickSideElementAutoScroll}
                            sideItemInfo={questionInfo}
                            sideItemList={questionList}
                            setSideItemList={setQuestionList}
                            currentSelected={currentSelectedQuestion}
                            setCurrentSelected={setCurrentSelectedQuestion}
                            targets={targets}
                        />

                        <Container
                            component="main"
                            maxWidth="xl"
                            sx={{
                                flexGrow: 1,
                                position: 'relative',
                                zIndex: 1,
                                height: '100vh',
                                overflow: 'hidden',
                            }}
                            // Inner Element Editable Reset Event Trigger
                            onClick={(e) => onClickEditModeActiveController(e, -2, null)}
                        >
                            <EditorContents
                                sidebarToggleHandler={() => setSidebarOpen(!isSidebarOpen)}
                                open={isSidebarOpen}
                                editModeController={onClickEditModeActiveController}
                                mainItemInfo={questionInfo}
                                setMainItemInfo={setQuestionInfo}
                                mainItemList={questionList}
                                setMainItemList={setQuestionList}
                                currentSelected={currentSelectedQuestion}
                                setCurrentSelected={setCurrentSelectedQuestion}
                                targets={targets}
                            />
                        </Container>
                    </Box>
                </LayoutSurveyProgressMenu>
            )}
        </>
    )
}

Survey_Editor.getLayout = (page) => (
    <AuthGuard>
        <LayoutWithServiceMenu>{page}</LayoutWithServiceMenu>
    </AuthGuard>
)

export default Survey_Editor