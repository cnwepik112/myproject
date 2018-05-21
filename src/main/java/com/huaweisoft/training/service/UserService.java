package com.huaweisoft.training.service;

import com.huaweisoft.training.entity.User;

public interface UserService {
    // 通过用户名及密码核查用户登录
    User login(String username, String password);
    //增加用户
    void register(User user);
    //根据用户名查询
    User findByUserName(String user);

}
