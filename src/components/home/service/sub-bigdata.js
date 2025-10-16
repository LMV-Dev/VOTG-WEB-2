import React from 'react'

/* MUI */
import { Box, Button, Container, Typography, Paper, Grid } from '@mui/material'

/* Compoent */
import { Scrollbar } from '@components/layout/scrollbar'
import LinkRequest from '@components/home/service/link-request'

const SubBigdata = (props) => {
    const { title, contents } = props
    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                pt: 6,
            }}
        >
            <Container
                maxWidth="xl"
                sx={{
                    alignItems: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    border: 'none',
                    minHeight: 'calc(100vh - 150px)',
                    mb: 10,
                }}
            >
                <LinkRequest />
                <Paper>
                    <Scrollbar>
                        <Box
                            sx={{
                                // minWidth: 800,
                                p: 6,
                                mb: 10,
                            }}
                        >
                            <Grid container justifyContent="center">
                                <Grid item md={4} xs={12} alignItems="center">
                                    <Typography
                                        color="text.main"
                                        align="left"
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            fontFamily: 'Poppins',
                                            paddingInline: {
                                                md: 5,
                                                xs: 'none',
                                            },
                                        }}
                                    >
                                        {title}
                                    </Typography>
                                </Grid>
                                <Grid item md={8} xs={12} alignItems="center" sx={{ mt: { md: 2, xs: 3 } }}>
                                    {/* <Logo /> */}
                                    <Typography style={{ textAlign: 'left', fontSize: '1.3rem', fontWeight: 700 }}>{contents}</Typography>
                                    <Box sx={{ mt: 3 }}>
                                        <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#222', lineHeight: 2 }}>
                                            인터넷이 발명되고 수많은 웹페이지를 통해 다양한 텍스트와 이미지들이 정보가 된 시대에 우리는 살고 있습니다. <br /> 이 정보들이 이제는 중요한 데이터로 역할을 하기 시작했습니다. <br />
                                            이것을 우리는 ‘빅데이터’라고 부릅니다. <br />
                                        </Typography>
                                        <Box
                                            sx={{
                                                height: '250px',
                                                backgroundImage: `url(/background/survey_bigdata.jpeg)`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center',
                                                backgroundSize: '100% auto',
                                                backgroundColor: '#fff',
                                                pt: 0,
                                                my: 5,
                                            }}
                                        />

                                        <Typography sx={{ fontSize: '1rem', fontWeight: 400, color: '#777', lineHeight: 2 }}>
                                            이러한 빅데이터는 적절한 분석의 과정을 거쳐야 비로소 현실에 적용가능한 형태의 2차 정보로 형식을 갖추고 우리의 활동에 도움을 줄 수 있으며 이것을 ‘빅데이터 분석’이라고 합니다. <br />
                                            <br /> <br /> 여기에도 역시 분석 기법들이 적용되어야 하는데요, 빅데이터 분석은 통계분석의 두 가지 줄기, 즉 빈도주의(Frequentist probability)와 베이지안 추론(Bayesian inference) 중 베이지안 추론 기법을
                                            적용해서 수행됩니다. <br /> 빈도주의와 베이지안 추론 모두 확률(probability)에 기반하지만, 빈도주의가 보다 객관적 기준의 확률을 가정한다면, 베이지안 추론은 주관적 기준의 확률을 가정하는 방식이라는 점이
                                            다릅니다. <br /> 베이지안 추론은 최근 이슈가 되기 시작한 빅데이터 분석에 적합한 분석방식으로서 분석자가 주관적으로 설정한 확률(사전확률)로 추론을 수행한 결과가 주관적 설정 확률과 크게 차이가 날 경우 다시
                                            수정확률(사후확률)로 추론을 수행하여 반복 추론을 실행하는 방식의 분석입니다. <br /> 이것을 조건부 확률이라고 합니다. <br /> 따라서 베이지안 추론은 인공지능 학습(machine learning, deep learning)에 유용하게
                                            활용될 수 있는 분석방식이라고 할 수 있습니다. <br /> <br /> <br /> 베이지안 추론에 근거한 빅데이터 분석은 인공지능(AI: Artificial Intelligence) 연구의 발전과 함께 진화하고 있습니다. <br /> 인공지능(AI)의
                                            목표는 컴퓨터가 사람처럼 생각할 수 있도록 학습시켜서 인간이 하는 활동을 더 잘 할 수 있도록 돕는 것입니다. <br /> 이 목표를 달성하기 위해서 ‘학습’은 매우 중요한 요소입니다. <br /> 즉 컴퓨터의 학습능력을
                                            발달시키는 것이 인공지능의 목표라고 할 수 있고 이를 가능하게 하는 것이 빅데이터 분석의 기본인 머신러닝(machine learning)입니다. <br />
                                            머신러닝은 인공지능에 포함되는 개념이면서 동등한 개념으로 이해되기도 하는데 이것은 머신러닝 즉 빅데이터 분석이 그만큼 인공지능 발전에 중요한 부분이라는 의미일 것입니다. <br /> 뷰즈온더고는 크롤링으로 수집한
                                            <br />
                                            <br />
                                            빅데이터를 기반으로 빅데이터 분석을 수행하여 얻은 결과에서 새로운 인사이트를 발견하고 이를 기업, 정부, 연구기관에 제공합니다. <br /> 여러분의 모든 활동 영역에 빠르고 정확한 의사결정 정보를 제공하기 위하여
                                            끊임없이 데이터를 파악하고 분석하여 결과를 제시합니다. <br />
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Scrollbar>
                </Paper>
                <LinkRequest />
            </Container>
        </Box>
    )
}

export default SubBigdata
