import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

import * as Yup from 'yup'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'

import { Logo } from '@components/layout/logo'

import { useCookies } from 'react-cookie'
import { useMounted } from '@hooks/use-mounted'
import { useAuth } from '@hooks/use-auth'
/* Language */
import { useTranslation } from 'react-i18next'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, Link, Checkbox, FormHelperText, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

const AuthIdpw = () => {
    const isMounted = useMounted()
    const router = useRouter()
    const { t } = useTranslation()
    const { login } = useAuth()

    /* Form Setting */
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            submit: null,
        },
        validationSchema: Yup.object({
            email: Yup.string().email(t('올바른 메일주소 형식으로 입력해주세요.')).max(255).required(t('메일주소를 입력해주세요.')),
            password: Yup.string().max(255).required(t('비밀번호를 입력해주세요.')),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await login(values.email, values.password, 'pn')
                toast.success('환영합니다!')

                if (isMounted()) {
                    const returnUrl = router.query.returnUrl || '/panel/board'
                    // const returnUrl = router.query.returnUrl || '/welcome?disableguard=true'

                    router.push(returnUrl).catch(console.error)
                }
            } catch (err) {
                // console.error(err)
                if (isMounted()) {
                    helpers.setStatus({ success: false })
                    helpers.setErrors({ submit: err.message })
                    helpers.setSubmitting(false)
                }
            }
        },
    })

    return (
        <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
            <Box sx={{ width: '100%', my: 2 }} />
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <NextLink href="/" passHref>
                    <a>
                        <Logo
                            variant={'dark'}
                            sx={{
                                width: 210,
                                height: 56,
                            }}
                            customColor={'#1C60FF'}
                        />
                    </a>
                </NextLink>

                <Typography variant="h4">{t('로그인')}</Typography>
                {/* <Typography color="textSecondary" sx={{ mt: 2 }} variant="body2">
                                {t('간편 로그인')}
                            </Typography> */}
            </Box>
            <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />
            <form noValidate onSubmit={formik.handleSubmit}>
                <TextField
                    // autoFocus
                    error={Boolean(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label={t('이메일')}
                    margin="normal"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                    color="info"
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
                    color="info"
                />
                {formik.errors.submit && (
                    <Box sx={{ mt: 3 }}>
                        <FormHelperText error>{formik.errors.submit}</FormHelperText>
                    </Box>
                )}
                <Box sx={{ mt: 2 }}>
                    <Button
                        disabled={formik.isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        sx={{
                            ':hover': {
                                color: 'info.contrastText',
                                boxShadow: '0 0 0 2px inset',
                                opacity: 0.8,
                            },
                        }}
                        color="info"
                    >
                        {t('로그인')}
                    </Button>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <NextLink href="/panel/auth">
                        <Button
                            fullWidth
                            size="large"
                            variant="outlined"
                            sx={{
                                ':hover': {
                                    color: 'info.main',
                                    boxShadow: '0 0 0 2px inset',
                                    opacity: 0.8,
                                },
                            }}
                            color="info"
                        >
                            {t('회원가입 하기')}
                        </Button>
                    </NextLink>
                </Box>
                {/* <Box sx={{ mt: 2 }}>
                <Alert severity="info">
                    <div>
                        Use <b>demo@devias.io</b> and password <b>Password123!</b>
                    </div>
                </Alert>
            </Box> */}
            </form>
        </Box>
    )
}

export default AuthIdpw
