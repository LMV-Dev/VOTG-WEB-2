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

const CODE = 'Q-0017'
const TYPE = 1

const title = '월 통신비를 선택해주세요. (핸드폰비 포함)'
const item = [
    { text: '5만원 이하 ', count: 0 },
    { text: '10만원 이하 ', count: 10 },
    { text: '20만원 이하', count: 10 },
    { text: '20만원 초과', count: 10 },
]

const Step_TelecomPay = ({ onChangeStepEnable }) => {
    const router = useRouter()
    const { user } = useAuth()
    const [selectedNumber, setSelectedNumber] = useState(null)

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
                <Box sx={{ width: '100%', my: 1 }} />
                <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                    <Typography sx={{ my: 1, color: 'text.main', fontSize: '1rem', fontWeight: 700, textAlign: 'left' }}>{title}</Typography>
                </Box>
                <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />
                <Box sx={{ mx: 0, my: 3 }}>
                    <Typography sx={{ mb: 3, textAlign: 'center', fontSize: '1.3rem', fontWeight: 700 }}>선택 : {item[selectedNumber]?.text}</Typography>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            {item.map((v, index) => {
                                var number = index + 1
                                return (
                                    <Fragment key={`step-key-${index}`}>
                                        <Box
                                            onClick={() => onClickSelectedNumber(index)}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '320px',
                                                height: '50px',
                                                background: '#1C60FF',
                                                mb: 2,
                                                borderRadius: '5px',
                                                '&:hover': {
                                                    cursor: 'pointer',
                                                    opacity: 0.8,
                                                    transition: 'all 0.5s',
                                                },
                                                ...(selectedNumber === index && {
                                                    background: '#1C60FF',
                                                    borderColor: 'rgba(0,0,0,0.5)',
                                                    borderWidth: 5,
                                                    borderStyle: 'solid',
                                                    // m: '0px 0px',
                                                }),
                                            }}
                                        >
                                            <Typography fontWeight={500} sx={{ color: '#fff' }}>
                                                {`${number}. `}
                                                {v.text}
                                            </Typography>
                                        </Box>
                                    </Fragment>
                                )
                            })}
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export default Step_TelecomPay
