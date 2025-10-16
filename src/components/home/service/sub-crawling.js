import React from 'react'

/* MUI */
import { Box, Button, Container, Typography, Paper, Grid } from '@mui/material'

/* Compoent */
import { Scrollbar } from '@components/layout/scrollbar'
import LinkRequest from '@components/home/service/link-request'

const SubCrawling = (props) => {
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
                                            크롤링(crawling) 인터넷에 작성된 정보들을 분석하기 위해 데이터를 수집하는 행위를 말합니다. <br /> 크롤링을 위해 사용되는 소프트웨어(코드)를 크롤러(crawler)라고 합니다. <br />
                                        </Typography>
                                        <Box
                                            sx={{
                                                height: '250px',
                                                backgroundImage: `url(/background/survey_crawling.jpeg)`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center',
                                                backgroundSize: '100% auto',
                                                backgroundColor: '#fff',
                                                pt: 0,
                                                my: 5,
                                            }}
                                        />

                                        <Typography sx={{ fontSize: '1rem', fontWeight: 400, color: '#777', lineHeight: 2 }}>
                                            구체적으로 크롤링은 다양한 웹사이트 페이지를 브라우징하는 활동을 의미하는데요 이 과정에서 웹페이지 안에 있는 특정 데이터를 추출하여 가공하는 활동을 스크래핑(scraping)이라고 부릅니다. <br /> 즉 크롤링은 단일
                                            작업으로만 이루어지기보다는 스크래핑과 동시에 이루어지는 데이터 수집과정이라고 볼 수 있습니다. <br /> <br /> <br /> 서베이를 통한 스몰데이터 수집과 빈도주의에 의한 통계분석과는 달리, 데이터의 수집부터
                                            분석의 논리가 완전히 다른 형태로 진행되는 것이 크롤링과 빅데이터 분석입니다. <br /> <br /> 크롤링에는 파이썬(Python)의 패키지와 코드를 주로 사용합니다. <br /> 크롤링과 스크래핑을 수행할 웹페이지는
                                            HTML문서로 작성되어 있고 HTML문서의 인터페이스 참조를 위해 CSS파일과 동적 상호작용을 위한 JavaScript가 사용됩니다. <br /> 모든 웹페이지에서 확인할 수 있는 HTML문서에서 어떤 CSS가 참조되었는지 확인하고, HTML
                                            태그를 찾아 필요한 데이터를 추출하기 위한 크롤러를 만들게 됩니다. <br /> <br /> 웹 상에 올려진 방대한 자료들 중에서 분석이 필요한 부분을 가져오고 싶을 때, 크롤러가 매우 유용하게 쓰일 수 있습니다. <br />{' '}
                                            그러나 파이썬에 익숙하지 않거나 코딩을 할 여력이 없다면 뷰즈온더고에 맡겨주세요. 여러분에게 필요한 데이터를 빠르고 정확하게 수집하여 분석가능한 형태로 전해드립니다. <br />
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

export default SubCrawling
