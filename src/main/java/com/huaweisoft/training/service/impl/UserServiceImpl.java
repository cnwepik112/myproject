package com.huaweisoft.training.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.huaweisoft.training.dao.UserMapper;
import com.huaweisoft.training.entity.User;
import com.huaweisoft.training.service.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    // 注入UserMapper接口
    @Autowired
    private UserMapper userMapper;
    /**
     * 登录 根据用户名和密码进行查询
     */
    @Override
    public User login(String username, String password) {
        return userMapper.findByUserNameAndPassword(username, password);
    }
    /**
     * 注册 增加用户
     */
    @Override
    public void register(User user) {
        userMapper.addUser(user);
    }
    /**
     * 根据用户名查询
     */
    @Override
    public User findByUserName(String username) {

        return userMapper.findByUserName(username);
    }
}
