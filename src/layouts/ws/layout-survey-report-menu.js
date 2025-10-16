import { useState, useEffect } from 'react'
import NextLink from 'next/link'
import PropTypes, { bool } from 'prop-types'
import { styled } from '@mui/material/styles'
import { UuidTool } from 'uuid-tool'
import { toast } from 'react-toastify'
import API from '@utils/API'
import { wait } from '@utils/wait'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'

/*MUI Component*/
import { Box, Typography, Toolbar, IconButton } from '@mui/material'
/*MUI Icon*/
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'

/*Import Components*/
import SurveyMenu from '@components/ws/survey-menu'

/*Root*/
const LayoutSurveyRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
}))

/* Menu Info Init*/

const LayoutSurveyReportMenu = (props) => {
    const { children, editMode, questionCheck, panelCheck, errorList } = props
    /*User*/
    const { user, logout } = useAuth()
    /*Router*/
    const router = useRouter()
    // Path Check
    const { asPath, pathname } = router // asPath = /realdata , pathname = /[code]
    // Param Check
    const { code, type } = router.query

    const [scrolled, setScrolled] = useState(false)

    // 스크롤 이벤트 감지
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10
            setScrolled(isScrolled)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
            <LayoutSurveyRoot>{children}</LayoutSurveyRoot>
    )
}

LayoutSurveyReportMenu.propTypes = {
    children: PropTypes.node,
    editMode: bool,
}

export default LayoutSurveyReportMenu