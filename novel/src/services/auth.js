import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
export default function isAuthenticated() {
    const refreshToken = Cookies.get('refreshToken');
    const accessToken = Cookies.get('accessToken');
    if (refreshToken && accessToken) {
        const isAccessTokenValid = validadeToken(accessToken);
        const isRefreshTokenValid = validadeToken(refreshToken);
        if (isAccessTokenValid && isRefreshTokenValid) return true;
    }
    return false;
}
function validadeToken(accessToken) {
    const decodedToken = decodeToken(accessToken);
    const expirationDate = decodedToken.exp * 1000;
    const currentDate = new Date().getTime();
    return currentDate < expirationDate;
}
function decodeToken(token) {
    const decodedToken = jwtDecode(token);
    return decodedToken;
}