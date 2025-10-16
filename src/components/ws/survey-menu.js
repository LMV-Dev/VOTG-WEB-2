import { Fragment, useEffect, useState } from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

/*MUI Element*/
import { styled } from '@mui/material/styles'
import { AppBar, Avatar, Badge, Box, Button, ButtonBase, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'

/*MUI Icon*/
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

/*Custom Icon*/
import { IconSurvey } from '@public/votg/IconSurvey'
import { IconPayment } from '@public/votg/IconPayment'
import { IconMypage } from '@public/votg/IconMypage'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'

/*Custom Icon*/

/*Import Components*/
import PopupWarningWithCancel_Logout from '@components/popup/popup-warning-with-cancel'
import PopupWarningWithCancel_MoveHome from '@components/popup/popup-warning-with-cancel'

/* Survey Id Creater*/
import { createResourceCode } from '@utils/create-resource-id'
/* Survey Schema */
import { surveyType } from '@schema/survey-type'

/*Initial Data*/
// 1-1. Create Oline Menu List
const menuTypeOnlineCreate = (code, type) => [
    {
        title: '설문제작',
        short: '제작',
        href: `/ws/survey/${code}/${type}/editor`,
    },
    {
        title: '미리보기',
        short: '보기',
        href: `/ws/survey/${code}/${type}/preview`,
    },
    // {
    //     title: '패널설정',
    //     short: '패널',
    //     href: `/ws/survey/${code}/${type}/pnls`,
    // },
    // {
    //     title: '리워드',
    //     short: '리워드 ',
    //     href: `/ws/survey/${code}/${type}/reward`,
    // },
    {
        title: '배포하기',
        short: '배포',
        href: `/ws/survey/${code}/${type}/share`,
    },
]
// 1-2. Edit Oline Menu List
const menuTypeOlineEdit = (code, type) => [
    {
        title: '설문수정',
        short: '수정',
        href: `/ws/survey/${code}/${type}/editor`,
    },
    {
        title: '미리보기',
        short: '보기',
        href: `/ws/survey/${code}/${type}/preview`,
    },
    // {
    //     title: '패널설정',
    //     short: '패널',
    //     href: `/ws/survey/${code}/${type}/pnls`,
    // },
    // {
    //     title: '리워드',
    //     short: '리워드 ',
    //     href: `/ws/survey/${code}/${type}/reward`,
    // },
    {
        title: '배포하기',
        short: '배포',
        href: `/ws/survey/${code}/${type}/share`,
    },
]

// 2-1. Create Convert Menu List
const menuTypeConvertCreate = (code, type) => [
    {
        title: '설문변환',
        short: '변환',
        href: `/ws/survey/${code}/${type}/convert`,
    },
    {
        title: '설문제작',
        short: '제작',
        href: `/ws/survey/${code}/${type}/editor`,
    },
    {
        title: '미리보기',
        short: '보기',
        href: `/ws/survey/${code}/${type}/preview`,
    },
    // {
    //     title: '패널설정',
    //     short: '패널',
    //     href: `/ws/survey/${code}/${type}/pnls`,
    // },
    // {
    //     title: '리워드',
    //     short: '리워드 ',
    //     href: `/ws/survey/${code}/${type}/reward`,
    // },
    {
        title: '배포하기',
        short: '배포',
        href: `/ws/survey/${code}/${type}/share`,
    },
]

// 2-1. Create Convert Menu List
const menuTypeConvertEdit = (code, type) => [
    {
        title: '설문변환',
        short: '변환',
        href: `/ws/survey/${code}/${type}/convert`,
    },
    {
        title: '설문수정',
        short: '수정',
        href: `/ws/survey/${code}/${type}/editor`,
    },
    {
        title: '미리보기',
        short: '보기',
        href: `/ws/survey/${code}/${type}/preview`,
    },
    // {
    //     title: '패널설정',
    //     short: '패널',
    //     href: `/ws/survey/${code}/${type}/pnls`,
    // },
    // {
    //     title: '리워드',
    //     short: '리워드 ',
    //     href: `/ws/survey/${code}/${type}/reward`,
    // },
    {
        title: '배포하기',
        short: '배포',
        href: `/ws/survey/${code}/${type}/share`,
    },
]

/**
 *  설문조사 제작 시 진행되는 Router Path 에 따른 메뉴를 제공
 *  각 메뉴에 해당하는 리스트는 json 형태로 관리
 *  Router Path가 일치할 경우 해당하는 Progress 메뉴를 하이라이트 해줌.
 *
 *  같은 위치에 존재하는 '다음' 버튼은 상위 layout-survey-progress-menu 에 서
 *  정의해준 '이름 : name'과 '이벤트 : event'에 의해서 동적으로 정의됨.
 *
 *  특정 위체에서 메뉴를 통해 발생하는 이벤트의 경우 layout 단에서 관리
 *
 *  layouts -> ws -> layout-survey-progress-menu.js
 * */
const SurveyMenu = (props) => {
    const { editMode, menuInfo, progressTriger } = props
    const [importMenuInfo, setImportMenuinfo] = useState(menuInfo)
    /*Router*/
    const router = useRouter()
    // Path Check
    const { asPath, pathname } = router // asPath = /realdata , pathname = /[code]
    // Param Check
    const { code, type } = router.query

    /* 라우팅에 따른 메뉴 선택*/
    const [menuSelected, setMenuSelected] = useState(null)

    /* 현재 진행되는 서베이 타입구분하여 메뉴 리스트 선택*/
    useEffect(() => {
        if (type == surveyType[0].url) {
            setMenuSelected(!editMode ? menuTypeOnlineCreate(code, type) : menuTypeOlineEdit(code, type))
        } else if (type == surveyType[1].url) {
            setMenuSelected(!editMode ? menuTypeConvertCreate(code, type) : menuTypeConvertEdit(code, type))
        }
    }, [editMode])

    /**
     * EVENT :: 다음
     */
    const [currentMenuItemIndex, setCurrentMenuItemIndex] = useState(null)
    const [nextMenuItem, setNextMenuItem] = useState(null)
    const [nextMenuEvent, setNextMenuEvent] = useState(null)
    useEffect(() => {
        if (menuSelected !== null && menuSelected !== undefined) {
            const selectedMenuItem = menuSelected.filter((v) => v.href == asPath)[0]
            const selectedMenuIndex = menuSelected.indexOf(selectedMenuItem)
            const selectedMenuNextItem = menuSelected[selectedMenuIndex + 1]

            // console.log('selectedMenuItem - Contents ', selectedMenuItem)
            // console.log('selectedMenuItem - Index ', selectedMenuIndex)
            // console.log('nextMenuItem - Contents ', selectedMenuNextItem)
            setCurrentMenuItemIndex(selectedMenuIndex)
            setNextMenuItem(selectedMenuNextItem)

            const nextMneuEventItem = menuInfo.filter((v) => v.title === selectedMenuItem?.title)[0]
            // console.log('nextMneuEventItem - Contents ', nextMneuEventItem)
            setNextMenuEvent(nextMneuEventItem)
        }
    }, [menuSelected])

    // Next에 해당하는 버튼을 클릭했을때 앞서 설정된 이벤트를 실행함.
    // 상단의 메뉴를 클릭해서 이동할 링크를 클릭할 경우에 대한 링크 또한 href 변수를 통해 설정
    const [selectedNextLink, setSelectedNextLink] = useState(null)
    const OnClickNextButton = async (href, trigger) => {
        if (trigger) {
            nextMenuEvent.event()
            setSelectedNextLink(href)
        } else {
            router.push(href).catch(console.error)
        }
    }

    useEffect(() => {
        // console.log('progress', progress)
        // progress가 true로 바뀌어야 다음 링크로 이동함.
        if (progressTriger && nextMenuItem !== null && nextMenuItem !== undefined) {
            router.push(selectedNextLink).catch(console.error)
        }
    }, [nextMenuItem, progressTriger])

    /**
     * EVENT :: 뒤로가기
     */

    return (
        <>
            {/* Viwe Area */}
            {/* 데스크탑 버튼 */}
            <Box
                sx={{
                    background: '#fff',
                    boxShadow: (theme) => theme.shadows[3],
                    mb: 1,
                    zIndex: 10,
                    /* width: '100%', */
                    position: 'fixed',
                    top: '65px',
                    left: 0,
                    right: 0,
                }}
            >
                <Toolbar
                    disableGutters
                    sx={{
                        display: 'flex',
                        alignItems: 'stretch',
                        minHeight: 64,
                        left: 0,
                        px: 2,
                        py: 1,
                    }}
                >
                    {/* Left: 1. Menu List */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexFlow: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {menuSelected?.map((v, index) => {
                            return (
                                <Fragment key={`survey-progress-menu-convert-${index}`}>
                                    {/* {asPath.includes('editor') && index > currentMenuItemIndex + 1} */}
                                    {menuTypeLink(index, currentMenuItemIndex, asPath.includes('editor') && index > currentMenuItemIndex + 1, v, asPath, OnClickNextButton)}
                                    {index !== menuSelected.length - 1 && <ArrowRightIcon fontSize="small" sx={{ color: 'black', mx: { xmd: 2, xs: 1 } }} />}
                                </Fragment>
                            )
                        })}
                    </Box>
                    {/* 2.Right Next Button */}
                    <Box sx={{ display: { md: 'flex', xs: 'none' }, flexGrow: 1 }} />

                    <Box
                        sx={{
                            // display: 'flex',
                            display: { md: 'flex', xs: 'none' },
                            flexFlow: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            // background: '#000',
                        }}
                    >
                        {/* 뒤로가기 버튼 */}
                        {menuSelected?.map((v, index) => {
                            if (v.href === asPath && index !== 0) {
                                return (
                                    <Fragment key={`elementMenu-previewe-back-${index}`}>
                                        <NextLink href={menuSelected[index - 1].href}>
                                            <Button
                                                // onClick={handleOpenLogoutWarning}
                                                size="medium"
                                                sx={{
                                                    display: { md: 'flex', xs: 'none' },
                                                    width: '100px',
                                                    height: '30px',
                                                    borderRadius: '20px 0px 20px 0px',
                                                    mx: 1,
                                                    fontSize: '0.8rem',
                                                }}
                                                type="button"
                                                // variant="contained"
                                            >
                                                {(type === 'nml' && index == 1) || (type === 'cnvt' && index == 2) ? `설문지 수정` : `뒤로가기`}
                                            </Button>
                                        </NextLink>
                                    </Fragment>
                                )
                            }
                        })}

                        {/* 다음 버튼 */}
                        <Fragment>
                            <Button
                                onClick={() => OnClickNextButton(nextMenuItem?.href, true)}
                                size="medium"
                                sx={{
                                    display: { md: 'flex', xs: 'none' },
                                    width: '100px',
                                    height: '30px',
                                    borderRadius: '20px 0px 20px 0px',
                                    mx: 1,
                                    fontSize: '0.8rem',
                                }}
                                type="button"
                                variant="contained"
                            >
                                {nextMenuEvent?.name}
                            </Button>
                        </Fragment>
                    </Box>
                </Toolbar>
            </Box>

            {/* 모바일 버튼 */}
            <Box
                sx={{
                    display: { md: 'none', xs: 'flex' },
                    alignItems: 'stretch',
                    minHeight: 64,
                    left: 0,
                    px: 2,
                    py: 1,
                    position: 'fixed',
                    top: '140px',
                    left: 0,
                    right: 0,
                    zIndex: 10,
                }}
            >
                <Box sx={{ display: { md: 'none', xs: 'flex' }, flexGrow: 1 }} />

                {/* 뒤로가기 버튼 */}
                {menuSelected?.map((v, index) => {
                    if (v.href === asPath && index !== 0) {
                        return (
                            <Fragment key={`elementMenu-previewe-back-${index}`}>
                                <NextLink href={menuSelected[index - 1].href}>
                                    <Button
                                        size="small"
                                        component="a"
                                        // onClick={handleOpenLogoutWarning}
                                        color="secondary"
                                        sx={{
                                            display: { md: 'none', xs: 'flex' },
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            height: '2rem',
                                            background: '#65748B',
                                            color: '#fff',
                                            ':hover': {
                                                background: '#4B5563',
                                            },
                                        }}
                                        startIcon={<NavigateBeforeIcon width={40} />}
                                    >
                                        뒤로
                                    </Button>
                                </NextLink>
                            </Fragment>
                        )
                    }
                })}
                <Box sx={{ display: { md: 'none', xs: 'flex', width: '5px' } }} />

                {/* 다음 버튼 */}
                <Fragment>
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => OnClickNextButton(nextMenuItem?.href, true)}
                        sx={{
                            display: { md: 'none', xs: 'flex' },
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            height: '2rem',
                        }}
                        endIcon={<NavigateNextIcon width={40} />}
                    >
                        {nextMenuEvent?.name}
                    </Button>
                </Fragment>
            </Box>
        </>
    )
}

SurveyMenu.propTypes = {
    editMode: PropTypes.bool,
}

export default SurveyMenu

//Type 1. Menu
const menuTypeLink = (index, currentIndex, disable, menu, asPath, routerEvent) => {
    return (
        // <NextLink href={menu.href} passHref>
        <IconButton
            onClick={() => (index > currentIndex ? routerEvent(menu.href, true) : routerEvent(menu.href, false))}
            sx={{
                px: { xmd: 3, xs: 2 },
                py: 2,
                mx: { xmd: 1, xs: 0 },
                background: menu.href === asPath && 'rgba(0, 0, 0, 0.04)',
                ...(menu.href === asPath && { pointerEvents: 'none', cursor: 'default' }),
                ...(disable && { pointerEvents: 'none', cursor: 'default' }),
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography
                    color="text.black"
                    sx={{
                        display: {
                            xmd: 'inline',
                            xs: 'none',
                        },
                        fontWeight: menu.href === asPath ? 700 : 500,
                    }}
                >
                    {menu.title}
                </Typography>

                <Typography
                    color="text.black"
                    sx={{
                        display: {
                            xmd: 'none',
                            xs: 'inline',
                        },
                        fontWeight: menu.href === asPath ? 700 : 500,
                    }}
                >
                    {menu.short}
                </Typography>
            </Box>
        </IconButton>
        // </NextLink>
    )
}
