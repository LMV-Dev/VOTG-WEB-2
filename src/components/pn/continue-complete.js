import { useState } from 'react'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*MUI Icon*/
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'

const ContinueComplete = () => {
    const [selectedNumber, setSelectedNumber] = useState(null)

    const onClickSelectedNumber = (value) => {
        setSelectedNumber(value)
    }
    return (
        <>
            <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                <Box sx={{ width: '100%', my: 2 }} />
                <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                    <Typography sx={{ width: '100%', my: 3, color: 'text.main', fontSize: '1.3rem', fontWeight: 700, textAlign: 'center' }}>
                        축하합니다!
                        <br />
                        설문 응답 모두 완료하여 <br />
                        리워드를 지급받았습니다.
                    </Typography>
                </Box>
                <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />
                <Box sx={{ mt: 3, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', border: '10px solid #000', borderRadius: '15px' }}>
                    <Typography sx={{ width: '100%', mt: 2, color: 'text.main', fontSize: '2rem', fontWeight: 700, textAlign: 'center' }}>1000</Typography>
                    <Typography sx={{ width: '100%', mb: 1, color: 'text.main', fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }}>포인트</Typography>
                </Box>
                <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Button component="a" href="/panel/board" variant="contained" color="info" size="large" fullWidth>
                            완료
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default ContinueComplete
