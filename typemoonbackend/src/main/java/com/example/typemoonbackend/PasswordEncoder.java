package com.example.typemoonbackend.util;

import org.springframework.util.DigestUtils;

public class PasswordEncoder {

    // 盐值，实际项目中可以存储在配置文件
    private static final String SALT = "typemoon@2023";

    /**
     * 密码加密
     */
    public static String encode(String password) {
        // 使用MD5加密，实际项目中可以使用BCrypt等更安全的加密方式
        String base = password + SALT;
        return DigestUtils.md5DigestAsHex(base.getBytes());
    }

    /**
     * 密码比对
     */
    public static boolean matches(String rawPassword, String encodedPassword) {
        return encode(rawPassword).equals(encodedPassword);
    }
}