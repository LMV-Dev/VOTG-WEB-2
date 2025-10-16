import NextLink from 'next/link'
import { useMediaQuery, Button, Box, Card, Container, Grid, Link, Typography, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'
export const HomeSolution = (props) => {
    const theme = useTheme()
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <Box
            sx={{
                backgroundColor: '#000',
                py: 10,
                mt: -2,
            }}
            {...props}
        >
            <Container maxWidth="xl">
                <Grid container>
                    <Grid item sm={12} xs={12}>
                        <Box
                            sx={{
                                pt: 5,
                                pb: { sm: 3, xs: 2 },
                                px: { md: 15, xs: 2 },
                            }}
                        >
                            <Typography align="left" sx={{ pb: { sm: 3, xs: 1 }, color: '#fff', fontSize: { md: '2.5rem', sm: '2.1rem', xs: '1.5rem' }, fontWeight: 700 }}>
                                뷰즈온더고는 새롭고 편리한 서베이를 제공합니다!
                            </Typography>
                            {/* <Typography align="left" sx={{ pb: { sm: 1, xs: 1 }, color: '#fff', fontSize: { md: '2.5rem', sm: '2.1rem', xs: '1rem' }, fontWeight: 700 }}>
                                비용은 50% 낮게, 타겟 정확도는 200% 높게!
                            </Typography>
                            <Typography align="left" sx={{ pb: { sm: 3, xs: 2 }, color: '#fff', fontSize: { md: '2.5rem', sm: '2.1rem', xs: '1rem' }, fontWeight: 700 }}>
                                결과 신뢰도는 100% 를 도출하는 ‘새로운’ 관점의 서베이 플랫폼.
                            </Typography> */}
                            <Typography align="left" sx={{ pb: { sm: 1, xs: 1 }, color: '#ccc', fontSize: { md: '1.5rem', sm: '1.2rem', xs: '0.9rem' }, fontWeight: 500 }}>
                                #학술전문서베이 #학술전문설문조사 #학술데이터
                            </Typography>
                            <Typography align="left" sx={{ pb: { sm: 6, xs: 5 }, color: '#ccc', fontSize: { md: '1.5rem', sm: '1.2rem', xs: '0.9rem' }, fontWeight: 500 }}>
                                #크롤링 #빅데이터 #데이터기반학술
                            </Typography>
                        </Box>
                        <Grid
                            container
                            sx={{
                                pt: 0,
                                pb: 0,
                                px: { md: 15, xs: 2 },
                            }}
                        >
                            <Grid item sm={1} xs={1}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%', justifyContent: 'left', alignItems: 'center' }}>
                                    <Box sx={{ width: { md: '1rem', sm: '0.8rem', xs: '0.5rem' }, height: { md: '320px', sm: '250px', xs: '150px' }, background: '#FF5353' }} />
                                    {/* <Box sx={{ width: { sm: '1rem', xs: '0.5rem' } }} />
                                    <Box sx={{ width: { sm: '1rem', xs: '0.5rem' }, height: { sm: '500px', xs: '300px' }, background: '#FF5353' }} /> */}
                                </Box>
                            </Grid>
                            <Grid item sm={10} xs={11}>
                                <Box>
                                    <Typography align="left" sx={{ pb: 1, color: '#fff', fontSize: { md: '2rem', sm: '1.3rem', xs: '1rem' }, fontWeight: 500 }}>
                                        1. 카카오톡, 문자메세지 즉시 발송 가능.
                                    </Typography>
                                    <Typography align="left" sx={{ pb: 1, color: '#fff', fontSize: { md: '2rem', sm: '1.3rem', xs: '1rem' }, fontWeight: 500 }}>
                                        2. 리워드 대량 구매 및 발송 기능 지원.
                                    </Typography>
                                    <Typography align="left" sx={{ pb: 1, color: '#fff', fontSize: { md: '2rem', sm: '1.3rem', xs: '1rem' }, fontWeight: 500 }}>
                                        3. 설문 결과 데이터 다운로드 및 리포트 작성 지원.
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            <Container
                maxWidth="xl"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    border: 'none',
                }}
            >
                <Box
                    sx={{
                        paddingInline: {
                            md: 'none',
                            xs: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                        },
                        marginTop: { md: '-5rem', sm: '-5rem', xs: '-2rem' },
                        marginRight: '5rem',
                    }}
                >
                    <Typography
                        color="primary.light"
                        align="right"
                        sx={{
                            fontSize: { md: '2.5rem', sm: '1.8rem', xs: '1.0rem' },
                            fontWeight: 700,
                            fontFamily: 'Poppins',
                            paddingInline: {
                                md: 0,
                                xs: 'none',
                            },
                            mb: 2,
                        }}
                    >
                        이 모든것을 뷰즈온더고 한곳에서!
                    </Typography>
                    <Box sx={{ width: mobileDevice ? '50%' : '40%', height: { md: '10px', sm: '10px', xs: '5px' }, background: '#FF5353' }}></Box>
                </Box>
            </Container>
        </Box>
    )
}
