import React, { useState, useEffect, useRef } from 'react'
import NextLink from 'next/link'
import { useMediaQuery, Button, Badge, Box, Card, Container, Grid, Link, Typography, Divider, Switch } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { PricingPlan, PriceingFree } from '@components/payment/home-pricing-plan'
import { useAuth } from '@hooks/use-auth'

export const HomePrice = () => {
    const theme = useTheme()
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'))
    const auth = useAuth()

    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                    height: {
                        md: '990px',
                        xs: 'auto',
                    },
                    backgroundColor: 'background.black',
                }}
            >
                {/* <img
                alt=""
                src="/icons/image_price.png"
                style={{ position: 'absolute', width: '100%', height: 'auto' }}
            /> */}
                <Box
                    sx={{
                        backgroundColor: 'black',
                        // backgroundImage: "url('/background/home_price.png')",
                        backgroundSize: {
                            md: '100% auto',
                            xs: 'auto 100%',
                        },
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed',
                        backgroundPosition: 'center top',
                        flexGrow: 1,
                        pb: 6,
                        zIndex: 10,
                    }}
                >
                    <Container maxWidth="lg" sx={{ py: 10, position: 'relative', zIndex: 2 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        pt: 3,
                                        pb: 3,
                                        px: { sm: 15, xs: 2 },
                                    }}
                                >
                                    <Typography align="center" sx={{ pb: 2, color: '#fff' }} variant={mobileDevice ? 'h2' : 'h3'}>
                                        서비스 요금
                                    </Typography>
                                </Box>
                            </Grid>
                            {/* 체험하기 요금제 */}
                            {/* <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                                <PriceingFree />
                            </Grid> */}
                            {/* 플랜 요금제 */}
                            <Grid item md={4} xs={12}>
                                <PricingPlan
                                    select={0}
                                    name="Starter"
                                    textColor="#000"
                                    focusColor="#7E97FF"
                                    bgColor="#fff"
                                    price="49,000"
                                    saleprice="11,000"
                                    unit="월"
                                    features={['기능 제한 없음', '6개월간 표본 300건 발송', '총 변환  20 페이지']}
                                    highlight={['', '(카카오톡, 문자 메시지 설문 배포 가능)', '(당사제공 양식기준, 연간 문항수 400개 동일)']}
                                    highlightColor={['#fff', '#FF8A00', '#FF8A00']}
                                    description=""
                                    cta={!(auth.isAuthenticated && auth.survey) ? '회원가입' : '결제하기'}
                                    sx={{
                                        height: '100%',
                                        maxWidth: 460,
                                        mx: 'auto',
                                    }}
                                />
                            </Grid>
                            <Grid item md={4} xs={12}>
                                <PricingPlan
                                    select={1}
                                    name="Standard"
                                    textColor="#000"
                                    focusColor="#4994FF"
                                    bgColor="#fff"
                                    price="79,000"
                                    saleprice="59,000"
                                    unit="월"
                                    features={['기능 제한 없음', '연간 표본 3,000건 발송', '총 변환 100 페이지']}
                                    highlight={['', '(카카오톡, 문자 메시지 설문 배포 가능)', '(당사제공 양식기준, 연간 문항수 2,000개 동일)']}
                                    highlightColor={['#fff', '#FF8A00', '#FF8A00']}
                                    description=""
                                    cta={!(auth.isAuthenticated && auth.survey) ? '회원가입' : '결제하기'}
                                    sx={{
                                        height: '100%',
                                        maxWidth: 460,
                                        mx: 'auto',
                                    }}
                                />
                            </Grid>
                            <Grid item md={4} xs={12}>
                                <PricingPlan
                                    select={2}
                                    name="Professional"
                                    textColor="#000"
                                    focusColor="#2AC5DE"
                                    bgColor="#fff"
                                    price="159,000"
                                    saleprice="99,000"
                                    unit="월"
                                    features={['기능 제한 없음', '연간 표본 6,000건 발송', '총 변환  200 페이지', '설문 설계, 문항 선정', '리포트 1회 50% 할인']}
                                    highlight={['', '(카카오톡, 문자 메시지 설문 배포 가능)', '(당사제공 양식기준, 연간 문항수 4,000개 동일)', '', '(별도 문의)']}
                                    highlightColor={['#fff', '#FF8A00', '#FF8A00', '#fff', '#FF8A00']}
                                    event={['', '', '', '', '*론칭기념 이벤트']}
                                    eventColor={['#fff', '#fff', '#fff', '#fff', '#FF8264']}
                                    cta={!(auth.isAuthenticated && auth.survey) ? '회원가입' : '결제하기'}
                                    sx={{
                                        height: '100%',
                                        maxWidth: 460,
                                        mx: 'auto',
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </>
    )
}
