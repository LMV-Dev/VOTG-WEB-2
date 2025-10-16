import React from 'react'

/* MUI */
import { Box, Button, Container, Typography, Paper, Grid } from '@mui/material'

/* Compoent */
import { Scrollbar } from '@components/layout/scrollbar'
import LinkRequest from '@components/home/service/link-request'

const SubStatistics = (props) => {
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
                                            통계(statistics)의 역사적 원류를 살펴보면, 국가(state)의 상태(status)를 나타낸다는 의미를 담고 있어서, 과거 국가 통치를 위해 국가의 각 분야에 대한 상태를 파악할 필요에 의해 시작되었다는 것을 알 수 있습니다.{' '}
                                            <br />
                                            이처럼 통계의 시작은 우리가 일반적으로 갖고 있는 개념과는 약간 달랐는데요, ‘통계’라고 하면 우리가 쉽게 떠올리는 어려운 수치와 함수로 가득찬 표가 아니었던 것입니다. <br />
                                            즉 초기에는 자료를 수집하는 것이 ‘통계’의 의미였습니다. <br />
                                        </Typography>
                                        <Box
                                            sx={{
                                                height: '250px',
                                                backgroundImage: `url(/background/survey_statistics.jpeg)`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center',
                                                backgroundSize: '100% auto',
                                                backgroundColor: '#fff',
                                                pt: 0,
                                                my: 5,
                                            }}
                                        />

                                        <Typography sx={{ fontSize: '1rem', fontWeight: 400, color: '#777', lineHeight: 2 }}>
                                            {' '}
                                            그러나 수집한 자료 즉 수치들의 관련성이 이해되지 않는다면 실제 국가 통치에 영향을 미칠 수 없다는 것을 깨닫게 된 19세기 무렵부터 데이터의 수집과 분석을 모두 통칭한 개념이 ‘통계’를 의미하게 되었습니다.
                                            <br /> <br /> <br /> 통계분석의 두 가지 줄기는 빈도주의(Frequentist probability)와 베이지안 추론(Bayesian inference)으로 나뉩니다. <br /> 두 가지 모두 확률(probability)에 기반하지만, 빈도주의가 보다 객관적
                                            기준의 확률을 가정한다면, 베이지안 추론은 주관적 기준의 확률을 가정하는 방식이라는 점이 다릅니다. <br /> <br /> 빈도주의에 따른 통계분석은 주로 오차 검정을 중심으로 하여 귀무가설(영가설)과 대립가설을 세우고
                                            귀무가설에 근거한 검정통계량을 구하여 귀무가설의 기각 여부를 결정함으로써 대립가설의 수용여부를 결정하는 방식이며 이것은 일반적으로 사용 중인 인과관계 분석의 대부분을 차지합니다. <br />
                                            <br /> 베이지안 추론은 최근 이슈가 되기 시작한 빅데이터 분석에 적합한 분석방식으로서 분석자가 주관적으로 설정한 확률(사전확률)로 추론을 수행한 결과가 주관적 설정 확률과 크게 차이가 날 경우 다시
                                            수정확률(사후확률)로 추론을 수행하여 반복 추론을 실행하는 방식의 분석입니다. <br /> 이것을 조건부 확률이라고 합니다. <br /> 따라서 베이지안 추론은 인공지능 학습(machine learning, deep learning)에 유용하게
                                            활용될 수 있는 분석방식이라고 할 수 있습니다. <br />
                                            <br /> 빈도주의에 입각하여 형성된 통계분석의 개념은 주로 ‘양적 연구’의 한 방법으로서 ‘스몰데이터(small data)’ 즉 ‘표본데이터’를 기반으로 이루어집니다. <br /> 스몰데이터 형성 방법은 서베이, 실험 등이
                                            있습니다. <br /> 서베이는 설문조사 및 여론조사에 의한 방법이고, 실험은 특정 대상들에 대한 개입에 의해 그 결과를 기록하여 데이터를 얻는 방법입니다. <br /> <br /> 스몰데이터를 기반으로 하는 통계분석은 크게
                                            기술통계 즉 빈도와 백분율, 평균, 표준편차, 왜도, 첨도 등의 기본 정보를 분석하는 영역과 인과관계 분석 영역으로 나눌 수 있습니다. <br /> <br /> <br /> 인과관계 분석의 영역에는 상관관계 분석, 회귀분석,
                                            매개효과 분석, 구조방정식 등의 통계분석 기법들이 적용되고 있습니다. <br /> 그 외에, 데이터를 구성하는 집단 간의 평균차이를 분석하는 기법들이 많이 적용되고 있습니다. <br /> 교차분석(카이제곱 검정), t-검정,
                                            ANOVA(일원배치분산분석) 등이 그것입니다. <br />
                                            <br /> 이들 분석은 특정 현상을 측정하기 위한 것이기 때문에, 데이터를 수집하기 위해 일정한 측정 수준을 갖춘 질문형식을 사용하게 됩니다. <br /> 이러한 서베이의 질문형식 또는 기타 기초 데이터를 사용하여 수집한
                                            데이터를 ‘척도’라고 부르며 크게 네 가지 형태로 작성됩니다. <br /> 이들 척도는 분석의 방식을 결정하는 데 매우 중요한 기준을 제공합니다. <br />
                                            <br />
                                            <br />
                                            1. 명목척도(nominal scale): 범주 데이터. 숫자로 표현되기 어려운 성별, 연령, 지역 등의 개인 정보 관련 데이터. 사용되는 숫자는 실제 의미를 가지는 수치가 아닌 단순 분류를 위한 것으로 이해됨 <br />
                                            <br />
                                            2. 서열척도(ordinal scale): 추상적인 개념을 측정하기 위해 4단계, 5단계, 7단계 등으로 생각의 정도에 순위(예: 매우 만족 5점, 만족 4점, 보통 3점, 불만족 2점 매우 불만족 1점) 를 매겨 측정하는 방법. 등간척도와
                                            유사하지만, 등간척도만큼의 객관성은 결여됨. 심리학, 교육학, 경제학 등 사회과학에서 주로 사용됨.
                                            <br />
                                            <br />
                                            3. 등간척도(interval scale): 시간, 나이, 지능지수 등 숫자 0에 절대적인 의미는 없이 숫자 사이의 간격이 중요한 데이터. 덧셈, 뺄셈 정도만 가능. 곱셈, 나눗셈은 의미가 없음
                                            <br />
                                            <br />
                                            4. 비율척도(ratio scale): 길이, 질량, 무게, 온도 등 0을 포함하는 물리량이나 많고 적음을 나타낼 수 있는 데이터. 사칙연산 가능.
                                            <br /> <br />
                                            통계분석을 위해서 과거에는 주로 통계패키지를 사용했습니다. <br /> SPSS, SAS, STATA, Minitab, Lisrel, AMOS 등이 그 예입니다. <br /> 현재는 R, Python 등 오픈 소프트웨어를 이용하여 양적 데이터와 질적 데이터
                                            모두를 처리할 수 있으며 거의 모든 유형의 통계분석이 가능해졌습니다. <br />
                                            <br />
                                            뷰즈온더고는 서베이를 위한 설문척도 개발은 물론 서베이를 통해 수집된 스몰데이터를 사용하여 SPSS 및 AMOS를 사용한 통계분석, R 코딩 및 통계분석, Python 코딩 및 모델링, 메타분석, 구조방정식 모형분석,
                                            잠재성장모형 분석, 비용편익분석 등을 수행합니다. <br />
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

export default SubStatistics
