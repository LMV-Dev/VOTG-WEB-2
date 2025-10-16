import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

import * as Yup from 'yup'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'

import { Logo } from '@components/layout/logo'

import { useCookies } from 'react-cookie'
import { useMounted } from '@hooks/use-mounted'
import { useAuth } from '@hooks/use-auth'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, Link, Checkbox, FormHelperText, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

const PanelAnswerMax = 12

const Session_00 = 6
const Session_01 = 9
const Session_02 = 6

const BoardPoint = ({ answerAllData }) => {
    console.log('answerAllData', answerAllData.length)
    const isMounted = useMounted()
    const router = useRouter()

    return (
        <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
            <Box sx={{ width: '100%', my: 2 }} />
            <Box
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
            </Box>
            <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />

            {answerAllData?.length > 0 && (
                <>
                    <Box sx={{ mt: 3, mb: 0 }}>
                        <Typography variant="h6" textAlign="center">
                            답변 완료수
                        </Typography>
                        <Box sx={{ my: 1 }}>
                            <Typography sx={{ fontSize: '2rem', fontWeight: 500, color: 'info.main', textAlign: 'center' }}>{answerAllData?.length}</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />

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

                    <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />
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
            </Box>
        </Box>
    )
}

export default BoardPoint
