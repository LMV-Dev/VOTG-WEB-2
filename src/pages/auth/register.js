import { useEffect } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Card, Container, Divider, Link, Typography } from '@mui/material'
import { JWTRegister } from '@components/auth/jwt-register' // 기능 컴포넌트는 그대로 사용
import { GuestGuard } from '@components/auth/guest-guard'
import { useAuth } from '@hooks/use-auth'
import { useTranslation } from 'react-i18next'

// 가이드라인에 맞는 아이콘을 사용합니다. (예: Feather Icons 또는 Heroicons 스타일)
// 여기서는 간단한 SVG로 로고를 표현했습니다.
const SmartSurveyLogo = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="48" y2="48">
                <stop stopColor="#7A72F8"/>
                <stop offset="1" stopColor="#F587D9"/>
            </linearGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#logoGradient)"/>
        <path d="M15 24H33" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M15 31H27" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M15 17H22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
);


const Register = () => {
    const router = useRouter()
    const { platform } = useAuth()
    const { disableGuard } = router.query
    const { t } = useTranslation()

    // 기능과 관련된 useEffect는 변경하지 않습니다.
    useEffect(() => {}, [])

    return (
        <>
            <Head>
                {/* 페이지 타이틀은 유지합니다. */}
                <title>{t('회원가입')} | Smart Survey</title>
            </Head>
            <Box
                component="main"
                sx={{
                    // [가이드라인 2] Background Color: #F8F9FA
                    backgroundColor: 'background.default', // #F8F9FA
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // [가이드라인 4] Layout & Spacing: 8px 그리드 시스템
                    py: { xs: 4, md: 8 }, // 32px, 64px
                }}
            >
                <Container
                    maxWidth="sm"
                    sx={{
                        // 콘텐츠 최대 너비는 1200px이지만, 로그인/회원가입은 sm(600px)이 적절합니다.
                        px: { xs: 3, md: 0 }, // 모바일에서는 좌우 여백 추가
                    }}
                >
                    {/* [가이드라인 5-B] Cards */}
                    <Card
                        elevation={0} // MUI 기본 그림자 제거
                        sx={{
                            p: { xs: 3, md: 4 }, // 내부 여백 24px ~ 32px
                            borderRadius: '24px', // 부드러운 인상을 위한 큰 반경 (16px ~ 24px)
                            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.05)', // 은은하고 넓게 퍼지는 그림자
                            backgroundColor: 'common.white', // #FFFFFF
                        }}
                    >
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <NextLink href="/" passHref>
                                <Box component="a" sx={{ textDecoration: 'none' }}>
                                    <SmartSurveyLogo />
                                </Box>
                            </NextLink>
                            
                            {/* [가이드라인 3] Typography: Heading 2 */}
                            <Typography
                                variant="h2"
                                sx={{
                                    mt: 3, // 24px 간격
                                    color: 'text.primary', // #212529
                                    fontWeight: 700,
                                    fontSize: { xs: '28px', md: '32px' }, // 반응형 폰트 사이즈
                                    letterSpacing: '-0.5px',
                                    lineHeight: '1.5',
                                }}
                            >
                                {t('새로운 계정 만들기')}
                            </Typography>

                            {/* [가이드라인 3] Typography: Body 1 */}
                            <Typography
                                sx={{
                                    mt: 1, // 8px 간격
                                    color: 'text.secondary', // #6C757D
                                    fontSize: '16px',
                                    lineHeight: '1.6',
                                    textAlign: 'center',
                                }}
                            >
                                {t('Smart Survey와 함께 설문을 시작해보세요.')}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                flexGrow: 1,
                                mt: 4, // 32px 간격
                                // [가이드라인 5-C] Input Fields & [5-A] Buttons 스타일 재정의
                                // 자식 컴포넌트(JWTRegister)의 스타일을 부모에서 제어합니다.
                                '& .MuiTextField-root': {
                                    '& .MuiInputLabel-root': { // 라벨 스타일 (Body 2)
                                        fontSize: '14px',
                                        color: 'text.secondary', // #6C757D
                                        '&.Mui-focused': {
                                            color: 'primary.main', // #6C63FF
                                        },
                                    },
                                    '& .MuiOutlinedInput-root': { // 입력창 테두리
                                        borderRadius: '12px',
                                        backgroundColor: 'common.white',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'divider', // #DEE2E6
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main', // Hover 시 Primary
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main', // Focus 시 Primary
                                            borderWidth: '1px',
                                        },
                                        // Focus 시 외부 광선 효과
                                        '&.Mui-focused': {
                                            boxShadow: '0 0 0 3px rgba(108, 99, 255, 0.2)',
                                        },
                                    },
                                },
                                // 회원가입 버튼 (Primary Button)
                                '& button[type="submit"]': {
                                    mt: 1, // 8px 간격
                                    width: '100%',
                                    background: 'linear-gradient(to right, #7A72F8, #F587D9)',
                                    color: 'common.white',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
                                    fontWeight: 700,
                                    fontSize: '16px',
                                    py: '12px',
                                    textTransform: 'none', // MUI 기본 대문자 변환 제거
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        filter: 'brightness(1.05)',
                                        boxShadow: '0 6px 16px rgba(108, 99, 255, 0.4)',
                                        transform: 'translateY(-2px)',
                                    },
                                },
                            }}
                        >
                            {platform === 'JWT' && <JWTRegister />}
                        </Box>

                        {/* [가이드라인 2, 5] 구분선 및 하단 링크 스타일 */}
                        <Divider sx={{ my: 3, borderColor: 'divider' }} />
                        <Box sx={{ textAlign: 'center' }}>
                            <NextLink
                                href={
                                    disableGuard
                                        ? `/auth/login?disableGuard=${disableGuard}`
                                        : '/auth/login'
                                }
                                passHref
                            >
                                <Link
                                    sx={{
                                        color: 'text.secondary', // #6C757D
                                        fontSize: '14px', // Body 2
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        transition: 'color 0.2s ease-in-out',
                                        '&:hover': {
                                            color: 'primary.main', // #6C63FF
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    {t('이미 계정이 있으신가요?')} <Box component="span" sx={{ fontWeight: 700 }}>{t('로그인하기')}</Box>
                                </Link>
                            </NextLink>
                        </Box>
                    </Card>
                </Container>
            </Box>
        </>
    )
}

Register.getLayout = (page) => <GuestGuard>{page}</GuestGuard>

export default Register;