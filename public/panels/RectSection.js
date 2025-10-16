import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import { Fragment } from 'react'

export const RectSection = styled((props) => {
    const { variant, customColor, data, selected, event, ...other } = props
    var color = variant === 'light' ? '#fff' : '#1C60FF'
    if (customColor != undefined) {
        color = customColor
    }

    return (
        <svg width="601" height="649" viewBox="0 0 601 649" fill="none" xmlns="http://www.w3.org/2000/svg" {...other}>
            <g onClick={() => event(0)}>
                <path d="M247.888 52.8729L352.057 52.8728L404.141 143.085L352.057 233.298L247.888 233.298L195.804 143.085L247.888 52.8729Z" fill={selected == 0 ? '#0033C5' : color} stroke="#1C60FF" />
                <text x="300" y="150" fill="#fff" fontSize="30" textAnchor="middle" fontWeight={700}>
                    {data[0]}
                </text>
            </g>
            <g onClick={() => event(1)}>
                <path d="M404.83 143.382L508.998 143.382L561.082 233.594L508.998 323.806L404.83 323.807L352.745 233.594L404.83 143.382Z" fill={selected == 1 ? '#0033C5' : color} stroke="#1C60FF" />
                <text x="455" y="240" fill="#fff" fontSize="30" textAnchor="middle">
                    {data[1]}
                </text>
            </g>
            <g onClick={() => event(2)}>
                <path onClick={() => event(2)} d="M405.255 323.873L509.424 323.873L561.508 414.085L509.424 504.298L405.255 504.298L353.171 414.085L405.255 323.873Z" fill={selected == 2 ? '#0033C5' : color} stroke="#1C60FF" />
                <text x="455" y="420" fill="#fff" fontSize="30" textAnchor="middle">
                    {data[2]}
                </text>
            </g>
            <g onClick={() => event(3)}>
                <path onClick={() => event(3)} d="M247.916 414.824L352.084 414.824L404.168 505.036L352.084 595.249L247.916 595.249L195.831 505.036L247.916 414.824Z" fill={selected == 3 ? '#0033C5' : color} stroke="#1C60FF" />
                <text x="300" y="520" fill="#fff" fontSize="30" textAnchor="middle">
                    {data[3]}
                </text>
            </g>
            <g onClick={() => event(4)}>
                <path d="M91.0015 324.873L195.17 324.873L247.254 415.085L195.17 505.298L91.0015 505.298L38.9173 415.085L91.0015 324.873Z" fill={selected == 4 ? '#0033C5' : color} stroke="#1C60FF" />
                <text x="145" y="420" fill="#fff" fontSize="30" textAnchor="middle">
                    {data[4]}
                </text>
            </g>
            <g onClick={() => event(5)}>
                <path d="M91.0015 143.873L195.17 143.873L247.254 234.085L195.17 324.298L91.0015 324.298L38.9173 234.085L91.0015 143.873Z" fill={selected == 5 ? '#0033C5' : color} stroke="#1C60FF" />
                <text x="145" y="240" fill="#fff" fontSize="30" textAnchor="middle">
                    {data[5]}
                </text>
            </g>
            {data[6]?.length > 0 && (
                <g onClick={() => event(6)}>
                    <path d="M248.002 233.873L352.17 233.873L404.254 324.085L352.17 414.298L248.002 414.298L195.917 324.085L248.002 233.873Z" fill={selected == 6 ? '#0033C5' : '#fff'} stroke="#5990E2" />

                    <text x="300" y="330" fill={selected == 6 ? '#fff' : color} fontSize="30" textAnchor="middle">
                        {data[6]}
                    </text>
                </g>
            )}
        </svg>
    )
})``

RectSection.defaultProps = {
    variant: 'color',
}
RectSection.propTypes = {
    variant: PropTypes.oneOf(['light', 'color']),
}
