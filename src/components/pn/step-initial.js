import React from 'react'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

const StepInitial = ({ onClickNextStep }) => {
    return (
        <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
            <Box sx={{ width: '100%', my: 2 }} />
            <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                <Typography sx={{ my: 3, color: 'text.main', fontSize: '1rem', fontWeight: 700, textAlign: 'left' }}>지금부터 뷰즈온더고 패널을 위한 설문조사를 시작하겠습니다.</Typography>
                <Typography sx={{ my: 1, color: 'text.main', fontSize: '0.8rem', fontWeight: 500, textAlign: 'left' }}>이 설문조사를 진행하지 않거나, 진행 도중 멈춘다 해도 회원가입이 취소되진 않습니다.</Typography>
                <Typography sx={{ my: 1, color: 'text.main', fontSize: '0.8rem', fontWeight: 500, textAlign: 'left' }}>
                    다만 상세한 패널 조건이 있는 설문 패널 선정에서 불이익이 있을 수 있습니다.
                    <br />
                    <br />이 점 양해바랍니다.
                </Typography>

                <Typography sx={{ my: 3, color: 'text.main', fontSize: '1rem', fontWeight: 700, textAlign: 'left' }}>설문을 모두 완료하신 분들은 총 3,000원의 포인트가 지급됩니다.</Typography>
            </Box>
            <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 5 }} />
            {/* <NextLink href="/panel/register"> */}
            <Button onClick={onClickNextStep} variant="outlined" color="info" size="large" fullWidth>
                시작하기
            </Button>
            {/* </NextLink> */}
        </Box>
    )
}

export default StepInitial
