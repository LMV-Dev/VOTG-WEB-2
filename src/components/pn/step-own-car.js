import { useState, useEffect, Fragment } from 'react'

import axios from 'axios'
import API from '@utils/API'
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { UuidTool } from 'uuid-tool'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*MUI Icon*/
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'

const CODE = 'Q-0015'
const TYPE = 1

const title = '보유한 차량 종류를 선택해주세요. (중복 선택 가능)'
const item = [
    { text: '휘발유', count: 0 },
    { text: '세단', count: 0 },
    { text: '경유', count: 0 },
    { text: 'SUV', count: 0 },
    { text: '전기', count: 0 },
    { text: '승합', count: 0 },
    { text: '수소', count: 0 },
    { text: '트럭', count: 0 },
    { text: '하이브리드', count: 0 },
    { text: '중장비\n(덤프,포크레인등)', count: 0 },
]

const Step_OwnCar = ({ onChangeStepEnable }) => {
    const router = useRouter()
    const { user } = useAuth()
    const [selectedArray, setSelectedArray] = useState([])

    const onClickselectedArray = async (value) => {
        var currentArray = []
        if (selectedArray.length > 0 && selectedArray.includes(value)) {
            currentArray = selectedArray.filter((data) => {
                return data != value
            })
        } else {
            if (selectedArray.length > 0) {
                currentArray = [...selectedArray, value].sort()
            } else {
                currentArray = [value].sort()
            }
        }

        const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')
        const answerConvert = [{ type: TYPE }, { ans: currentArray }]
        setSelectedArray(currentArray)
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
            setSelectedArray(renewAnswer[1].ans)
        }
    }, [answerData])

    useEffect(() => {
        if (selectedArray.length > 0) {
            onChangeStepEnable(true)
        } else {
            onChangeStepEnable(false)
        }
        // console.log('selectedArray', selectedArray)
    }, [selectedArray])

    return (
        <>
            <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                <Box sx={{ width: '100%', my: 1 }} />
                <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                    <Typography sx={{ my: 1, color: 'text.main', fontSize: '1rem', fontWeight: 700, textAlign: 'left' }}>{title}</Typography>
                </Box>
                <Divider sx={{ width: '100%', height: '1px', mt: 2, mb: 2 }} />
                <Box sx={{ mx: 0, my: 0 }}>
                    <Typography sx={{ mb: 3, textAlign: 'center', fontSize: selectedArray.length > 2 ? '0.9rem' : '1.3rem', fontWeight: 700 }}>
                        {`선택 : `}
                        {selectedArray.length > 0 &&
                            selectedArray.map((v, index) => {
                                if (selectedArray.length == 1) {
                                    return item[v]?.text
                                } else {
                                    if (index === selectedArray.length - 1) {
                                        return item[v]?.text
                                    } else {
                                        return item[v]?.text + ', '
                                    }
                                }
                            })}
                    </Typography>
                    <Grid container spacing={1}>
                        {item.map((v, index) => {
                            var number = index + 1
                            return (
                                <Grid item xs={6} key={`step-key-${index}`}>
                                    <Fragment>
                                        <Box
                                            onClick={() => onClickselectedArray(index)}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%',
                                                height: '50px',
                                                background: '#1C60FF',
                                                mb: 2,
                                                borderRadius: '5px',
                                                '&:hover': {
                                                    cursor: 'pointer',
                                                    opacity: 0.8,
                                                    transition: 'all 0.5s',
                                                },
                                                ...(selectedArray.length > 0 &&
                                                    selectedArray.includes(index) && {
                                                        background: '#1C60FF',
                                                        borderColor: 'rgba(0,0,0,0.5)',
                                                        borderWidth: 5,
                                                        borderStyle: 'solid',
                                                        // m: '0px 0px',
                                                    }),
                                            }}
                                        >
                                            <Typography fontWeight={500} sx={{ color: '#fff', whiteSpace: 'pre-wrap', fontSize: v.text.length > 5 ? '0.8rem' : '1rem' }}>
                                                {`${number}. `}
                                                {v.text}
                                            </Typography>
                                        </Box>
                                    </Fragment>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export default Step_OwnCar
