import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

/*MUI Element*/
import { Box, Typography, Button } from '@mui/material'
/*MUI Icon*/
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'

const Element_MidEmpty = (props) => {
    const { mode, isFocusing, isEditing } = props
    const [writeToggle, setWriteToggle] = useState(false)
    /*Router*/
    const router = useRouter()
    // Path Check
    const { asPath, pathname } = router // asPath = /realdata , pathname = /[code]
    // Param Check
    const { code, type } = router.query

    useEffect(() => {
        if (mode == undefined || mode == 'read') {
            setWriteToggle(false)
        } else if (mode == 'write') {
            setWriteToggle(true)
        }

        if (isEditing !== true) {
            isEditing = false
        }
        if (isFocusing !== true) {
            isFocusing = false
        }
    }, [])

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: '30px',
                pb: '50px',
            }}
        >
            {isEditing ? (
                <Box sx={{ marginTop: '1rem', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography
                        sx={{
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            textAlign: 'center',
                        }}
                    >
                        <>우측 메뉴를 통해 응답유형를 결정할 수 있습니다.</>
                    </Typography>
                    <KeyboardDoubleArrowRightIcon sx={{ fontSize: '3rem', color: 'primary.main', mx: 2 }} />
                </Box>
            ) : (
                <Box sx={{ marginTop: '1rem', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {writeToggle ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    color: 'error.main',
                                }}
                            >
                                {/*WriteMode :  Preview  */}
                                응답유형이 선택되지 않았습니다. 응답유형을 선택해주세요.
                            </Typography>
                            <Button component="a" varient="contained" href={`${asPath.replace('preview', 'editor')}`} sx={{ my: 2 }}>
                                수정하기
                            </Button>
                        </Box>
                    ) : (
                        <Typography
                            sx={{
                                fontSize: '1rem',
                                fontWeight: '700',
                                textAlign: 'center',
                                color: 'secondary.main',
                            }}
                        >
                            {/*EditMode   */}
                            클릭해서 응답 유형 결정해주세요.
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    )
}

export default Element_MidEmpty
