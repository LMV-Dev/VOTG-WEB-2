import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import Head from 'next/head'
import axios from 'axios'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*Mui Icon */
import HomeIcon from '@mui/icons-material/Home'

/*Custom Icon*/
import { LogoSymbol } from '@public/votg/logoSymbol'
import { LogoLabel } from '@public/votg/logoLabel'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { GuestGuard } from '@components/auth/guest-guard'
import { createResourceCode } from '@utils/create-resource-id'

// import { removeSessionStorageIncludeWord } from '@utils/session-control'

//ELEMENT
const PAGE_TITLE = '패널 가입 아이디 등록'

/*Improt Layouts*/
import LayoutPanelRegister from '@layouts/pn/layout-panel-register'

/*Import Components*/
//Layout

//STEP
import AuthIdpw from '@components/pn/login-auth-idpw'

const PanelLogin = () => {
    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 뷰즈온더고 :: Views On the Go</title>
            </Head>
            <Box sx={{ px: 0, py: 0, height: '60px', position: 'fixed', background: '#fff', boxShadow: (theme) => theme.shadows[3], width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
                <Container maxWidth="sm" sx={{ display: 'flex' }}>
                    <IconButton component="a" href="/panel">
                        <LogoSymbol sx={{ width: 38, height: 'auto' }} variant="color" customColor={'#1C60FF'} />
                    </IconButton>
                    <Typography sx={{ ml: 1, mt: 2, color: 'text.main', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>{`로그인`}</Typography>
                </Container>
            </Box>
            <Container
                component="main"
                maxWidth="sm"
                sx={{
                    flexGrow: 1,
                    mt: '60px',
                    pt: 2,
                    pb: 2,
                    px: 4,
                    background: '#fff',
                    height: 'calc(100vh - 50px)',
                }}
            >
                <AuthIdpw />
            </Container>
        </>
    )
}

PanelLogin.getLayout = (page) => (
    <GuestGuard>
        <LayoutPanelRegister>{page}</LayoutPanelRegister>
    </GuestGuard>
)

export default PanelLogin
