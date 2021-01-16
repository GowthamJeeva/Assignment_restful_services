const secret = 'somethinghere';
const expireTime = 60 * 30;
const SALT_WORK_FACTOR = 10;
const FE_URL = 'http://localhost:4200/';

module.exports = {
    secret: secret,
    expireTime: expireTime,
    SALT_WORK_FACTOR: SALT_WORK_FACTOR,
    FE_URL: FE_URL
}