import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Box, Button, Card, CardActions, CardContent, Container, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material'
import { AuthGuard } from '@components/auth/auth-guard'

/* Import Component */
import { CardList } from '@components/payment/card-list'
import { PayRequest } from '@components/payment/pay-request'
import { PlanSelect } from '@components/payment/service-plan-select'

//ELEMENT
const PAGE_TITLE = '결제 관리'

/*Improt Layouts*/
import LayoutWithDefaultMenu from '@layouts/ws/layout-with-default-menu'

const Payment = () => {
    const [displayBanner, setDisplayBanner] = useState(true)

    // useEffect(() => {
    //     gtm.push({ event: 'page_view' })
    // }, [])

    useEffect(() => {
        // Restore the persistent state from local/session storage
        const value = globalThis.sessionStorage.getItem('dismiss-banner')

        if (value === 'true') {
            // setDisplayBanner(false);
        }
    }, [])

    const handleDismissBanner = () => {
        // Update the persistent state
        // globalThis.sessionStorage.setItem('dismiss-banner', 'true');
        setDisplayBanner(false)
    }

    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 뷰즈온더고 :: Views On the Go</title>
            </Head>
            <Container
                component="main"
                maxWidth="lg"
                sx={{
                    flexGrow: 1,
                    py: 5,
                    background: '#fff',
                    minHeight: 'calc(100vh - 150px)',
                }}
            >
                <Box sx={{ mb: 4 }}>
                    <Grid container justifyContent="space-between" spacing={3}>
                        <Grid item>
                            <Typography variant="h4">결제 관리</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ mb: 3 }} />
                <CardList />
                <Divider sx={{ my: 3 }} />
                <PlanSelect />
                <PayRequest />
            </Container>
        </>
    )
}

Payment.getLayout = (page) => (
    <AuthGuard>
        <LayoutWithDefaultMenu>{page}</LayoutWithDefaultMenu>
    </AuthGuard>
)

export default Payment
