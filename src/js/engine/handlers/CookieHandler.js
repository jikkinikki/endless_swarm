class CookieHandler {

    addCookie(name, value, days = 365) {
        if (this.getCookie(name) !== null) return false;
        this._setCookie(name, value, days);
        return true;
    }

    overrideCookie(name, value, days = 365) {
        this._setCookie(name, value, days);
    }

    removeCookie(name) {
        document.cookie = `${name}=; Max-Age=0; path=/`;
    }

    getCookie(name) {
        const match = document.cookie
            .split("; ")
            .find(row => row.startsWith(name + "="));
        return match ? decodeURIComponent(match.split("=")[1]) : null;
    }

    _setCookie(name, value, days = 365) {
        const expires = new Date(
            Date.now() + days * 24 * 60 * 60 * 1000
        ).toUTCString();

        document.cookie =
            `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }
}

export default new CookieHandler();