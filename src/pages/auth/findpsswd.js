import { useEffect } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Card, Container, Divider, Link, Typography } from '@mui/material'
import { useSettings } from '@hooks/use-settings'
import { Logo } from '@components/layout/logo'
import { JWTFindPassword } from '@components/auth/jwt-find-password'
import { GuestGuard } from '@components/auth/guest-guard'
import { useAuth } from '@hooks/use-auth'
// import { gtm } from '../../lib/gtm'

/* Language */
import { useTranslation } from 'react-i18next'

// 컴포넌트 이름은 기존 코드를 유지합니다.
const FindPasswordPage = () => {
    const router = useRouter()
    const { platform } = useAuth()
    const { disableGuard } = router.query
    const { t } = useTranslation()

    // useEffect는 기능과 관련되므로 변경하지 않습니다.
    useEffect(() => {}, [])

    return (
        <>
            <Head>
                {/* 페이지 타이틀을 서비스명에 맞게 수정합니다. */}
                <title>{t('비밀번호 찾기')} | Smart Survey</title>
            </Head>
            <Box
                component="main"
                sx={{
                    // 1. 배경색 변경 (Design Guideline: Background Color)
                    backgroundColor: '#F8F9FA',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    alignItems: 'center', // 수직 중앙 정렬
                    justifyContent: 'center', // 수평 중앙 정렬
                }}
            >
                <Container
                    maxWidth="sm"
                    sx={{
                        // 2. 레이아웃 간격 (Layout & Spacing)
                        py: {
                            xs: '60px',
                            md: '64px', // 8px 그리드 시스템에 맞춰 조정
                        },
                    }}
                >
                    {/* 3. 카드 디자인 변경 (Component: Cards) */}
                    <Card
                        elevation={0} // MUI 기본 그림자 제거
                        sx={{
                            p: '32px', // 카드 내부 여백 (Padding)
                            borderRadius: '24px', // 부드러운 인상을 위한 큰 반경
                            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.05)', // 은은하고 넓게 퍼지는 그림자
                            backgroundColor: '#FFFFFF',
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
                                <a>
                                    <Logo
                                        variant={'dark'}
                                        sx={{
                                            width: 210,
                                            height: 56,
                                        }}
                                    />
                                </a>
                            </NextLink>
                            {/* 4. 타이포그래피 변경 (Typography: Heading 2) */}
                            <Typography
                                sx={{
                                    mt: '24px', // 로고와의 간격
                                    color: '#212529', // Text (Primary)
                                    fontWeight: 700,
                                    fontSize: '32px',
                                    letterSpacing: '-0.5px',
                                    lineHeight: '1.5',
                                }}
                            >
                                {t('비밀번호 찾기')}
                            </Typography>
                             <Typography
                                sx={{
                                    mt: '8px',
                                    color: '#6C757D', // Text (Secondary)
                                    fontSize: '16px', // Body 1
                                    lineHeight: '1.6',
                                    textAlign: 'center',
                                }}
                            >
                                {t('가입하신 이메일을 입력하시면, 비밀번호 재설정 링크를 보내드립니다.')}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                flexGrow: 1,
                                mt: '32px', // 제목과의 간격
                                // 5. JWTFindPassword 내부 컴포넌트 스타일 재정의
                                // (Component: Input Fields & Buttons)
                                '& .MuiTextField-root': {
                                    '& .MuiInputLabel-root': { // 라벨 스타일
                                        fontSize: '14px',
                                        color: '#6C757D', // Text (Secondary)
                                        '&.Mui-focused': {
                                            color: '#6C63FF', // Primary
                                        },
                                    },
                                    '& .MuiOutlinedInput-root': { // 입력창 테두리
                                        borderRadius: '12px',
                                        backgroundColor: '#FFFFFF',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#DEE2E6', // Line / Border
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#6C63FF', // Hover 시 Primary
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#6C63FF', // Focus 시 Primary
                                            borderWidth: '1px',
                                        },
                                        // Focus 시 외부 광선 효과
                                        '&.Mui-focused': {
                                            boxShadow: '0 0 0 3px rgba(108, 99, 255, 0.2)',
                                        },
                                    },
                                },
                                // '인증메일 발송' 버튼 (Primary Button)
                                '& button[type="submit"]': {
                                    mt: '8px', // 입력창과의 간격
                                    width: '100%',
                                    background: 'linear-gradient(to right, #7A72F8, #F587D9)',
                                    color: '#FFFFFF',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
                                    fontWeight: 700,
                                    fontSize: '16px',
                                    py: '12px',
                                    textTransform: 'none', // MUI 기본 대문자 변환 제거
                                    '&:hover': {
                                        filter: 'brightness(1.05)',
                                        boxShadow: '0 6px 16px rgba(108, 99, 255, 0.4)',
                                    },
                                },
                            }}
                        >
                            {platform === 'JWT' && <JWTFindPassword />}
                        </Box>
                        {/* 6. 구분선 및 하단 링크 스타일 변경 */}
                        <Divider sx={{ my: '24px', borderColor: '#DEE2E6' }} />
                        <Box sx={{ textAlign: 'center' }}>
                            <NextLink href={disableGuard ? `/auth/login?disableGuard=${disableGuard}` : '/auth/login'} passHref>
                                <Link
                                    sx={{
                                        color: '#6C757D', // Text (Secondary)
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            color: '#6C63FF', // Primary
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    {t('로그인 페이지로 돌아가기')}
                                </Link>
                            </NextLink>
                        </Box>
                    </Card>
                </Container>
            </Box>
        </>
    )
}

FindPasswordPage.getLayout = (page) => <GuestGuard>{page}</GuestGuard>

export default FindPasswordPage