import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Head from 'next/head'
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Tabs, Tab, MenuItem, TextField, Typography, IconButton } from '@mui/material'
import { AuthGuard } from '@components/auth/auth-guard'

import { useAuth } from '@hooks/use-auth'
import { useMounted } from '@hooks/use-mounted'
import axios from 'axios'
import { UuidTool } from 'uuid-tool'

/* Mui Icon */
import PostAddIcon from '@mui/icons-material/PostAdd'
/* Icons */
import { ArrowRight as ArrowRightIcon } from '@components/icons/arrow-right'
import { Briefcase as BriefcaseIcon } from '@components/icons/briefcase'
import { Download as DownloadIcon } from '@components/icons/download'
import { ExternalLink as ExternalLinkIcon } from '@components/icons/external-link'
import { InformationCircleOutlined as InformationCircleOutlinedIcon } from '@components/icons/information-circle-outlined'
import { Reports as ReportsIcon } from '@components/icons/reports'
import { Users as UsersIcon } from '@components/icons/users'
/* Icons - New*/
import { IconCreateDragDrop } from '@public/votg/IconCreateDragDrop'
import { IconCreateOnlineForm } from '@public/votg/IconCreateOnlineForm'

// import { gtm } from '../../lib/gtm'

/*Improt Layouts*/
import LayoutWithServiceMenu from '@layouts/ws/layout-with-service-menu'

/* Component*/
import AccountList from '@components/adm/account-list'
import PayResultList from '@components/adm/pay-result-list'
import PanelList from '@components/adm/panel-list'

//Popup

//Tabs Contents
const tabs = [
    { label: '계정 리스트', value: 'account' },
    { label: '서비스 결제 내역', value: 'billing' },
    { label: '패널 가입자 리스트', value: 'panel' },
]

const AdmPanel = () => {
    const isMounted = useMounted()
    const router = useRouter()
    const { user } = useAuth()
    const { selected } = router.query

    useEffect(() => {
        // console.log('adminPanel', user?.mode >= 2)
        if (!router.isReady) {
            return
        }
        if (user?.mode < 2) router.push(`/`).catch(console.error)
    }, [user])

    //Tab
    const [currentTab, setCurrentTab] = useState(selected || 'account')

    //Tab
    const handleTabsChange = (event, value) => {
        setCurrentTab(value)
    }

    return (
        <>
            <Head>
                <title>관리자 패널 | 뷰즈온더고 :: Views On the Go</title>
            </Head>
            {user?.mode >= 2 && (
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        py: 8,
                        background: '#fff',
                    }}
                >
                    <Container maxWidth="xl" sx={{ px: { sm: 10, xs: 2 } }}>
                        <Box sx={{ mb: 4 }}>
                            <Grid container justifyContent="space-between" spacing={3}>
                                <Grid item>
                                    <Typography variant="h4">관리자 패널</Typography>
                                    {/* <SurveyListTable data={planExample} /> */}
                                </Grid>
                            </Grid>
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: 'background.white',
                                marginTop: '30px',
                            }}
                        >
                            <Divider sx={{ mb: 3 }} />
                            <Tabs indicatorColor="primary" onChange={handleTabsChange} scrollButtons="auto" textColor="primary" value={currentTab} variant="scrollable" sx={{ mt: 3 }}>
                                {tabs.map((tab) => (
                                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                                ))}
                            </Tabs>

                            {currentTab === tabs[0].value && <AccountList />}
                            {currentTab === tabs[1].value && <PayResultList />}
                            {currentTab === tabs[2].value && <PanelList />}
                        </Box>
                    </Container>
                </Box>
            )}
        </>
    )
}

AdmPanel.getLayout = (page) => (
    <AuthGuard>
        <LayoutWithServiceMenu>{page}</LayoutWithServiceMenu>
    </AuthGuard>
)

export default AdmPanel
