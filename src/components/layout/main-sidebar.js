import { Fragment, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { Box, Button, Drawer, Link, useMediaQuery, Divider, IconButton, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useAuth } from '@hooks/use-auth'
import { toast } from 'react-toastify'

/* MUI Icon */
import PolicyIcon from '@mui/icons-material/Policy'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'

const MainSidebarLink = styled(Link)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    display: 'block',
    padding: theme.spacing(1.5),
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}))

const menuCenter = [
    // {
    //     title: '서베이 조사',
    //     href: '/service/research',
    // },
    // {
    //     title: '통계분석',
    //     href: '/service/statistics',
    // },
    // {
    //     title: '크롤링',
    //     href: '/service/crawling',
    // },
    // {
    //     title: '빅데이터 분석',
    //     href: '/service/bigdata',
    // },
    // {
    //     title: '상담신청',
    //     href: '/request',
    // },
    // {
    //     title: '공지사항',
    //     href: '/board/notice',
    // },
]

export const MainSidebar = (props) => {
    const auth = useAuth()
    const { user, logout } = useAuth()
    const { onClose, open } = props
    const router = useRouter()
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))

    const handlePathChange = () => {
        if (open) {
            onClose?.()
        }
    }
    // const handelMoveScroll = async () => {
    //     await onClose()
    //     await onMoveScroll()
    // }

    // const handelMoveScrollWrite = async () => {
    //     await onClose()
    //     await onMoveScrollWrite()
    // }

    const handleOpenLoginDialog = () => {
        if (auth.isAuthenticated) {
            handleLogout()
        } else {
            // setOpenDialog(true)
            // TEST LOGIN STATE
            router.push('/auth/login').catch(console.error)
        }
    }

    const handleRouteDashboard = () => {
        if (auth.isAuthenticated) {
            router.push('/dashboard').catch(console.error)
        } else {
            router.push('/auth/login').catch(console.error)
        }
    }

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

    useEffect(
        handlePathChange,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router.asPath],
    )

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
        await router.push('/').catch(console.error)
    }

    return (
        <Drawer
            anchor="right"
            onClose={onClose}
            // open={!lgUp && open}
            open={open}
            PaperProps={{ sx: { width: 256 } }}
            sx={{
                zIndex: (theme) => theme.zIndex.appBar + 100,
            }}
            variant="temporary"
        >
            <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* <Button
                    onClick={handleRouteDashboard}
                    fullWidth
                    sx={{
                        mt: 1.5,
                        backgroundColor: 'error.main',
                        ':hover': {
                            color: 'error.contrastText',
                            boxShadow: '0 0 0 2px inset',
                            backgroundColor: 'error.dark',
                        },
                    }}
                    // target="_blank"
                    variant="contained"
                >
                    서비스 이용하기
                </Button> */}

                {menuCenter.map((menu, index) => {
                    return (
                        <Fragment key={`center-menu-${index}`}>
                            <NextLink href={menu.href}>
                                <Button
                                    component="a"
                                    fullWidth
                                    sx={{
                                        mt: 1.5,
                                        // backgroundColor: 'error.main',
                                        ':hover': {
                                            color: 'error.contrastText',
                                            boxShadow: '0 0 0 2px inset',
                                            backgroundColor: 'error.dark',
                                        },
                                    }}
                                    // target="_blank"
                                    variant="text"
                                >
                                    {menu.title}
                                </Button>
                            </NextLink>
                            <Divider sx={{ width: '100%', mt: 1 }} />
                        </Fragment>
                    )
                })}

                <Box sx={{ mt: 1 }} />

                {auth.isAuthenticated && (
                    <>
                        {user?.status == 3 && (
                            <Button
                                onClick={() => router.push('/ws/manager')}
                                fullWidth
                                sx={{
                                    mt: 1.5,
                                    color: 'primary.main',
                                }}
                                variant="outlined"
                                startIcon={<HistoryEduIcon fontSize="medium" />}
                            >
                                설문지 관리
                            </Button>
                        )}
                        <Button
                            onClick={() => router.push('/ws/mypage')}
                            fullWidth
                            sx={{
                                mt: 1.5,
                                color: 'primary.main',
                            }}
                            variant="outlined"
                            startIcon={<AccountCircleIcon fontSize="medium" />}
                        >
                            마이페이지
                        </Button>
                    </>
                )}
                {user?.mode >= 2 && (
                    <Button
                        onClick={() => router.push('/adm')}
                        fullWidth
                        sx={{
                            mt: 1.5,
                            color: 'primary.main',
                        }}
                        variant="outlined"
                        startIcon={<AdminPanelSettingsIcon fontSize="medium" />}
                    >
                        관리자 모드
                    </Button>
                )}

                <Button
                    onClick={handleOpenLoginDialog}
                    fullWidth
                    sx={{
                        mt: 1.5,
                        // backgroundColor: 'error.main',
                        ':hover': {
                            color: 'error.contrastText',
                            boxShadow: '0 0 0 2px inset',
                            backgroundColor: 'error.dark',
                        },
                    }}
                    // target="_blank"
                    variant="outlined"
                >
                    {auth.isAuthenticated ? '로그아웃' : '로그인/회원가입'}
                </Button>

                <Box sx={{ flexGrow: 1 }} />

                {/* <Divider sx={{ width: '100%', my: 3 }} /> */}

                {/* <NextLink href={`/panel`}>
                    <Button
                        component="a"
                        fullWidth
                        sx={{
                            mt: 1.5,
                            backgroundColor: 'error.main',
                            ':hover': {
                                color: 'error.contrastText',
                                boxShadow: '0 0 0 2px inset',
                                backgroundColor: 'error.dark',
                            },
                        }}
                        // target="_blank"
                        variant="contained"
                    >
                        패널 커뮤니티
                    </Button>
                </NextLink> */}
                {/* <Divider sx={{ width: '100%', my: 3 }} /> */}
                <Box sx={{ mb: 10 }} />
            </Box>
        </Drawer>
    )
}

MainSidebar.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
}
