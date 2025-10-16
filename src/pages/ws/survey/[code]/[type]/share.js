import { useEffect, useState, useRef } from 'react'
import NextLink from 'next/link'
import Head from 'next/head'
import { debounce, throttle } from 'lodash'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { AuthGuard } from '@components/auth/auth-guard'

//ELEMENT
const PAGE_TITLE = '설문지 배포하기'

/*Improt Layouts*/
import LayoutWithServiceMenu from '@layouts/ws/layout-with-service-menu'
import LayoutSurveyProgressMenu from '@layouts/ws/layout-survey-progress-menu'
/*Import Components*/
import ShareDistributeType from '@components/survey/share/share-distribute-type'
import ShareTypePhone from '@components/survey/share/share-type-phone'
import ShareTypeEmail from '@components/survey/share/share-type-email'
import ShareTypeUrl from '@components/survey/share/share-type-url'

/* Survey Schema */
import { sendContactForm } from '@schema/element-schema'

/* getServerSideProps */
import { getServerSideProps } from '@components/survey/get-survey-data'
export { getServerSideProps }

const Survey_Share = (props) => {
    const { user } = useAuth()
    /*Router*/
    const router = useRouter()
    // Path Check
    const { asPath, pathname } = router // asPath = /realdata , pathname = /[code]
    // Param Check
    const { code, type } = router.query

    if (code == null || code == undefined) {
        router.push('/ws/manager').catch(console.error)
    }
    /* */

    /* getServerSideProps */
    const { surveyDataFromDB, editMode } = props
    const [routingCheck, setRoutingCheck] = useState(false)
    useEffect(() => {
        if (surveyDataFromDB !== null && (surveyDataFromDB.UserCode.data && user?.code.data && surveyDataFromDB.UserCode.data.toString() !== user?.code.data.toString())) {
            router.push('/ws/manager').catch(console.error)
        } else {
            setRoutingCheck(true)
        }
    }, [user])
    const [sendContactLoadData, setSendContactLoadData] = useState(surveyDataFromDB !== null ? JSON.parse(surveyDataFromDB?.sendContact) : surveyDataFromDB)
    /* */

    /**
     * Routing Type
     * 설문조사 종류에 따라서
     *  1. 온라인 설문조사 t = nml
     *  2. 커스텀 설문조사 t = cnvt
     */

    /**배포관련 데이터 관리 */
    /* Selected Distibute Type */
    const [selectDistribute, setSelectDistribute] = useState(3) // 0 : MMS / 1 : KAKAO / 2 : EMAIL / 3 : URL
    /* Contact List */
    const [phoneNumberArrayList, setPhoneNumberArrayList] = useState([])
    const [emailArrayList, setEmailArrayList] = useState([])

    /**
     *
     * 배포 데이터 초기 데이터 반영
     *
     */
    const CONTACT_CODE = `svct-${code}`
    useEffect(() => {
        if (!router.isReady) {
            return
        }
        let contactSessionStorageData = globalThis.sessionStorage.getItem(CONTACT_CODE)
        if (contactSessionStorageData === undefined || contactSessionStorageData === null) {
            //신규 설정
            globalThis.sessionStorage.setItem(CONTACT_CODE, JSON.stringify(sendContactForm))
            if (sendContactLoadData) {
                //session storage에는 없지만, 저장된 데이터가 서버에 있으면 세팅
                setSelectDistribute(sendContactLoadData.sendType ?? 3)
                setPhoneNumberArrayList(sendContactLoadData.phoneNumbers ?? [])
                setEmailArrayList(sendContactLoadData.emails ?? [])
            }
        } else {
            let jsonConvertSessionStorageData = JSON.parse(contactSessionStorageData)
            //이미 로딩되어진 global session stroage의 데이터를 받아와서 세팅
            setSelectDistribute(jsonConvertSessionStorageData.sendType)
            setPhoneNumberArrayList(jsonConvertSessionStorageData.phoneNumbers)
            setEmailArrayList(jsonConvertSessionStorageData.emails)
        }
    }, [router.isReady])

    /**
     *
     *
     * 발송 방법 및 연락처 데이터 수정시 Session Storage 반영
     *
     */

    /* 1. 발송 타입(sendType) 수정시 세션 반영 */
    const updateSendType = useRef(
        throttle((selectDistribute) => {
            let contactSessionStorageData = globalThis.sessionStorage.getItem(CONTACT_CODE)
            if (contactSessionStorageData !== undefined && contactSessionStorageData !== null) {
                let jsonConvertSessionStorageData = JSON.parse(contactSessionStorageData)
                jsonConvertSessionStorageData.sendType = selectDistribute
                globalThis.sessionStorage.setItem(CONTACT_CODE, JSON.stringify(jsonConvertSessionStorageData))
            }
        }, 1000),
    )
    useEffect(() => updateSendType.current(selectDistribute), [selectDistribute])

    /* 2. 연락처 정보(phoneNumbers) 수정시 세션 반영 */
    const updatePhonenNumbers = useRef(
        throttle((phoneNumberArrayList) => {
            let contactSessionStorageData = globalThis.sessionStorage.getItem(CONTACT_CODE)
            if (contactSessionStorageData !== undefined && contactSessionStorageData !== null) {
                let jsonConvertSessionStorageData = JSON.parse(contactSessionStorageData)
                jsonConvertSessionStorageData.phoneNumbers = phoneNumberArrayList
                globalThis.sessionStorage.setItem(CONTACT_CODE, JSON.stringify(jsonConvertSessionStorageData))
            }
        }, 1000),
    )
    useEffect(() => updatePhonenNumbers.current(phoneNumberArrayList), [phoneNumberArrayList])

    /* 3. 이메일 정보(emails) 수정시 세션 반영 */
    const updateEmails = useRef(
        throttle((emailArrayList) => {
            let contactSessionStorageData = globalThis.sessionStorage.getItem(CONTACT_CODE)
            if (contactSessionStorageData !== undefined && contactSessionStorageData !== null) {
                let jsonConvertSessionStorageData = JSON.parse(contactSessionStorageData)
                jsonConvertSessionStorageData.emails = emailArrayList
                globalThis.sessionStorage.setItem(CONTACT_CODE, JSON.stringify(jsonConvertSessionStorageData))
            }
        }, 1000),
    )
    useEffect(() => updateEmails.current(emailArrayList), [emailArrayList])

    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 인공지능 기반 건축설계 자동화 기술개발 연구단</title>
            </Head>
            {routingCheck && (
                <LayoutSurveyProgressMenu editMode={false}>
                    {/* 전체 배경 */}
                    <Box
                        component="main"
                        sx={{
                            minHeight: '100vh',
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
                            component="main"
                            maxWidth="md"
                            sx={{
                                flexGrow: 1,
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            <Card elevation={12} sx={{ borderRadius: 2, p: { xs: 2, sm: 4 } }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <ShareDistributeType selectDistribute={selectDistribute} setSelectDistribute={setSelectDistribute} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {(selectDistribute === 0 || selectDistribute === 1) && (
                                            <ShareTypePhone
                                                selectDistribute={selectDistribute}
                                                setSelectDistribute={setSelectDistribute}
                                                surveyDataFromDB={surveyDataFromDB}
                                                phoneNumberArrayList={phoneNumberArrayList}
                                                setPhoneNumberArrayList={setPhoneNumberArrayList}
                                            />
                                        )}
                                        {selectDistribute === 2 && (
                                            <ShareTypeEmail
                                                selectDistribute={selectDistribute}
                                                setSelectDistribute={setSelectDistribute}
                                                surveyDataFromDB={surveyDataFromDB}
                                                emailArrayList={emailArrayList}
                                                setEmailArrayList={setEmailArrayList}
                                            />
                                        )}
                                        {selectDistribute === 3 && <ShareTypeUrl />}
                                    </Grid>
                                </Grid>
                            </Card>
                        </Container>
                    </Box>
                </LayoutSurveyProgressMenu>
            )}
        </>
    )
}

Survey_Share.getLayout = (page) => (
    <AuthGuard>
        <LayoutWithServiceMenu>{page}</LayoutWithServiceMenu>
    </AuthGuard>
)

export default Survey_Share