import NextLink from 'next/link'
import { useMediaQuery, Button, Box, Card, Container, Grid, Link, Typography, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'
export const HomeIntro = (props) => {
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
                    <Grid item sm={10} xs={11}>
                        <Box
                            sx={{
                                pt: 5,
                                pb: { sm: 5, xs: 2 },
                                px: { md: 15, xs: 2 },
                            }}
                        >
                            <Typography align="left" sx={{ pb: { sm: 2, xs: 1 }, color: '#fff', fontSize: { md: '3.3rem', sm: '2.7rem', xs: '1.8rem' }, fontWeight: 700 }}>
                                Views On The Go는
                            </Typography>
                            <Typography align="left" sx={{ pb: { sm: 6, xs: 0 }, color: '#fff', fontSize: { md: '1.8rem', sm: '1.4rem', xs: '1rem' }, fontWeight: 700 }}>
                                설문조사 서비스를 더 넓은 관점으로 바라보고 접근합니다.
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                pt: 0,
                                pb: 5,
                                px: { md: 15, xs: 2 },
                            }}
                        >
                            <Typography align="left" sx={{ pb: 1, color: '#fff', fontSize: { md: '3rem', sm: '3rem', xs: '1.5rem' }, fontWeight: 700 }}>
                                새로운 시선으로.
                            </Typography>
                            <Typography align="left" sx={{ pb: 1, color: '#fff', fontSize: { md: '3rem', sm: '3rem', xs: '1.5rem' }, fontWeight: 700 }}>
                                새로운 방식으로.
                            </Typography>
                            <Typography align="left" sx={{ pb: 1, color: '#fff', fontSize: { md: '3rem', sm: '3rem', xs: '1.5rem' }, fontWeight: 700 }}>
                                새로운 DATA.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item sm={2} xs={1}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%', justifyContent: 'left', alignItems: 'center' }}>
                            <Box sx={{ width: { sm: '1rem', xs: '0.5rem' }, height: { sm: '500px', xs: '300px' }, background: '#FF5353' }} />
                            <Box sx={{ width: { sm: '1rem', xs: '0.5rem' } }} />
                            <Box sx={{ width: { sm: '1rem', xs: '0.5rem' }, height: { sm: '500px', xs: '300px' }, background: '#FF5353' }} />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Container
                maxWidth="xl"
                sx={{
                    mt: 5,
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
                        marginBottom: { md: '-20px', xs: '-10px' },
                    }}
                >
                    <Typography
                        color="primary.contrastText"
                        align="right"
                        variant="h1"
                        sx={{
                            fontFamily: 'Poppins',
                            paddingInline: {
                                md: 0,
                                xs: 'none',
                            },
                        }}
                    >
                        HANDY SURVEY
                    </Typography>
                    <Box sx={{ width: mobileDevice ? '50%' : '30%', height: '10px', background: '#FF5353' }}></Box>
                </Box>
            </Container>
        </Box>
    )
}
