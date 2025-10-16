import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import Head from 'next/head'
import axios from 'axios'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardContent, Container, Divider, Grid, Typography } from '@mui/material'

/* MUI Icon*/
import PostAddIcon from '@mui/icons-material/PostAdd'
import ListIcon from '@mui/icons-material/List'
import DoneIcon from '@mui/icons-material/Done'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { AuthGuard } from '@components/auth/auth-guard'

//ELEMENT
const PAGE_TITLE = '설문지 관리'

/*Improt Layouts*/
import LayoutWithServiceMenu from '@layouts/ws/layout-with-service-menu'

/*Import Component*/
import SurveyCreateSelect from '@components/survey/survey-create-select'
import SurveyListTable from '@components/survey/survey-list-table'
import SurveyListTableEditable from '@components/survey/survey-list-table-editable'

/*Import Popup*/
import PopupSurveyCreate from '@components/popup/popup-survey-create'

const Page_Manager = () => {
    const { user } = useAuth()
    const router = useRouter()

    /* Session Storage Clear on Mount */
    useEffect(() => {
        globalThis.sessionStorage.clear()
    }, [])

    /* Data Fetching */
    const [surveyListData, setSurveyListData] = useState(null)

    useEffect(() => {
        if (!router.isReady) {
            return
        }
        const fetchData = async () => {
            try {
                const res = await axios.get(`https://api.koaiarchitecture.com/online/survey/list`, {
                    params: { UserCode: JSON.stringify(user?.code.data) },
                })
                if (res.data) {
                    setSurveyListData(res.data.payload)
                }
            } catch (error) {
                console.error('Failed to fetch survey list:', error)
                setSurveyListData([]) // 에러 발생 시 빈 배열로 설정하여 로딩 상태 해제
            }
        }
        fetchData()
    }, [user, router.isReady])

    /* Popup Control :: Create Survey */
    const [popup_SurveyCreate, setPopup_SurveyCreate] = useState(false)
    const handleOpenPopup_SurveyCreate = () => setPopup_SurveyCreate(true)
    const handleClosePopup_SurveyCreate = () => setPopup_SurveyCreate(false)

    /* Editable Activation Control */
    const [editableListActivation, setEditableListActivation] = useState(false)

    return (
        <>
            <PopupSurveyCreate onClose={handleClosePopup_SurveyCreate} open={popup_SurveyCreate} />
            <Head>
                <title>{PAGE_TITLE} | 인공지능 기반 건축설계 자동화 기술개발 연구단</title>
            </Head>
            {/* 전체 배경 */}
            <Box
                component="main"
                sx={{
                    minHeight: 'calc(100vh - 64px)',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center', // 로딩 스피너 중앙 정렬을 위해 center로 변경
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
                {surveyListData === null ? (
                    <CircularProgress size={50} sx={{ color: 'common.white' }} />
                ) : (
                    <Container
                        maxWidth="lg"
                        sx={{
                            flexGrow: 1,
                            position: 'relative',
                            zIndex: 1,
                            alignSelf: 'flex-start', // 컨텐츠는 상단에 정렬
                        }}
                    >
                        <Card elevation={12} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                                {/* Title Line */}
                                <Box sx={{ mb: 4 }}>
                                    <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                                        <Grid item>
                                            <Typography variant="h4">설문지 관리</Typography>
                                        </Grid>
                                        {surveyListData.length !== 0 && (
                                            <Grid item>
                                                <NextLink href={`/ws/ipaupload`} passHref>
                                                    <Button sx={{ mr: 1, mt: 1 }} variant="outlined" startIcon={<FileUploadOutlinedIcon />} color="secondary">
                                                        IPA 설문 업로드
                                                    </Button>
                                                </NextLink>
                                                <Button
                                                    sx={{ mr: 1, mt: 1 }}
                                                    onClick={() => setEditableListActivation(!editableListActivation)}
                                                    variant="outlined"
                                                    startIcon={!editableListActivation ? <ListIcon /> : <DoneIcon />}
                                                    color={!editableListActivation ? 'secondary' : 'primary'}
                                                >
                                                    {!editableListActivation ? '리스트 편집' : '편집 완료'}
                                                </Button>
                                                <Button sx={{ mt: 1 }} onClick={handleOpenPopup_SurveyCreate} variant="outlined" startIcon={<PostAddIcon />} color="secondary">
                                                    설문지 제작하기
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                {/* Content Area */}
                                {surveyListData.length === 0 ? (
                                    <SurveyCreateSelect />
                                ) : !editableListActivation ? (
                                    <SurveyListTable onlineData={surveyListData} />
                                ) : (
                                    <SurveyListTableEditable onlineData={surveyListData} />
                                )}
                            </CardContent>
                        </Card>
                    </Container>
                )}
            </Box>
        </>
    )
}

Page_Manager.getLayout = (page) => (
    <AuthGuard>
        <LayoutWithServiceMenu>{page}</LayoutWithServiceMenu>
    </AuthGuard>
)

export default Page_Manager