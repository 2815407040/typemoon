package com.example.typemoonbackend.service.impl;

import com.example.typemoonbackend.entity.SysUser;
import com.example.typemoonbackend.mapper.UserMapper;
import com.example.typemoonbackend.service.UserService;
import com.example.typemoonbackend.util.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public SysUser login(String username, String password) {
        // 1. 根据用户名查询用户
        SysUser user = userMapper.findByUsername(username);

        // 2. 验证用户是否存在
        if (user == null) {
            return null;
        }

        // 3. 验证用户是否被锁定
        if (user.getIsLocked() == 1) {
            throw new RuntimeException("用户已被锁定");
        }

        // 4. 验证密码（加密后比对）
        if (PasswordEncoder.matches(password, user.getPassword())) {
            return user;
        }

        return null;
    }
}