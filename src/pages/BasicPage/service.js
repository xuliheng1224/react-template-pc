import http from 'utils/api'

export function download (data) {
    return http({
        method: 'GET',
        url: `api/common/export/${9}`,
        data,
    })
}
