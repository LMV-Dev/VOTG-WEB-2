import NextLink from 'next/link'
import { useMediaQuery, Button, Box, Card, Container, Grid, Link, Typography, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'
export const HomeNews = (props) => {
    const theme = useTheme()
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'))

    const contentsSection = [
        {
            title: '머니투데이, "커스텀서베이 플랫폼" 로코모션뷰, 서비스혁신기업으로 뽑혀',
            href: 'https://news.mt.co.kr/mtview.php?no=2022070116524292011',
            image: '/news/new_contents_00.png',
        },
        {
            title: '월간 인터뷰 2022년 9월호',
            href: 'http://www.interviewm.com/news/articleView.html?idxno=2714',
            image: '/news/new_contents_01.png',
        },
        {
            title: '이코노미뷰 2022년 10월호',
            href: '#',
            image: '/news/new_contents_02.png',
        },
    ]

    return (
        <Box
            sx={{
                backgroundColor: '#000',
                py: 10,
                mt: -2,
            }}
            {...props}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        pt: 3,
                        pb: 8,
                        px: { sm: 15, xs: 2 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography align="center" sx={{ pb: 3, color: '#fff', textAlign: 'center' }} variant={mobileDevice ? 'h2' : 'h3'}>
                        대외활동 및 수상내역
                    </Typography>
                    <Box sx={{ width: '250px', height: '10px', background: '#FF5353' }}></Box>
                </Box>

                <Grid container spacing={4}>
                    {contentsSection.map((v, index) => {
                        return (
                            <Grid item lg={4} xs={12} key={`grid-write-${index}`}>
                                <a href={v.href} target="_blank">
                                    <Box
                                        sx={{
                                            margin: '0 auto',
                                            maxWidth: '460px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            cursor: 'pointer',
                                            ':hover': {
                                                opacity: 0.8,
                                            },
                                            backgroundColor: '#333',
                                            // pb: 3,
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <Box sx={{ px: 0, height: '350px', backgroundImage: `url(${v.image})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'top center', backgroundSize: '100% auto', borderRadius: '10px' }}>
                                            <Box sx={{ position: 'relative', px: 2, py: 1, top: '270px', left: '0px', height: '80px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '0 0 10px 10px' }}>
                                                <Typography sx={{ mt: 1, color: '#fff', textSize: { sm: '1rem', xs: '2rem' } }} textAlign="left">
                                                    {v.title}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </a>
                            </Grid>
                        )
                    })}
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
