import React from 'react'

/* MUI */
import { Box, Button, Container, Typography, Paper, Grid, Divider } from '@mui/material'

/* Compoent */
import { Scrollbar } from '@components/layout/scrollbar'
import LinkRequest from '@components/home/service/link-request'

const SubtResearch = (props) => {
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
                                    <Typography style={{ textAlign: 'left', fontSize: { sm: '1.3rem', xs: '1rem' }, fontWeight: 700 }}>{contents}</Typography>
                                    <Box sx={{ mt: 3 }}>
                                        <Typography
                                            sx={{
                                                fontSize: { sm: '1rem', xs: '0.8rem' },
                                                fontWeight: 500,
                                                color: '#222',
                                                lineHeight: 2,
                                            }}
                                        >
                                            서베이(Survey)는 알아보고자 하는 현상에 대하여 불특정 또는 특정 다수의 사람들에게 질문을 던져 그 응답을 수집하는 절차와 행위를 뜻합니다. <br />
                                            보통 여론조사 등을 리서치(Research)라고 부릅니다. <br />
                                        </Typography>
                                        <Box
                                            sx={{
                                                height: '250px',
                                                backgroundImage: `url(/background/survey_research.jpeg)`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center',
                                                backgroundSize: '100% auto',
                                                backgroundColor: '#fff',
                                                pt: 0,
                                                my: 5,
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontSize: { sm: '1rem', xs: '0.8rem' },
                                                fontWeight: 400,
                                                color: '#777',
                                                lineHeight: 2,
                                            }}
                                        >
                                            그러나 엄밀한 의미를 살펴보면 Research는 연구문제를 해결하거나 가설을 검증하기 위해 실험, 자료조사 또는 서베이를 수행한다는 더 넓은 의미를 포함하고 있습니다. <br />
                                            서베이는 여러 가지 조사 방법 중 하나의 형태이며, 서베이를 통해 인구집단의 변화하는 의견이나 생각의 동향을 빠르게 파악할 수 있습니다. <br />
                                            즉 서베이를 통해 획득한 응답 데이터는 리서치의 기본 자료가 될 수 있습니다. <br />
                                            서베이가 데이터의 형태인 자료를 형성하는 절차라는 점에서 ‘자료’의 유형을 알아볼 필요가 있습니다. <br />
                                            자료는 그 원천에 따라 1차 자료와 2차 자료로 나눕니다. <br />
                                            2차 자료는 현재 시점에서 조사된 자료이기보다는 이미 형성되어 오픈되었거나 내부적으로 활용되는 자료를 말합니다. <br />
                                            예를 들어, 국가기관에서 통계조사하여 공개하는 오픈데이터들은 2차 자료로 볼 수 있으며 기업이나 정부, 연구기관 등이 개별적으로 정리하여 축적한 텍스트와 수치 모두를 포괄하는 자료 또한 2차 자료라고 할 수
                                            있습니다. <br />
                                            반면에, 1차 자료는 현재 시점에서 분석이나 의사결정을 위해 직접적, 즉각적으로 수집한 자료입니다. <br />
                                            1차 자료에는 서베이 응답, 실험 결과, 시뮬레이션, 사례 연구결과 등이 포함됩니다. <br />
                                            서베이의 형식은 과거부터 현재까지 구축되어 온 방법들이 사용되고 있습니다. <br />
                                            설문, 면접, 관찰 등의 방법이 주요 서베이 방식이며 설문조사의 경우 다음과 같은 흐름을 보이고 있습니다. <br />
                                        </Typography>
                                        <Divider sx={{ my: 5 }} />
                                        <Typography
                                            sx={{
                                                fontSize: { sm: '1.3rem', xs: '1rem' },
                                                fontWeight: 700,
                                                lineHeight: 2,
                                                mb: 3,
                                            }}
                                        >
                                            ◦ 서베이 산업에서의 신기술 도입률 저조
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: { sm: '1rem', xs: '0.8rem' },
                                                fontWeight: 400,
                                                color: '#000',
                                                lineHeight: 2,
                                            }}
                                        >
                                            - 설문지 기반의 정량 설문, 직접조사/심층면접 등
                                            <span style={{ fontWeight: 500, textDecoration: 'underline', textUnderlinePosition: 'under' }}>전통적인 방법이 주요 설문 방식으로 채용되고 있어 기술적 변화가 더딘 상황</span> <br />- 모바일 환경 등 대중의
                                            생활 패턴이 변화된 것에 비해 설문 조사의 방식은 기술 변화의 흐름을 따라가지 못하고 구시대적 방식으로 수행하고 있음
                                        </Typography>
                                        <Divider sx={{ my: 5 }} />
                                        <Typography
                                            sx={{
                                                fontSize: { sm: '1.3rem', xs: '1rem' },
                                                fontWeight: 700,
                                                lineHeight: 2,
                                                mb: 3,
                                            }}
                                        >
                                            ◦ Tech 기반 솔루션, 데이터 분석 업체의 성장세
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: { sm: '1rem', xs: '0.8rem' },
                                                fontWeight: 400,
                                                color: '#000',
                                                lineHeight: 2,
                                            }}
                                        >
                                            - 데이터 분석 전문 업체가 기존 리서치 업체의 업무를 상당부분을 대체할 수 있다는 점에서 기존 리서치 업체들에게 위기감이 고조되고 있음
                                            <br />- Tech 기반 솔루션 업체들이 보유한 빅데이터 관리 기술을 도입하여
                                            <span style={{ fontWeight: 500, textDecoration: 'underline', textUnderlinePosition: 'under' }}>Tech 기반 고품질 리서치를 수행할 것에 대한 시장의 요구가 증대</span>되고 있음
                                        </Typography>
                                        <Divider sx={{ my: 5 }} />
                                        <Typography
                                            sx={{
                                                fontSize: { sm: '1.3rem', xs: '1rem' },
                                                fontWeight: 700,
                                                lineHeight: 2,
                                                mb: 3,
                                            }}
                                        >
                                            ◦ 학술논문 및 정책연구에 활용될 전문 서베이 데이터 확보의 어려움
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: { sm: '1rem', xs: '0.8rem' },
                                                fontWeight: 400,
                                                color: '#000',
                                                lineHeight: 2,
                                            }}
                                        >
                                            - 정책연구와 학술논문에 활용될 전문 데이터 수집을 위해 전문가 패널이 다수 확보되어야하나
                                            <span style={{ fontWeight: 500, textDecoration: 'underline', textUnderlinePosition: 'under' }}>전문가 패널의 모집에 어려움</span>이 있음
                                            <br /> - 임의의 설문 대상자들 중 적합 패널을 설문으로 걸러내는 방식으로는 충분한 설문대상자 확보에 제약이 있음
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'left',
                                                mt: 10,
                                            }}
                                        >
                                            <img alt="" src="/media/research-image.png" style={{ maxWidth: '800px', width: '100%' }} />

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    mt: 1,
                                                    maxWidth: '800px',
                                                }}
                                            >
                                                <Typography
                                                    color="text.black"
                                                    sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: 500,
                                                        overflow: 'hidden',
                                                        fontFamily: 'Noto Sans KR',
                                                        textOverflow: 'ellipsis',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 2,
                                                        ml: 2,
                                                    }}
                                                >
                                                    {`<리서치 업체 유형별 동향>`}
                                                </Typography>
                                                <Typography
                                                    color="text.black"
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        fontWeight: 500,
                                                        overflow: 'hidden',
                                                        fontFamily: 'Noto Sans KR',
                                                        textOverflow: 'ellipsis',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 2,
                                                        ml: 2,
                                                    }}
                                                >
                                                    출처: Greenbook Market Research Trends Report 2020
                                                </Typography>
                                            </Box>
                                        </Box>
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

export default SubtResearch
