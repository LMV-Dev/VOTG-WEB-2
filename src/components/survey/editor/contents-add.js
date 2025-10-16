import React from 'react'
import { Box, Grid } from '@mui/material'
/* M Icon */
import AddCircleIcon from '@mui/icons-material/AddCircle'

const ContentsAdd = (props) => {
    const { onClickAddQeustionItem } = props
    return (
        <Box
            sx={{
                mx: 1,
            }}
        >
            <Grid container spacing={1}>
                <Grid item xs={8} xmd={8} md={9}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 2,
                            opacity: 0.1,
                            transition: 'all 0.5s',
                            '&:hover': {
                                py: 2,
                                opacity: 0.8,
                                cursor: 'pointer',
                                transition: 'all 0.5s',
                            },
                        }}
                        onClick={onClickAddQeustionItem}
                    >
                        <Box
                            sx={{
                                flex: '1 1 auto',
                                width: '100%',
                                height: '2px',
                                background: '#FF5353',
                            }}
                        />
                        <AddCircleIcon size={18} sx={{ color: '#FF5353' }} />

                        <Box
                            sx={{
                                flex: '1 1 auto',
                                width: '100%',
                                height: '2px',
                                background: '#FF5353',
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ContentsAdd
