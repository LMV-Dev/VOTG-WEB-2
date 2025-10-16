import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'

export const IconSurveyDuplicate = styled((props) => {
    const { variant, customColor, ...other } = props
    const color = variant === 'light' ? '#fff' : '#FF5353'

    if (customColor != undefined) {
        color = customColor
    }

    return (
        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" {...other}>
            <rect x="0.5" y="0.5" width="28" height="28" rx="4.5" fill={color} stroke={color} />
            <path d="M8.69922 13.8657L14.1367 19.5751L21.0242 11.6001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
})``

IconSurveyDuplicate.defaultProps = {
    variant: 'color',
}
IconSurveyDuplicate.propTypes = {
    variant: PropTypes.oneOf(['light', 'color']),
}
