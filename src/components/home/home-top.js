import NextLink from 'next/link'
import { Avatar, Box, Button, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { CheckCircleOutlined as CheckCircleOutlinedIcon } from '@components/icons/check-circle-outlined'
import { Users as UsersIcon } from '@components/icons/users'
import { Star as StarIcon } from '@components/icons/star'
import { Template as TemplateIcon } from '@components/icons/template'

export const HomeSectionTop = (props) => {
    const theme = useTheme()

    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                position: 'relative',
                pt: 8,
                pb: 6,
                overflow: 'hidden',
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
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
                '@keyframes float': {
                    '0%, 100%': {
                        transform: 'translateY(0px)',
                    },
                    '50%': {
                        transform: 'translateY(-10px)',
                    },
                },
                '@keyframes pulse': {
                    '0%, 100%': {
                        transform: 'scale(1)',
                    },
                    '50%': {
                        transform: 'scale(1.05)',
                    },
                },
            }}
            {...props}
        >
            <Container
                maxWidth="xl"
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                }}
            >
                {/* 메인 타이틀 */}
                <Typography
                    variant="h1"
                    sx={{
                        background: 'linear-gradient(45deg, #ffffff 30%, #f0f8ff 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 800,
                        fontSize: {
                            xs: '3rem',
                            sm: '4rem',
                            md: '5rem',
                            lg: '6rem',
                        },
                        letterSpacing: '0.02em',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        animation: 'fadeInUp 1s ease-out',
                        mb: 2,
                    }}
                >
                    SURVEY
                </Typography>
                
                {/* 서브 타이틀 */}
                <Typography
                    variant="h4"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        // fontWeight: 300,
                        fontWeight: 400,
                        fontSize: {
                            xs: '1.5rem',
                            sm: '2rem',
                            // md: '2.5rem',
                            md: '2.0rem',
                        },
                        maxWidth: 1200,
                        lineHeight: 1.6,
                        animation: 'fadeInUp 1s ease-out 0.3s both',
                        mb: 1,
                    }}
                >
                    POE (거주 후 평가) post occupancy evaluation
                </Typography>

                {/* 설명 텍스트 */}
                <Typography
                    variant="h6"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: 400,
                        fontSize: {
                            xs: '1rem',
                            sm: '1.2rem',
                        },
                        maxWidth: 500,
                        lineHeight: 1.5,
                        animation: 'fadeInUp 1s ease-out 0.5s both',
                        mb: 4,
                    }}
                >
                    혁신적인 설문조사 자동화 솔루션
                </Typography>

                {/* 기능 카드들 */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: { xs: 1.5, sm: 2 },
                        mt: 4,
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        animation: 'fadeInUp 1s ease-out 0.6s both',
                        maxWidth: 800,
                    }}
                >
                    {[
                        { 
                            icon: <CheckCircleOutlinedIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem' }, color: '#ffffff' }} />, 
                            text: '간편한 제작',
                            description: '클릭 몇 번으로 완성'
                        },
                        { 
                            icon: <UsersIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem' }, color: '#ffffff' }} />, 
                            text: '실시간 분석',
                            description: '즉시 결과 확인'
                        },
                        { 
                            icon: <StarIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem' }, color: '#ffffff' }} />, 
                            text: '프리미엄 기능',
                            description: '고급 분석 도구'
                        },
                        { 
                            icon: <TemplateIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem' }, color: '#ffffff' }} />, 
                            text: '다양한 템플릿',
                            description: '맞춤형 디자인'
                        },
                    ].map((feature, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'center',
                                gap: { xs: 1, sm: 1.5 },
                                px: { xs: 2, sm: 3 },
                                py: { xs: 2, sm: 1.5 },
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#ffffff',
                                minWidth: { xs: '140px', sm: '160px' },
                                textAlign: { xs: 'center', sm: 'left' },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                animation: `float 3s ease-in-out ${index * 0.5}s infinite`,
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    transform: 'translateY(-5px) scale(1.05)',
                                    boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
                                    animation: 'none',
                                },
                            }}
                        >
                            <Box 
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: { xs: '40px', sm: 'auto' },
                                    height: { xs: '40px', sm: 'auto' },
                                    color: '#ffffff',
                                }}
                            >
                                {feature.icon}
                            </Box>
                            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                        mb: { xs: 0.5, sm: 0 },
                                        color: '#ffffff',
                                    }}
                                >
                                    {feature.text}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        opacity: 0.8,
                                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                        display: { xs: 'block', sm: 'none' },
                                        color: '#ffffff',
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* CTA 버튼 */}
                <Box
                    sx={{
                        mt: 6,
                        animation: 'fadeInUp 1s ease-out 0.8s both',
                    }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            color: '#667eea',
                            borderRadius: '50px',
                            px: 5,
                            py: 2,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            boxShadow: '0 8px 25px rgba(255, 255, 255, 0.3)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            animation: 'pulse 2s ease-in-out infinite',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 1)',
                                transform: 'translateY(-3px) scale(1.05)',
                                boxShadow: '0 15px 35px rgba(255, 255, 255, 0.4)',
                                animation: 'none',
                            },
                        }}
                        href="#survey-maker"
                    >
                        {/* 🚀 지금 시작하기 */}
                        Smart POE 설문<br/>
                        지금 시작하기
                    </Button>
                </Box>

                {/* 배경 장식 요소들 */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        animation: 'float 4s ease-in-out infinite',
                        zIndex: 0,
                        display: { xs: 'none', md: 'block' },
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: '20%',
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
                        position: 'absolute',
                        bottom: '15%',
                        left: '20%',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        animation: 'float 5s ease-in-out 2s infinite',
                        zIndex: 0,
                        display: { xs: 'none', md: 'block' },
                    }}
                />
            </Container>
        </Box>
    )
}