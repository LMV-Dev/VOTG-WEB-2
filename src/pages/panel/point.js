import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import Head from 'next/head'
import axios from 'axios'
import { UuidTool } from 'uuid-tool'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*Mui Icon */
import HomeIcon from '@mui/icons-material/Home'

/*Custom Icon*/
import { LogoSymbol } from '@public/votg/logoSymbol'
import { LogoLabel } from '@public/votg/logoLabel'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { PanelGuard } from '@components/auth/panel-guard'
import { createResourceCode } from '@utils/create-resource-id'

//ELEMENT
const PAGE_TITLE = '뷰즈온더고 패널'

/*Improt Layouts*/
import LayoutPanelBoard from '@layouts/pn/layout-panel-board'

/*Import Components*/
//Layout

//STEP
import BoardPoint from '@components/pn/board-point'

const PanelSurveyList = () => {
    const router = useRouter()
    const auth = useAuth()
    const { user } = useAuth()
    // console.log('auth :: ', auth)

    const [answerAllData, setAnswerAllData] = useState(null)

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
                .post(`https://api.koaiarchitecture.com/panel/answer/all`, {
                    PanelCode: uuidString,
                })
                .then(async (res) => {
                    // console.log(res.data)
                    if (res.data) {
                        if (isMounted) {
                            // console.log('res.data', res.data.payload)
                            setAnswerAllData(res.data.payload)
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
        if (answerAllData !== null) {
            answerAllData?.map((q, qIndex) => {
                // console.log('Code : ', q.QuestionCode)
                const renewAnswer = JSON.parse(q.answer)
                // console.log('Answer All : ', renewAnswer)
                // console.log('Answer type  : ', renewAnswer[0].type)
                // console.log('Answer answer  : ', renewAnswer[1].ans)
            })
        }
    }, [answerAllData])

    if (answerAllData === null) {
        return (
            <>
                <CircularProgress
                    size={24}
                    sx={{
                        color: 'primary.main',
                        position: 'relative',
                        top: '70%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />
            </>
        )
    }
    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 뷰즈온더고 :: Views On the Go</title>
            </Head>

            <Container
                component="main"
                maxWidth="sm"
                sx={{
                    flexGrow: 1,
                    mt: '60px',
                    pt: 2,
                    pb: 2,
                    px: 4,
                    background: '#fff',
                    height: 'calc(100vh - 50px)',
                }}
            >
                <BoardPoint answerAllData={answerAllData} />
            </Container>
        </>
    )
}

PanelSurveyList.getLayout = (page) => (
    <PanelGuard>
        <LayoutPanelBoard>{page}</LayoutPanelBoard>
    </PanelGuard>
)

export default PanelSurveyList
