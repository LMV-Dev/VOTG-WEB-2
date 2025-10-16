import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'

export const IconServiceResearch = styled((props) => {
    const { variant, customColor, ...other } = props
    var color = variant === 'light' ? '#fff' : '#FF5353'
    if (customColor != undefined) {
        color = customColor
    }

    return (
        <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" {...other}>
            <path
                d="M150.002 142.5L135.002 127.5C137.68 123.214 139.287 117.857 139.287 112.5C139.287 97.5 127.502 85.7143 112.502 85.7143C97.5017 85.7143 85.716 97.5 85.716 112.5C85.716 127.5 97.5017 139.286 112.502 139.286C117.859 139.286 123.216 137.679 127.502 135L142.502 150L150.002 142.5ZM96.4302 112.5C96.4302 103.393 103.395 96.4286 112.502 96.4286C121.609 96.4286 128.573 103.393 128.573 112.5C128.573 121.607 121.609 128.571 112.502 128.571C103.395 128.571 96.4302 121.607 96.4302 112.5ZM32.1445 75H85.716V85.7143H32.1445V75ZM32.1445 42.8572H96.4302V53.5715H32.1445V42.8572Z"
                fill={color}
            />
            <path
                d="M64.2857 137.679L36.4286 122.679C20.3571 114.643 10.7143 98.0357 10.7143 80.3571V10.7143H117.857V69.6429H128.571V10.7143C128.571 4.82143 123.75 0 117.857 0H10.7143C4.82143 0 0 4.82143 0 10.7143V80.3571C0 102.321 11.7857 122.143 31.0714 132.321L64.2857 150V137.679Z"
                fill={color}
            />
        </svg>
    )
})``

IconServiceResearch.defaultProps = {
    variant: 'color',
}
IconServiceResearch.propTypes = {
    variant: PropTypes.oneOf(['light', 'color']),
}
