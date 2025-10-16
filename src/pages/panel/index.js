import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import Head from 'next/head'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*Mui Icon */
import HomeIcon from '@mui/icons-material/Home'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'

/*Custom Icon*/
import { LogoSymbol } from '@public/votg/logoSymbol'
import { LogoLabel } from '@public/votg/logoLabel'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { GuestGuard } from '@components/auth/guest-guard'

// import { removeSessionStorageIncludeWord } from '@utils/session-control'

//ELEMENT
const PAGE_TITLE = '패널'

/*Improt Layouts*/
import LayoutPanelRegister from '@layouts/pn/layout-panel-register'
/*Import Components*/

const PanelIndex = () => {
    const auth = useAuth()

    // console.log('auth :: ', auth)
    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 뷰즈온더고 :: Views On the Go</title>
            </Head>
            <Container
                component="main"
                maxWidth="sm"
                sx={{
                    flexGrow: 1,
                    pt: 5,
                    pb: 2,
                    background: '#1C60FF',
                    height: '90vh',
                }}
            >
                <Box sx={{ px: 3, pt: 10, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                    {/* <LogoSymbol sx={{ width: 38, height: 'auto' }} variant="color" customColor={'#fff'} /> */}
                    <Box sx={{ width: '100%', maxWidth: '360px', display: 'flex', justifyContent: 'start' }}>
                        <LogoLabel sx={{ width: 350, height: 'auto', marginRight: '30px' }} variant="color" customColor={'#fff'} />
                    </Box>

                    <Box>
                        <Typography sx={{ my: 3, color: '#fff', fontSize: '1.3rem', fontWeight: 700, textAlign: 'center' }}>당신의 응답이 세상을 바꿉니다.</Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 auto' }}></Box>

                    <NextLink href="/panel/auth">
                        <Button variant="outlined" color="white" size="large" fullWidth>
                            패널 가입하기
                        </Button>
                    </NextLink>
                    <Divider sx={{ my: 1 }} />
                    <NextLink href="https://cafe.naver.com/viewsonthego">
                        <Button variant="outlined" color="white" size="large" fullWidth>
                            네이버 패널 커뮤니티
                        </Button>
                    </NextLink>
                    <Divider sx={{ my: 1 }} />
                    <NextLink href="/panel/login">
                        <Button variant="text" color="white" fullWidth endIcon={<KeyboardArrowRightIcon />}>
                            로그인
                        </Button>
                    </NextLink>
                    <Divider sx={{ backgroundColor: 'white', width: '100%', height: '1px', mt: 5, mb: 1 }} />
                    {/* <NextLink href="/"> */}
                    <Button component="a" href="/" variant="text" color="white" fullWidth startIcon={<HomeIcon />}>
                        홈으로 돌아가기
                    </Button>
                    {/* </NextLink> */}
                </Box>
            </Container>
        </>
    )
}

PanelIndex.getLayout = (page) => (
    <GuestGuard>
        <LayoutPanelRegister>{page}</LayoutPanelRegister>
    </GuestGuard>
)

export default PanelIndex
