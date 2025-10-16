import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'

export const IconSurveyLogic = styled((props) => {
    const { variant, customColor, ...other } = props
    const color = variant === 'light' ? '#fff' : '#FF5353'

    if (customColor != undefined) {
        color = customColor
    }

    return (
        <svg
            width="31"
            height="29"
            viewBox="0 0 31 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...other}
        >
            <path
                d="M20.1198 11.2642H29.9057C30.2064 11.2642 30.45 11.012 30.45 10.7006V0.563604C30.45 0.252243 30.2064 0 29.9057 0H20.1198C19.8191 0 19.5755 0.252243 19.5755 0.563604V4.22506H14.4105C14.262 4.22506 14.1402 4.35118 14.1402 4.50489V13.2348H10.8783V9.4315C10.8783 9.12014 10.6347 8.8679 10.334 8.8679H0.544294C0.2436 8.8679 0 9.12014 0 9.4315V19.5685C0 19.8799 0.2436 20.1321 0.544294 20.1321H10.3302C10.6309 20.1321 10.8745 19.8799 10.8745 19.5685V15.7652H14.1364V24.4951C14.1364 24.6488 14.2582 24.7749 14.4067 24.7749H19.5717V28.4364C19.5717 28.7478 19.8153 29 20.116 29H29.9019C30.2026 29 30.4462 28.7478 30.4462 28.4364V18.3073C30.4462 17.9959 30.2026 17.7437 29.9019 17.7437H20.1198C19.8191 17.7437 19.5755 17.9959 19.5755 18.3073V22.2486H16.5838V6.75931H19.5755V10.7006C19.5755 11.012 19.8191 11.2642 20.1198 11.2642ZM22.1562 2.67613H27.8656V8.59201H22.1562V2.67613ZM8.29382 17.4599H2.58444V11.548H8.29382V17.4599ZM22.1562 20.4198H27.8656V26.3357H22.1562V20.4198Z"
                fill={color}
            />
        </svg>
    )
})``

IconSurveyLogic.defaultProps = {
    variant: 'color',
}
IconSurveyLogic.propTypes = {
    variant: PropTypes.oneOf(['light', 'color']),
}
