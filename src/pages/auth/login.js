import { useEffect } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Card, Container, Divider, Link, Typography, Button } from '@mui/material'
import { useSettings } from '@hooks/use-settings'
import { Logo } from '@components/layout/logo'
// import { AuthBanner } from '../../components/authentication/auth-banner'
import { JWTLogin } from '@components/auth/jwt-login-email'
import { GuestGuard } from '@components/auth/guest-guard'
import { useAuth } from '@hooks/use-auth'
// import { gtm } from '../../lib/gtm'

/* Language */
import { useTranslation } from 'react-i18next'

/* Icons */
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const Login = () => {
    const router = useRouter()
    const { platform } = useAuth()
    const { disableGuard } = router.query
    const { t } = useTranslation()

    // useEffect(() => {
    //     gtm.push({ event: 'page_view' })
    // }, [])

    return (
        <>
            <Head>
                <title>{t('로그인')} | Smart Survey Maker</title>
                <meta name="description" content="Smart Survey Maker에 로그인하여 혁신적인 설문 제작 서비스를 이용해보세요." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/ico/favicon.png" />
            </Head>

            {/* 전체 배경 */}
            <Box
                component="main"
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
                            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.2) 0%, transparent 50%)
                        `,
                        pointerEvents: 'none',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        right: '-20%',
                        width: '100%',
                        height: '200%',
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
                        transform: 'rotate(15deg)',
                        animation: 'shimmer 8s ease-in-out infinite',
                        pointerEvents: 'none',
                    },
                    '@keyframes shimmer': {
                        '0%, 100%': {
                            transform: 'rotate(15deg) translateX(-100%)',
                            opacity: 0,
                        },
                        '50%': {
                            transform: 'rotate(15deg) translateX(100%)',
                            opacity: 1,
                        },
                    },
                    '@keyframes fadeInUp': {
                        from: {
                            opacity: 0,
                            transform: 'translateY(30px)',
                        },
                        to: {
                            opacity: 1,
                            transform: 'translateY(0)',
                        },
                    },
                }}
            >
                {/* 상단 헤더 - 흰색 배경으로 변경 */}
                <Box 
                    sx={{ 
                        px: 0, 
                        py: 0, 
                        height: '80px', 
                        position: 'fixed', 
                        top: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        width: '100%', 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        flexDirection: 'row', 
                        alignItems: 'center',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Container 
                        maxWidth="lg" 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: '100%',
                        }}
                    >
                        {/* 홈으로 가기 버튼 */}
                        <NextLink href="/" passHref>
                            <Button
                                component="a"
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                sx={{
                                    borderColor: 'rgba(102, 126, 234, 0.3)',
                                    color: '#667eea',
                                    borderRadius: '12px',
                                    px: 3,
                                    py: 1.5,
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: '#667eea',
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        transform: 'translateY(-1px)',
                                    },
                                }}
                            >
                                홈으로
                            </Button>
                        </NextLink>

                        {/* 로고 - 중앙 */}
                        <NextLink href="/" passHref>
                            <Box
                                component="a"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    position: 'absolute',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    '&:hover': {
                                        transform: 'translateX(-50%) scale(1.05)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                                    }}
                                >
                                    <img 
                                        alt="Survey Logo" 
                                        src="/ico/favicon.png" 
                                        width={26} 
                                        height={26}
                                    />
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Smart Survey
                                </Typography>
                            </Box>
                        </NextLink>

                        {/* 로그인 텍스트 */}
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: '#667eea', 
                                fontSize: '1rem', 
                                fontWeight: 600,
                                display: { xs: 'none', sm: 'block' },
                            }}
                        >
                            {t('로그인')}
                        </Typography>
                    </Container>
                </Box>

                {/* 메인 컨테이너 */}
                <Container
                    maxWidth="sm"
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        py: {
                            xs: '120px',
                            md: '140px',
                        },
                        mt: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 'calc(100vh - 80px)',
                    }}
                >
                    {/* 로그인 카드 */}
                    <Card 
                        elevation={0}
                        sx={{ 
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '32px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            overflow: 'visible',
                            width: '100%',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 35px 70px rgba(0, 0, 0, 0.15)',
                            },
                            p: { xs: 3, md: 5 },
                            animation: 'fadeInUp 0.8s ease-out'
                        }}
                    >
                        {/* 로고 및 헤더 */}
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                mb: 4,
                            }}
                        >
                            <NextLink href="/" passHref>
                                <Box
                                    component="a"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        mb: 3,
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '16px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                                        }}
                                    >
                                        <img 
                                            alt="Survey Logo" 
                                            src="/ico/favicon.png" 
                                            width={32} 
                                            height={32}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Smart Survey
                                    </Typography>
                                </Box>
                            </NextLink>

                            <Typography 
                                variant="h4" 
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    mb: 1,
                                }}
                            >
                                {t('로그인')}
                            </Typography>
                            
                            <Typography 
                                variant="body1" 
                                sx={{
                                    color: 'text.secondary',
                                    textAlign: 'center',
                                    maxWidth: 300,
                                }}
                            >
                                스마트 설문 플랫폼에 오신 것을 환영합니다
                            </Typography>
                        </Box>

                        {/* 로그인 폼 */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                mt: 3,
                            }}
                        >
                            {platform === 'JWT' && <JWTLogin />}
                        </Box>

                        {/* 구분선 */}
                        <Divider 
                            sx={{ 
                                my: 5,
                                background: 'rgba(102, 126, 234, 0.1)',
                                height: '1px',
                            }} 
                        />

                        {/* 하단 링크들 */}
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    flexDirection: 'row',
                                    gap: 2,
                                }}
                            >
                                <NextLink 
                                    href={disableGuard ? `/auth/register?disableGuard=${disableGuard}` : '/auth/register'} 
                                    passHref
                                >
                                    <Link 
                                        color="textSecondary" 
                                        variant="body2"
                                        sx={{
                                            color: '#667eea',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                color: '#5a67d8',
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        ✨ 회원가입
                                    </Link>
                                </NextLink>
                                
                                <Typography 
                                    sx={{ 
                                        color: 'text.secondary', 
                                        fontWeight: '400',
                                        opacity: 0.5,
                                    }}
                                >
                                    |
                                </Typography>
                                
                                <NextLink 
                                    href={disableGuard ? `/auth/findpsswd?disableGuard=${disableGuard}` : '/auth/findpsswd'} 
                                    passHref
                                >
                                    <Link 
                                        color="textSecondary" 
                                        variant="body2"
                                        sx={{
                                            color: '#667eea',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                color: '#5a67d8',
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        🔐 비밀번호 찾기
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography 
                                variant="body2" 
                                sx={{
                                    color: 'text.secondary',
                                    textAlign: 'center',
                                    opacity: 0.8,
                                    mt: 2,
                                }}
                            >
                                계정이 없으신가요?{' '}
                                <NextLink 
                                    href={disableGuard ? `/auth/register?disableGuard=${disableGuard}` : '/auth/register'} 
                                    passHref
                                >
                                    <Link
                                        component="span"
                                        sx={{
                                            color: '#667eea',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        지금 가입하기
                                    </Link>
                                </NextLink>
                            </Typography>
                        </Box>
                    </Card>
                </Container>

                {/* 배경 장식 요소들 */}
                <Box
                    sx={{
                        position: 'fixed',
                        top: '15%',
                        left: '10%',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        animation: 'float 4s ease-in-out infinite',
                        zIndex: 0,
                        display: { xs: 'none', md: 'block' },
                        '@keyframes float': {
                            '0%, 100%': {
                                transform: 'translateY(0px)',
                            },
                            '50%': {
                                transform: 'translateY(-15px)',
                            },
                        },
                    }}
                />
                <Box
                    sx={{
                        position: 'fixed',
                        top: '25%',
                        right: '15%',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(240, 147, 251, 0.2)',
                        animation: 'float 3s ease-in-out 1s infinite',
                        zIndex: 0,
                        display: { xs: 'none', md: 'block' },
                    }}
                />
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: '20%',
                        left: '20%',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        animation: 'float 5s ease-in-out 2s infinite',
                        zIndex: 0,
                        display: { xs: 'none', md: 'block' },
                    }}
                />
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: '15%',
                        right: '10%',
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'rgba(118, 75, 162, 0.15)',
                        animation: 'float 4s ease-in-out 3s infinite',
                        zIndex: 0,
                        display: { xs: 'none', md: 'block' },
                    }}
                />
            </Box>
        </>
    )
}

Login.getLayout = (page) => <GuestGuard>{page}</GuestGuard>

export default Login