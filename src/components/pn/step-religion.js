import { useState, useEffect } from 'react'

import axios from 'axios'
import API from '@utils/API'
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { UuidTool } from 'uuid-tool'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*MUI Icon*/

//Icon
import { RectSection } from '@public/panels/RectSection'

const CODE = 'Q-0002'
const TYPE = 2

const title = '종교를 선택해주세요.'
const item = ['기독교', '불교', '원불교', '이슬람교', '천주교', '무교', '그외']

const Step_Religion = ({ onChangeStepEnable }) => {
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
                <Box sx={{ mx: 0, my: 2 }}>
                    <Typography sx={{ mb: 3, textAlign: 'center', fontSize: '1.3rem', fontWeight: 700 }}>선택 : {item[selectedNumber]}</Typography>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Box sx={{ width: '300px', height: '360px' }}>
                                <RectSection width="300" height="300" data={item} selected={selectedNumber} event={onClickSelectedNumber} />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export default Step_Religion
