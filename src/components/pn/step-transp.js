import { useState, useEffect } from 'react'

import axios from 'axios'
import API from '@utils/API'
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { UuidTool } from 'uuid-tool'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*MUI Icon*/
import PetsIcon from '@mui/icons-material/Pets'
import CloseIcon from '@mui/icons-material/Close'

const CODE = 'Q-0013'
const TYPE = 0

const title = '자주 사용하는 교통 수단을 선택해주세요.'
const item = [
    { text: '버스', count: 0 },
    { text: '지하철', count: 0 },
    { text: '자차', count: 0 },
    { text: ' 기차', count: 0 },
    { text: ' 항공', count: 0 },
    { text: '선박', count: 0 },
    { text: '자전거', count: 0 },
    { text: '킥보드', count: 0 },
    { text: '그외', count: 0 },
]
/* Icon */
import { IconTp00Bus } from '@public/panels/step_tp_00_bus'
import { IconTp01Subway } from '@public/panels/step_tp_01_subway'
import { IconTp02Mycar } from '@public/panels/step_tp_02_mycar'
import { IconTp03Train } from '@public/panels/step_tp_03_train'
import { IconTp04Airplan } from '@public/panels/step_tp_04_airplan'
import { IconTp05Ship } from '@public/panels/step_tp_05_ship'
import { IconTp06Bike } from '@public/panels/step_tp_06_bike'
import { IconTp07Kickboard } from '@public/panels/step_tp_07_kickboard'

const Step_Transp = ({ onChangeStepEnable }) => {
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

    //onChangeStepEnable
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
                <Box sx={{ width: '100%', my: 2 }} />
                <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                    <Typography sx={{ my: 3, color: 'text.main', fontSize: '1rem', fontWeight: 700, textAlign: 'left' }}>{title}</Typography>
                </Box>
                <Divider sx={{ width: '100%', height: '1px', mt: 1, mb: 1 }} />
                <Box sx={{ mx: 0, mb: 5 }}>
                    <Typography sx={{ mb: 3, textAlign: 'center', fontSize: '1.1rem', fontWeight: 700 }}>선택 : {item[selectedNumber]?.text}</Typography>
                    <Grid container spacing={1} sx={{ width: '100%' }}>
                        {/* 1 Row */}
                        <Grid item xs={4}>
                            <Box
                                onClick={() => onClickSelectedNumber(0)}
                                sx={{
                                    width: '100px',
                                    height: '100px',
                                    pt: 2,
                                    background: '#1C60FF',
                                    borderRadius: '20px',
                                    '&:hover': {
                                        background: '#1C60FF',
                                        cursor: 'pointer',
                                        // opacity: 0.8,
                                        transition: 'all 0.5s',
                                    },
                                    ...(selectedNumber === 0 && {
                                        background: '#1C60FF',
                                        borderColor: 'rgba(0,0,0,0.5)',
                                        borderWidth: 5,
                                        borderStyle: 'solid',
                                        m: '0px 0px',
                                    }),
                                    margin: '0 auto',
                                }}
                            >
                                <Typography sx={{ color: 'text.white', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}>{item[0].text}</Typography>
                                <IconTp00Bus sx={{ width: '100%', height: '50%', fontSize: 40, color: '#fff', textAlign: 'center' }} customColor={'#fff'} />
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box
                                onClick={() => onClickSelectedNumber(1)}
                                sx={{
                                    width: '100px',
                                    height: '100px',
                                    pt: 2,
                                    background: '#1C60FF',
                                    borderRadius: '20px',
                                    '&:hover': {
                                        background: '#1C60FF',
                                        cursor: 'pointer',
                                        // opacity: 0.8,
                                        transition: 'all 0.5s',
                                    },
                                    ...(selectedNumber === 1 && {
                                        background: '#1C60FF',
                                        borderColor: 'rgba(0,0,0,0.5)',
                                        borderWidth: 5,
                                        borderStyle: 'solid',
                                        m: '0px 0px',
                                    }),
                                    margin: '0 auto',
                                }}
                            >
                                <Typography sx={{ color: 'text.white', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}>{item[1].text}</Typography>
                                <IconTp01Subway sx={{ width: '100%', height: '50%', fontSize: 40, color: '#fff', textAlign: 'center' }} customColor={'#fff'} />
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box
                                onClick={() => onClickSelectedNumber(2)}
                                sx={{
                                    width: '100px',
                                    height: '100px',
                                    pt: 2,
                                    background: '#1C60FF',
                                    borderRadius: '20px',
                                    '&:hover': {
                                        background: '#1C60FF',
                                        cursor: 'pointer',
                                        // opacity: 0.8,
                                        transition: 'all 0.5s',
                                    },
                                    ...(selectedNumber === 2 && {
                                        background: '#1C60FF',
                                        borderColor: 'rgba(0,0,0,0.5)',
                                        borderWidth: 5,
                                        borderStyle: 'solid',
                                        m: '0px 0px',
                                    }),
                                    margin: '0 auto',
                                }}
                            >
                                <Typography sx={{ color: 'text.white', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}>{item[2].text}</Typography>
                                <IconTp02Mycar sx={{ width: '100%', height: '50%', fontSize: 40, color: '#fff', textAlign: 'center' }} customColor={'#fff'} />
                            </Box>
                        </Grid>
                        {/* 2 Row */}
                        <Grid item xs={4}>
                            <Box
                                onClick={() => onClickSelectedNumber(3)}
                                sx={{
                                    width: '100px',
                                    height: '100px',
                                    pt: 2,
                                    background: '#1C60FF',
                                    borderRadius: '20px',
                                    '&:hover': {
                                        background: '#1C60FF',
                                        cursor: 'pointer',
                                        // opacity: 0.8,
                                        transition: 'all 0.5s',
                                    },
                                    ...(selectedNumber === 3 && {
                                        background: '#1C60FF',
                                        borderColor: 'rgba(0,0,0,0.5)',
                                        borderWidth: 5,
                                        borderStyle: 'solid',
                                        m: '0px 0px',
                                    }),
                                    margin: '0 auto',
                                }}
                            >
                                <Typography sx={{ color: 'text.white', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}>{item[3].text}</Typography>
                                <IconTp03Train sx={{ width: '100%', height: '50%', fontSize: 40, color: '#fff', textAlign: 'center' }} customColor={'#fff'} />
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box
                                onClick={() => onClickSelectedNumber(4)}
                                sx={{
                                    width: '100px',
                                    height: '100px',
                                    pt: 2,
                                    background: '#1C60FF',
                                    borderRadius: '20px',
                                    '&:hover': {
                                        background: '#1C60FF',
                                        cursor: 'pointer',
                                        // opacity: 0.8,
                                        transition: 'all 0.5s',
                                    },
                                    ...(selectedNumber === 4 && {
                                        background: '#1C60FF',
                                        borderColor: 'rgba(0,0,0,0.5)',
                                        borderWidth: 5,
                                        borderStyle: 'solid',
                                        m: '0px 0px',
                                    }),
                                    margin: '0 auto',
                                }}
                            >
                                <Typography sx={{ color: 'text.white', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}>{item[4].text}</Typography>
                                <IconTp04Airplan sx={{ width: '100%', height: '50%', fontSize: 40, color: '#fff', textAlign: 'center' }} customColor={'#fff'} />
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box
                                onClick={() => onClickSelectedNumber(5)}
                                sx={{
                                    width: '100px',
                                    height: '100px',
                                    pt: 2,
                                    background: '#1C60FF',
                                    borderRadius: '20px',
                                    '&:hover': {
                                        background: '#1C60FF',
                                        cursor: 'pointer',
                                        // opacity: 0.8,
                                        transition: 'all 0.5s',
                                    },
                                    ...(selectedNumber === 5 && {
                                        background: '#1C60FF',
                                        borderColor: 'rgba(0,0,0,0.5)',
                                        borderWidth: 5,
                                        borderStyle: 'solid',
                                        m: '0px 0px',
                                    }),
                                    margin: '0 auto',
                                }}
                            >
                                <Typography sx={{ color: 'text.white', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}>{item[5].text}</Typography>
                                <IconTp05Ship sx={{ width: '100%', height: '50%', fontSize: 40, color: '#fff', textAlign: 'center' }} customColor={'#fff'} />
                            </Box>
                        </Grid>

                        {/* 3 Row */}
                        <Grid item xs={4}>
                            <Box
                                onClick={() => onClickSelectedNumber(6)}
                                sx={{
                                    width: '100px',
                                    height: '100px',
                                    pt: 2,
                                    background: '#1C60FF',
                                    borderRadius: '20px',
                                    '&:hover': {
                                        background: '#1C60FF',
                                        cursor: 'pointer',
                                        // opacity: 0.8,
                                        transition: 'all 0.5s',
                                    },
                                    ...(selectedNumber === 6 && {
                                        background: '#1C60FF',
                                        borderColor: 'rgba(0,0,0,0.5)',
                                        borderWidth: 5,
                                        borderStyle: 'solid',
                                        m: '0px 0px',
                                    }),
                                    margin: '0 auto',
                                }}
                            >
                                <Typography sx={{ color: 'text.white', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}>{item[6].text}</Typography>
                                <IconTp06Bike sx={{ width: '100%', height: '50%', fontSize: 40, color: '#fff', textAlign: 'center' }} customColor={'#fff'} />
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box
                                onClick={() => onClickSelectedNumber(7)}
                                sx={{
                                    width: '100px',
                                    height: '100px',
                                    pt: 2,
                                    background: '#1C60FF',
                                    borderRadius: '20px',
                                    '&:hover': {
                                        background: '#1C60FF',
                                        cursor: 'pointer',
                                        // opacity: 0.8,
                                        transition: 'all 0.5s',
                                    },
                                    ...(selectedNumber === 7 && {
                                        background: '#1C60FF',
                                        borderColor: 'rgba(0,0,0,0.5)',
                                        borderWidth: 5,
                                        borderStyle: 'solid',
                                        m: '0px 0px',
                                    }),
                                    margin: '0 auto',
                                }}
                            >
                                <Typography sx={{ color: 'text.white', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}>{item[7].text}</Typography>
                                <IconTp07Kickboard sx={{ width: '100%', height: '50%', fontSize: 40, color: '#fff', textAlign: 'center' }} customColor={'#fff'} />
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box
                                onClick={() => onClickSelectedNumber(8)}
                                sx={{
                                    width: '100px',
                                    height: '100px',
                                    pt: 4.5,
                                    background: '#1C60FF',
                                    borderRadius: '20px',
                                    '&:hover': {
                                        background: '#1C60FF',
                                        cursor: 'pointer',
                                        // opacity: 0.8,
                                        transition: 'all 0.5s',
                                    },
                                    ...(selectedNumber === 8 && {
                                        background: '#1C60FF',
                                        borderColor: 'rgba(0,0,0,0.5)',
                                        borderWidth: 5,
                                        borderStyle: 'solid',
                                        m: '0px 0px',
                                    }),
                                    margin: '0 auto',
                                }}
                            >
                                <Typography sx={{ color: 'text.white', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}>{item[8].text}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export default Step_Transp
