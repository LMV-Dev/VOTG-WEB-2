/*Card Number Hypen*/
export const autoHypenCard = (str) => {
    str = str
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3-$4')
        .replace(/(\-{1,3})$/g, '')
    return str
}
export const autoHypenCardWithSecret = (str) => {
    str = str.replace(/[^0-9]/g, '')
    var tmp = ''
    if (str.length < 5) {
        return str
    } else if (str.length < 9) {
        tmp += str.substr(0, 4)
        tmp += '-'
        tmp += str.substr(4)
        return tmp
    } else if (str.length < 13) {
        tmp += str.substr(0, 4)
        tmp += '-'
        tmp += str.substr(4, 4)
        tmp += '-'
        tmp += str.substr(8, 4).replace(/\d/g, '*')
        return tmp
    } else {
        tmp += str.substr(0, 4)
        tmp += '-'
        tmp += str.substr(4, 4)
        tmp += '-'
        tmp += str.substr(8, 4)
        tmp += '-'
        tmp += str.substr(12)
        return tmp
    }
    return str
}

export const formatPhoneNumber = (number) => {
    //Filter only numbers from the input
    var cleaned = ('' + number).replace(/\D/g, '')

    //Check if the input is of correct length
    var match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/)

    if (match) {
        return match[1] + '-' + match[2] + '-' + match[3]
    }

    return null
}

export const formatPhoneNumberMask = (number) => {
    //Filter only numbers from the input
    var cleaned = ('' + number).replace(/\D/g, '')

    //Check if the input is of correct length
    var match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/)

    if (match) {
        let matedMaskMiddle = match[2].replace(/(?<=.{1})./gi, '*')
        let matedMaskLast = match[3].replace(/(?<=.{1})./gi, '*')
        return match[1] + '-' + matedMaskMiddle + '-' + matedMaskLast
    }

    return null
}

export const formatCardNumber = (number) => {
    //Filter only numbers from the input
    // var cleaned = ('' + number).replace(/\D/g, '')

    //Check if the input is of correct length

    if (number !== undefined) {
        var match = number.match(/^(\d{4})(\d{4})(\D{4})(\d{4})$/)
        return match[1] + '-' + match[2] + '-' + match[3] + '-' + match[4]
    }

    return null
}

export const formatPrice = (number) => {
    if (!typeof number === 'number') {
        // console.log(typeof number)
        return
    } else {
        // console.log(number)
        // console.log('type', typeof number)
        var match = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        // console.log(match)
    }

    return match
}
