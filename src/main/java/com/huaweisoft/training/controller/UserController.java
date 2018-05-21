/*package com.huaweisoft.training.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import com.huaweisoft.training.entity.User;
import com.huaweisoft.training.service.UserService;

@Controller
@RequestMapping("/user")
public class UserController {
    private final Logger log = Logger.getLogger(UserController.class);
    @Autowired
    private UserService userService;

    *//**
     * 欢迎页
     *//*
    @RequestMapping(value = "/")
    public String welcome(Model model) {
        log.info("进入欢迎页");
        return "/user/login";
    }

    @RequestMapping(value = "userlogin", method = RequestMethod.POST)
    public String login(User user, Model model) {
        User user1 = userService.login("username", "password");
        if (user1 != null) {
            // 登录成功，将user对象设置到HttpSession作用范围域中
            model.addAttribute("user", user1);
            model.addAttribute("msg", "登录成功");
            // 转发到main请求
            mv.setView(new RedirectView("/smmbookapp/main"));
            // 登录成功，跳转页面
            return "index";
        }
        else {
            // 登录失败，设置失败信息，并调转到登录页面
            model.addAttribute("msg", "登录失败，请检查用户名和密码是否正确！");
            return "user/login";

        }

    }

    *//**
     * 跳转到用户注册页面
     *//*
    @RequestMapping(value = "/registerpage")
    public String registerpage() {

        return "user/registerpage";
    }
    *//**
     * 用户注册
     *//*
    @RequestMapping(value="/userregister",method=RequestMethod.POST)
    public String register(User user,Model model) {
        String username=user.getUsername();
        // 如果数据库中没有该用户，可以注册，否则跳转页面
        if (userService.findByUserName(username) == null) {
            // 添加用户
            userService.register(user);
            // 注册成功跳转到主页面
            model.addAttribute("msg", "注册成功");
            return "index";
        }else {
            // 注册失败跳转到错误页面
            model.addAttribute("msg", "注册失败");
            return "user/registerpage";
        }
        
    }
}

*/