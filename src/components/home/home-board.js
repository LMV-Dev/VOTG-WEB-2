import { Fragment, useState, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useMediaQuery, Button, Box, Card, Container, Grid, Link, Typography, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import { wait } from '@utils/wait'
import { formatInTimeZone } from 'date-fns-tz'

import { IconServiceResearch } from '@public/votg/IconServiceResearch'
import { IconServiceStatistics } from '@public/votg/IconServiceStatistics'
import { IconServiceCrawling } from '@public/votg/IconServiceCrawling'
import { IconServiceBigdata } from '@public/votg/IconServiceBigdata'

const dataSample = [
    {
        code: '0',
        title: '서베이 조사',
        createdAt: '2022-10-16 05:56:46',
    },
    {
        code: '1',
        title: '서베이 조사',
        createdAt: '2022-10-16 05:56:46',
    },
    {
        code: '2',
        title: '서베이 조사',
        createdAt: '2022-10-16 05:56:46',
    },
    {
        code: '3',
        title: '서베이 조사',
        createdAt: '2022-10-16 05:56:46',
    },
]

export const HomeBoard = (props) => {
    const router = useRouter()
    const theme = useTheme()
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'))

    const [noticeData, setNoticeData] = useState([])
    const [learnData, setLearnData] = useState([])

    useEffect(() => {
        if (!router.isReady) {
            return
        }
        let isMounted = true
        // declare the async data fetching function
        // let currentCreateSureveyData = JSON.parse(globalThis.sessionStorage.getItem('current-create-survey'))

        const fetchData = async () => {
            // const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')
            await axios
                // .get(`http://localhost:3400/json/sample/00`, null)
                .get(`https://api.koaiarchitecture.com/board/notice/list`, null)
                .then(async (res) => {
                    // console.log(res.data)
                    if (res.data) {
                        if (isMounted) {
                            // console.log('res.data', res.data.payload)
                            setNoticeData(res.data.payload)
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
    }, [router])

    useEffect(() => {
        if (!router.isReady) {
            return
        }
        let isMounted = true
        // declare the async data fetching function
        // let currentCreateSureveyData = JSON.parse(globalThis.sessionStorage.getItem('current-create-survey'))

        const fetchData = async () => {
            // const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')
            await axios
                // .get(`http://localhost:3400/json/sample/00`, null)
                .get(`https://api.koaiarchitecture.com/board/learn/list`, null)
                .then(async (res) => {
                    // console.log(res.data)
                    if (res.data) {
                        if (isMounted) {
                            // console.log('res.data', res.data.payload)
                            setLearnData(res.data.payload)
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
    }, [router])

    return (
        <Box
            sx={{
                backgroundColor: '#fff',
                py: 10,
                mt: -2,
            }}
            {...props}
        >
            <Container maxWidth="lg">
                {/* <Box
                    sx={{
                        pt: 10,
                        pb: 3,
                        px: { sm: 15, xs: 2 },
                    }}
                >
                    <Typography align="center" sx={{ pb: 3, color: '#fff' }} variant={mobileDevice ? 'h4' : 'h3'}>
                        서비스 리스트
                    </Typography>
                </Box> */}

                <Grid container spacing={4}>
                    <Grid item md={6} sm={6} xs={12} key={`grid-write-00`}>
                        <Box
                            sx={{
                                margin: '0 auto',
                                maxWidth: '460px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                pb: 2,
                            }}
                        >
                            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography sx={{ mt: 1, color: '#000', fontSize: { sm: '1.3rem', xs: '1.1rem' }, fontWeight: 700 }} textAlign="center">
                                    공지사항
                                </Typography>
                                <Box sx={{ flexGrow: 1 }} />
                                <Button
                                    component="a"
                                    href="/board/notice"
                                    size="small"
                                    sx={{
                                        display: { md: 'flex', xs: 'none' },
                                        width: '80px',
                                        height: '25px',
                                        borderRadius: '20px 0px 20px 0px',
                                        mx: 0,
                                        my: 3,
                                        fontSize: '0.8rem',
                                        background: 'primary.dark',
                                    }}
                                    type="button"
                                    variant="contained"
                                >
                                    더보기
                                </Button>
                            </Box>
                            <Box sx={{ width: '100%', height: '0.5px', background: '#FF5353', mb: 2 }} />
                            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', height: '200px' }}>
                                {noticeData !== null &&
                                    noticeData.map((v, index) => {
                                        if (index > 4) {
                                            return
                                        } else {
                                            return (
                                                <NextLink href={`/board/view/?type=${1}&code=${v.code}`} key={`notice-${index}`}>
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            my: 1,
                                                            display: 'flex',
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            cursor: 'pointer',
                                                            ':hover': {
                                                                opacity: 0.8,
                                                            },
                                                        }}
                                                    >
                                                        <Typography sx={{ fontSize: '1rem' }}>{v.title?.length < 33 ? v.title : `${v.title?.substring(0, 33)} ···`}</Typography>
                                                        <Box sx={{ flexGrow: 1 }} />
                                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 400, mb: 0 }}>{formatInTimeZone(v.createdAt, 'Asia/Seoul', 'yyyy.MM.dd')}</Typography>
                                                    </Box>
                                                </NextLink>
                                            )
                                        }
                                    })}
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12} key={`grid-write-01`}>
                        <Box
                            sx={{
                                margin: '0 auto',
                                maxWidth: '460px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                pb: 2,
                            }}
                        >
                            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography sx={{ mt: 1, color: '#000', fontSize: { sm: '1.3rem', xs: '1.1rem' }, fontWeight: 700 }} textAlign="center">
                                    Learning is Action
                                </Typography>
                                <Box sx={{ flexGrow: 1 }} />
                                <Button
                                    component="a"
                                    href="/board/learn"
                                    size="small"
                                    sx={{
                                        display: { md: 'flex', xs: 'none' },
                                        width: '80px',
                                        height: '25px',
                                        borderRadius: '20px 0px 20px 0px',
                                        mx: 0,
                                        my: 3,
                                        fontSize: '0.8rem',
                                        background: 'primary.dark',
                                    }}
                                    type="button"
                                    variant="contained"
                                >
                                    더보기
                                </Button>
                            </Box>
                            <Box sx={{ width: '100%', height: '0.5px', background: '#FF5353', mb: 2 }} />
                            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                                {learnData !== null &&
                                    learnData.map((v, index) => {
                                        if (index > 4) {
                                            return
                                        } else {
                                            return (
                                                <NextLink href={`/board/view/?type=${2}&code=${v.code}`} key={`learn-${index}`}>
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            my: 1,
                                                            display: 'flex',
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            cursor: 'pointer',
                                                            ':hover': {
                                                                opacity: 0.8,
                                                            },
                                                        }}
                                                    >
                                                        <Typography sx={{ fontSize: '1rem' }}>{v.title?.length < 33 ? v.title : `${v.title?.substring(0, 33)} ···`}</Typography>
                                                        <Box sx={{ flexGrow: 1 }} />
                                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 400, mb: 0 }}>{formatInTimeZone(v.createdAt, 'Asia/Seoul', 'yyyy.MM.dd')}</Typography>
                                                    </Box>
                                                </NextLink>
                                            )
                                        }
                                    })}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                <Box
                    sx={{
                        py: 2,
                    }}
                />
            </Container>
        </Box>
    )
}
