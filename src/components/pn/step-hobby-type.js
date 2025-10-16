import { useState, useEffect } from 'react'

import axios from 'axios'
import API from '@utils/API'
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { UuidTool } from 'uuid-tool'
import { toast } from 'react-toastify'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*MUI Icon*/
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'

const CODE = 'Q-0011'
const TYPE = 3

const title = '취미를 입력해주세요.'
const item = [
    { text: '남성', count: 0 },
    { text: '여성', count: 10 },
]

const Step_HobbyType = ({ onChangeStepEnable }) => {
    const router = useRouter()
    const { user } = useAuth()
    const [answerText, setAnswerText] = useState('')

    const onChangeAnswerText = (e) => {
        // console.log('e', e.target.value)
        setAnswerText(e.target.value)
    }

    const [saveState, setSaveState] = useState(false)
    const onClickSaveAnswer = async () => {
        const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')
        const answerConvert = [{ type: TYPE }, { ans: answerText }]
        const res = await API.post('panel/answer/save', {
            PanelCode: uuidString,
            QuestionCode: CODE,
            answerJson: JSON.stringify(answerConvert),
        })

        toast.success('취미 입력 완료')
        setSaveState(true)
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
            setAnswerText(renewAnswer[1].ans)
        }
    }, [answerData])

    //onChangeStepEnable
    useEffect(() => {
        if (saveState) {
            onChangeStepEnable(true)
        } else {
            onChangeStepEnable(false)
        }
    }, [saveState])

    return (
        <>
            <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                <Box sx={{ width: '100%', my: 2 }} />
                <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                    <Typography sx={{ my: 3, color: 'text.main', fontSize: '1rem', fontWeight: 700, textAlign: 'center' }}>{title}</Typography>
                </Box>
                <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />
                <Box sx={{ mx: 0, my: 5 }}>
                    {/* <Typography sx={{ mb: 3, textAlign: 'center', fontSize: '1.3rem', fontWeight: 700 }}>선택 :{item[selectedNumber]?.text}</Typography> */}
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box sx={{ width: '320px', height: '100px', background: '#1C60FF', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '5px' }}>
                                <TextField value={answerText} onChange={onChangeAnswerText} variant="outlined" color="info" sx={{ width: '280px', color: '#fff', background: '#fff', borderRadius: '10px' }} />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    onClick={onClickSaveAnswer}
                                    fullWidth
                                    size="large"
                                    variant="outlined"
                                    sx={{
                                        ':hover': {
                                            color: 'info.main',
                                            boxShadow: '0 0 0 2px inset',
                                            opacity: 0.8,
                                        },
                                    }}
                                    color="info"
                                >
                                    저장하기
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export default Step_HobbyType
