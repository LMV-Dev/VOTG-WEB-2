import NextLink from 'next/link'
import { useMediaQuery, Button, Box, Card, Container, Grid, Link, Typography, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { IconServiceResearch } from '@public/votg/IconServiceResearch'
import { IconServiceStatistics } from '@public/votg/IconServiceStatistics'
import { IconServiceCrawling } from '@public/votg/IconServiceCrawling'
import { IconServiceBigdata } from '@public/votg/IconServiceBigdata'

export const HomeServiceColumn = (props) => {
    const theme = useTheme()
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'))

    const contentsSection = (size, color) => [
        {
            title: '서베이 조사',
            desc: '',
            href: '/service/research',
            icon: <IconServiceResearch sx={{ width: size }} variant="color" customColor={color} />,
        },
        {
            title: '통계분석',
            desc: '',
            href: '/service/statistics',
            icon: <IconServiceStatistics sx={{ width: size }} variant="color" customColor={color} />,
        },
        {
            title: '크롤링',
            desc: '',
            href: '/service/crawling',
            icon: <IconServiceCrawling sx={{ width: size }} variant="color" customColor={color} />,
        },
        {
            title: '빅데이터 분석',
            desc: '',
            href: '/service/bigdata',
            icon: <IconServiceBigdata sx={{ width: size }} variant="color" customColor={color} />,
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
                    {contentsSection(80, '#fff').map((v, index) => {
                        return (
                            <Grid item md={3} sm={6} xs={12} key={`grid-write-${index}`}>
                                <a href={v.href}>
                                    <Box
                                        sx={{
                                            margin: '0 auto',
                                            maxWidth: '460px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            ':hover': {
                                                opacity: 0.8,
                                            },
                                            backgroundColor: 'rgba(10,10,10,0.5)',
                                            pb: 2,
                                        }}
                                    >
                                        <Box sx={{ px: 0, height: '130px', display: 'flex', justifyContent: 'center' }}>{v.icon}</Box>
                                        <Typography sx={{ mt: 1, color: '#fff', fontSize: { sm: '1.3rem', xs: '1.1rem' }, fontWeight: 700 }} textAlign="center">
                                            {v.title}
                                        </Typography>
                                        <Typography sx={{ mt: 1, color: '#ccc', fontSize: { sm: '1rem', xs: '0.9rem' }, fontWeight: 500 }} textAlign="center">
                                            {v.desc}
                                        </Typography>
                                        <Button
                                            size="small"
                                            sx={{
                                                display: { md: 'flex', xs: 'none' },
                                                width: '80px',
                                                height: '25px',
                                                borderRadius: '20px 0px 20px 0px',
                                                mx: 1,
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
