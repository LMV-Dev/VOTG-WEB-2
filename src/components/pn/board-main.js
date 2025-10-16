import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { formatInTimeZone } from 'date-fns-tz'

import * as Yup from 'yup'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'

import { Logo } from '@components/layout/logo'

import { useCookies } from 'react-cookie'
import { useMounted } from '@hooks/use-mounted'
import { useAuth } from '@hooks/use-auth'

/*MUI Element*/
import { Box, CircularProgress, Chip, Button, InputAdornment, Card, Link, Checkbox, FormHelperText, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

const PanelAnswerMax = 19

const Session_00 = 5
const Session_01 = 12
// const Session_02 = 6

const BoardMain = ({ answerAllData }) => {
    // console.log('answerAllData', answerAllData)
    const isMounted = useMounted()
    const router = useRouter()

    return (
        <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
            <Box sx={{ width: '100%', my: 2 }} />
            {/* <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <NextLink href="/" passHref>
                    <a>
                        <Logo
                            variant={'dark'}
                            sx={{
                                width: 210,
                                height: 56,
                            }}
                            customColor={'#1C60FF'}
                        />
                    </a>
                </NextLink>

                <Typography variant="h6">안녕하세요. 패널 가입을 환영합니다.</Typography>
                <Typography sx={{ fontSize: '0.9rem', textAlign: 'center', mt: 3 }}>차후 뷰즈온더고를 통해 진행되는 설문조사에 참여해주시면 많은 해택을 받으실 수 있습니다.</Typography>
            </Box>
            <Divider sx={{ width: '100%', height: '1px', mt: 2, mb: 1 }} /> */}

            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                <Typography variant="h6" textAlign="left">
                    포인트
                </Typography>
                <Box
                    sx={{
                        width: '100%',
                        height: '80px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'top',
                        alignItems: 'center',
                        my: 1,
                    }}
                >
                    <TextField
                        color="info"
                        variant="outlined"
                        size="small"
                        label=""
                        margin="normal"
                        name="survey-point"
                        type="text"
                        value={answerAllData?.length == PanelAnswerMax ? '3,000 포인트' : answerAllData?.length >= Session_01 ? '2,000 포인트' : answerAllData?.length >= Session_00 ? '1,000 포인트' : '0포인트'}
                        sx={{
                            textAlign: 'right',
                            minWidth: '200px',
                            width: '100%',
                            fontSize: '1rem',
                            [`& fieldset`]: {
                                borderRadius: '5px 0 0 5px',
                            },
                        }}
                        inputProps={{ readOnly: true, style: { fontSize: '1rem', textAlign: 'right' } }}
                    />
                    <Button color="info" variant="contained" component="a" href="/panel/point" size="small" sx={{ minHeight: '40px', mt: '8px', borderRadius: '0 5px 5px 0' }}>
                        교환
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ width: '100%', height: '1px', mt: 2, mb: 5 }} />
            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                <Typography variant="h6" textAlign="left">
                    참여한 설문
                </Typography>
                <Box sx={{ my: 2, border: '1px solid #eee', borderRadius: '10px', minHeight: '100px' }}>
                    <Grid container>
                        <Grid item xs={8}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, height: '100%', alignItems: 'flext-start', justifyContent: 'center' }}>
                                <Typography sx={{ fontWeight: 700, py: 1 }}>패널 가입 설문조사</Typography>
                                <Typography sx={{ py: 1 }}>{answerAllData.length > 0 && formatInTimeZone(answerAllData[answerAllData.length - 1]?.createdAt, 'Asia/Seoul', 'yyyy.MM.dd, hh:mm a')}</Typography>
                            </Box>
                        </Grid>
                        {/* <Grid item xs={2}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, height: '100%', alignItems: 'flext-start', justifyContent: 'bottom' }}>
                                <Button color="secondary" variant="text" size="small">
                                    리워드 확인
                                </Button>
                            </Box>
                        </Grid> */}
                        <Grid item xs={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, height: '100%', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Button component="a" href="/panel/step" color="secondary" variant="outlined" size="small" sx={{ mb: 1 }}>
                                    수정
                                </Button>

                                <Button color={answerAllData?.length == PanelAnswerMax ? 'success' : 'secondary'} variant="outlined" size="small" sx={{ mb: 1, pointerEvents: 'none' }}>
                                    {answerAllData?.length == PanelAnswerMax ? '완료' : answerAllData?.length >= Session_01 ? '2단계 완료' : answerAllData?.length >= Session_00 ? '1단계 완료' : '참여 전'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* {answerAllData?.length > 0 && (
                <>
                    <Box sx={{ mt: 3, mb: 0 }}>
                        <Typography variant="h6" textAlign="center">
                            답변 완료수
                        </Typography>
                        <Box sx={{ my: 1 }}>
                            <Typography sx={{ fontSize: '2rem', fontWeight: 500, color: 'info.main', textAlign: 'center' }}>
                                {answerAllData?.length} / {PanelAnswerMax}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ width: '100%', height: '1px', mt: 2, mb: 1 }} />

                    <Box sx={{ mt: 3, mb: 0 }}>
                        <Typography variant="h6" textAlign="center">
                            적립 포인트
                        </Typography>
                        <Box sx={{ my: 1 }}>
                            <Typography sx={{ fontSize: '2rem', fontWeight: 500, color: 'info.main', textAlign: 'center' }}>
                                {answerAllData?.length == PanelAnswerMax ? '3,000 포인트' : answerAllData?.length >= Session_01 ? '2,000 포인트' : answerAllData?.length >= Session_00 ? '1,000 포인트' : '0포인트'}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ width: '100%', height: '1px', mt: 2, mb: 1 }} />
                </>
            )}
            <Box sx={{ mt: 2 }}>
                <NextLink href="/panel/step">
                    <Button
                        disabled={PanelAnswerMax == answerAllData?.length}
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
                        {PanelAnswerMax == answerAllData?.length ? '설문을 완료하였습니다.' : answerAllData?.length > 0 ? `패널 설문 계속하기` : `패널 설문 시작하기`}
                    </Button>
                </NextLink>
            </Box> */}
        </Box>
    )
}

export default BoardMain
