import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { Alert, Box, Button, FormHelperText, TextField, CircularProgress, Typography } from '@mui/material'
import { useAuth } from '@hooks/use-auth'
import { useMounted } from '@hooks/use-mounted'
/* Language */
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

export const JWTLogin = (props) => {
    const isMounted = useMounted()
    const router = useRouter()
    const auth = useAuth()
    const { login, logout } = useAuth()
    const { t } = useTranslation()

    /* Form Setting */
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            submit: null,
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t('올바른 메일주소 형식으로 입력해주세요.'))
                .max(255)
                .required(t('메일주소를 입력해주세요.')),
            password: Yup.string()
                .max(255)
                .required(t('비밀번호를 입력해주세요.')),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await login(values.email, values.password)
                // toast('환영합니다!')

                if (isMounted()) {
                    const returnUrl = router.query.returnUrl || '/?init=true'
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

    useEffect(() => {
        if (auth.isAuthenticated) {
            logout()
        }
    }, [])

    return (
        <form noValidate onSubmit={formik.handleSubmit} {...props}>
            <TextField
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
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '16px',
                        background: 'rgba(102, 126, 234, 0.02)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'rgba(102, 126, 234, 0.05)',
                        },
                        '&.Mui-focused': {
                            background: 'rgba(102, 126, 234, 0.05)',
                            '& fieldset': {
                                borderColor: '#667eea',
                                borderWidth: '2px',
                            },
                        },
                        '& fieldset': {
                            borderColor: 'rgba(102, 126, 234, 0.2)',
                            transition: 'all 0.3s ease',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        '&.Mui-focused': {
                            color: '#667eea',
                        },
                    },
                }}
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
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '16px',
                        background: 'rgba(102, 126, 234, 0.02)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'rgba(102, 126, 234, 0.05)',
                        },
                        '&.Mui-focused': {
                            background: 'rgba(102, 126, 234, 0.05)',
                            '& fieldset': {
                                borderColor: '#667eea',
                                borderWidth: '2px',
                            },
                        },
                        '& fieldset': {
                            borderColor: 'rgba(102, 126, 234, 0.2)',
                            transition: 'all 0.3s ease',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        '&.Mui-focused': {
                            color: '#667eea',
                        },
                    },
                }}
            />
            
            {formik.errors.submit && (
                <Box sx={{ mt: 3 }}>
                    <FormHelperText 
                        error
                        sx={{
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            p: 2,
                            background: 'rgba(244, 67, 54, 0.1)',
                            borderRadius: '12px',
                            border: '1px solid rgba(244, 67, 54, 0.2)',
                        }}
                    >
                        {formik.errors.submit}
                    </FormHelperText>
                </Box>
            )}
            
            <Box sx={{ mt: 4 }}>
                <Button
                    disabled={formik.isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        },
                        '&:disabled': {
                            background: 'rgba(102, 126, 234, 0.3)',
                            color: 'rgba(255, 255, 255, 0.7)',
                            transform: 'none',
                            boxShadow: 'none',
                        },
                    }}
                >
                    {formik.isSubmitting ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={20} color="inherit" />
                            로그인 중...
                        </Box>
                    ) : (
                        `🚀 ${t('로그인')}`
                    )}
                </Button>
            </Box>
        </form>
    )
}