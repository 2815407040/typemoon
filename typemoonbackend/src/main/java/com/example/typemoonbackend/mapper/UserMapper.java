package com.example.typemoonbackend.mapper;

import com.example.typemoonbackend.entity.SysUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    /**
     * 根据用户名查询用户
     */
    SysUser findByUsername(@Param("username") String username);
}