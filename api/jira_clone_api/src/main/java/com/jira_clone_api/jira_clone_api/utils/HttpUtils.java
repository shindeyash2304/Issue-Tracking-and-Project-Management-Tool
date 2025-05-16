package com.jira_clone_api.jira_clone_api.utils;

import jakarta.servlet.http.Cookie;

public class HttpUtils {
    public static String cookieToHeaderString(Cookie cookie) {
        StringBuilder sb = new StringBuilder();
        sb.append(cookie.getName()).append("=").append(cookie.getValue());

        if (cookie.getPath() != null) sb.append("; Path=").append(cookie.getPath());
        if (cookie.getDomain() != null) sb.append("; Domain=").append(cookie.getDomain());
        if (cookie.getMaxAge() > 0) sb.append("; Max-Age=").append(cookie.getMaxAge());
        if (cookie.getSecure()) sb.append("; Secure");
        if (cookie.isHttpOnly()) sb.append("; HttpOnly");

        return sb.toString();
    }
}
