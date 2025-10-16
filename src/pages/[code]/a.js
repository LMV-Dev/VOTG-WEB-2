import { useEffect, useState, useRef, useCallback, Fragment, createRef } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { UuidTool } from 'uuid-tool'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import API from '@utils/API'
import { debounce, throttle } from 'lodash'
import { Logo } from '@components/layout/logo'
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
    CircularProgress,
} from '@mui/material'

/* Get Data from DB */
export const getServerSideProps = async (context) => {
    const { code } = context.query

    try {
        const resSurvey = await axios.get(`https://api.koaiarchitecture.com/online/survey/answer`, {
            params: { surveyCode: code },
        })

        // const answerData = resAnswer.data
        const surveyData = resSurvey.data
        if (surveyData.payload[0] == undefined) {
            return {
                redirect: {
                    permanent: false,
                    destination: '/404',
                },
                props: {},
            }
        }
        return { props: { surveyData } }
    } catch (error) {
        return {
            redirect: {
                permanent: false,
                destination: '/404',
            },
            props: {},
        }
    }
}

const Survey_answer = (props) => {
    const { surveyData } = props
    const theme = useTheme()
    const router = useRouter()
    const { code, c } = router.query

    // console.log('surveyData', surveyData)
    // console.log('answerData', answerData)

    //Scroll Ref
    const targets = useRef([])

    // const [answerStatus, setAnswerStatus] = useState(answerData.payload.status)
    const [surveyComplete, setSurveyComplete] = useState(false)
    // const [phoneCode, setPhoneCode] = useState(answerData.payload.phoneCode)
    /* Question List Temp Data */
    const [surveyStatus, setSurveyStatus] = useState(JSON.parse(surveyData?.payload[0]?.status))
    const [surveyLoadData, setSurveyLoadData] = useState(JSON.parse(surveyData?.payload[0]?.survey))
    const [rewadData, setRewadData] = useState(null)
    /* Question Edit State */
    const [questionList, setQuestionList] = useState([])
    const [questionStep, setQuestionStep] = useState(0)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [previousQuestionIndexArray, setPreviousQuestionIndexArray] = useState([])
    const [currentQuestionDisable, setCurrentQuestionDisable] = useState(false)

    /* 다음 버튼 응답 설정 */
    const onClickNextButton = (currentQuestion) => {
        // console.log('onClickNextButton - currentQuestion', currentQuestion)

        if (!currentQuestion.logicActive) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        } else {
            const nextIndex = questionList.map((q) => q.id).indexOf(currentQuestion.logicNext[currentQuestion.checked || 0].questionId)
            // console.log('onClickNextButton - previousQuestion', currentQuestion.checked || 0)
            setPreviousQuestionIndexArray([...previousQuestionIndexArray, { prevId: currentQuestion.id, nextId: currentQuestion.logicNext[currentQuestion.checked || 0].questionId }])
            setCurrentQuestionIndex(nextIndex)
        }
    }
    // useEffect(() => {
    //     console.log('previousQuestionIndexArray', previousQuestionIndexArray)
    // }, [previousQuestionIndexArray])
    const onClickPrevButton = (currentQuestion) => {
        if (previousQuestionIndexArray.map((p) => p.nextId).includes(currentQuestion.id)) {
            const prevElementIndex = previousQuestionIndexArray.map((p) => p.nextId).indexOf(currentQuestion.id)
            // console.log('prevElementIndex', prevElementIndex)
            const prevIndex = questionList.map((q) => q.id).indexOf(previousQuestionIndexArray[prevElementIndex].prevId)
            setCurrentQuestionIndex(prevIndex)
            setPreviousQuestionIndexArray([...previousQuestionIndexArray.filter((q) => q.nextId !== currentQuestion.id)])
        } else {
            setCurrentQuestionIndex(currentQuestionIndex - 1)
        }
    }

    //필수 입력 항목 체크
    useEffect(() => {
        if (questionList[currentQuestionIndex]?.required) {
            if (questionList[currentQuestionIndex].type === 0) {
                if (questionList[currentQuestionIndex].duplicate) {
                    setCurrentQuestionDisable(questionList[currentQuestionIndex].checked == null ? true : questionList[currentQuestionIndex].checked?.length == 0)
                    // console.log('duplicate - null', questionList[currentQuestionIndex].checked == null)
                    // console.log('duplicate - checked length', questionList[currentQuestionIndex].checked?.length == 0)
                } else {
                    setCurrentQuestionDisable(questionList[currentQuestionIndex].checked == null)
                }
            } else if (questionList[currentQuestionIndex].type === 1) {
                setCurrentQuestionDisable(questionList[currentQuestionIndex].answer[0].content.trim().length < 1)
            } else if (questionList[currentQuestionIndex].type === 2) {
                const resultArray = questionList[currentQuestionIndex].answer[0].content[2].map((v, vIndex) => {
                    return v.checked !== null
                })
                // console.log('resultArray', resultArray)
                const totalChecked = resultArray.reduce((prev, next) => prev && next, true)
                // console.log('totalChecked', totalChecked)
                setCurrentQuestionDisable(!totalChecked)
            }
        } else {
            setCurrentQuestionDisable(false)
        }
    }, [questionList, currentQuestionIndex, currentQuestionDisable])

    // useEffect(() => {
    //     console.log('currentQuestionDisable', currentQuestionDisable)
    // }, [currentQuestionDisable])

    // onChange : 00 Choice Element 객관식
    const onChangeChoiceAnswer = (event, mode, selectedIndex, innerItem, rowIndex) => {
        event.stopPropagation()
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
        setQuestionList([...updateList])
    }

    const onChangeChoiceEtcAnswer = (event, selectedIndex) => {
        event.stopPropagation()
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

    // onChange : 01 Essay Element 주관식
    const onChangeEssayAnswer = (event, selectedIndex, question, innerItem) => {
        event.stopPropagation()
        // console.log('onChangeEssayAnswer - selectedIndex', selectedIndex)
        // console.log('onChangeEssayAnswer - question', question)
        // console.log('onChangeEssayAnswer - innerItem', innerItem)
        // let innerItemList = questionList[selectedIndex].answer[0].filter((item) => item !== innerItem)

        questionList.find((q) => q.id == question.id).answer.find((a) => a.id == innerItem.id).content = event.target.value
        // console.log('updateList', questionList.find((q) => q.id == question.id).answer.find((a) => a.id == innerItem.id).content)
        // const updateList = questionList.map((item, itemIndex) => {
        //     if (selectedIndex === itemIndex) {
        //         let updateItem = {
        //             ...item,
        //             answer: [
        //                 {
        //                     ...questionList[selectedIndex].answer[0],
        //                     content: event.target.value,
        //                 },
        //             ],
        //         }
        //         return updateItem
        //     }
        //     return item
        // })

        setQuestionList([...questionList])
    }

    // onChange : 02 Table Element 행렬형
    const onChangeTableAnswer = (event, mode, selectedIndex, innerItem, editContent, type, rowIndex, checkedIndex) => {
        event.stopPropagation()
        // console.log('innerItem', innerItem)
        // console.log('editContent', editContent)
        let editContentList = questionList[selectedIndex].answer[0].content.filter((item) => item !== editContent)
        let innerItemList = questionList[selectedIndex].answer[0].content[type].filter((item) => item !== innerItem)
        // console.log('editContentList', editContentList)
        // console.log('innerItemList', innerItemList)
        // answerList.splice(rowIndex, 0, { ...editAnswer, content: event.target.value })

        if (type === 0) {
            // console.log('answerList', '질문 row', rowIndex)
            if (mode == 'click') {
                innerItemList.splice(rowIndex, 0, { ...innerItem, edit: !innerItem.edit })
            } else if (mode == 'input') {
                innerItemList.splice(rowIndex, 0, { ...innerItem, row: event.target.value })
            }
            editContentList.splice(type, 0, [...innerItemList])
        } else if (type === 1) {
            // console.log('answerList', '선택지 column', rowIndex)
            if (mode == 'click') {
                innerItemList.splice(rowIndex, 0, { ...innerItem, edit: !innerItem.edit })
            } else if (mode == 'input') {
                innerItemList.splice(rowIndex, 0, { ...innerItem, column: event.target.value })
            }
            editContentList.splice(type, 0, [...innerItemList])
        } else if (type === 2) {
            // console.log('answerList', '라디오/체크박스', rowIndex)
            if (mode == 'radio') {
                innerItemList.splice(rowIndex, 0, { ...innerItem, checked: checkedIndex })
            }
            editContentList.splice(type, 0, [...innerItemList])
        }

        // console.log('editContentList - last ', editContentList)
        // console.log('innerItemList - last ', innerItemList)

        const updateList = questionList.map((item, itemIndex) => {
            if (selectedIndex === itemIndex) {
                let updateItem = {
                    ...item,
                    answer: [
                        {
                            ...questionList[itemIndex].answer[0],
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
            setTableAnswerEditModeControl(event, selectedIndex, rowIndex, type)
        }
    }

    // onChange : 03 Rating Element 별점형
    const onChangeStartAnswer = (event, selectedIndex, innerItem) => {
        event.stopPropagation()
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
        setQuestionList([...updateList])
    }

    /* Question Update */
    useEffect(() => {
        if (surveyLoadData !== null) {
            // console.log('surveyLoadData', surveyLoadData)
            setRewadData(surveyLoadData.reward)
            // console.log('Reward', surveyLoadData.reward)
            setQuestionList(surveyLoadData.questions)
            setQuestionStep(surveyLoadData.questions.length)
            globalThis.sessionStorage.setItem('suvy-answr', JSON.stringify(surveyLoadData.questions))
        } else {
            globalThis.sessionStorage.removeItem('suvy-answr')
        }
    }, [surveyComplete, surveyLoadData])

    /* Complete to Survey */
    const onSurveyComplete = async () => {
        try {
            if (surveyStatus == 0) {
                toast.error(
                    <div>
                        배포전입니다. <br />
                        배포후 응답을 수집할 수 있습니다.
                    </div>,
                    {
                        enableHtml: true,
                    },
                )
            } else if (surveyStatus == 1) {
                const answerData = globalThis.sessionStorage.getItem('suvy-answr')
                // console.log(surveyData)

                // answerData.map((ans, aIndex) => {})

                const uuidString = UuidTool.newUuid().replace(/-/g, '')
                const res = await API.post('online/survey/answer', {
                    identifyCode: uuidString,
                    surveyCode: code,
                    answerJson: answerData,
                })
                // console.log(res)
                setSurveyComplete(true)
                globalThis.sessionStorage.setItem(`${code}`, true)
                globalThis.sessionStorage.removeItem('suvy-answr')
                toast.success('설문 완료')
            }
        } catch (error) {
            console.error(error)
            toast.error('Unable to logout.')
        }
    }

    /* Question Update */
    useEffect(() => {
        // const size = new TextEncoder().encode(JSON.stringify(questionList)).length
        // const kiloBytes = size / 1024
        // const megaBytes = kiloBytes / 1024

        // console.log('questionList - data', questionList)
        globalThis.sessionStorage.setItem('suvy-answr', JSON.stringify(questionList))
    }, [questionList])

    useEffect(() => {
        if (globalThis.sessionStorage.getItem(`${code}`) === 'true') {
            setSurveyComplete(true)
        }
    }, [])

    if (surveyLoadData === null) {
        return (
            <Box sx={{ height: '100vh' }}>
                <CircularProgress
                    sx={{
                        position: 'relative',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />
            </Box>
        )
    }

    if (surveyStatus == 3) {
        globalThis.sessionStorage.removeItem('suvy-answr')
        return (
            <>
                <Box
                    sx={{
                        height: '100vh',
                        backgroundColor: 'background.paper',
                        pt: 10,
                    }}
                >
                    <Container
                        maxWidth="md"
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography color="primary" variant="overline">
                            설문 수집이 완료되었습니다.
                        </Typography>

                        <Typography align="center" variant="h5" sx={{ py: 1 }}>
                            설문에 관심가져 주셔서 감사합니다.
                        </Typography>
                        {/* <Box>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    window.open('about:blank', '_self')
                                    setTimeout(()=>{
                                        window.close()
                                    },100);
                                }}

                                component="a"
                                href="#"
                                sx={{ width: '200px', my: 5 }}
                            >
                                종료
                            </Button>
                        </Box> */}
                        <Box sx={{ position: 'fixed', bottom: 0, my: 5 }}>
                            <Logo width={100} />
                        </Box>
                        {/* <Typography
                                align="center"
                                color="textSecondary"
                                variant="subtitle1"
                                sx={{ py: 3 }}
                            >
                                설문조사 완료후 연락처를 남겨주시면 소정의 상품을 보내드립니다.
                            </Typography> */}
                    </Container>
                </Box>
            </>
        )
    }

    // if (answerStatus == 4) {
    //     globalThis.sessionStorage.removeItem('suvy-answr')
    //     return (
    //         <>
    //             <Box
    //                 sx={{
    //                     height: '100vh',
    //                     backgroundColor: 'background.paper',
    //                     pt: 10,
    //                 }}
    //             >
    //                 <Container
    //                     maxWidth="md"
    //                     sx={{
    //                         alignItems: 'center',
    //                         display: 'flex',
    //                         flexDirection: 'column',
    //                     }}
    //                 >
    //                     <Typography color="primary" variant="overline">
    //                         설문링크가 갱신되었습니다.
    //                     </Typography>

    //                     <Typography align="center" variant="h5" sx={{ py: 1 }}>
    //                         새로운 링크를 통해 접속해 주세요.
    //                     </Typography>
    //                     <Box>
    //                         <Button
    //                             variant="outlined"
    //                             onClick={() => {
    //                             }}
    //                             sx={{ width: '200px', my: 5 }}
    //                         >
    //                             종료
    //                         </Button>
    //                     </Box>
    //                     <Box sx={{ position: 'fixed', bottom: 0, my: 5 }}>
    //                         <Logo width={100} />
    //                     </Box>
    //                     {/* <Typography
    //                             align="center"
    //                             color="textSecondary"
    //                             variant="subtitle1"
    //                             sx={{ py: 3 }}
    //                         >
    //                             설문조사 완료후 연락처를 남겨주시면 소정의 상품을 보내드립니다.
    //                         </Typography> */}
    //                 </Container>
    //             </Box>
    //         </>
    //     )
    // }

    return (
        <>
            <Head>
                <title>설문조사 | 뷰즈온더고</title>
            </Head>
            {/* <ElementNavbar sx={{ paddingTop: '128px', zIndex: 900 }} path={router.asPath} /> */}
            {/* <ElementSidebar
                onClose={() => setSidebarOpen(!isSidebarOpen)}
                open={isSidebarOpen}
                sideItemList={questionList}
                setSideItemList={setQuestionList}
                currentSelected={currentSelectedQuestion}
                setCurrentSelected={setCurrentSelectedQuestion}
                targets={targets}
            /> */}

            {!surveyComplete && (
                <Box sx={{ mt: 5, backgroundColor: 'background.grade', minHeight: 'calc(100vh)' }}>
                    {/* <ProjectPreviewNextLayout sidebarActive={false} setSidebarStatus={() => {}}> */}
                    <Container disableGutters={true} maxWidth={'xmd'}>
                        <Box sx={{ margin: '0 auto', my: 2, mx: { sm: 1, xs: 0 } }}>
                            <Card
                                sx={{
                                    height: '100%',
                                    px: { sm: 5, xs: 1 },

                                    pt: 5,
                                    pb: 4,
                                    border: '2px solid #fff',
                                }}
                            >
                                {surveyLoadData?.info.logoImage?.length > 0 && (
                                    <>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                alignItems: 'top',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    width: '100%',
                                                    minHeight: '50px',
                                                    maxHeight: '70px',
                                                }}
                                            >
                                                <Image src={`https://api.koaiarchitecture.com/${surveyLoadData?.info?.logoImage}`} priority={true} layout="fill" objectFit="contain" objectPosition="left" />
                                            </div>
                                        </Box>
                                        <Divider sx={{ mt: 3, visibility: 'hidden' }} />
                                    </>
                                )}
                                <Typography
                                    sx={{
                                        color: 'text.black',
                                        fontSize: '1.8rem',
                                        fontWeight: 500,
                                    }}
                                >
                                    {surveyLoadData?.title || surveyLoadData?.info?.title}
                                </Typography>
                                {surveyLoadData?.info?.description?.length > 0 && (
                                    <>
                                        <Divider sx={{ my: 3 }} />
                                        <Typography
                                            sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: 400,
                                                lineHeight: '1.8',
                                                whiteSpace: 'pre-wrap',
                                                ml: 0.5,
                                            }}
                                        >
                                            {surveyLoadData?.info?.description}
                                        </Typography>
                                    </>
                                )}
                            </Card>
                        </Box>
                        {questionList.map((q, qIndex) => {
                            const qNumber = qIndex + 1
                            if (qIndex === currentQuestionIndex) {
                                return (
                                    <Box sx={{ margin: '0 auto', my: 2, mx: { sm: 1, xs: 0 } }} key={`questionList-${qIndex}`}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} xmd={12} md={12}>
                                                <Card
                                                    // onClick={(e) => onClickEditModeActive(e, qIndex, q)}
                                                    sx={{
                                                        height: '100%',
                                                        px: { sm: 5, xs: 1 },
                                                        pt: 1,
                                                        pb: 1,
                                                        border: '2px solid #fff',
                                                        // '&:hover': currentSelectedQuestion !== qIndex && {
                                                        //     border: '2px solid #FF535330',
                                                        //     cursor: 'pointer',
                                                        //     transition: 'all 0.5s',
                                                        // },
                                                    }}
                                                >
                                                    {/* 0. TOP INICATOR LINE */}
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mt: 1,
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        {q.required ? (
                                                            <Typography
                                                                sx={{
                                                                    color: 'primary.main',
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                *필수
                                                            </Typography>
                                                        ) : (
                                                            <Box></Box>
                                                        )}
                                                        {/* {questionList.length > 1 && (
                                                        // <IconButton onClick={(e) => onClickDeleteQuestionButton(e, q)}>
                                                        <IconButton onClick={() => setQuestionList((items) => items.filter((item) => item.id !== q.id))}>
                                                            <IconSurveyDelete
                                                                sx={{
                                                                    width: 21,
                                                                }}
                                                                customColor="#000"
                                                            />
                                                        </IconButton>
                                                    )} */}
                                                    </Box>

                                                    {/* 1. TITLE LINE */}
                                                    <Box sx={{ pt: 0, pb: 1 }}>
                                                        {q.title?.length > 0 ? (
                                                            <>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'flex-start',
                                                                        alignItems: 'top',
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: '0.8rem',
                                                                            fontWeight: '700',
                                                                        }}
                                                                    >{`${qNumber}.`}</Typography>
                                                                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'pre-wrap', ml: 1 }}>{`${q.title}`}</Typography>
                                                                </Box>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'text.secondary' }}>{`${qNumber}. 문항 제목이 입력되지 않았습니다.`}</Typography>
                                                            </>
                                                        )}
                                                        <Divider sx={{ mt: 1 }} />
                                                    </Box>
                                                    {/* 2. CONTENTS LINE */}
                                                    <Box>
                                                        {/* 2-1. Not Selected */}
                                                        {q.type === null && (
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    mt: '40px',
                                                                    mb: '80px',
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: '1rem',
                                                                        fontWeight: '700',
                                                                        textAlign: 'center',
                                                                    }}
                                                                >
                                                                    응답형태가 선택되지 않았습니다.
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                        {/* 2-2. Selected */}
                                                        {q.type !== null && (
                                                            <Box sx={{ pt: 0, mb: 3 }}>
                                                                {/* No Edit Mode*/}
                                                                {/* 객관식 */}
                                                                <Box>
                                                                    {q.type === 0 && (
                                                                        <>
                                                                            <RadioGroup aria-labelledby="answer-radio-group-label" name="answer-radio-group">
                                                                                {q.answer.map((a, aIndex) => {
                                                                                    return (
                                                                                        <Fragment key={`question-key-${aIndex}`}>
                                                                                            <FormControlLabel
                                                                                                value={aIndex + 1}
                                                                                                control={
                                                                                                    q.duplicate ? (
                                                                                                        <Checkbox
                                                                                                            onChange={(e) => onChangeChoiceAnswer(e, 'checkbox', qIndex, a, aIndex)}
                                                                                                            checked={q.checked !== null ? q.checked.includes(aIndex) : false}
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <Radio onChange={(e) => onChangeChoiceAnswer(e, 'radio', qIndex, a, aIndex)} checked={a.checked} />
                                                                                                    )
                                                                                                }
                                                                                                label={
                                                                                                    <>
                                                                                                        {a.content?.length > 0 ? (
                                                                                                            <Typography sx={{ fontSize: { sm: '0.8rem', xs: '0.5rem' }, fontWeight: 500 }}>{a.content}</Typography>
                                                                                                        ) : (
                                                                                                            <Typography
                                                                                                                sx={{
                                                                                                                    fontSize: { sm: '0.8rem', xs: '0.5rem' },
                                                                                                                    fontWeight: 500,
                                                                                                                    color: 'text.secondary',
                                                                                                                }}
                                                                                                            >
                                                                                                                선택지를 입력해주세요
                                                                                                            </Typography>
                                                                                                        )}
                                                                                                    </>
                                                                                                }
                                                                                            />
                                                                                        </Fragment>
                                                                                    )
                                                                                })}
                                                                                {q.etcActive && (
                                                                                    <FormControlLabel
                                                                                        value={q.answer.length + 1}
                                                                                        control={
                                                                                            q.duplicate ? (
                                                                                                <Checkbox onChange={(e) => onChangeChoiceAnswer(e, 'etc', qIndex, null, q.answer.length)} />
                                                                                            ) : (
                                                                                                <Radio onChange={(e) => onChangeChoiceAnswer(e, 'etc', qIndex, null, q.answer.length)} />
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
                                                                                                <Typography sx={{ fontSize: { sm: '0.8rem', xs: '0.5rem' }, minWidth: '2rem', ml: 1 }}>기타:</Typography>
                                                                                                <TextField
                                                                                                    multiline={true}
                                                                                                    variant="standard"
                                                                                                    size={'small'}
                                                                                                    label=""
                                                                                                    margin="normal"
                                                                                                    name={`question-content-etc-${qIndex}`}
                                                                                                    disabled={q.duplicate ? !q.checked?.includes(q.answer.length) : q.checked !== q.answer.length}
                                                                                                    onChange={(e) => onChangeChoiceEtcAnswer(e, qIndex)}
                                                                                                    placeholder="기타 답변을 입력해주세요."
                                                                                                    type="text"
                                                                                                    value={q.etcAnswer?.content}
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
                                                                                                            fontSize: { sm: '0.8rem', xs: '0.5rem' },
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
                                                                {/*No Edit Mode*/}
                                                                {/* 주관식 */}
                                                                <Box>
                                                                    <Box>
                                                                        {q.type === 1 &&
                                                                            q.answer.map((a, aIndex) => {
                                                                                return (
                                                                                    <Fragment key={`question-key-${aIndex}`}>
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
                                                                                                    multiline={true}
                                                                                                    variant="outlined"
                                                                                                    // error={
                                                                                                    //     q.title?.length < 5 ||
                                                                                                    //     q.title?.length > 51
                                                                                                    // }
                                                                                                    size={'large'}
                                                                                                    label=""
                                                                                                    margin="normal"
                                                                                                    name={`question-content-${aIndex}`}
                                                                                                    onChange={(e) => onChangeEssayAnswer(e, qIndex, q, a)}
                                                                                                    placeholder="질문에 답해주세요."
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
                                                                                                    }}
                                                                                                    inputProps={{
                                                                                                        style: {
                                                                                                            fontSize: { sm: '0.8rem', xs: '0.5rem' },
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
                                                                </Box>
                                                                {/* No Edit Mode*/}
                                                                {/* 행렬형 */}
                                                                <Box>
                                                                    {q.type === 2 &&
                                                                        q.answer.map((a, aIndex) => {
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
                                                                                                    return (
                                                                                                        <TableCell
                                                                                                            key={`table-head-row-cell-${aIndex}-${colIndex}`}
                                                                                                            sx={{
                                                                                                                width: `${60 / a.content[1].length}%`,
                                                                                                            }}
                                                                                                        >
                                                                                                            <Typography
                                                                                                                sx={{
                                                                                                                    lineHeight: '1.3',
                                                                                                                    fontSize: { sm: '0.8rem', xs: '0.5rem' },
                                                                                                                    textAlign: 'center',
                                                                                                                }}
                                                                                                            >
                                                                                                                {item.column}
                                                                                                            </Typography>
                                                                                                        </TableCell>
                                                                                                    )
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
                                                                                                            <Typography
                                                                                                                sx={{
                                                                                                                    lineHeight: '1.3',
                                                                                                                    fontSize: { sm: '0.8rem', xs: '0.5rem' },
                                                                                                                    textAlign: 'left',
                                                                                                                    ml: '0.3rem',
                                                                                                                }}
                                                                                                            >
                                                                                                                {item.row}
                                                                                                            </Typography>
                                                                                                        </TableCell>
                                                                                                        {/* 질문별 선택지 */}
                                                                                                        {a.content[1].map((item, colIndex) => {
                                                                                                            // console.log('item', item)
                                                                                                            return (
                                                                                                                <TableCell key={`table-body-row-cell-select-${aIndex}-${colIndex}`} sx={{ maxWidth: '5rem' }}>
                                                                                                                    {q.duplicate ? (
                                                                                                                        <Checkbox sx={{ '& span': { width: '100%' } }} />
                                                                                                                    ) : (
                                                                                                                        <Radio
                                                                                                                            sx={{ transform: { sm: 'scale(0.8)', xs: 'scale(0.5)' } }}
                                                                                                                            checked={a.content[2][rowIndex].checked === colIndex}
                                                                                                                            onChange={(e) => onChangeTableAnswer(e, 'radio', qIndex, a.content[2][rowIndex], a.content[2], 2, rowIndex, colIndex)}
                                                                                                                        />
                                                                                                                    )}
                                                                                                                </TableCell>
                                                                                                            )
                                                                                                        })}
                                                                                                    </TableRow>
                                                                                                )
                                                                                            })}
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </Box>
                                                                            )
                                                                        })}
                                                                </Box>

                                                                {/* No Edit Mode*/}
                                                                {/* 별점형 */}
                                                                <Box>
                                                                    {q.type === 3 && (
                                                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                                                            <Rating size="large" onChange={(e) => onChangeStartAnswer(e, qIndex, q.answer[0].content)} />
                                                                        </Box>
                                                                    )}
                                                                </Box>

                                                                {/* No Edit Mode*/}
                                                                {/* 연락처 */}
                                                                <Box>
                                                                    {q.type === 4 &&
                                                                        q.answer.map((a, aIndex) => {
                                                                            return (
                                                                                <Fragment key={`question-key-${aIndex}`}>
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
                                                                                                multiline={true}
                                                                                                variant="outlined"
                                                                                                // error={
                                                                                                //     q.title?.length < 5 ||
                                                                                                //     q.title?.length > 51
                                                                                                // }
                                                                                                size={'large'}
                                                                                                label=""
                                                                                                margin="normal"
                                                                                                name={`question-content-${aIndex}`}
                                                                                                onChange={(e) => onChangeEssayAnswer(e, qIndex, a)}
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
                                                                                                    mb: 0,
                                                                                                }}
                                                                                                inputProps={{
                                                                                                    style: {
                                                                                                        fontSize: { sm: '0.8rem', xs: '0.5rem' },
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
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )
                            }
                        })}
                        <Divider sx={{ my: 1 }} />
                        {currentQuestionIndex !== questionStep ? (
                            <Box sx={{ margin: '0 auto', my: 5, mx: { sm: 1, xs: 1 } }}>
                                {currentQuestionIndex > 0 ? (
                                    <Grid container spacing={1}>
                                        <Grid item xs={4}>
                                            <Button fullWidth size="large" variant="outlined" sx={{ py: 2 }} onClick={() => onClickPrevButton(questionList[currentQuestionIndex])}>
                                                뒤로가기
                                            </Button>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Button fullWidth size="large" variant="contained" sx={{ py: 2 }} onClick={() => onClickNextButton(questionList[currentQuestionIndex])} disabled={currentQuestionDisable}>
                                                다음
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Button fullWidth size="large" variant="contained" sx={{ py: 2 }} onClick={() => onClickNextButton(questionList[currentQuestionIndex])} disabled={currentQuestionDisable}>
                                                다음
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}
                            </Box>
                        ) : (
                            <Box sx={{ margin: '0 auto', my: 5, mx: { sm: 1, xs: 1 } }}>
                                <Button fullWidth size="large" variant="outlined" sx={{ py: 2 }} onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>
                                    뒤로가기
                                </Button>
                                <Divider sx={{ my: 1 }} />
                                <Button fullWidth size="large" variant="contained" sx={{ py: 2 }} onClick={onSurveyComplete}>
                                    설문 응답 제출
                                </Button>
                            </Box>
                        )}
                        <Divider sx={{ mb: 10 }} />
                    </Container>
                </Box>
            )}
            {surveyComplete && (
                <>
                    <Box
                        sx={{
                            height: '100vh',
                            backgroundColor: 'background.paper',
                            pt: 10,
                        }}
                    >
                        <Container
                            maxWidth="md"
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography color="primary" variant="overline">
                                설문 응답 완료
                            </Typography>

                            <Typography align="center" variant="h5" sx={{ py: 1 }}>
                                설문에 응해주셔서 감사합니다.
                            </Typography>
                            {/* <Box>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        window.open('about:blank', '_self')
                                        setTimeout(()=>{
                                        window.close()
                                    },100);
                                    }}
                                    component="a"
                                    href="#"
                                    sx={{ width: '200px', my: 5 }}
                                >
                                    종료
                                </Button>
                            </Box> */}
                            <Box sx={{ position: 'fixed', bottom: 0, my: 5 }}>
                                <Logo width={100} />
                            </Box>
                            {/* <Typography
                                align="center"
                                color="textSecondary"
                                variant="subtitle1"
                                sx={{ py: 3 }}
                            >
                                설문조사 완료후 연락처를 남겨주시면 소정의 상품을 보내드립니다.
                            </Typography> */}
                        </Container>
                    </Box>
                </>
            )}
        </>
    )
}

// Survey_answer.getLayout = (page) => <AuthGuard>{page}</AuthGuard>

export default Survey_answer
