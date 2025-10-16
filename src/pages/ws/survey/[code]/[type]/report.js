import { useEffect, useState, useRef, useCallback, Fragment } from 'react'
import Head from 'next/head'
import axios from 'axios'
import { UuidTool } from 'uuid-tool'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

/*MUI Element*/
import {
    AppBar,
    Box,
    Button,
    Card,
    CardHeader,
    CardContent,
    CircularProgress,
    Collapse,
    Container,
    Divider,
    Grid,
    IconButton,
    Rating,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    Typography,
} from '@mui/material'

/* MUI Icon */
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'

//ELEMENT
const PAGE_TITLE = '설문 결과'

/*Improt Layouts*/
import LayoutWithServiceMenu from '@layouts/ws/layout-with-service-menu'
import LayoutSurveyReportMenu from '@layouts/ws/layout-survey-report-menu'

/*Import Components*/
import ChartType_Bar from '@components/survey/charts/chart-type-bar'
import ChartType_Pie from '@components/survey/charts/chart-type-pie'
import Report_Title_Download from '@components/survey/report/report-title-download'
import Report_NoneType from '@components/survey/report/report-none-type'
import API from '@utils/API'

const buttonStyle = {
    padding: '10px 20px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontWeight: 'bold',
    color: '#333',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}

const Survey_answers = () => {
    /* Hooks */
    const router = useRouter()
    const { code } = router.query
    const { user } = useAuth()

    /* State Management */
    const [surveySelectedSurveyTitle, setSurveySelectedSurveyQuestionTitle] = useState(null)
    const [questionList, setQuestionList] = useState([])
    const [originQuestions, setOriginQuestions] = useState([])
    const [surveyResult, setSurveyResult] = useState(null)
    const [resultRebuild, setResultRebuild] = useState([])
    const [graphTypeControl, setGraphTypeControl] = useState([])
    const [selectedReward, setSelectedReward] = useState(null)
    const [rewardRequestItem, setRewardRequestItem] = useState(false)
    const [rewardRequestStatus, setRewardRequestStatus] = useState(false)

    /* Data Fetching & Processing */
    // 1. Fetch initial survey and result data
    useEffect(() => {
        if (!router.isReady || !user) {
            return
        }
        const fetchData = async () => {
            try {
                const res = await axios.get(`https://api.koaiarchitecture.com/online/survey/answers/result`, {
                    params: { UserCode: JSON.stringify(user?.code.data), surveyCode: code },
                })
                if (res.data && res.data.payload) {
                    const surveyData = JSON.parse(res.data.payload.selected.survey)
                    setSurveySelectedSurveyQuestionTitle(surveyData.title || surveyData.info?.title)
                    const questions = surveyData.question || surveyData.questions
                    setQuestionList(questions)
                    setOriginQuestions(questions)
                    setSelectedReward(surveyData.reward)
                    setSurveyResult(res.data.payload.result)
                }
            } catch (error) {
                console.error('Failed to fetch survey results:', error)
                toast.error('설문 결과를 불러오는데 실패했습니다.')
                router.push('/ws/manager')
            }
        }
        fetchData()
    }, [user, router.isReady, code])

    // 2. Fetch reward payment status
    useEffect(() => {
        if (!selectedReward?.code || !user) return

        const fetchRewardData = async () => {
            try {
                const result = await API.get('payment/request/item', {
                    UserCode: UuidTool.toString(user?.code.data).replace(/-/g, ''),
                    orderCode: selectedReward.code,
                })
                if (result.payload) {
                    setRewardRequestItem(result.payload)
                    setRewardRequestStatus(result.payload.status === '1')
                }
            } catch (error) {
                console.error('Failed to fetch reward status:', error)
            }
        }
        fetchRewardData()
    }, [selectedReward, user])

    // 3. Process survey results when data is available
    useEffect(() => {
        if (!surveyResult || !questionList.length) {
            return
        }

        const processedQuestions = JSON.parse(JSON.stringify(questionList)) // Deep copy to avoid mutation

        // Initialize results and etcAnswers
        processedQuestions.forEach((q) => {
            if (q.type === 0) {
                q.answer.forEach((a) => (a.result = 0))
                if (q.etcActive) {
                    q.answer.push({ id: 'etc-code-value', content: '기타', result: 0 })
                    q.etcAnswer = []
                }
            } else if (q.type === 1 || q.type === 3 || q.type === 4) {
                q.answer = []
            } else if (q.type === 2) {
                q.answer[0].content[2] = q.answer[0].content[0].map(() => Array(q.answer[0].content[1].length).fill(0))
            }
        })

        surveyResult.forEach((result) => {
            const identifyCode = UuidTool.toString(result.identifyCode.data).replace(/-/g, '')
            const answerJson = JSON.parse(result.answer)

            answerJson.forEach((a) => {
                const question = processedQuestions.find((q) => q.id === a.id)
                if (!question) return

                switch (a.type) {
                    case 0: // Multiple Choice
                        const isDuplicate = question.duplicate
                        const originalAnswerLength = originQuestions.find((q) => q.id === a.id)?.answer.length
                        if (isDuplicate && Array.isArray(a.checked)) {
                            a.checked.forEach((chkIdx) => {
                                if (question.answer[chkIdx]) question.answer[chkIdx].result++
                                if (a.etcActive && chkIdx === originalAnswerLength) {
                                    question.etcAnswer.push({ identifyCode, content: a.etcAnswer?.content })
                                }
                            })
                        } else if (!isDuplicate && typeof a.checked === 'number') {
                            if (question.answer[a.checked]) question.answer[a.checked].result++
                            if (a.etcActive && a.checked === originalAnswerLength) {
                                question.etcAnswer.push({ identifyCode, content: a.etcAnswer?.content })
                            }
                        }
                        break
                    case 1: // Subjective
                    case 3: // Rating
                    case 4: // Contact
                        question.answer.push({ identifyCode, content: a.answer[0].content })
                        break
                    case 2: // Matrix
                        a.answer[0].content[2].forEach((row, rIndex) => {
                            if (question.answer[0].content[2][rIndex] && question.answer[0].content[2][rIndex][row.checked] !== undefined) {
                                question.answer[0].content[2][rIndex][row.checked]++
                            }
                        })
                        break
                    default:
                        break
                }
            })
        })

        setResultRebuild(processedQuestions)
        setGraphTypeControl(processedQuestions.map(() => ({ type: 0 })))
    }, [surveyResult])

    const onChangeGraphType = (index, value) => {
        const newGraphTypeControl = [...graphTypeControl]
        if (newGraphTypeControl[index]) {
            newGraphTypeControl[index].type = value
            setGraphTypeControl(newGraphTypeControl)
        }
    }

    /* Helper Components */
    const TableCollapsRow = ({ item, a, aIndex, rowIndex }) => {
        const [open, setOpen] = useState(false)
        const [tableToggle, setTableToggle] = useState(0)
        const colorArray = ['#FF5353', '#0C7CD5', '#7BC67E', '#FFB547', '#2F3EB1']

        const resultRebuild = a.content[1].map((colItem, colIndex) => ({
            content: colItem.column,
            result: a.content[2][rowIndex][colIndex] || 0,
        }))

        return (
            <Fragment>
                <TableRow hover>
                    <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                        <Typography sx={{ fontSize: '0.8rem', textAlign: 'left', ml: '0.3rem', py: 1 }}>{item.row || '선택지 미입력'}</Typography>
                    </TableCell>
                    {a.content[1].map((_, colIndex) => (
                        <TableCell key={`table-body-row-cell-select-${aIndex}-${colIndex}`} sx={{ maxWidth: '5rem', textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '0.8rem' }}>{a.content[2][rowIndex][colIndex]}</Typography>
                        </TableCell>
                    ))}
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                </TableRow>
                <TableRow sx={{ background: '#fafafa' }}>
                    <TableCell style={{ padding: 0 }} colSpan={a.content[1].length + 2}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ m: 2 }}>
                                <AppBar position="static" color="default" elevation={1} sx={{ mb: 3 }}>
                                    <Tabs value={tableToggle} onChange={(e, value) => setTableToggle(value)} textColor="primary" variant="fullWidth" indicatorColor="primary">
                                        <Tab label="막대 그래프" value={0} />
                                        <Tab label="파이 그래프" value={1} />
                                    </Tabs>
                                </AppBar>
                                {tableToggle === 0 && <ChartType_Bar colorArray={colorArray} resultData={resultRebuild} />}
                                {tableToggle === 1 && <ChartType_Pie colorArray={colorArray} resultData={resultRebuild} />}
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </Fragment>
        )
    }

    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 인공지능 기반 건축설계 자동화 기술개발 연구단</title>
            </Head>
            <LayoutSurveyReportMenu>
                <Box
                    component="main"
                    sx={{
                        minHeight: 'calc(100vh - 64px)',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 8,
                        overflow: 'auto',
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
                            '0%, 100%': { transform: 'rotate(15deg) translateX(-100%)', opacity: 0 },
                            '50%': { transform: 'rotate(15deg) translateX(100%)', opacity: 1 },
                        },
                    }}
                >
                    {surveyResult === null ? (
                        <CircularProgress size={50} sx={{ color: 'common.white' }} />
                    ) : (
                        <Container maxWidth="md" sx={{ alignSelf: 'flex-start', zIndex: 1 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Report_Title_Download
                                        surveySelectedSurveyTitle={surveySelectedSurveyTitle}
                                        questionList={questionList}
                                        surveyResult={surveyResult}
                                        rewardRequestStatus={rewardRequestStatus}
                                        rewardRequestItem={rewardRequestItem}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <button
                                        onClick={() => {
                                            const newUrl = window.location.href.replace('report', 'ipa2')
                                            window.open(newUrl, '_blank')
                                        }}
                                        style={buttonStyle}
                                    >
                                        IPA 그래프 보기
                                    </button>
                                </Grid>

                                {surveyResult.length > 0 && (
                                    <>
                                        <Grid item xs={12}>
                                            <Divider>
                                                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'common.white', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                                                    문항별 응답 수집 결과
                                                </Typography>
                                            </Divider>
                                        </Grid>
                                        {resultRebuild.map((q, qIndex) => {
                                            if (q.id === '60c7d1ba79024c40b9117f853379ac55') return null
                                            const qNumber = qIndex + 1
                                            const colorArray = ['#FF5353', '#0C7CD5', '#7BC67E', '#FFB547', '#2F3EB1']

                                            return (
                                                <Grid item xs={12} key={`questionList-${qIndex}`}>
                                                    <Card elevation={12} sx={{ borderRadius: 2 }}>
                                                        <CardHeader
                                                            title={
                                                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                                    <Typography sx={{ fontSize: '1rem', fontWeight: '700' }}>{`${qNumber}.`}</Typography>
                                                                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, whiteSpace: 'pre-wrap', ml: 1 }}>
                                                                        {q.title || '문항 제목이 입력되지 않았습니다.'}
                                                                    </Typography>
                                                                </Box>
                                                            }
                                                        />
                                                        <Divider />

                                                        {q.type === null && <Report_NoneType />}

                                                        {q.type !== null && (
                                                            <>
                                                                {/* Common Info Section */}
                                                                <CardContent sx={{ pb: 1, backgroundColor: 'grey.50' }}>
                                                                    <Typography component="div" sx={{ fontSize: '0.8rem', fontWeight: 500, color: 'text.secondary' }}>
                                                                        <li>
                                                                            문항 타입 :
                                                                            {
                                                                                {
                                                                                    0: ' 객관식',
                                                                                    1: ' 주관식',
                                                                                    2: ' 행렬형',
                                                                                    3: ' 별점형',
                                                                                    4: ' 연락처',
                                                                                }[q.type]
                                                                            }
                                                                            응답
                                                                        </li>
                                                                        {q.type === 0 && <li>답변 방법 : {q.duplicate ? `중복 응답` : `단일 응답`}</li>}
                                                                        <li>필수 여부 : {q.required ? `필수응답 O` : `필수응답 X`}</li>
                                                                    </Typography>
                                                                </CardContent>
                                                                <Divider />

                                                                {/* Type-specific content */}
                                                                {q.type === 0 && (
                                                                    <>
                                                                        <CardContent>
                                                                            <AppBar position="static" color="default" elevation={1} sx={{ mb: 5 }}>
                                                                                <Tabs
                                                                                    value={graphTypeControl[qIndex]?.type || 0}
                                                                                    onChange={(e, value) => onChangeGraphType(qIndex, value)}
                                                                                    textColor="primary"
                                                                                    variant="fullWidth"
                                                                                    indicatorColor="primary"
                                                                                >
                                                                                    <Tab label="막대 그래프" value={0} />
                                                                                    <Tab label="파이 그래프" value={1} />
                                                                                </Tabs>
                                                                            </AppBar>
                                                                            {graphTypeControl[qIndex]?.type === 0 && <ChartType_Bar colorArray={colorArray} resultData={q.answer} />}
                                                                            {graphTypeControl[qIndex]?.type === 1 && <ChartType_Pie colorArray={colorArray} resultData={q.answer} />}
                                                                        </CardContent>
                                                                        <Table>
                                                                            {/* ... Table rendering for type 0 ... */}
                                                                        </Table>
                                                                    </>
                                                                )}

                                                                {(q.type === 1 || q.type === 4) && (
                                                                    <Table>
                                                                        {/* ... Table rendering for type 1 & 4 ... */}
                                                                    </Table>
                                                                )}

                                                                {q.type === 2 && !q.duplicate && (
                                                                    <Table>
                                                                        {/* ... Table rendering for type 2 ... */}
                                                                    </Table>
                                                                )}

                                                                {q.type === 3 && (
                                                                    <Table>
                                                                        {/* ... Table rendering for type 3 ... */}
                                                                    </Table>
                                                                )}
                                                            </>
                                                        )}
                                                    </Card>
                                                </Grid>
                                            )
                                        })}
                                    </>
                                )}
                            </Grid>
                        </Container>
                    )}
                </Box>
            </LayoutSurveyReportMenu>
        </>
    )
}

Survey_answers.getLayout = (page) => <LayoutWithServiceMenu>{page}</LayoutWithServiceMenu>

export default Survey_answers