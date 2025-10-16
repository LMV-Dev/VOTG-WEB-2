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
import { useCookies } from 'react-cookie'
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
import RegisterBottomButton from '@components/pn/register-bottom-button'
import RegisterBottomProgress from '@components/pn/register-bottom-progress'

//STEP
import AuthNew from '@components/pn/register-auth-new'

const PanelRegister = () => {
    const auth = useAuth()
    const { impPNCertify, user } = useAuth()
    const router = useRouter()
    const imp_uid = router.query.imp_uid
    const success = router.query.success
    const [cookie, setCookie, rmCookie] = useCookies(['tempUser'])

    const [tempUser, setTempUser] = useState(null)

    useEffect(() => {
        // console.log('tempUser', cookie.tempUser)
        // cookie를 통해 받은 임시데이터를 활용하여 tempUser로 생성후 삭제
        if (cookie.tempUser !== undefined) {
            setTempUser(cookie.tempUser)
            rmCookie('tempUser', { path: '/' })
        }
    }, [cookie])

    useEffect(() => {
        console.log('tempUser', tempUser)
        if (tempUser?.user === 'exist') {
            setRegisterStatue(true)
        } else {
            setRegisterStatue(false)
        }
    }, [tempUser])

    const [registerStatus, setRegisterStatue] = useState(false)

    useEffect(
        () => {
            if (!router.isReady) {
                return
            }
            let isMounted = true

            // You should remove the "disableGuard" check, because it's meant to be used only in the demo.
            if (success === 'false') {
                router.push('/panel/auth').catch(console.error)
            } else {
                const fetchData = async () => {
                    await impPNCertify({
                        imp_uid: imp_uid,
                    })
                }
                fetchData().catch(console.error)
                return () => {
                    isMounted = false
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router.isReady],
    )

    if (tempUser === null || tempUser === undefined) {
        return (
            <>
                <CircularProgress
                    size={24}
                    sx={{
                        color: 'primary.main',
                        position: 'relative',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />
            </>
        )
    }
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
                    <Typography sx={{ ml: 1, mt: 2, color: 'text.main', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>{`아이디 / 비밀번호 등록`}</Typography>
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
                {registerStatus ? (
                    <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', my: 2 }} />
                        <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                            <Typography sx={{ my: 3, color: 'text.main', fontSize: '1rem', fontWeight: 700, textAlign: 'left' }}>이미 가입된 계정입니다.</Typography>
                        </Box>
                        <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />
                        <Box sx={{ mt: 2 }}>
                            <Button
                                component="a"
                                href={'/panel/login'}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                sx={{
                                    ':hover': {
                                        color: 'info.contrastText',
                                        boxShadow: '0 0 0 2px inset',
                                        opacity: 0.8,
                                    },
                                }}
                                color="info"
                            >
                                로그인 바로가기
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <AuthNew tempUser={tempUser} />
                )}
            </Container>
        </>
    )
}

PanelRegister.getLayout = (page) => (
    <GuestGuard>
        <LayoutPanelRegister>{page}</LayoutPanelRegister>
    </GuestGuard>
)

export default PanelRegister
