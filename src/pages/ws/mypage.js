import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

/*MUI Element*/
import { Box, Button, Card, CardContent, Container, Divider, Grid, Tabs, Tab, Typography } from '@mui/material'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { AuthGuard } from '@components/auth/auth-guard'

/*Improt Layouts*/
import LayoutWithDefaultMenu from '@layouts/ws/layout-with-default-menu'

/*Import Components*/
import { AccountGeneralSettings } from '@components/mypage/account-general-setting'

//ELEMENT
const PAGE_TITLE = '내정보'

//Tabs Contents
const tabs = [
    { label: '계정 정보', value: 'account' },
    // { label: '이용 서비스', value: 'billing' },
]

const Mypage = () => {
    /* Router */
    const router = useRouter()
    const { selected } = router.query

    /* State Management */
    const [currentTab, setCurrentTab] = useState(selected || 'account')

    /* Event Handlers */
    const handleTabsChange = (event, value) => {
        setCurrentTab(value)
    }

    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 인공지능 기반 건축설계 자동화 기술개발 연구단</title>
            </Head>
            {/* 전체 배경 */}
            <Box
                component="main"
                sx={{
                    minHeight: 'calc(100vh - 64px)', // Adjust height for default layout
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    py: 8,
                    overflow: 'auto',
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
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        flexGrow: 1,
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <Card elevation={12} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                            <Box sx={{ mb: 4 }}>
                                <Grid container justifyContent="space-between" spacing={3}>
                                    <Grid item>
                                        <Typography variant="h4">내정보</Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Tabs indicatorColor="primary" onChange={handleTabsChange} scrollButtons="auto" textColor="primary" value={currentTab} variant="scrollable">
                                {tabs.map((tab) => (
                                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                                ))}
                            </Tabs>
                            <Divider sx={{ mb: 3 }} />
                            {currentTab === 'account' && <AccountGeneralSettings />}
                            {/* {currentTab === 'billing' && <PlanSelect />} */}
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </>
    )
}

Mypage.getLayout = (page) => (
    <AuthGuard>
        <LayoutWithDefaultMenu>{page}</LayoutWithDefaultMenu>
    </AuthGuard>
)

export default Mypage