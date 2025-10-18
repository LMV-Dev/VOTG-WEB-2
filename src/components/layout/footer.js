import NextLink from 'next/link'
import { Box, Container, Divider, Grid, Link, List, ListItem, ListItemAvatar, ListItemText, Typography, Button, IconButton } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { MinusOutlined as MinusOutlinedIcon } from '@components/icons/minus-outlined'
import { useSettings } from '@hooks/use-settings'
import { useAuth } from '@hooks/use-auth'
import { toast } from 'react-toastify'
import { Logo } from '@components/layout/logo'
import { Fragment } from 'react'

/* MUI icon */
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'

export const Footer = (props) => {
    const auth = useAuth()
    const { logout } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
            handlePushRoutingEvent()
            toast.success('로그아웃')
        } catch (err) {
            console.error(err)
            toast.error('Unable to logout.')
        }
    }

    const serviceMenu = [
        {
            title: '로그인·회원가입',
            href: '/auth/login',
        },
        {
            title: '로그아웃',
            href: '/#',
        },
        {
            title: '서비스 소개',
            href: '/service/research',
        },
    ]

    const snsMenu = [
        {
            title: '인스타그램',
            href: 'https://www.instagram.com/views_on_the_go/',
            icon: <InstagramIcon color="white" fontSize="medium" sx={{ mr: 1 }} />,
        },
        {
            title: '유튜브',
            href: 'https://www.youtube.com/@viewsonthego/videos',
            icon: <YouTubeIcon color="white" fontSize="medium" sx={{ mr: 1 }} />,
        },
    ]

    return (
        <div></div>
        // <Box
        //     sx={{
        //         backgroundColor: '#FF5353',
        //         borderTopColor: 'divider',
        //         borderTopStyle: 'solid',
        //         borderTopWidth: 1,
        //         pb: 6,
        //         pt: {
        //             md: 8,
        //             xs: 6,
        //         },
        //         mt: -1,
        //     }}
        //     {...props}
        // >
        //     <Container
        //         maxWidth="xl"
        //         sx={{
        //             alignItems: 'left',
        //             display: 'flex',
        //             flexDirection: 'column',
        //             px: { sm: 15, xs: 2 },
        //         }}
        //     >
        //         <Grid container sx={{ display: 'flex', flexDirection: 'row' }}>
        //             <Grid item md={4} xs={12}>
        //                 <Typography align="left" variant="h5" color="text.white">
        //                     VIEWS ON THE GO
        //                 </Typography>
        //             </Grid>
        //             <Grid item md={8} xs={12}>
        //                 <Box sx={{ display: { sm: 'flex', xs: 'none' }, justifyContent: 'right', flexDirection: { md: 'row-reverse', xs: 'column' }, my: { md: 0, xs: 1 } }}>
        //                     {serviceMenu.map((v, index) => {
        //                         if (index === 0 && !auth.isAuthenticated) {
        //                             return (
        //                                 <Button component="a" href={v.href} key={`footer-nav-${index}`}>
        //                                     <Box sx={{ cursor: 'pointer', ':hover': { opacity: 0.8 } }}>
        //                                         <Typography align="left" color="text.white" sx={{ fontSize: { md: '0.9rem', xs: '1rem' }, fontWeight: 500, mr: { md: 3, xs: 1 } }}>
        //                                             {v.title}
        //                                         </Typography>
        //                                     </Box>
        //                                 </Button>
        //                             )
        //                         } else if (index === 1 && auth.isAuthenticated) {
        //                             return (
        //                                 <Button sx={{ cursor: 'pointer', ':hover': { opacity: 0.8 } }} onClick={() => handleLogout()} key={`footer-nav-${index}`}>
        //                                     <Typography align="left" color="text.white" sx={{ fontSize: { md: '0.9rem', xs: '1rem' }, fontWeight: 500, mr: { md: 3, xs: 1 } }}>
        //                                         {v.title}
        //                                     </Typography>
        //                                 </Button>
        //                             )
        //                         }
        //                         if (index === 2) {
        //                             return (
        //                                 <Button sx={{ cursor: 'pointer', ':hover': { opacity: 0.8 } }} key={`footer-nav-${index}`} href={v.href}>
        //                                     <Typography align="left" color="text.white" sx={{ fontSize: { md: '0.9rem', xs: '1rem' }, fontWeight: 500, mr: { md: 3, xs: 1 } }}>
        //                                         {v.title}
        //                                     </Typography>
        //                                 </Button>
        //                             )
        //                         }
        //                     })}
        //                 </Box>
        //             </Grid>
        //         </Grid>

        //         <Grid container sx={{ display: 'flex', flexDirection: 'row' }}>
        //             <Grid item md={4} xs={12}></Grid>
        //             <Grid item md={8} xs={12}>
        //                 <Box sx={{ display: { sm: 'flex', xs: 'none' }, justifyContent: 'right', flexDirection: { md: 'row-reverse', xs: 'column' }, my: { md: 0, xs: 1 } }}>
        //                     {snsMenu.map((v, index) => {
        //                         return (
        //                             <IconButton key={`footer-sns-${index}`} component="a" href={v.href} target="_blank" sx={{ cursor: 'pointer', ':hover': { opacity: 0.8 }, mr: { md: 2, xs: 1 } }}>
        //                                 {v.icon}
        //                                 <Typography align="left" color="text.white" sx={{ fontSize: { md: '0.9rem', xs: '1rem' }, fontWeight: 500, mr: { md: 2, xs: 1 } }}>
        //                                     {v.title}
        //                                 </Typography>
        //                             </IconButton>
        //                         )
        //                     })}
        //                 </Box>
        //             </Grid>
        //         </Grid>

        //         <Box
        //             sx={{
        //                 justifyContent: 'left',
        //                 alignItems: 'lett',
        //                 display: 'flex',
        //             }}
        //         >
        //             <Typography color="#fff" variant="caption" align="left">
        //                 상호 : (주)로코모션뷰 | 대표자명 : 김도연
        //                 <br />
        //                 사업자등록번호 : 724-81-02383 | 통신판매업신고번호 : 제2022-서울영등포-2374
        //                 <br />
        //                 연락처 : 1899-1294 | 이메일 : info@locomotionview.com | 인스타그램 :{' '}
        //                 <a href="https://www.instagram.com/views_on_the_go/" target="_blank">
        //                     @views_on_the_go
        //                 </a>
        //                 <br />
        //                 주소 : 서울특별시 영등포구 여의대로 108, 타워1동 4층 422디07호(여의도동, 파크원)
        //                 <br />
        //                 <NextLink href="/privacy" passHref>
        //                     <a>개인정보보호정책</a>
        //                 </NextLink>
        //                 {` | `}
        //                 <NextLink href="/terms" passHref>
        //                     <a>전자상거래이용약관</a>
        //                 </NextLink>
        //                 <br />
        //                 <br />
        //                 Copyright 2022 Ⓒ LocomotionView Inc.
        //             </Typography>
        //         </Box>
        //     </Container>
        // </Box>
    )
}
