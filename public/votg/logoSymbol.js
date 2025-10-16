import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'

export const LogoSymbol = styled((props) => {
    const { variant, customColor, ...other } = props
    var color = variant === 'light' ? '#fff' : '#FF5353'
    if (customColor != undefined) {
        color = customColor
    }

    return (
        <svg width="195" height="153" viewBox="0 0 195 153" fill="none" xmlns="http://www.w3.org/2000/svg" {...other}>
            <path d="M0 152.709H72.997V79.6152C32.6831 79.6152 0 112.341 0 152.709Z" fill={color} />
            <path d="M79.5703 152.709C119.884 152.709 152.567 119.982 152.567 79.6152H79.5703V152.709V152.709Z" fill={color} />
            <path d="M152.567 0H152.09V0.0116567C111.997 0.268104 79.5703 32.8835 79.5703 73.0933H152.567C152.567 22.1827 194.43 0 194.43 0H152.567V0Z" fill={color} />
        </svg>
    )
})``

LogoSymbol.defaultProps = {
    variant: 'color',
}
LogoSymbol.propTypes = {
    variant: PropTypes.oneOf(['light', 'color']),
}
