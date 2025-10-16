import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'

export const IconLogin = styled((props) => {
    const { variant, ...other } = props
    const color = variant === 'light' ? '#fff' : '#FF5353'

    return (
        <svg
            width="100"
            height="112"
            viewBox="0 0 100 112"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...other}
        >
            <path
                d="M11.1111 72.2222H22.2222V100H88.8889V11.1111H22.2222V38.8889H11.1111V5.55556C11.1111 4.08213 11.6964 2.66905 12.7383 1.62718C13.7802 0.585316 15.1932 0 16.6667 0H94.4444C95.9179 0 97.3309 0.585316 98.3728 1.62718C99.4147 2.66905 100 4.08213 100 5.55556V105.556C100 107.029 99.4147 108.442 98.3728 109.484C97.3309 110.526 95.9179 111.111 94.4444 111.111H16.6667C15.1932 111.111 13.7802 110.526 12.7383 109.484C11.6964 108.442 11.1111 107.029 11.1111 105.556V72.2222ZM44.4444 50V33.3333L72.2222 55.5556L44.4444 77.7778V61.1111H0V50H44.4444Z"
                fill={color}
            />
        </svg>
    )
})``

IconLogin.defaultProps = {
    variant: 'color',
}
IconLogin.propTypes = {
    variant: PropTypes.oneOf(['light', 'color']),
}
