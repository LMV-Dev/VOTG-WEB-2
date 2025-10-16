import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import { toast } from 'react-toastify'
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography, Tooltip } from '@mui/material'
import { useAuth } from '@hooks/use-auth'
import { Menu as MenuIcon } from '@components/icons/menu'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'

const HomeSubNavbar = (props) => {
    const auth = useAuth()
    const { user, logout } = useAuth()
    const router = useRouter()
    const { onOpenSidebar } = props
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10
            setScrolled(isScrolled)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleRouteLoginLogoutControl = () => {
        if (auth.isAuthenticated) {
            handleLogout()
        } else {
            router.push('/auth/login').catch(console.error)
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            // 세션 스토리지 클리어 로직은 별도 함수로 분리하거나 유지
            await router.push('/').catch(console.error)
            toast.success('로그아웃')
        } catch (err) {
            console.error(err)
            toast.error('Unable to logout.')
        }
    }

    return (
        <>
            <AppBar
                elevation={0}
                sx={{
                    background: 'rgba(255, 255, 255, 1)',
                    backdropFilter: scrolled ? 'blur(10px)' : 'none',
                    borderBottom: scrolled ? '1px solid #DEE2E6' : '1px solid transparent',
                    boxShadow: scrolled ? '0px 8px 24px rgba(0, 0, 0, 0.05)' : 'none',
                    transition: 'all 0.3s ease-in-out',
                    color: 'text.secondary',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    width:"100vw",
                    height: '80px',
                    zIndex: (theme) => theme.zIndex.appBar,
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Toolbar
                        disableGutters
                        sx={{
                            height: '100%',
                            width: '100%',
                            minHeight: '80px !important',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {/* [수정] 왼쪽 영역: 고정 너비 할당 */}
                        <Box sx={{
                            // flex: 1 대신 고정 너비를 주어 레이아웃 틀을 안정시킵니다.
                            // 이 값은 데스크톱 버튼들이 충분히 들어갈 너비여야 합니다.
                            width: { md: 300 }, 
                            display: 'flex',
                            justifyContent: 'flex-start',
                        }}>
                            {/* 데스크톱용 버튼 그룹 */}
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                                <NextLink href="/" passHref>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        document.getElementById('survey-maker')?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                    sx={{ borderColor: '#DEE2E6', color: 'text.primary', borderRadius: '12px', fontWeight: 700 }}
                                >
                                    Make POE Survey
                                </Button>
                                </NextLink>
                                <NextLink href="/about" passHref>
                                    <Button
                                        component="a"
                                        variant="outlined"
                                        sx={{ borderColor: '#DEE2E6', color: 'text.primary', borderRadius: '12px', fontWeight: 700 }}
                                    >
                                        About
                                    </Button>
                                </NextLink>
                            </Box>

                            {/* 모바일용 메뉴 버튼 */}
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <IconButton onClick={onOpenSidebar} sx={{ border: '1px solid #DEE2E6', borderRadius: '12px' }}>
                                    <MenuIcon fontSize="medium" />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* [수정] 중앙 로고 영역: 남는 공간을 모두 차지하여 자동 중앙 정렬 */}
                        <Box sx={{
                            flexGrow: 1, // 이 속성이 로고를 항상 중앙에 위치시킵니다.
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                            <NextLink href="/" passHref>
                                <Box
                                    component="a"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        textDecoration: 'none',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 45, height: 45, borderRadius: '12px',
                                            background: 'linear-gradient(to right, #7A72F8, #F587D9)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
                                        }}
                                    >
                                        <img alt="Smart Survey Logo" src="/ico/favicon.png" width={26} height={26} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '22px', background: 'linear-gradient(to right, #7A72F8, #F587D9)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: { xs: 'none', sm: 'block' } }}>
                                        Smart Survey
                                    </Typography>
                                </Box>
                            </NextLink>
                        </Box>

                        {/* [수정] 오른쪽 영역: 고정 너비 할당 */}
                        <Box sx={{
                            // 왼쪽과 동일한 너비를 주어 완벽한 대칭을 이룹니다.
                            width: { md: 250 },
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 1,
                        }}>
                            {/* 데스크톱/로그인 상태에 따른 버튼들 */}
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                                {user?.mode >= 2 && (
                                    <Tooltip title="관리자 모드">
                                        <IconButton onClick={() => router.push('/adm')}><AdminPanelSettingsIcon /></IconButton>
                                    </Tooltip>
                                )}
                                {auth.isAuthenticated ? (
                                    <>
                                        {user?.status === 3 && (
                                            <Tooltip title="설문지 관리">
                                                <IconButton onClick={() => router.push('/ws/manager')}><HistoryEduIcon /></IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title="마이페이지">
                                            <IconButton onClick={() => router.push('/ws/mypage')}><AccountCircleIcon /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="로그아웃">
                                            <IconButton onClick={handleRouteLoginLogoutControl}><LogoutIcon /></IconButton>
                                        </Tooltip>
                                    </>
                                ) : (
                                    <Button onClick={handleRouteLoginLogoutControl} variant="contained" sx={{ background: 'linear-gradient(to right, #7A72F8, #F587D9)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)', color: 'white', fontWeight: 700 }}>
                                        로그인
                                    </Button>
                                )}
                            </Box>

                            {/* 모바일용 아이콘 버튼 */}
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <Tooltip title={auth.isAuthenticated ? "마이페이지" : "로그인"}>
                                    <IconButton onClick={() => auth.isAuthenticated ? router.push('/ws/mypage') : handleRouteLoginLogoutControl()}>
                                        {auth.isAuthenticated ? <AccountCircleIcon /> : <LoginIcon />}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    )
}

HomeSubNavbar.propTypes = {
    onOpenSidebar: PropTypes.func,
}

export default HomeSubNavbar