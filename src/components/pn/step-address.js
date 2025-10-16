import { useState } from 'react'

/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, Paper, MenuItem, TextField, Typography, IconButton } from '@mui/material'

/*MUI Icon*/
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'

const title = '주소를 입력해주세요. (도로명 주소까지)'
const item = [
    { text: '남성', count: 0 },
    { text: '여성', count: 10 },
]

const Step_Address = () => {
    const [selectedNumber, setSelectedNumber] = useState(null)

    const onClickSelectedNumber = (value) => {
        setSelectedNumber(value)
    }
    return (
        <>
            <Box sx={{ pt: 0, pb: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                <Box sx={{ width: '100%', my: 2 }} />
                <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                    <Typography sx={{ my: 3, color: 'text.main', fontSize: '1rem', fontWeight: 700, textAlign: 'center' }}>{title}</Typography>
                </Box>
                <Divider sx={{ width: '100%', height: '1px', mt: 5, mb: 1 }} />
                <Box sx={{ mx: 0, my: 5 }}>
                    {/* <Typography sx={{ mb: 3, textAlign: 'center', fontSize: '1.3rem', fontWeight: 700 }}>선택 :{item[selectedNumber]?.text}</Typography> */}
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box sx={{ width: '320px', height: '100px', background: '#1C60FF', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '5px' }}>
                                <TextField variant="outlined" color="info" sx={{ width: '280px', color: '#fff', background: '#fff', borderRadius: '10px' }} />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export default Step_Address
