import { useEffect, useState, useRef } from 'react'
import NextLink from 'next/link'
import Head from 'next/head'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { AuthGuard } from '@components/auth/auth-guard'

//ELEMENT
const PAGE_TITLE = '설문지 미리보기'

/*Improt Layouts*/
import LayoutWithServiceMenu from '@layouts/ws/layout-with-service-menu'
import LayoutSurveyProgressMenu from '@layouts/ws/layout-survey-progress-menu'
/*Import Components*/
import PreviewContents from '@components/survey/preview/preview-contents'

/* Survey Schema */
import { surveyForm, elementInfo, elementQuestions } from '@schema/element-schema'

/* getServerSideProps */
import { getServerSideProps } from '@components/survey/get-survey-data'
export { getServerSideProps }

const Survey_Preview = (props) => {
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
    const [surveyLoadData, setSurveyLoadData] = useState(surveyDataFromDB !== null ? JSON.parse(surveyDataFromDB?.survey) : surveyDataFromDB)
    /* */

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

    /**설문조사 응답에 대한 포커싱 구분 */
    const onChangeFocusingController = (event, selectedIndex, selectedData) => {
        event.stopPropagation()
        if (selectedData !== questionTempData) {
            setCurrentSelectedQuestion(selectedIndex)
            setQuestionTempData(selectedData)
        }
    }

    /**
     *
     * 설문조사 데이터 초기 데이터 반영
     *
     */
    const SURVEY_CODE = `svcd-${code}`
    useEffect(() => {
        if (!router.isReady) {
            return
        }
        let surveySessionStorageData = globalThis.sessionStorage.getItem(SURVEY_CODE)
        if (surveySessionStorageData === undefined || surveySessionStorageData === null) {
            //신규 설정
            globalThis.sessionStorage.setItem(SURVEY_CODE, JSON.stringify(surveyForm))
            if (surveyDataFromDB !== null) {
                //session storage에는 없지만, 저장된 데이터가 서버에 있으면 세팅
                setQuestionInfo({ title: surveyLoadData?.title || surveyLoadData?.info?.title, description: surveyLoadData?.info?.description, logoImage: surveyLoadData?.info?.logoImage })
                setQuestionList(surveyLoadData?.question || surveyLoadData?.questions)
            }
        } else {
            let jsonConvertSessionStorageData = JSON.parse(surveySessionStorageData)
            //이미 로딩되어진 global session stroage의 데이터를 받아와서 세팅
            setQuestionInfo(jsonConvertSessionStorageData.info)
            setQuestionList(jsonConvertSessionStorageData.questions)
        }
    }, [router.isReady])

    /**
     *
     * 설문조사 데이터 수정시 Session Storage 반영
     *
     */

    /* 미리보기의 경우 데이터 수정시 Seesion에 반영되어 저장되지 않음. */

    /**
     *
     * 설문조사 질문 유효성 검사
     *
     */
    const [questionDataValid, setQuestionDataValid] = useState(false)
    const [questionErrorList, setQuestionErrorList] = useState([])
    useEffect(() => {
        let error = ''
        let errorList = []
        let validInfo = true
        let validList = true

        Object.values(questionInfo).map((c, cIndex) => {
            if (cIndex === 0 && c.trim().length === 0) {
                validInfo = false
                error = `설문지 제목이 입력되지 않음`
                errorList.push(error)
            } else if (cIndex === 1 && c.trim().length === 0) {
                validInfo = false
                error = `설문지 안내사항이 입력되지 않음`
                errorList.push(error)
            }
        })

        Object.values(questionList).map((q, qIndex) => {
            let qNumber = qIndex + 1
            if (q.title.trim().length === 0) {
                error = `${qNumber}번 :: 질문 제목이 입력되지 않음`
                errorList.push(error)
                validList = false
            }
            if (q.type === null) {
                error = `${qNumber}번 :: 질문의 응답유형이 선택되지 않음`
                errorList.push(error)
                validList = false
            } else if (q.logicActive && q.logicNext.some((item) => item.questionId.length < 5)) {
                error = `${qNumber}번 :: 로직설정의 다음 문항이 선택되지 않음`
                errorList.push(error)
                validList = false
            } else {
                if (q.type == 0) { //객관식
                    q.answer.map((a, aIndex) => {
                        let aNumber = aIndex + 1
                        if (a.content.trim().length == 0) {
                            error = `${qNumber}-${aNumber}번 :: 선택지 내용이 입력되지 않음`
                            errorList.push(error)
                            validList = false
                        }
                    })
                } else if (q.type == 2) { //행렬형
                    //ROW 행
                    q.answer[0].content[0].map((item, rowIndex) => {
                        let rowNumber = rowIndex + 1
                        if (item.row.trim().length == 0) {
                            error = `${qNumber}번 ${rowNumber}행 :: 질문이 입력되지 않음`
                            errorList.push(error)
                            validList = false
                        }
                    })
                    //COLUMN 열
                    q.answer[0].content[1].map((item, colIndex) => {
                        let colNumber = colIndex + 1
                        if (item.column.trim().length == 0) {
                            error = `${qNumber}번 ${colNumber}열 :: 선택지 내용이 입력되지 않음`
                            errorList.push(error)
                            validList = false
                        }
                    })
                }
            }
        })

        setQuestionDataValid(validInfo && validList)
        setQuestionErrorList(errorList)
    }, [questionInfo, questionList])

    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 인공지능 기반 건축설계 자동화 기술개발 연구단</title>
            </Head>
            {routingCheck && (
                <LayoutSurveyProgressMenu editMode={editMode} questionCheck={questionDataValid} errorList={questionErrorList}>
                    {/* 전체 배경 */}
                    <Box
                        component="main"
                        sx={{
                            minHeight: '100vh',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center', // 컨텐츠 중앙 정렬
                            alignItems: 'flex-start', // 컨텐츠 상단 정렬
                            overflow: 'auto', // 스크롤이 필요할 경우
                            py: 4, // 상하 패딩
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
                        <Container
                            component="main"
                            maxWidth="md" // 미리보기는 보통 너비가 더 좁으므로 'md'로 조정
                            sx={{
                                flexGrow: 1,
                                position: 'relative',
                                zIndex: 1,
                                height: '100%',
                            }}
                            // Inner Element Editable Reset Event Trigger
                            onClick={(e) => onChangeFocusingController(e, -2, null)}
                        >
                            <PreviewContents
                                focusingController={onChangeFocusingController}
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

Survey_Preview.getLayout = (page) => (
    <AuthGuard>
        <LayoutWithServiceMenu>{page}</LayoutWithServiceMenu>
    </AuthGuard>
)

export default Survey_Preview