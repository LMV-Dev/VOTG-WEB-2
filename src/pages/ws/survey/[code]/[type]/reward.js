import { useEffect, useState, useRef } from 'react'
import NextLink from 'next/link'
import Head from 'next/head'
import { UuidTool } from 'uuid-tool'
import { debounce, throttle } from 'lodash'
import axios from 'axios'
import API from '@utils/API'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
import fetcherWithParams from '@utils/fetcherWithParams'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { AuthGuard } from '@components/auth/auth-guard'

//ELEMENT
const PAGE_TITLE = '리워드 선택'

/*Improt Layouts*/
import LayoutWithServiceMenu from '@layouts/ws/layout-with-service-menu'
import LayoutSurveyProgressMenu from '@layouts/ws/layout-survey-progress-menu'
/*Import Components*/
import RewardProductList from '@components/survey/reward/reward-product-list'
import RewardPaymentRequest from '@components/survey/reward/reward-payment-request'
import RewardAleadyBuy from '@components/survey/reward/reward-aleady-buy'

/* Survey Schema */
import { surveyForm, elementInfo, elementType, elementFunction, elementQuestions, defaultQuestion, answerType, elementReward } from '@schema/element-schema'

/* getServerSideProps */
import { getServerSideProps } from '@components/survey/get-survey-data'
export { getServerSideProps }

const Survey_Reward = (props) => {
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
        if (surveyDataFromDB !== null && surveyDataFromDB.UserCode.data.toString() !== user?.code.data.toString()) {
            router.push('/ws/manager').catch(console.error)
        } else {
            setRoutingCheck(true)
        }
    }, [user])
    // console.log(`${PAGE_TITLE} :: surveyDataFromDB`, surveyDataFromDB)
    // console.log(`${PAGE_TITLE} :: editMode`, editMode)
    const [surveyLoadData, setSurveyLoadData] = useState(surveyDataFromDB !== null ? JSON.parse(surveyDataFromDB?.survey) : surveyDataFromDB)
    /* */

    /**
     * Routing Type
     * 설문조사 종류에 따라서
     *  1. 온라인 설문조사 t = nml
     *  2. 커스텀 설문조사 t = cnvt
     */

    /* 상품 정보 */
    const [selectedReward, setSelectedReward] = useState(null)
    //
    // const [selectedCategory, setSelectedCategory] = useState(null)
    // const [selectedItem, setSelectedItem] = useState(null)
    const [orderCode, setOrderCode] = useState(`order-${UuidTool.toString(user?.code.data).replace(/-/g, '').slice(0, 24)}-${Date.now()}`)
    const [requestNumber, setRequestNumber] = useState(1)

    const handleChangeReward = (type, value) => {
        // console.log('handleChangeReward - type', type)
        // console.log('handleChangeReward - value', value)
        if (selectedReward == null) {
            setSelectedReward({
                ...elementReward,
                code: orderCode,
                count: requestNumber,
                [type]: value,
            })
        } else {
            setSelectedReward({
                ...selectedReward,
                [type]: value,
            })
        }
    }

    // useEffect(() => {
    //     console.log('selectedReward', selectedReward)
    // }, [selectedReward])

    /* 변경된 정보 반영*/
    // useEffect(() => {
    //     //scheme : elementReward
    //     let newRewardElement = {
    //         code: orderCode,
    //         category: selectedCategory,
    //         item: selectedItem,
    //         count: parseInt(requestNumber),
    //     }
    //     console.log('newRewardElement', newRewardElement)
    //     setSelectedReward(newRewardElement)
    // }, [selectedCategory, selectedItem, orderCode, requestNumber])

    /**
     *
     * 설문조사 데이터 초기 데이터 반영 :: 새로 제작 or 수정 진행
     *
     */

    const SURVEY_CODE = `svcd-${code}`
    // 1. 세션이 존재하는 경우 => 최우선으로 화면표시
    // 2. 세션이 없을경우는 2가지 경우가 생김
    // 2-1. 세션이 없음 && 데이터 베이스에도 없음 => 신규로 데이터 생성이 필요 => 세션스토리지에 더미데이터로 등록
    // 2-2. 세션이 없음 but 데이서 테이스에는 있음 => 신규로 데이터 생성 x => 데이터 베이스에 있는 데이터를 불러와 세션스토리지에 등록
    // 2-2-1. 수정이 발생함 => 원본 데이터베이스에 있는 데이터 들은 데이터베이스 원본으로 세션스토리지를 만들어 별도로 관리하여 불러올 수 있도록함
    // 2-2-2. 수정이 발생함 => 세션스토리지 메인 가지에서만 계속해서 저장
    // 2-2 => 1. 세션이 존재하는 경우 => 동일하게 최우선으로 화면 설정할 수 있도록 함.

    useEffect(() => {
        let surveySessionStorageData = globalThis.sessionStorage.getItem(SURVEY_CODE)
        // console.log('surveySessionStorageData - Init Data', surveySessionStorageData)
        if (surveySessionStorageData === undefined || surveySessionStorageData === null) {
            //신규 설정
            globalThis.sessionStorage.setItem(SURVEY_CODE, JSON.stringify(surveyForm))
            if (surveyDataFromDB !== null) {
                //session storage에는 없지만, 저장된 데이터가 서버에 있으면 세팅
                setSelectedReward(surveyLoadData?.reward)
            }
        } else {
            let jsonConvertSessionStorageData = JSON.parse(surveySessionStorageData)
            //이미 로딩되어진 global session stroage의 데이터를 받아와서 세팅
            setSelectedReward(jsonConvertSessionStorageData.reward)
        }
    }, [])

    //** 리워드 데이터를 로딩한 후 리워드 데이터가 구매했는지 여부 판단이 필요함 */

    const [rewardRequestItem, setRewardRequestItem] = useState(false)
    const [rewardRequestStatus, setRewardRequestStatus] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            const result = await API.get('payment/request/item', {
                UserCode: UuidTool.toString(user?.code.data).replace(/-/g, ''),
                orderCode: selectedReward.code,
            })
            if (result.payload !== null && result.payload !== undefined) {
                // console.log('result.payload', result.payload)
                setRewardRequestItem(result.payload)
                setRewardRequestStatus(result.payload.status === '0' ? false : result.payload.status === '1' ? 'true' : false)
            }
        }

        if (selectedReward?.code !== undefined && selectedReward?.code !== null) {
            fetchData()
        }
    }, [selectedReward])

    /**
     *
     *
     * 설문조사 데이터 수정시 Session Storage 반영
     *
     */
    /*
        const throttled = useRef(throttle((newValue) => console.log(newValue), 1000))
        useEffect(() => throttled.current(value), [value])
    */

    /* 4. 리워드  선택 정보(selectedReward) 수정시 세션 반영 */
    const updateSelectedReward = useRef(
        throttle((selectedReward) => {
            let surveySessionStorageData = globalThis.sessionStorage.getItem(SURVEY_CODE)
            // console.log('questionInfo', questionInfo)
            if (surveySessionStorageData !== undefined && surveySessionStorageData !== null) {
                //기존 데이터 로드
                let jsonConvertSessionStorageData = JSON.parse(surveySessionStorageData)
                //업데이트
                jsonConvertSessionStorageData.reward = selectedReward
                globalThis.sessionStorage.setItem(SURVEY_CODE, JSON.stringify(jsonConvertSessionStorageData))
                // console.log('surveySessionStorageData - Edit :: questionInfo ', questionInfo)
            }
        }, 1000),
    )
    useEffect(() => updateSelectedReward.current(selectedReward), [selectedReward])

    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 인공지능 기반 건축설계 자동화 기술개발 연구단</title>
            </Head>
            {routingCheck && (
                <LayoutSurveyProgressMenu editMode={editMode}>
                    <Container
                        component="main"
                        maxWidth="xl"
                        sx={{
                            flexGrow: 1,
                            py: 5,
                            background: '#fff',
                            minHeight: '100vh',
                        }}
                    >
                        {rewardRequestStatus && (
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item md={2} sm={0}></Grid>
                                    <Grid item md={8} sm={12}>
                                        <RewardAleadyBuy rewardRequestItem={rewardRequestItem} />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                        {!rewardRequestStatus && (
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item md={8} xs={12}>
                                        <RewardProductList selectedReward={selectedReward} handleChangeReward={handleChangeReward} />
                                    </Grid>
                                    <Grid item md={4} xs={12}>
                                        <RewardPaymentRequest selectedReward={selectedReward} handleChangeReward={handleChangeReward} />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Container>
                </LayoutSurveyProgressMenu>
            )}
        </>
    )
}

Survey_Reward.getLayout = (page) => (
    <AuthGuard>
        <LayoutWithServiceMenu>{page}</LayoutWithServiceMenu>
    </AuthGuard>
)

export default Survey_Reward
