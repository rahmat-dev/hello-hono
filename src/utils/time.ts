export const getEpochTime = () => Math.floor(new Date().getTime() / 1000.0)

export const getJwtExpiredTime = () => getEpochTime() + 60 * 60 * 24 * 1 // expired at 1 day
