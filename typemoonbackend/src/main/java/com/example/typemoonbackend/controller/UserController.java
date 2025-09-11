package com.example.typemoonbackend.controller;

import com.example.typemoonbackend.entity.SysUser;
import com.example.typemoonbackend.service.UserService;
import com.example.typemoonbackend.vo.UserLoginVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin  // 解决跨域问题
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody UserLoginVo loginVo) {
        Map<String, Object> result = new HashMap<>();

        try {
            SysUser user = userService.login(loginVo.getUsername(), loginVo.getPassword());
            if (user != null) {
                result.put("message", "登录成功");
                result.put("user", user);
            } else {
                result.put("message", "用户名或密码错误");
            }
        } catch (Exception e) {
            result.put("message", "登录失败: " + e.getMessage());
        }

        return result;
    }
}