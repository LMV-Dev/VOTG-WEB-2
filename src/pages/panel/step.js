import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import Head from 'next/head'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*Mui Icon */
import HomeIcon from '@mui/icons-material/Home'

/*Custom Icon*/
import { LogoSymbol } from '@public/votg/logoSymbol'
import { LogoLabel } from '@public/votg/logoLabel'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { AuthGuard } from '@components/auth/auth-guard'

// import { removeSessionStorageIncludeWord } from '@utils/session-control'

//ELEMENT
const PAGE_TITLE = '패널'

/*Improt Layouts*/
import LayoutPanelStep from '@layouts/pn/layout-panel-register'

/*Import Components*/
//Layout
import RegisterBottomButton from '@components/pn/register-bottom-button'
import RegisterBottomProgress from '@components/pn/register-bottom-progress'

//STEP
//Page 1
import StepInitial from '@components/pn/step-initial'
import Step_Gender from '@components/pn/step-gender'
import Step_Years from '@components/pn/step-years'
import Step_Address from '@components/pn/step-address'
import Step_Religion from '@components/pn/step-religion'
import Step_Income from '@components/pn/step-income'
import Step_HouseType from '@components/pn/step-house-type'
import Step_HouseContract from '@components/pn/step-house-contract'

//Page 2
import Step_FamilySize from '@components/pn/step-family-size'
import Step_FamilyTogther from '@components/pn/step-family-togther'
import Step_FamilyMarry from '@components/pn/step-family-marry'
import Step_FamilyChildren from '@components/pn/step-family-children'
import Step_Pet from '@components/pn/step-pet'
import Step_HobbyType from '@components/pn/step-hobby-type'
import Step_HobbyTime from '@components/pn/step-hobby-time'

//Page 3
import Step_Transp from '@components/pn/step-transp'
import Step_DriveLicense from '@components/pn/step-drive-license'
import Step_OwnCar from '@components/pn/step-own-car'
import Step_TelecomType from '@components/pn/step-telecom-type'
import Step_TelecomPay from '@components/pn/step-telecom-pay'
import Step_JobType from '@components/pn/step-job-type'
import Step_EmployType from '@components/pn/step-employ-type'

//Next button
import ContinueNext from '@components/pn/continue-next'
import ContinueComplete from '@components/pn/continue-complete'

const PanelStep = () => {
    // var step = 0
    const maxPageStep = 23 // 7 + 7 + 9
    const totalSection = 3
    const sectionEachStep = [7, 7, 9]
    const [pageStep, setPageStep] = useState(0)
    const [stepEnable, setStepEnable] = useState(false)
    const onClickBackStep = () => {
        setPageStep(--pageStep)
    }
    const onClickNextStep = () => {
        setPageStep(++pageStep)
        setStepEnable(false)
    }

    const onChangeStepEnable = (value) => {
        setStepEnable(value)
    }

    const [continuePopup, setContinuePopup] = useState(false)
    const [currentStepPercent, setCurrentStepPercent] = useState(0)

    const onPopupController = () => {
        setContinuePopup(false)
    }

    useEffect(() => {
        if (pageStep === 6) {
            setContinuePopup(true)
            setCurrentStepPercent(30)
        } else if (pageStep == 13) {
            setContinuePopup(true)
            setCurrentStepPercent(60)
        }
        // console.log('pageStep', pageStep)
    }, [pageStep])

    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 뷰즈온더고 :: Views On the Go</title>
            </Head>
            {!continuePopup && pageStep !== 20 && (
                <Box sx={{ px: 0, py: 0, height: '60px', position: 'fixed', background: '#fff', boxShadow: (theme) => theme.shadows[3], width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
                    <Container maxWidth="sm" sx={{ display: 'flex' }}>
                        <IconButton component="a" href="/panel">
                            <LogoSymbol sx={{ width: 38, height: 'auto' }} variant="color" customColor={'#1C60FF'} />
                        </IconButton>
                        <Typography sx={{ ml: 1, mt: 2, color: 'text.main', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>
                            {pageStep == 0 && `패널 질문 사전 안내`}
                            {pageStep > 0 && `STEP ${pageStep}`}
                        </Typography>
                    </Container>
                </Box>
            )}
            <Container
                component="main"
                maxWidth="sm"
                sx={{
                    flexGrow: 1,
                    mt: '60px',
                    pt: 2,
                    pb: 2,
                    px: 4,
                    background: '#fff',
                    height: 'calc(100vh - 50px)',
                }}
            >
                {pageStep == 0 && <StepInitial onClickNextStep={onClickNextStep} />}

                {pageStep == 1 && <Step_Gender onChangeStepEnable={onChangeStepEnable} />}
                {/* {pageStep == 2 && <Step_Years />} */}
                {/* {pageStep == 2 && <Step_Address />} */}
                {pageStep == 2 && <Step_Religion onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 3 && <Step_Income onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 4 && <Step_HouseType onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 5 && <Step_HouseContract onChangeStepEnable={onChangeStepEnable} />}
                {/* {pageStep == 6 && continuePopup ? <ContinueNext currentStepPercent={currentStepPercent} onPopupController={onPopupController} /> : <Step_FamilySize onChangeStepEnable={onChangeStepEnable} />} */}
                {pageStep == 6 && (continuePopup ? <ContinueNext currentStepPercent={currentStepPercent} onPopupController={onPopupController} /> : <Step_FamilySize onChangeStepEnable={onChangeStepEnable} />)}
                {pageStep == 7 && <Step_FamilyTogther onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 8 && <Step_FamilyMarry onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 9 && <Step_FamilyChildren onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 10 && <Step_Pet onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 11 && <Step_HobbyType onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 12 && <Step_HobbyTime onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 13 && (continuePopup ? <ContinueNext currentStepPercent={currentStepPercent} onPopupController={onPopupController} /> : <Step_Transp onChangeStepEnable={onChangeStepEnable} />)}
                {pageStep == 14 && <Step_DriveLicense onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 15 && <Step_OwnCar onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 16 && <Step_TelecomType onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 17 && <Step_TelecomPay onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 18 && <Step_JobType onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 19 && <Step_EmployType onChangeStepEnable={onChangeStepEnable} />}
                {pageStep == 20 && <ContinueComplete />}
            </Container>

            {/* {pageStep > 0 && <RegisterBottomProgress pageStep={pageStep} maxPageStep={maxPageStep} totalSection={totalSection} sectionEachStep={sectionEachStep} />} */}
            {pageStep > 0 && !continuePopup && pageStep !== 20 && <RegisterBottomButton stepEnable={stepEnable} onClickNextStep={onClickNextStep} onClickBackStep={onClickBackStep} />}
        </>
    )
}

PanelStep.getLayout = (page) => (
    // <AuthGuard>
    <LayoutPanelStep>{page}</LayoutPanelStep>
    // </AuthGuard>
)

export default PanelStep
