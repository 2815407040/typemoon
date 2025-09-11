package com.example.typemoonbackend.entity;

import lombok.Data;

import java.util.Date;

/**
 * 系统用户实体类（对应数据库表sys_user）
 */
@Data
public class SysUser {
    private Long id;
    private String username;
    private String password; // 存储加密后的密码
    private String email;
    private String role;
    private Date createTime;
    private Integer isLocked;
}
