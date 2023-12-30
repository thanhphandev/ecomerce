import { HTTPStatus } from '../common/httpStatus'
import { CustomError } from '../common/errorObject'
import Limiter from 'express-rate-limit'

const OTPLimit = Limiter({
    windowMs: 15 * 1000 * 60,
    max: 2,
    handler: () => {
        throw new CustomError('please waiting 15 mintues! send again', HTTPStatus.TOO_MANY_REQUEST)
    }
})

export {
    OTPLimit
}