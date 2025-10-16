import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'

export const IconTp00Bus = styled((props) => {
    const { variant, customColor, ...other } = props
    var color = variant === 'light' ? '#fff' : '#FF5353'
    if (customColor != undefined) {
        color = customColor
    }

    return (
        <svg width="68" height="63" viewBox="0 0 68 63" fill="none" xmlns="http://www.w3.org/2000/svg" {...other}>
            <g clippath="url(#clip0_505_2014)">
                <path d="M62.4836 18.5479H67.6645V28.9097H62.4836V18.5479ZM0.3125 18.5479H5.49342V28.9097H0.3125V18.5479ZM44.3503 41.862H49.5313V47.0429H44.3503V41.862ZM18.4457 41.862H23.6266V47.0429H18.4457V41.862Z" fill="white" />
                <path
                    d="M46.9389 0H21.0343C17.6004 0.00411328 14.3084 1.37005 11.8802 3.79819C9.45208 6.22632 8.08614 9.5184 8.08203 12.9523V49.2188C8.0834 50.5924 8.62969 51.9094 9.601 52.8807C10.5723 53.852 11.8893 54.3983 13.263 54.3997V62.1711H18.4439V54.3997H49.5294V62.1711H54.7103V54.3997C56.0838 54.3976 57.4004 53.8511 58.3715 52.88C59.3427 51.9088 59.8892 50.5922 59.8913 49.2188V12.9523C59.8871 9.5184 58.5212 6.22632 56.0931 3.79819C53.6649 1.37005 50.3729 0.00411328 46.9389 0ZM54.7103 15.5428V31.0855H13.263V15.5428H54.7103ZM21.0343 5.18092H46.9389C48.541 5.18568 50.1023 5.68625 51.4084 6.6139C52.7145 7.54156 53.7015 8.8508 54.2337 10.3618H13.7396C14.2718 8.8508 15.2588 7.54156 16.5649 6.6139C17.871 5.68625 19.4323 5.18568 21.0343 5.18092ZM13.263 49.2188V36.2665H54.7129L54.7155 49.2188H13.263Z"
                    fill={color}
                />
            </g>
            <defs>
                <clipPath id="clip0_505_2014">
                    <rect width="67.9737" height="63" fill={color} />
                </clipPath>
            </defs>
        </svg>
    )
})``

IconTp00Bus.defaultProps = {
    variant: 'color',
}
IconTp00Bus.propTypes = {
    variant: PropTypes.oneOf(['light', 'color']),
}
