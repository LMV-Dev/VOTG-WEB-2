import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'

export const IconSurveyRadio = styled((props) => {
    const { variant, customColor, ...other } = props
    const color = variant === 'light' ? '#fff' : '#FF5353'

    if (customColor != undefined) {
        color = customColor
    }

    return (
        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" {...other}>
            <circle cx="14.5" cy="14.5" r="13.5" fill="white" stroke={color} strokeWidth="2" />
            <ellipse cx="14.6227" cy="14.5" rx="7.2614" ry="7.25" fill={color} />
        </svg>
    )
})``

IconSurveyRadio.defaultProps = {
    variant: 'color',
}
IconSurveyRadio.propTypes = {
    variant: PropTypes.oneOf(['light', 'color']),
}
