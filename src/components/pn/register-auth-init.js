import React from 'react'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

const AuthInit = ({ onClickNextStep }) => {
    return (
        <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
            <Box sx={{ width: '100%', my: 2 }} />
            <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                <Typography sx={{ my: 3, color: 'text.main', fontSize: '1rem', fontWeight: 700, textAlign: 'left' }}>회원가입을 위해 본인 확인이 필요합니다.</Typography>
            </Box>
            <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                <Typography sx={{ my: 1, color: 'text.main', fontSize: '0.8rem', fontWeight: 500, textAlign: 'left' }}>아래의 버튼을 눌러 본인인증을 진행해 주세요.</Typography>
                <Typography sx={{ my: 1, color: 'text.main', fontSize: '0.8rem', fontWeight: 500, textAlign: 'left' }}>이점 참고 부탁드립니다.</Typography>
            </Box>
            <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 5 }} />
            {/* <NextLink href="/panel/register"> */}
            <Button onClick={onClickNextStep} variant="outlined" color="info" size="large" fullWidth>
                본인인증
            </Button>
            {/* </NextLink> */}
        </Box>
    )
}

export default AuthInit
