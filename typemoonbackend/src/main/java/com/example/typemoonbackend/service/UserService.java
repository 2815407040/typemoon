package com.example.typemoonbackend.service;

import com.example.typemoonbackend.entity.SysUser;

public interface UserService {
    /**
     * 用户登录验证
     * @param username 用户名
     * @param password 密码
     * @return 登录成功的用户信息，失败返回null
     */
    SysUser login(String username, String password);
}