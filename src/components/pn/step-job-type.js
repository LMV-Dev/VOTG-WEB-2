import { useState, useEffect, Fragment } from 'react'

import axios from 'axios'
import API from '@utils/API'
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { UuidTool } from 'uuid-tool'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton, Pagination } from '@mui/material'

/*MUI Icon*/
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'

const CODE = 'Q-0018'
const TYPE = 1

const title = '직업군을 선택해주세요.'
const item = [
    { text: '농업, 임업 및 어업', count: 0 },
    { text: '광업', count: 10 },
    { text: '제조업', count: 10 },
    { text: '전기, 가스, 증기 및 공기 조절 공급업', count: 10 },
    { text: '수도, 하수 및 폐기물 처리, 원료 재생업', count: 10 },
    { text: '건설업', count: 10 },
    { text: '도매 및 소매업', count: 10 },
    //
    { text: '운수 및 창고업', count: 0 },
    { text: '숙박 및 음식점업', count: 10 },
    { text: '정보통신업', count: 10 },
    { text: '금융 및 보험업', count: 10 },
    { text: '부동산업', count: 10 },
    { text: '전문, 과학 및 기술 서비스업', count: 10 },
    { text: '사업시설 관리, 사업 지원 및 임대 서비스업', count: 10 },
    //
    { text: '공공 행정, 국방 및 사회보장 행정', count: 0 },
    { text: '교육 서비스업', count: 10 },
    { text: '보건업 및 사회복지 서비스업', count: 10 },
    { text: '예술, 스포츠 및 여가관련 서비스업', count: 10 },
    { text: '협회 및 단체, 수리 및 기타 개인 서비스업', count: 10 },
    { text: '가구 내 고용활동 및 달리 분류되지 않은 자가 소비 생산활동', count: 10 },
]

const Step_JobType = ({ onChangeStepEnable }) => {
    const router = useRouter()
    const { user } = useAuth()
    const [selectedNumber, setSelectedNumber] = useState(null)

    const [page, setPage] = useState(1)
    const handlePage = (event, value) => {
        setPage(value)
    }

    const onClickSelectedNumber = async (value) => {
        setSelectedNumber(value)

        const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')
        const answerConvert = [{ type: TYPE }, { ans: value }]
        const res = await API.post('panel/answer/save', {
            PanelCode: uuidString,
            QuestionCode: CODE,
            answerJson: JSON.stringify(answerConvert),
        })
        // console.log('res', res)
    }

    const [answerData, setAnswerData] = useState(null)
    //UserData

    /* Loaded survey Data */
    useEffect(() => {
        if (!router.isReady) {
            return
        }
        let isMounted = true
        // declare the async data fetching function
        // let currentCreateSureveyData = JSON.parse(globalThis.sessionStorage.getItem('current-create-survey'))

        const fetchData = async () => {
            const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')
            await axios
                // .get(`http://localhost:3400/json/sample/00`, null)
                .post(`https://api.koaiarchitecture.com/panel/answer/check`, {
                    PanelCode: uuidString,
                    QuestionCode: CODE,
                })
                .then(async (res) => {
                    // console.log(res.data)
                    if (res.data) {
                        if (isMounted) {
                            // console.log('res.data', res.data.payload)
                            setAnswerData(res.data.payload)
                        }
                    }
                })
                .catch((error) => console.log(error))
        }
        // call the function
        fetchData().catch(console.error)
        return () => {
            isMounted = false
        }
    }, [user])

    useEffect(() => {
        // console.log('answerAllData', answerAllData)
        if (answerData !== null) {
            // console.log('Code : ', answerData.QuestionCode)
            const renewAnswer = JSON.parse(answerData.answer)
            // console.log('Answer All : ', renewAnswer)
            // console.log('Answer type  : ', renewAnswer[0].type)
            // console.log('Answer answer  : ', renewAnswer[1].ans)
            setSelectedNumber(renewAnswer[1].ans)
        }
    }, [answerData])

    useEffect(() => {
        if (selectedNumber !== null) {
            onChangeStepEnable(true)
        } else {
            onChangeStepEnable(false)
        }
    }, [selectedNumber])

    return (
        <>
            <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                <Box sx={{ width: '100%', my: 0 }} />
                <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                    <Typography sx={{ my: 1, color: 'text.main', fontSize: '1rem', fontWeight: 700, textAlign: 'left' }}>{title}</Typography>
                </Box>
                <Divider sx={{ width: '100%', height: '1px', mt: 1, mb: 1 }} />
                <Box sx={{ mx: 0, my: 0 }}>
                    <Typography sx={{ mb: 2, textAlign: 'center', fontSize: '1rem', fontWeight: 500 }}>선택 : {item[selectedNumber]?.text}</Typography>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            {item.slice((page - 1) * 7, page * 7).map((v, index) => {
                                var newIndex = index + (page - 1) * 7
                                var number = index + 1 + (page - 1) * 7
                                return (
                                    <Fragment key={`step-key-${newIndex}`}>
                                        <Box
                                            onClick={() => onClickSelectedNumber(newIndex)}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '320px',
                                                height: '45px',
                                                background: '#1C60FF',
                                                mb: 1,
                                                borderRadius: '5px',
                                                '&:hover': {
                                                    cursor: 'pointer',
                                                    opacity: 0.8,
                                                    transition: 'all 0.5s',
                                                },
                                                ...(selectedNumber === newIndex && {
                                                    background: '#1C60FF',
                                                    borderColor: 'rgba(0,0,0,0.5)',
                                                    borderWidth: 5,
                                                    borderStyle: 'solid',
                                                    // m: '0px 0px',
                                                }),
                                            }}
                                        >
                                            <Typography fontWeight={500} sx={{ color: '#fff', fontSize: v.text.length > 20 ? '0.8rem' : '0.9rem' }}>
                                                {`${number}. `}
                                                {v.text}
                                            </Typography>
                                        </Box>
                                    </Fragment>
                                )
                            })}
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Pagination count={3} size="small" sx={{ margin: '0 auto' }} onChange={handlePage} />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export default Step_JobType
