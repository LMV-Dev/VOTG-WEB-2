import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useTheme } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { styled } from '@mui/material/styles'
import { useMediaQuery, Box, Container, IconButton, Button, Tooltip } from '@mui/material'
import { useAuth } from '@hooks/use-auth'

/* Mui Icon */
import LogoutIcon from '@mui/icons-material/Logout'

/*Custom Icon*/
import { LogoSymbol } from '@public/votg/logoSymbol'

/*Import Components*/
import TopMenu from '@components/pn/top-menu'

/*Root*/
const LayoutRoot = styled('div')(({ theme }) => ({
    // background: '#fff',
    background: '#F9FAFC',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
    // marginTop: '65px',
    // [theme.breakpoints.up('lg')]: {
    //     paddingInline: 100,
    // },
}))

const LayoutPanelBoard = (props) => {
    const theme = useTheme()
    const deviceUp_md = useMediaQuery(theme.breakpoints.up('md'))
    const { children } = props
    const router = useRouter()
    const { asPath, pathname } = useRouter()
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
            handlePushRoutingEvent()
            toast.success('로그아웃')
        } catch (err) {
            console.error(err)
            toast.error('Unable to logout.')
        }
    }

    const handlePushRoutingEvent = async () => {
        globalThis.sessionStorage.removeItem('shared-check')
        globalThis.sessionStorage.removeItem('convert-pdf-cache')
        globalThis.sessionStorage.removeItem('convert-survey-question-init-check')
        globalThis.sessionStorage.removeItem('convert-survey-question')
        globalThis.sessionStorage.removeItem('create-survey-question')
        globalThis.sessionStorage.removeItem('current-create-survey')
        globalThis.sessionStorage.removeItem('set-file-cache')
        globalThis.sessionStorage.removeItem('send-phone-number')
        globalThis.sessionStorage.removeItem('send-type')
        await router.push('/panel').catch(console.error)
    }

    return (
        <>
            <LayoutRoot>
                <Box sx={{ px: 0, py: 0, height: '60px', position: 'fixed', background: '#fff', boxShadow: (theme) => theme.shadows[3], width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
                    <Container maxWidth="sm" sx={{ display: 'flex' }}>
                        <IconButton component="a" href="/panel/board">
                            <LogoSymbol sx={{ width: 38, height: 'auto' }} variant="color" customColor={'#1C60FF'} />
                        </IconButton>

                        <NextLink href={'/panel/board'}>
                            <Button
                                component="a"
                                size="small"
                                variant="text"
                                sx={{
                                    fontSize: '0.7rem',
                                    color: '/panel/board' == asPath ? 'info.main' : 'text.black',
                                    background: 'transparent',
                                    ':hover': {
                                        color: 'text.secondary',
                                        background: 'transparent',
                                    },
                                }}
                            >
                                내 정보
                            </Button>
                        </NextLink>

                        <NextLink href={'/panel/survey'}>
                            <Button
                                component="a"
                                size="small"
                                variant="text"
                                sx={{
                                    fontSize: '0.7rem',
                                    color: '/panel/survey' == asPath ? 'info.main' : 'text.black',
                                    background: 'transparent',
                                    ':hover': {
                                        color: 'text.secondary',
                                        background: 'transparent',
                                    },
                                }}
                            >
                                {deviceUp_md ? `요청 설문 리스트` : `요청 설문`}
                            </Button>
                        </NextLink>

                        {/* <NextLink href={'/panel/point'}>
                            <Button
                                component="a"
                                size="small"
                                variant="text"
                                sx={{
                                    fontSize: '0.7rem',
                                    color: '/panel/point' == asPath ? 'info.main' : 'text.black',
                                    background: 'transparent',
                                    ':hover': {
                                        color: 'text.secondary',
                                        background: 'transparent',
                                    },
                                }}
                            >
                                {deviceUp_md ? `포인트 리워드 관리` : `포인트 리워드`}
                            </Button>
                        </NextLink> */}

                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton
                            onClick={handleLogout}
                            sx={{
                                color: 'primary.main',
                                mr: '0px',
                            }}
                        >
                            <Tooltip title="로그아웃">
                                <LogoutIcon fontSize="medium" color="info" />
                            </Tooltip>
                        </IconButton>
                        {/* <Typography sx={{ ml: 1, mt: 2, color: 'text.main', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>패널</Typography> */}
                    </Container>
                </Box>
                {children}
            </LayoutRoot>
        </>
    )
}

LayoutPanelBoard.propTypes = {
    children: PropTypes.node,
}

export default LayoutPanelBoard
