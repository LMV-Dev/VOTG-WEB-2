import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import Head from 'next/head'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { AuthGuard } from '@components/auth/auth-guard'

// import { removeSessionStorageIncludeWord } from '@utils/session-control'

//ELEMENT
const PAGE_TITLE = '패널 페이지'

/*Improt Layouts*/
import LayoutPanelRegister from '@layouts/pn/layout-panel-register'
/*Import Components*/

const _Blank = () => {
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
                    py: 5,
                    background: '#fff',
                    minHeight: 'calc(100vh - 150px)',
                }}
            ></Container>
        </>
    )
}

_Blank.getLayout = (page) => (
    // <AuthGuard>
    <LayoutPanelRegister>{page}</LayoutPanelRegister>
    // </AuthGuard>
)

export default _Blank
