import React from 'react'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*Mui Icon */
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'

const RegisterBottomButton = ({ stepEnable, onClickBackStep, onClickNextStep }) => {
    return (
        <Box sx={{ px: 2, pt: 2, pb: 5, height: '80px', position: 'fixed', bottom: 0, background: '#fff', boxShadow: (theme) => theme.shadows[3], width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
            <Container component="main" maxWidth="sm" sx={{}}>
                <Grid container spacing={1}>
                    <Grid item xs={5}>
                        <Button onClick={onClickBackStep} variant="outlined" color="secondary" size="large" fullWidth startIcon={<KeyboardArrowLeftIcon />}>
                            뒤로
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                        <Button disabled={!stepEnable} onClick={onClickNextStep} variant="contained" color="info" size="large" fullWidth endIcon={<KeyboardArrowRightIcon />}>
                            다음
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default RegisterBottomButton
