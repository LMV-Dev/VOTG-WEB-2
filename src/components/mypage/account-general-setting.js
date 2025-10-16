import { Fragment, useState, useEffect } from 'react'
import NextLink from 'next/link'
import { Avatar, Box, Button, Chip, Card, CardContent, Divider, Grid, ListItem, ListItemText, Link, Switch, Tooltip, TextField, Typography, TableContainer, Table, TableBody, TableRow, TableCell, IconButton } from '@mui/material'
import { UserCircle as UserCircleIcon } from '@components/icons/user-circle'
import { UuidTool } from 'uuid-tool'
import { toast } from 'react-toastify'
import API from '@utils/API'
import { wait } from '@utils/wait'
/* Icon */
import { IconEdit } from '@public/votg/IconEdit'

// Auth
import { useAuth } from '@hooks/use-auth'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/router'

//Popup
import PaymentAddPopover from '@components/popovers/popover-payment-add'
import PopupWarningWithCancel_DeleteAccount from '@components/popup/popup-warning-with-cancel'
import PopupAccountUserPasswdChange from '@components/popup/popup-account-user-passwd-change'

//Util
import { formatPhoneNumber, formatCardNumber } from '@utils/auto-format'

export const AccountGeneralSettings = (props) => {
    // To get the user from the authContext, you can use
    const { user } = useAuth()
    console.log(user)
    const cookieList = ['acsTK', 'refTK']
    const [cookie, setCookie, rmCookie] = useCookies()
    /*Router*/
    const router = useRouter()

    // console.log('AccountGeneralSettings - user ', user.code.data.toString())
    // console.log('AccountGeneralSettings - cookie ', cookie.acsTK)

    const [openDialog, setOpenDialog] = useState(false)

    const handleOpenPaymentAddDialog = () => {
        setOpenDialog(true)
    }

    const handleClosePaymentAddDialog = () => {
        setOpenDialog(false)
    }

    /*Popup*/
    // Delete My Account
    const [openDialogWarning_DeleteAccount, setopenDialogWarning_DeleteAccount] = useState(false)
    const handleOpenWarning_DeleteAccount = () => {
        setopenDialogWarning_DeleteAccount(true) // Popup Test Check
    }
    const handleCloseWarning_DeleteAccount = async () => {
        setopenDialogWarning_DeleteAccount(false)
    }
    const handlePushRoutingEvent = async () => {
        try {
            //현재까지 작성된 정보를 서버쪽으로 저장하는 API :: POST

            const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')
            const res = await API.delete('auth/account/delete', {
                UserCode: uuidString,
            })
            // console.log(res)
            if (Boolean(res.isSuccess)) {
                cookieList.map((v) => {
                    rmCookie(v, { path: '/' })
                })
                toast.success('탈퇴완료')
                await router.reload(`/`)
            } else {
                toast.error('탈퇴 오류, 다시 시도해주세요.')
                await wait(2000)
                await router.reload(`/ws/mypage`)
            }
        } catch (error) {
            toast.error('탈퇴 오류, 다시 시도해주세요.')
            await wait(2000)
            await router.reload(`/ws/mypage`)
        }
    }

    // ChangePassword
    const [openDialogWarning_ChangePassword, setopenDialogWarning_ChangePassword] = useState(false)
    const handleOpenWarning_ChangePassword = () => {
        setopenDialogWarning_ChangePassword(true)
    }
    const handleCloseWarning_ChangePassword = async () => {
        setopenDialogWarning_ChangePassword(false)
    }


    // 라디오 버튼 시작
    const [checked, setChecked] = useState('radio-1');

    const getLabelStyle = (radioId) => ({
        display: 'block',
        borderRadius: '8px',
        width: '100%',
        height: '45px',
        lineHeight: '45px',
        border: '1px solid #1f296a',
        textAlign: 'center',
        height: '-webkit-fill-available',
        border: checked === radioId ? '1px solid #1f296a' : '1px solid #E6E8F0',
        color: checked === radioId ? '#1f296a' : '#666',
    });

    const radiobtn = {
        box: { 
            marginTop:'20px',
            display: 'flex',
            justifyContent: 'space-between',
            gap:'10px',
        },
        formRadioBtn: {
            width:'100%'
        },
        input: {
        display: 'none',
        },
    };
    // 라디오 버튼 끝

    /** 지역구분 시작  ============================================== */
    const regionCheckboxes = [
        { id: 'region_1', label: '전체', name: 'mchk2', checked: user?.region === '중구,동구,서구,남구,북구,수성구,달서구,달성군,군위군' },
        { id: 'region_2', label: '중구', name: 'mchk2', checked: (user?.region?.includes('중구')) ? true : false },
        { id: 'region_3', label: '동구', name: 'mchk2', checked: (user?.region?.includes('동구')) ? true : false },
        { id: 'region_4', label: '서구', name: 'mchk2', checked: (user?.region?.includes('서구')) ? true : false },
        { id: 'region_5', label: '남구', name: 'mchk2', checked: (user?.region?.includes('남구')) ? true : false },
        { id: 'region_6', label: '북구', name: 'mchk2', checked: (user?.region?.includes('북구')) ? true : false },
        { id: 'region_7', label: '수성구', name: 'mchk2', checked: (user?.region?.includes('수성구')) ? true : false },
        { id: 'region_8', label: '달서구', name: 'mchk2', checked: (user?.region?.includes('달서구')) ? true : false },
        { id: 'region_9', label: '달성군', name: 'mchk2', checked: (user?.region?.includes('달성군')) ? true : false },
        { id: 'region_10', label: '군위군', name: 'mchk2', checked: (user?.region?.includes('군위군')) ? true : false }, 
    ];
    /** 지역구분 끝  ============================================== */

    /** 연면적 시작  ============================================== */
    const areaCheckboxes = [
        { id: 'area_1', label: '전체', name: 'mchk3', checked: user?.area === '500미만,500~999,1000~1999,2000~2999,3000~5000,5000이상' },
        { id: 'area_2', label: '500미만', name: 'mchk3', checked: (user?.area?.includes('500미만')) ? true : false },
        { id: 'area_3', label: '500~999', name: 'mchk3', checked: (user?.area?.includes('500~999')) ? true : false },
        { id: 'area_4', label: '1000~1999', name: 'mchk3', checked: (user?.area?.includes('1000~1999')) ? true : false },
        { id: 'area_5', label: '2000~2999', name: 'mchk3', checked: (user?.area?.includes('2000~2999')) ? true : false },
        { id: 'area_6', label: '3000~5000', name: 'mchk3', checked: (user?.area?.includes('3000~5000')) ? true : false },
        { id: 'area_7', label: '5000이상', name: 'mchk3', checked: (user?.area?.includes('5000이상')) ? true : false },
    ];
    /** 연면적 끝  ============================================== */

    /** 지상층수 시작  ============================================== */
    const floorCheckboxes = [
        { id: 'floor_1', label: '전체', name: 'mchk4', checked: user?.floor === '1~4,5~10,11~' },
        { id: 'floor_2', label: '1~4', name: 'mchk4', checked: (user?.floor?.includes('1~4')) ? true : false },
        { id: 'floor_3', label: '5~10', name: 'mchk4', checked: (user?.floor?.includes('5~10')) ? true : false },
        { id: 'floor_4', label: '11~', name: 'mchk4', checked: (user?.floor?.includes('11~')) ? true : false },
    ];
    /** 지상층수 끝  ============================================== */

    /** 분석/시각화 시작  ============================================== */
    const analysisCheckboxes = [
        { id: 'analysis_1', label: '전체', name: 'mchk5', checked: user?.analysis === '전반평가(건축맥락),공간별 평가' },
        { id: 'analysis_2', label: '전반평가(건축맥락)', name: 'mchk5', checked: (user?.analysis?.includes('전반평가(건축맥락)')) ? true : false },
        { id: 'analysis_3', label: '공간별 평가', name: 'mchk5', checked: (user?.analysis?.includes('공간별 평가')) ? true : false },
    ];
    /** 분석/시각화 끝  ============================================== */

    return (
        <>
            <PopupWarningWithCancel_DeleteAccount
                onClose={handleCloseWarning_DeleteAccount}
                open={openDialogWarning_DeleteAccount}
                event={handlePushRoutingEvent}
                sw={true}
                title={'탈퇴 하시겠습니까?'}
                description={'계정을 삭제하시면 이용중인 서비스의 모든 정보가 소실되며,\n모든 데이터는 복구 불가능합니다.'}
                cancelName={'탈퇴하기'}
                confirmName={'취소'}
                color={'primary'}
            />
            <PaymentAddPopover returnUrl={'/ws/payment'} onClose={handleClosePaymentAddDialog} open={openDialog} />
            <PopupAccountUserPasswdChange onClose={handleCloseWarning_ChangePassword} open={openDialogWarning_ChangePassword} />

            <Box sx={{ mt: 4 }} {...props}>
                <Card>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item md={4} xs={12}>
                                <Typography variant="h6">계정 정보</Typography>
                            </Grid>

                            <Grid item md={8} xs={12}>
                                {/* 01 :  name & service type */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        mb: 3,
                                        alignItems: 'center',
                                    }}
                                >
                                    <ListItemText
                                        disableTypography
                                        primary={
                                            <ListItem
                                                disableGutters
                                                sx={{
                                                    justifyContent: 'space-between',
                                                    paddingInline: 1,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: 'text.black',
                                                        fontSize: '1rem',
                                                        fontWeight: '700',
                                                    }}
                                                >
                                                    이름
                                                </Typography>
                                            </ListItem>
                                        }
                                        secondary={
                                            <ListItem
                                                disableGutters
                                                sx={{
                                                    // justifyContent: 'space-between',
                                                    paddingInline: 1,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: 'text.black',
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    {user?.name}
                                                </Typography>
                                                {user?.status === 0 && (
                                                    <Chip
                                                        label={`결제 후 사용가능`}
                                                        variant="outlined"
                                                        color={'disable'}
                                                        size="small"
                                                        sx={{
                                                            marginInline: 1,
                                                            paddingInline: 1,
                                                            height: '1.5rem',
                                                        }}
                                                    />
                                                )}
                                                {user?.status === 1 && (
                                                    <Chip
                                                        label={`결제후 추가 사용 가능`}
                                                        variant="outlined"
                                                        color={'warning'}
                                                        size="small"
                                                        sx={{
                                                            marginInline: 1,
                                                            paddingInline: 1,
                                                            height: '1.5rem',
                                                        }}
                                                    />
                                                )}
                                                {user?.status === 2 && (
                                                    <Chip
                                                        label={`정지된 계정`}
                                                        variant="outlined"
                                                        color={'error'}
                                                        size="small"
                                                        sx={{
                                                            marginInline: 1,
                                                            paddingInline: 1,
                                                            height: '1.5rem',
                                                        }}
                                                    />
                                                )}
                                                {user?.status === 3 && (
                                                    <Chip
                                                        label={user?.type === 0 ? 'Starter' : user?.type === 1 ? 'Standard' : user?.type === 2 ? 'Professional' : 'Dev'}
                                                        variant="outlined"
                                                        color={user?.type === 0 ? 'free' : user?.type === 1 ? 'basic' : user?.type === 2 ? 'pro' : 'primary'}
                                                        size="small"
                                                        sx={{
                                                            marginInline: 1,
                                                            paddingInline: 1,
                                                            height: '1.5rem',
                                                        }}
                                                    />
                                                )}
                                            </ListItem>
                                        }
                                    />
                                </Box>

                                {/* 02 : email */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        mb: 3,
                                        alignItems: 'center',
                                    }}
                                >
                                    <ListItemText
                                        disableTypography
                                        primary={
                                            <ListItem
                                                disableGutters
                                                sx={{
                                                    justifyContent: 'space-between',
                                                    paddingInline: 1,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: 'text.black',
                                                        fontSize: '1rem',
                                                        fontWeight: '700',
                                                    }}
                                                >
                                                    메일 주소
                                                </Typography>
                                            </ListItem>
                                        }
                                        secondary={
                                            <ListItem
                                                disableGutters
                                                sx={{
                                                    // justifyContent: 'space-between',
                                                    paddingInline: 1,
                                                }}
                                            >
                                                <>
                                                    <Typography
                                                        sx={{
                                                            color: 'text.black',
                                                            fontSize: '1rem',
                                                        }}
                                                    >
                                                        {user?.email}
                                                        {/* <Tooltip
                                                            title="수정"
                                                            sx={{
                                                                marginInline: 1,
                                                                paddingInline: 1,
                                                            }}
                                                        >
                                                            <IconButton edge="end" onClick={() => console.log('등록된 주소 수정')}>
                                                                <IconEdit variant="dark" width={20} />
                                                            </IconButton>
                                                        </Tooltip> */}
                                                    </Typography>
                                                </>
                                            </ListItem>
                                        }
                                    />
                                </Box>

                                {/* 03 : Card */}
                                

                                {/* 04 :  phone */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        mb: 3,
                                        alignItems: 'center',
                                    }}
                                >
                                    <ListItemText
                                        disableTypography
                                        primary={
                                            <ListItem
                                                disableGutters
                                                sx={{
                                                    justifyContent: 'space-between',
                                                    paddingInline: 1,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: 'text.black',
                                                        fontSize: '1rem',
                                                        fontWeight: '700',
                                                    }}
                                                >
                                                    연락처
                                                </Typography>
                                            </ListItem>
                                        }
                                        secondary={
                                            <ListItem
                                                disableGutters
                                                sx={{
                                                    // justifyContent: 'space-between',
                                                    paddingInline: 1,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: 'text.black',
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    {formatPhoneNumber(user?.phone)}
                                                </Typography>
                                            </ListItem>
                                        }
                                    />
                                </Box>
                                
                                <div style={radiobtn.box}>
                                    {(user !== undefined && user !== null) ? (
                                        <>
                                            <div className="form_radio_btn" style={radiobtn.formRadioBtn}>
                                                <input type="radio" id="radio-1" name="userType" style={radiobtn.input}/>
                                                <label htmlFor="radio-1" style={user?.userType === "1" ? getLabelStyle('radio-1') : getLabelStyle('radio-2')}>개인회원</label>
                                            </div>
                                            <div className="form_radio_btn" style={radiobtn.formRadioBtn}>
                                                <input type="radio" id="radio-2" name="userType" style={radiobtn.input} disabled/>
                                                <label htmlFor="radio-2" style={user?.userType === "2" ? getLabelStyle('radio-1') : getLabelStyle('radio-2')}>기업회원</label>
                                            </div>
                                        </>
                                    ) : (e) => {console.log(e)}}
                                </div>

                                <div style={{marginTop:'30px'}}>
                                    <Typography sx={{
                                                        mt: 4 ,
                                                        color: 'text.black',
                                                        fontSize: '1rem',
                                                        fontWeight: '700',
                                                    }}>
                                        시설물 유형
                                    </Typography>
                                    <div className='checkbox_grid type02'>
                                        <div>
                                            <input className='custom_check' type="checkbox" id="check_1" name="check01" checked disabled/>
                                            <label htmlFor="check_1">근린생활시설</label>
                                        </div>
                                    </div>

                                    <Typography sx={{
                                                        mt: 4 ,
                                                        color: 'text.black',
                                                        fontSize: '1rem',
                                                        fontWeight: '700',
                                                    }}>
                                        지역구분
                                    </Typography>
                                    <div className='checkbox_flex'>
                                        {regionCheckboxes.map((checkbox) => (
                                            <div key={checkbox.id}>
                                                <input
                                                className='custom_check'
                                                type="checkbox"
                                                id={checkbox.id}
                                                name={checkbox.name}
                                                checked={checkbox.checked}
                                                disabled
                                                />
                                                <label htmlFor={checkbox.id}>{checkbox.label}</label>
                                            </div>
                                        ))}
                                    </div>

                                    <Typography sx={{
                                                        mt: 4 ,
                                                        color: 'text.black',
                                                        fontSize: '1rem',
                                                        fontWeight: '700',
                                                    }}>
                                        연면적(m²)
                                    </Typography>
                                    <div className='checkbox_flex'>
                                        {areaCheckboxes.map((checkbox) => (
                                            <div key={checkbox.id}>
                                                <input
                                                className='custom_check'
                                                type="checkbox"
                                                id={checkbox.id}
                                                name={checkbox.name}
                                                checked={checkbox.checked}
                                                disabled
                                                />
                                                <label htmlFor={checkbox.id}>{checkbox.label}</label>
                                            </div>
                                        ))}
                                    </div>

                                    <Typography sx={{
                                                        mt: 4 ,
                                                        color: 'text.black',
                                                        fontSize: '1rem',
                                                        fontWeight: '700',
                                                    }}>
                                        지상층수
                                    </Typography>
                                    <div className='checkbox_flex'>
                                        {floorCheckboxes.map((checkbox) => (
                                            <div key={checkbox.id}>
                                                <input
                                                className='custom_check'
                                                type="checkbox"
                                                id={checkbox.id}
                                                name={checkbox.name}
                                                checked={checkbox.checked}
                                                disabled
                                                />
                                                <label htmlFor={checkbox.id}>{checkbox.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <Typography sx={{
                                                        mt: 4 ,
                                                        color: 'text.black',
                                                        fontSize: '1rem',
                                                        fontWeight: '700',
                                                    }}>
                                        분석/시각화
                                    </Typography>
                                    <div className='checkbox_flex'>
                                        {analysisCheckboxes.map((checkbox) => (
                                            <div key={checkbox.id}>
                                                <input
                                                className='custom_check'
                                                type="checkbox"
                                                id={checkbox.id}
                                                name={checkbox.name}
                                                checked={checkbox.checked}
                                                disabled
                                                />
                                                <label htmlFor={checkbox.id}>{checkbox.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                    

                                </div>

                                {/* 05 :  address */}
                                {/* <Box
                                    sx={{
                                        display: 'flex',
                                        mb: 3,
                                        alignItems: 'center',
                                    }}
                                >
                                    <ListItemText
                                        disableTypography
                                        primary={
                                            <ListItem
                                                disableGutters
                                                sx={{
                                                    justifyContent: 'space-between',
                                                    paddingInline: 1,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: 'text.black',
                                                        fontSize: '1rem',
                                                        fontWeight: '700',
                                                    }}
                                                >
                                                    주소
                                                </Typography>
                                            </ListItem>
                                        }
                                        secondary={
                                            <ListItem
                                                disableGutters
                                                sx={{
                                                    // justifyContent: 'space-between',
                                                    paddingInline: 1,
                                                }}
                                            >
                                                {user?.address_zip === null ? (
                                                    <Typography
                                                        sx={{
                                                            color: 'text.secondary',
                                                            fontSize: '1rem',
                                                            '&:hover': {
                                                                cursor: 'pointer',
                                                                textDecoration: 'underline',
                                                            },
                                                        }}
                                                        onClick={() => console.log('주소 등록하기')}
                                                    >
                                                        주소 등록하기
                                                    </Typography>
                                                ) : (
                                                    <>
                                                        <Typography
                                                            sx={{
                                                                color: 'text.black',
                                                                fontSize: '1rem',
                                                            }}
                                                        >
                                                            {`(${user?.address_zip}) ${user?.address_road} ${user?.address_detail}`}
                                                            <Tooltip
                                                                title="수정"
                                                                sx={{
                                                                    marginInline: 1,
                                                                    paddingInline: 1,
                                                                }}
                                                            >
                                                                <IconButton edge="end" onClick={() => console.log('등록된 주소 수정')}>
                                                                    <IconEdit variant="dark" width={20} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Typography>
                                                    </>
                                                )}
                                            </ListItem>
                                        }
                                    />
                                </Box> */}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item md={4} xs={12}>
                                <Typography variant="h6">비밀번호 설정</Typography>
                            </Grid>
                            <Grid item md={8} sm={12} xs={12}>
                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mt: 3,
                                        my: 3,
                                    }}
                                >
                                    <div>
                                        <Typography variant="subtitle2">비밀번호를 변경합니다. 비밀번호는 보안을 위해 주기적으로 변경해주는것이 좋습니다.</Typography>
                                    </div>
                                    <Button variant="outlined" size="small" sx={{ fontWeight: 700 }} onClick={handleOpenWarning_ChangePassword}>
                                        변경하기
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item md={4} xs={12}>
                                <Typography variant="h6">계정 탈퇴</Typography>
                            </Grid>
                            <Grid item md={8} xs={12}>
                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mt: 1,
                                        my: 3,
                                    }}
                                >
                                    <Typography variant="subtitle2">계정을 삭제하시면 이용중인 서비스의 모든 정보가 소실되며, 모든 데이터는 복구 불가능합니다.</Typography>
                                    <Button onClick={handleOpenWarning_DeleteAccount} variant="label" size="small" sx={{ fontWeight: 400 }}>
                                        탈퇴하기
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}
