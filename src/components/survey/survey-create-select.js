import { Fragment, useEffect, useState } from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { UuidTool } from 'uuid-tool'

/*MUI Element*/
import { styled } from '@mui/material/styles'
import { AppBar, Avatar, Badge, Box, Button, ButtonBase, IconButton, Toolbar, Tooltip, Typography, Divider } from '@mui/material'

/*MUI Icon*/
import LogoutIcon from '@mui/icons-material/Logout'

/*Custom Icon*/
import { IconSurvey } from '@public/votg/IconSurvey'
import { IconPayment } from '@public/votg/IconPayment'
import { IconMypage } from '@public/votg/IconMypage'
import { IconCreateDragDrop } from '@public/votg/IconCreateDragDrop'
import { IconCreateOnlineForm } from '@public/votg/IconCreateOnlineForm'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'

/* Survey Id Creater*/
import { createResourceCode } from '@utils/create-resource-id'
/* Survey Schema */
import { surveyType } from '@schema/survey-type'

const SurveyCreateSelect = () => {
    return (
        <>
            <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {/* Intro TItle */}
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography sx={{ py: 1, color: 'primary.main', fontSize: '1rem', fontWeight: 700, textAlignt: 'center' }}>뷰즈온더고에 오신것을 환영합니다.</Typography>
                    <Typography sx={{ color: 'text.black', fontSize: '1.5rem', fontWeight: 700, textAlignt: 'center' }}>지금 바로 설문지를 제작해보세요!</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                {/* Service Card */}
                <Box sx={{ width: '100%', height: { sm: '45vh', xs: '20vh' }, pt: 3, display: 'flex', flexWrap: 'wrap', gap: '1rem', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <NextLink href={`/ws/survey/${createResourceCode()}/${surveyType[0].url}/editor`}>
                        <Box
                            sx={{
                                flexGrow: 1,
                                height: '100%',
                                background: '#FF5353',
                                display: 'flex',
                                flexDirection: { sm: 'column', xs: 'row' },
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: 'all 0.5s',
                                '&:hover': {
                                    cursor: 'pointer',
                                    opacity: 0.8,
                                    transition: 'all 0.5s',
                                },
                            }}
                        >
                            <Typography
                                sx={{ flexGrow: { sm: 1, xs: 'none' }, fontSize: { sm: '2rem', xs: '1.5rem' }, fontWeight: 700, color: '#fff', display: { sm: 'flex', xs: 'none' }, flexDirection: 'column', justifyContent: 'end' }}
                            ></Typography>
                            <IconCreateOnlineForm customColor="#fff" sx={{ flexGrow: { sm: 1, xs: 'none' }, width: { sm: '5rem', xs: '30px' }, mr: 2 }} />
                            <Typography sx={{ flexGrow: { sm: 1, xs: 'none' }, fontSize: { sm: '2rem', xs: '1.5rem' }, fontWeight: 700, color: '#fff' }}>온라인 설문 제작하기</Typography>
                        </Box>
                    </NextLink>
                </Box>
            </Box>
        </>
    )
}

export default SurveyCreateSelect
