import { useState, useEffect } from 'react'
import PropTypes, { bool } from 'prop-types'
import { styled } from '@mui/material/styles'
import { UuidTool } from 'uuid-tool'
import { toast } from 'react-toastify'
import API from '@utils/API'
import { wait } from '@utils/wait'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'

/*MUI Component*/
import { Box, Typography } from '@mui/material'

/*Import Components*/
import SurveyMenu from '@components/ws/survey-menu'
import PopupWarning_Preview from '@components/popup/popup-warning-with-cancel'
import PopupWarning_Panel from '@components/popup/popup-warning-with-cancel'
import PopupWarning_Distribute from '@components/popup/popup-warning-with-cancel'

/*Root*/
const LayoutSurveyRoot = styled('div')(({ theme }) => ({
    // background: '#fff',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
    marginTop: '80px',
    [theme.breakpoints.down('md')]: {
        marginTop: '110px',
    },
}))

/* Menu Info Init*/

const menuInitInfo = [
    { index: 0, title: '설문변환', name: '다음', event: () => console.log('다음') },
    { index: 1, title: '설문제작', name: '다음', event: () => console.log('다음') },
    { index: 2, title: '미리보기', name: '다음', event: () => console.log('다음') },
    // { index: 3, title: '패널설정', name: '다음', event: () => console.log('다음') },
    // { index: 4, title: '리워드', name: '다음', event: () => console.log('다음') },
    { index: 3, title: '배포하기', name: '배포하기', event: () => console.log('배포') },
    { index: 4, title: '설문수정', name: '다음', event: () => console.log('다음') },
]

/**
 * LayoutSurveyProgressMenu 에서
 * 하위에 존재하는 메뉴 버튼에 대한 이벤트를 정의해줌
 * 메뉴의 수정 여부는 최상위 Page 단에서 판단하여
 * editMode로 전달받아 하위 메뉴의 타입을 전달해주는 역할을 하며
 *
 * 현재 컴포넌트의 위치 Router Path 에 따라서 '다음'버튼에 해당하는 이벤트를
 * 정의하여 하위 메뉴 리스트에 전달
 * */

const LayoutSurveyProgressMenu = (props) => {
    const { children, editMode, questionCheck, panelCheck, errorList } = props
    /*User*/
    const { user, logout } = useAuth()
    /*Router*/
    const router = useRouter()
    // Path Check
    const { asPath, pathname } = router // asPath = /realdata , pathname = /[code]
    // Param Check
    const { code, type } = router.query

    const [menuInfo, setMenuInfo] = useState(menuInitInfo)

    useEffect(() => {
        const updateMenu = [
            { ...menuInitInfo[0], name: '설문수정', event: event_JustRouting }, // type = cnvt 일때 사용
            { ...menuInitInfo[1], name: '다음', event: eventSurveyNext }, // 설문조사 신규 생성
            { ...menuInitInfo[2], name: '다음', event: () => handleOpen(2) },
            // { ...menuInitInfo[3], name: '다음', event: () => handleOpen(3) },
            // { ...menuInitInfo[4], name: '다음', event: event_JustRouting },
            { ...menuInitInfo[3], name: '배포하기', event: () => handleOpen(5) },
            { ...menuInitInfo[4], name: '다음', event: eventSurveyNext }, // 설문조사 기존 수정
        ]
        setMenuInfo(updateMenu)
    }, [])

    /* Popup Selected */
    const [selectedPopup, setSelectedPopup] = useState(0)
    /* Popup Control */
    const [openPopup, setOpenPopup] = useState(false)
    const handleOpen = async (number) => {
        //보여줄 팝업 선택
        setSelectedPopup(number)
        // 팝업 보여주기
        setOpenPopup(true)
    }
    const handleClose = async () => {
        setOpenPopup(false)
    }

    /* Survey Session Data Code*/
    const SURVEY_CODE = `svcd-${code}`
    /* Send Contact Session Data Code*/
    const CONTACT_CODE = `svct-${code}`

    /* 다음페이지 링크 이동 컨트롤 트리거  */
    const [progressTriger, setProgressTriger] = useState(false)
    /**
     * 0. 서비스 단순 라우팅
     * */
    const event_JustRouting = () => {
        // console.log('Update 다음')
        setProgressTriger(true)
    }
    /**
     * 1. 설문 자동 저장 이벤트
     * */
    const eventSurveyNext = async () => {
        try {
            //현재까지 작성된 정보를 서버쪽으로 저장하는 API :: POST
            let currentCreateSureveyData = globalThis.sessionStorage.getItem(SURVEY_CODE)

            //console.log('currentCreateSureveyData', currentCreateSureveyData)
            //console.log('sendPhoneNumber', sendPhoneNumber)
            const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')
            const res = await API.post('online/survey/save', {
                UserCode: uuidString,
                surveyCode: code,
                surveyType: 0,
                surveyJson: currentCreateSureveyData,
                sendURL: `/${code}/o`,
                thumbnail: null,
                fileCode: null,
            })
            // console.log(res)
            if (Boolean(res.isSuccess)) {
                // toast.success('설문조사가 저장되었습니다.')
                //다음 링크로 이동
                setProgressTriger(true)
            } else {
                toast.error('저장 오류, 다시 시도해주세요.')
                await wait(2000)
                await router.reload(`/ws/survey/${code}/${type}/editor`).catch(console.error)
            }
        } catch (error) {
            console.error(error)
            toast.error('저장 오류, 다시 시도해주세요.')
            await wait(2000)
            await router.reload(`/ws/survey/${code}/${type}/editor`).catch(console.error)
        }
    }

    /**
     *  2. Preview 페이지 라우팅
     * */
    const [isPreviewChecked, setIsPreviewChecked] = useState(false)
    useEffect(() => setIsPreviewChecked(questionCheck), [questionCheck])
    const eventPreviewNext = async () => {
        try {
            //현재까지 작성된 정보를 서버쪽으로 저장하는 API :: POST
            let currentCreateSureveyData = globalThis.sessionStorage.getItem(SURVEY_CODE)

            // console.log('currentCreateSureveyData', currentCreateSureveyData)
            // console.log('sendPhoneNumber', sendPhoneNumber)
            const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')
            const res = await API.post('online/survey/save', {
                UserCode: uuidString,
                surveyCode: code,
                surveyType: 0,
                surveyJson: currentCreateSureveyData,
                sendURL: `/${code}/o`,
                thumbnail: null,
                fileCode: null,
            })
            // console.log(res)
            if (Boolean(res.isSuccess)) {
                // toast.success('설문조사가 저장되었습니다.')
                //다음 링크로 이동
                setProgressTriger(true)
            } else {
                toast.error('저장 오류, 다시 시도해주세요.')
                await wait(2000)
                await router.reload(`/ws/survey/${code}/${type}/preview`).catch(console.error)
            }
        } catch (error) {
            console.error(error)
            toast.error('저장 오류, 다시 시도해주세요.')
            await wait(2000)
            await router.reload(`/ws/survey/${code}/${type}/preview`).catch(console.error)
        }
    }

    /**
     *  3. Panel 페이지 라우팅
     * */
    const [isPanelChecked, setIsPanelChecked] = useState(false)
    useEffect(() => {
        // console.log('panelCheck', panelCheck)
        if (panelCheck !== null && panelCheck !== undefined) {
            setIsPanelChecked(true)
        } else {
            setIsPanelChecked(false)
        }
    }, [panelCheck])

    const eventPanelNext = async () => {
        //현재까지 작성된 정보를 서버쪽으로 저장하는 API :: POST
        eventSurveyNext()
        //다음 링크로 이동
        setProgressTriger(true)
    }

    /**
     *  5. 배포 페이지 라우팅
     * */

    /*Distribute Popup : 배포 이벤트 -> 서버로 서베이 데이터 저장 + 서베이 배포 갱신*/
    const handleDistributeInit = async () => {
        try {
            let currentCreateSureveyData = globalThis.sessionStorage.getItem(SURVEY_CODE)
            let sendType = parseInt(JSON.parse(globalThis.sessionStorage.getItem(CONTACT_CODE)).sendType)
            let sendContactObject = '{}'
            if (sendType === 0 || sendType === 1) {
                let sendPhoneNumber = JSON.parse(globalThis.sessionStorage.getItem(CONTACT_CODE))
                // console.log('sendPhoneNumber.phoneNumbers.length', sendPhoneNumber.phoneNumbers.length)
                if (sendPhoneNumber === null || sendPhoneNumber === undefined || sendPhoneNumber?.phoneNumbers.length === 0) {
                    return alert('발송할 연락처가 입력되지 않았습니다.\n연락처를 입력하거나, URL통해 배포해주세요.')
                } else {
                    sendContactObject = globalThis.sessionStorage.getItem(CONTACT_CODE)
                }
            }else if (sendType === 2){
                let sendEmails = JSON.parse(globalThis.sessionStorage.getItem(CONTACT_CODE))
                // console.log('sendEmails.emails.length', sendEmails.emails.length)
                if (sendEmails === null || sendEmails === undefined || sendEmails?.emails.length === 0) {
                    return alert('발송할 이메일이 입력되지 않았습니다.\n이메일을 입력하거나, URL통해 배포해주세요.')
                } else {
                    sendContactObject = globalThis.sessionStorage.getItem(CONTACT_CODE)
                }
            }

            console.log('CONTACT_CODE', JSON.parse(globalThis.sessionStorage.getItem(CONTACT_CODE)).sendType)
            console.log('sendType', sendType)
            // console.log('sendContactObject', sendContactObject)
            const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')
            if (user?.mode >= 2) {
                const res = await API.post('online/survey/distribute/change/admin', {
                    UserCode: uuidString,
                    surveyCode: code,
                    surveyType: type === 'nml' ? 0 : 1,
                    surveyJson: currentCreateSureveyData,
                    sendType: sendType,
                    sendContact: sendContactObject,
                    sendURL: `/${code}/o`,
                    thumbnail: null,
                    fileCode: null,
                })
            } else {
                const res = await API.post('online/survey/distribute/change/general', {
                    UserCode: uuidString,
                    surveyCode: code,
                    surveyType: type === 'nml' ? 0 : 1,
                    surveyJson: currentCreateSureveyData,
                    sendType: sendType,
                    sendContact: sendContactObject,
                    sendURL: `/${code}/o`,
                    thumbnail: null,
                    fileCode: null,
                })
            }
            toast.success('배포 완료')

            await wait(1000)
            await router.push(`/ws/survey/${code}/${type}/report`).catch(console.error)
        } catch (error) {
            console.error(error)
            toast.error('Distribute Error: ' + error)
        }
    }

    return (
        <>
            {selectedPopup == 2 && (
                <PopupWarning_Preview
                    onClose={handleClose}
                    open={openPopup}
                    event={eventPreviewNext}
                    sw={false}
                    title={isPreviewChecked ? '설문지 작성이 완료되었습니다.' : '설문에 대한 정보가 모두 입력되지 않았습니다.\n아래 항목을 수정후 진행해 주세요.'}
                    description={isPreviewChecked ? '작성한 설문지 문항들은 다시 돌아와 수정할 수 있습니다.' : `${errorList.join('\r\n')}`}
                    cancelName={isPreviewChecked ? '취소' : '확인'}
                    confirmName={isPreviewChecked ? '다음' : ''}
                    color={'primary'}
                />
            )}
            {selectedPopup == 3 && (
                <PopupWarning_Panel
                    onClose={handleClose}
                    open={openPopup}
                    event={eventPanelNext}
                    sw={false}
                    title={isPanelChecked ? (panelCheck == 0 ? '패널 구매하기를 선택하셨습니다.' : '직접 배포하기를 선택하셨습니다.') : '선택되지 않았습니다.'}
                    description={isPanelChecked ? (panelCheck == 0 ? '작성해주신 패널 정보를 확인하여 연락드릴 수 있도록 하겠습니다.' : '패널구매가 필요할 경우 다시 돌아와 요청할 수 있습니다.') : '패널에 대한 선택 여부를 결정해주세요.'}
                    cancelName={isPanelChecked ? '취소' : '확인'}
                    confirmName={isPanelChecked ? '다음' : ''}
                    color={'error'}
                />
            )}
            {selectedPopup == 5 && (
                <PopupWarning_Panel
                    onClose={handleClose}
                    open={openPopup}
                    event={handleDistributeInit}
                    sw={false}
                    title={'설문지 배포'}
                    description={'작성이 완료된 설문지를 배포합니다. \n배포하기를 누르면 설정한 배포방식으로 설문지가 즉시 발송됩니다.'}
                    cancelName={'취소'}
                    confirmName={'배포하기'}
                    color={'success'}
                />
            )}
            <SurveyMenu editMode={editMode} menuInfo={menuInfo} progressTriger={progressTriger} />
            <LayoutSurveyRoot>{children}</LayoutSurveyRoot>
        </>
    )
}

LayoutSurveyProgressMenu.propTypes = {
    children: PropTypes.node,
    editMode: bool,
}

export default LayoutSurveyProgressMenu
