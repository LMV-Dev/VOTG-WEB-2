import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import API from '@utils/API'
import { wait } from '@utils/wait'
import { Grid, Box, Button, Checkbox, FormHelperText, Link, TextField, Typography, Divider } from '@mui/material'
import { useAuth } from '@hooks/use-auth'
import { useMounted } from '@hooks/use-mounted'
/* Language */
import { useTranslation } from 'react-i18next'

export const JWTRegister = (props) => {
    const isMounted = useMounted()
    const router = useRouter()
    const { register } = useAuth()
    const { t } = useTranslation()

    /* Page State */
    const [pageStep, setPageStep] = useState(0)
    /* Form State */
    const [isPhoneExist, setPhoneExist] = useState(false)
    const [sendCode, setSendCode] = useState(false)
    const [sendError, setSendError] = useState(false)
    const [verifyComplete, setVerifyComplete] = useState(false)
    const [verifyError, setVerifyError] = useState(false)
    const [userType, setUserType] = useState(1);

    const onClickSendCode = useCallback(async (phone) => {
        setPhoneExist(false)
        setSendError(false)
        // console.log(phone)
        const exPhone = await API.get('auth/user/phone', {
            phoneNumber: phone,
        })
        if (exPhone.isSuccess === false) {
            setPhoneExist(true)
            return null
        }

        const res = await API.post('auth/sendCodeSENS', {
            phoneNumber: phone,
        })
        // const res = await API.post('auth/sendCodeTW', {
        //     phoneNumber: phone,
        // })
        // console.log('onClickSendCode Result', res)
        if (res?.isSuccess === true) {
            setSendCode(true)
        } else {
            setSendError(true)
        }
    })

    const onClickVerify = useCallback(async (phone, code) => {
        const res = await API.post('auth/verifyNumberSENS', {
            phoneNumber: phone,
            verifyCode: code,
        })
        // console.log('onClickVerify Result', res)
        if (res?.isSuccess === true) {
            setVerifyError(false)
            setVerifyComplete(false)
            await wait(1000)
            setPageStep(1)
        } else {
            setVerifyError(true)
        }
    })

    /* Form Setting */
    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            code: '',
            email: '',
            password: '',
            passwordcheck: '',
            userType: userType,
            policy: false,
            mailing: false,
            submit: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().max(255).required(t('이름을 입력해주세요.')),
            phone: Yup.string()
                .max(255)
                .required(t('휴대폰 번호를 입력해주세요.'))
                .matches(/^01([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})$/, '올바른 휴대폰 번호를 입력해주세요.'),
            code: Yup.string().min(6, '인증코드 6자리를 입력해주세요.').max(6, '인증코드 6자리를 입력해주세요.').required(t('인증코드를 입력해주세요.')),
            email: Yup.string().email(t('올바른 메일주소 형식으로 입력해주세요.')).max(255, t('너무 긴 이메일 주소는 서비스에서 사용할 수 없습니다.')).required(t('메일주소를 입력해주세요.')),
            password: Yup.string()
                .min(7, t('비밀번호는 7자 이상이어야 합니다.'))
                .max(255, t('암호 확인은 최대 255자여야 합니다.'))
                .required(t('비밀번호를 입력해주세요.'))
                .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~@$!%*#?&^>/<])[A-Za-z\d`~@$!%*#?&^>/<]{8,}$/, t('대소문자, 숫자 및 특수 문자 하나 이상을 포함 필수')),
            passwordcheck: Yup.string()
                .required(t('동일한 비밀번호를 입력해주세요.'))
                .oneOf([Yup.ref('password'), null], '동일한 비밀번호를 입력해주세요.'),
            policy: Yup.boolean().oneOf([true], t('회원가입을 위해 약관에 동의해주세요.')),
        }),
        onSubmit: async (values, helpers) => {
            // alert(JSON.stringify(values, null, 2))
            try {
                await register({
                    name: values.name,
                    phone: values.phone,
                    email: values.email,
                    password: values.password,
                    mailing: values.mailing,
                    userType: userType,
                    facility: '근린생활시설',
                    region: getRegionList(), 
                    area: getAreaList(), 
                    floor: getFloorList(), 
                    analysis: getAnalysisList(), 
                })

                if (isMounted()) {
                    const returnUrl = router.query.returnUrl || '/'
                    router.push(returnUrl).catch(console.error)
                }
            } catch (error) {
                if (isMounted()) {
                    helpers.setStatus({ success: false })
                    helpers.setErrors({ submit: error.message })
                    helpers.setSubmitting(false)
                }
            }
        },
    })


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
        cursor:'pointer',
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

    const handleRadioChange = (e) => {
        setChecked(e.target.id);
        console.log(e.target.value);
        setUserType(e.target.value);
    };
    // 라디오 버튼 끝

    /** 지역구분 시작  ============================================== */
    const [regionCheckbox, setRegionCheckbox] = useState([
        { id: 'region_1', label: '전체', checked: false },
        { id: 'region_2', label: '중구', checked: false },
        { id: 'region_3', label: '동구', checked: false },
        { id: 'region_4', label: '서구', checked: false },
        { id: 'region_5', label: '남구', checked: false },
        { id: 'region_6', label: '북구', checked: false },
        { id: 'region_7', label: '수성구', checked: false },
        { id: 'region_8', label: '달서구', checked: false },
        { id: 'region_9', label: '달성군', checked: false },
        { id: 'region_10', label: '군위군', checked: false },
    ]);

    const handleRegionCheckboxChange = (id) => {
        const updatedCheckboxes = regionCheckbox.map((region) =>
        region.id === id ? { ...region, checked: !region.checked } : region
        );
    
        // "전체" 체크박스가 클릭된 경우, 나머지 체크박스 상태를 업데이트
        if (id === 'region_1') {
          const allChecked = updatedCheckboxes[0].checked;
          updatedCheckboxes.slice(1).forEach((region) => (region.checked = allChecked));
        } else {
          // "전체" 체크박스가 아닌 경우, "전체" 체크박스의 상태를 업데이트
          const allChecked = updatedCheckboxes.slice(1).every((region) => region.checked);
          updatedCheckboxes[0].checked = allChecked;
        }
    
        setRegionCheckbox(updatedCheckboxes);
    };

    const getRegionList = () => {
        const regionItems = regionCheckbox
          .filter((checkbox) => checkbox.checked && checkbox.id !== 'region_1')
          .map((checkbox) => checkbox.label);
        return regionItems.join(',');
    };
    /** 지역구분 끝  ============================================== */

    /** 연면적 시작  ============================================== */
    const [areaCheckbox, setAreaCheckbox] = useState([
        { id: 'area_1', label: '전체', checked: false },
        { id: 'area_2', label: '500미만', checked: false },
        { id: 'area_3', label: '500~999', checked: false },
        { id: 'area_4', label: '1000~1999', checked: false },
        { id: 'area_5', label: '2000~2999', checked: false },
        { id: 'area_6', label: '3000~5000', checked: false },
        { id: 'area_7', label: '5000이상', checked: false },
    ]);

    const handleAreaCheckboxChange = (id) => {
        const updatedCheckboxes = areaCheckbox.map((area) =>
        area.id === id ? { ...area, checked: !area.checked } : area
        );
    
        // "전체" 체크박스가 클릭된 경우, 나머지 체크박스 상태를 업데이트
        if (id === 'area_1') {
          const allChecked = updatedCheckboxes[0].checked;
          updatedCheckboxes.slice(1).forEach((area) => (area.checked = allChecked));
        } else {
          // "전체" 체크박스가 아닌 경우, "전체" 체크박스의 상태를 업데이트
          const allChecked = updatedCheckboxes.slice(1).every((area) => area.checked);
          updatedCheckboxes[0].checked = allChecked;
        }
    
        setAreaCheckbox(updatedCheckboxes);
    };

    const getAreaList = () => {
        const areaItems = areaCheckbox
          .filter((checkbox) => checkbox.checked && checkbox.id !== 'area_1')
          .map((checkbox) => checkbox.label);
        return areaItems.join(',');
    };
    /** 연면적 끝  ============================================== */

    /** 지상층수 시작  ============================================== */
    const [floorCheckbox, setFloorCheckbox] = useState([
        { id: 'floor_1', label: '전체', checked: false },
        { id: 'floor_2', label: '1~4', checked: false },
        { id: 'floor_3', label: '5~10', checked: false },
        { id: 'floor_4', label: '11~', checked: false },
    ]);

    const handleFloorCheckboxChange = (id) => {
        const updatedCheckboxes = floorCheckbox.map((floor) =>
        floor.id === id ? { ...floor, checked: !floor.checked } : floor
        );
    
        // "전체" 체크박스가 클릭된 경우, 나머지 체크박스 상태를 업데이트
        if (id === 'floor_1') {
          const allChecked = updatedCheckboxes[0].checked;
          updatedCheckboxes.slice(1).forEach((floor) => (floor.checked = allChecked));
        } else {
          // "전체" 체크박스가 아닌 경우, "전체" 체크박스의 상태를 업데이트
          const allChecked = updatedCheckboxes.slice(1).every((floor) => floor.checked);
          updatedCheckboxes[0].checked = allChecked;
        }
    
        setFloorCheckbox(updatedCheckboxes);
    };

    const getFloorList = () => {
        const floorItems = floorCheckbox
          .filter((checkbox) => checkbox.checked && checkbox.id !== 'floor_1')
          .map((checkbox) => checkbox.label);
        return floorItems.join(',');
    };
    /** 지상층수 끝  ============================================== */

    /** 분석/시각화 시작  ============================================== */
    const [analysisCheckbox, setAnalysisCheckbox] = useState([
        { id: 'analysis_1', label: '전체', checked: false },
        { id: 'analysis_2', label: '전반평가(건축맥락)', checked: false },
        { id: 'analysis_3', label: '공간별 평가', checked: false },
    ]);

    const handleAnalysisCheckboxChange = (id) => {
        const updatedCheckboxes = analysisCheckbox.map((analysis) =>
        analysis.id === id ? { ...analysis, checked: !analysis.checked } : analysis
        );
    
        // "전체" 체크박스가 클릭된 경우, 나머지 체크박스 상태를 업데이트
        if (id === 'analysis_1') {
          const allChecked = updatedCheckboxes[0].checked;
          updatedCheckboxes.slice(1).forEach((analysis) => (analysis.checked = allChecked));
        } else {
          // "전체" 체크박스가 아닌 경우, "전체" 체크박스의 상태를 업데이트
          const allChecked = updatedCheckboxes.slice(1).every((analysis) => analysis.checked);
          updatedCheckboxes[0].checked = allChecked;
        }
    
        setAnalysisCheckbox(updatedCheckboxes);
    };

    const getAnalysisList = () => {
        const analysisItems = analysisCheckbox
          .filter((checkbox) => checkbox.checked && checkbox.id !== 'analysis_1')
          .map((checkbox) => checkbox.label);
        return analysisItems.join(',');
    };
    /** 분석/시각화 끝  ============================================== */
    
    return (
        <>
            <form noValidate onSubmit={formik.handleSubmit} {...props}>
                {pageStep === 0 && (
                    <>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 25,
                                    height: 25,
                                    border: (theme) => `1px solid ${theme.palette.divider}`,
                                    borderRadius: 20,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography sx={{ fontWeight: 'fontWeightBold' }} variant="subtitle1">
                                    1
                                </Typography>
                            </Box>
                            <Typography sx={{ ml: 2 }} variant="subtitle1">
                                본인인증
                            </Typography>
                        </Box>
                        <TextField
                            error={Boolean(formik.touched.name && formik.errors.name)}
                            fullWidth
                            helperText={formik.touched.name && formik.errors.name}
                            label={t('이름')}
                            margin="normal"
                            name="name"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.name}
                        />
                        <Grid
                            container
                            spacing={1}
                            sx={{
                                justifyContent: 'center',
                                alignItems: 'top',
                            }}
                        >
                            <Grid item xs={9}>
                                <TextField
                                    // disabled={sendCode}
                                    error={Boolean(formik.touched.phone && formik.errors.phone)}
                                    fullWidth
                                    helperText={formik.touched.phone && formik.errors.phone}
                                    label={t('휴대폰 번호')}
                                    margin="normal"
                                    name="phone"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.phone}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    disabled={Boolean(formik.errors.name || formik.errors.phone) || sendCode}
                                    fullWidth
                                    size="large"
                                    type="button"
                                    sx={{ padding: 1.5, mt: 2 }}
                                    variant="outlined"
                                    onClick={() => onClickSendCode(formik.values.phone)}
                                >
                                    전송
                                </Button>
                            </Grid>
                        </Grid>
                        {sendCode && (
                            <>
                                <Typography color="textSecondary" variant="caption">
                                    {'인증번호를 받지 못하셨나요? '}
                                    <Button
                                        size="saml"
                                        type="button"
                                        sx={{
                                            fontSize: '0.75rem',
                                            fontWeight: 400,
                                            lineHeight: 1,
                                        }}
                                        onClick={() => onClickSendCode(formik.values.phone)}
                                    >
                                        {t('인증번호 재전송')}
                                    </Button>
                                </Typography>
                            </>
                        )}

                        {sendCode && (
                            <>
                                <TextField
                                    error={Boolean(formik.touched.code && formik.errors.code)}
                                    fullWidth
                                    helperText={formik.touched.code && formik.errors.code}
                                    label={t('인증 번호')}
                                    margin="normal"
                                    name="code"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.code}
                                />

                                {verifyError && (
                                    <Box sx={{ mb: 2 }}>
                                        <FormHelperText error>{'인증번호가 올바르지 않습니다.'}</FormHelperText>
                                    </Box>
                                )}

                                {verifyComplete && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography color="text.main" variant="caption">
                                            {'인증되었습니다.'}
                                        </Typography>
                                    </Box>
                                )}
                            </>
                        )}
                        <div style={radiobtn.box}>
                            <div className="form_radio_btn" style={radiobtn.formRadioBtn}>
                                <input type="radio" id="radio-1" name="userType" onChange={handleRadioChange} value="1" style={radiobtn.input} />
                                <label htmlFor="radio-1" style={getLabelStyle('radio-1')}>개인회원</label>
                            </div>
                            <div className="form_radio_btn" style={radiobtn.formRadioBtn}>
                                <input type="radio" id="radio-2" name="userType" onChange={handleRadioChange} value="2" style={radiobtn.input} />
                                <label htmlFor="radio-2" style={getLabelStyle('radio-2')}>기업회원</label>
                            </div>
                        </div>
                        <div>
                            <Typography sx={{ mt: 4 }} variant="subtitle1">
                                시설물 유형
                            </Typography>
                            <div className='checkbox_grid type02'>
                                <div>
                                    <input className='custom_check' type="checkbox" id="check_1" name="mchk1" checked/>
                                    <label htmlFor="check_1">근린생활시설</label>
                                </div>
                            </div>

                            <Typography sx={{ mt: 2 }} variant="subtitle1">
                                지역구분
                            </Typography>
                            <div className='checkbox_flex'>
                                {regionCheckbox.map((region) => (
                                    <div key={region.id}>
                                        <input
                                            className='custom_check'
                                            type="checkbox"
                                            id={region.id}
                                            name="mchk2"
                                            checked={region.checked}
                                            onChange={() => handleRegionCheckboxChange(region.id)}
                                        />
                                        <label htmlFor={region.id}>{region.label}</label>
                                    </div>
                                ))}
                            </div>

                            <Typography sx={{ mt: 2 }} variant="subtitle1">
                                연면적(m²)
                            </Typography>
                            <div className='checkbox_flex'>
                                {areaCheckbox.map((area) => (
                                    <div key={area.id}>
                                        <input
                                            className='custom_check'
                                            type="checkbox"
                                            id={area.id}
                                            name="mchk3"
                                            checked={area.checked}
                                            onChange={() => handleAreaCheckboxChange(area.id)}
                                        />
                                        <label htmlFor={area.id}>{area.label}</label>
                                    </div>
                                ))}
                            </div>

                            <Typography sx={{ mt: 2 }} variant="subtitle1">
                                지상층수
                            </Typography>
                            <div className='checkbox_flex'>
                                {floorCheckbox.map((floor) => (
                                    <div key={floor.id}>
                                        <input
                                            className='custom_check'
                                            type="checkbox"
                                            id={floor.id}
                                            name="mchk4"
                                            checked={floor.checked}
                                            onChange={() => handleFloorCheckboxChange(floor.id)}
                                        />
                                        <label htmlFor={floor.id}>{floor.label}</label>
                                    </div>
                                ))}
                            </div>
                            
                            <Typography sx={{ mt: 2 }} variant="subtitle1">
                                분석/시각화
                            </Typography>
                            <div className='checkbox_flex'>
                                {analysisCheckbox.map((analysis) => (
                                    <div key={analysis.id}>
                                        <input
                                            className='custom_check'
                                            type="checkbox"
                                            id={analysis.id}
                                            name="mchk5"
                                            checked={analysis.checked}
                                            onChange={() => handleAnalysisCheckboxChange(analysis.id)}
                                        />
                                        <label htmlFor={analysis.id}>{analysis.label}</label>
                                    </div>
                                ))}
                            </div>
                            
                        </div>
                        <Box sx={{ mt: 2 }}>
                            <Button disabled={Boolean(formik.errors.code)} fullWidth size="large" type="button" variant="contained" onClick={() => onClickVerify(formik.values.phone, formik.values.code)}>
                                {t('확인')}
                            </Button>
                        </Box>
                        {isPhoneExist && <FormHelperText error>{t('이미 가입된 정보입니다.')}</FormHelperText>}
                        {sendError && <FormHelperText error>{t('인증문자 발송 오류. 새로고침 후 가입 부탁드립니다.')}</FormHelperText>}
                    </>
                )}
                {pageStep === 1 && (
                    <>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 25,
                                    height: 25,
                                    border: (theme) => `1px solid ${theme.palette.divider}`,
                                    borderRadius: 20,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography sx={{ fontWeight: 'fontWeightBold' }} variant="subtitle1">
                                    2
                                </Typography>
                            </Box>
                            <Typography sx={{ ml: 2 }} variant="subtitle1">
                                계정정보
                            </Typography>
                        </Box>
                        <TextField
                            error={Boolean(formik.touched.email && formik.errors.email)}
                            fullWidth
                            helperText={formik.touched.email && formik.errors.email}
                            label={t('아이디(메일주소)')}
                            margin="normal"
                            name="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="email"
                            value={formik.values.email}
                        />
                        <TextField
                            error={Boolean(formik.touched.password && formik.errors.password)}
                            fullWidth
                            helperText={formik.touched.password && formik.errors.password}
                            label={t('비밀번호')}
                            margin="normal"
                            name="password"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.password}
                        />
                        <TextField
                            error={Boolean(formik.touched.passwordcheck && formik.errors.passwordcheck)}
                            fullWidth
                            helperText={formik.touched.passwordcheck && formik.errors.passwordcheck}
                            label={t('비밀번호 확인')}
                            margin="normal"
                            name="passwordcheck"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.passwordcheck}
                        />
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                ml: -1,
                                mt: 2,
                            }}
                        >
                            <Checkbox checked={formik.values.policy} name="policy" onChange={formik.handleChange} />
                            <Typography color="textSecondary" variant="body2">
                                {t(' 서비스 이용약관 동의')}{' '}
                                <Link component="a" href="#">
                                    {t('이용약관')}
                                </Link>
                            </Typography>
                        </Box>
                        {Boolean(formik.touched.policy && formik.errors.policy) && <FormHelperText error>{formik.errors.policy}</FormHelperText>}
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                ml: -1,
                                mb: 2,
                            }}
                        >
                            <Checkbox checked={formik.values.mailing} name="mailing" onChange={formik.handleChange} />
                            <Typography color="textSecondary" variant="body2">
                                {t('마케팅 및 광고 활용 동의')}{' '}
                                <Link component="a" href="#">
                                    {t('내용보기')}
                                </Link>
                            </Typography>
                        </Box>
                        {formik.errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{formik.errors.submit}</FormHelperText>
                            </Box>
                        )}
                        <Box sx={{ mt: 2 }}>
                            <Button
                                // disabled={formik.isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                {t('회원가입')}
                            </Button>
                        </Box>
                    </>
                )}
            </form>
        </>
    )
}
