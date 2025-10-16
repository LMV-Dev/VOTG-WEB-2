import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import * as Yup from 'yup'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'

import { useMounted } from '@hooks/use-mounted'
import { useAuth } from '@hooks/use-auth'
/* Language */
import { useTranslation } from 'react-i18next'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, Link, Checkbox, FormHelperText, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

const AuthNew = ({ tempUser }) => {
    const router = useRouter()
    const isMounted = useMounted()
    const { t } = useTranslation()
    const { register } = useAuth()

    /* Form Setting */
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            passwordcheck: '',
            policy: false,
            mailing: false,
            submit: null,
        },
        validationSchema: Yup.object({
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
                await register(
                    {
                        name: tempUser.name,
                        phone: tempUser.phone,
                        birthday: tempUser.birthday,
                        email: values.email,
                        password: values.password,
                        mailing: values.mailing,
                    },
                    'pn',
                )
                toast.success('회원가입 완료!')

                if (isMounted()) {
                    const returnUrl = router.query.returnUrl || '/panel/step'
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
    useEffect(() => {
        // disabled={formik.isSubmitting}/
        // console.log('formik', formik)
    }, [formik])

    if (tempUser === null) {
        return (
            <>
                <CircularProgress
                    size={24}
                    sx={{
                        color: 'primary.main',
                        position: 'relative',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />
            </>
        )
    }

    return (
        <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
            <Box sx={{ width: '100%', my: 2 }} />
            <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                <Typography sx={{ my: 3, color: 'text.main', fontSize: '1rem', fontWeight: 700, textAlign: 'left' }}>회원 가입 정보</Typography>
            </Box>
            {/* <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                <Typography sx={{ my: 1, color: 'text.main', fontSize: '0.8rem', fontWeight: 500, textAlign: 'left' }}>아래의 버튼을 눌러 본인인증을 진행해 주세요.</Typography>
                <Typography sx={{ my: 1, color: 'text.main', fontSize: '0.8rem', fontWeight: 500, textAlign: 'left' }}>이점 참고 부탁드립니다.</Typography>
            </Box> */}
            <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />
            {/* <NextLink href="/panel/register"> */}

            {/* {tempUser?.name} */}
            <form noValidate onSubmit={formik.handleSubmit}>
                <TextField
                    color="info"
                    error={Boolean(formik.errors.name)}
                    fullWidth
                    helperText={formik.errors.name}
                    label={t('이름')}
                    margin="normal"
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={tempUser.name}
                    disabled
                />
                <TextField
                    color="info"
                    error={Boolean(formik.errors.phone)}
                    fullWidth
                    helperText={formik.errors.phone}
                    label={t('휴대폰 번호')}
                    margin="normal"
                    name="phone"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={tempUser.phone}
                    disabled
                />
                <TextField
                    color="info"
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
                    color="info"
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
                    color="info"
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
                    <Checkbox color="info" checked={formik.values.policy} name="policy" onChange={formik.handleChange} />
                    <Typography color="textSecondary" variant="body2">
                        {t('개인정보보호정책 이용약관 동의')}{' '}
                        <Link component="a" href="/privacy" color="info.main">
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
                    <Checkbox color="info" checked={formik.values.mailing} name="mailing" onChange={formik.handleChange} />
                    <Typography color="textSecondary" variant="body2">
                        {t('마케팅 및 광고 활용 동의')}
                        <Link component="a" href="#" color="info.main">
                            {t('내용보기')}
                        </Link>
                    </Typography>
                </Box>
                {formik.errors.submit && (
                    <Box sx={{ mt: 3, mb: 3 }}>
                        <FormHelperText error>{formik.errors.submit}</FormHelperText>
                    </Box>
                )}
                <Button type="submit" variant="outlined" color="info" size="large" fullWidth>
                    확인
                </Button>
            </form>
            {/* </NextLink> */}
        </Box>
    )
}

export default AuthNew
