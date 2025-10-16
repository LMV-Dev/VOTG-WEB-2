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

/*MUI Element*/
import { Box, CircularProgress, Button, Card, Link, Checkbox, FormHelperText, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

const PanelAnswerMax = 12

const Session_00 = 6
const Session_01 = 9
const Session_02 = 6

const BoardSurvey = ({ answerAllData }) => {
    console.log('answerAllData', answerAllData.length)
    const isMounted = useMounted()
    const router = useRouter()

    return (
        <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
            <Box sx={{ width: '100%', my: 2 }} />
            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                <Typography variant="h6" textAlign="left">
                    요청 설문 리스트
                </Typography>
            </Box>
            <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />
            <Box sx={{ py: 10 }}>
                <Typography sx={{ color: 'secondary.main' }}>참여 요청한 설문이 없습니다.</Typography>
            </Box>
        </Box>
    )
}

export default BoardSurvey
