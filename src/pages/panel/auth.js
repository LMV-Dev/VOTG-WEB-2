import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import Head from 'next/head'

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
import { useMounted } from '@hooks/use-mounted'
import { GuestGuard } from '@components/auth/guest-guard'
import { createResourceCode } from '@utils/create-resource-id'

// import { removeSessionStorageIncludeWord } from '@utils/session-control'

//ELEMENT
const PAGE_TITLE = '패널 가입 본인인증'

/*Improt Layouts*/
import LayoutPanelRegister from '@layouts/pn/layout-panel-register'

/*Import Components*/
//Layout
import RegisterBottomButton from '@components/pn/register-bottom-button'
import RegisterBottomProgress from '@components/pn/register-bottom-progress'

//STEP
import AutInit from '@components/pn/register-auth-init'

const PanelAuth = () => {
    const isMounted = useMounted()
    const router = useRouter()

    const popupIMPCertification = () => {
        // IMP.certification(param, callback) 호출
        IMP.certification(
            {
                // param
                // 주문 번호
                merchant_uid: `order-${createResourceCode()}`,
                // 모바일환경에서 popup:false(기본값) 인 경우 필수
                m_redirect_url: `${process.env.NEXT_PUBLIC_HOST}/panel/register`,
                // PC환경에서는 popup 파라메터가 무시되고 항상 true 로 적용됨
                popup: false,
            },
            async (rsp) => {
                // callback
                if (rsp.success) {
                    console.log('surcess data ', rsp)
                    // console.log(rsp.imp_uid)
                    try {
                        if (isMounted()) {
                            //http://localhost:7701/panel/register?imp_uid=imp_258661886591&success=true
                            const returnUrl = `/panel/register?imp_uid=${rsp.imp_uid}&success=true` || '/'
                            router.push(returnUrl).catch(console.error)
                        }
                    } catch (error) {
                        if (isMounted()) {
                            alert(`인증 오류\n새로고침 후 다시 시도 부탁드립니다.`)
                        }
                    }
                } else {
                    alert(`인증창을 닫았습니다.\n다시 시도 부탁드립니다.`)
                }
            },
        )
    }

    useEffect(() => {
        /* Chai iamport */
        const { IMP } = window
        IMP.init('imp61484477') // 예: imp00000000
    }, [])

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
                    <Typography sx={{ ml: 1, mt: 2, color: 'text.main', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>{`패널 가입 본인인증`}</Typography>
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
                <AutInit onClickNextStep={popupIMPCertification} />
            </Container>
        </>
    )
}

PanelAuth.getLayout = (page) => (
    <GuestGuard>
        <LayoutPanelRegister>{page}</LayoutPanelRegister>
    </GuestGuard>
)

export default PanelAuth
