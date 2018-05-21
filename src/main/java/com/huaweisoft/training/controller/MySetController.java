package com.huaweisoft.training.controller;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.huaweisoft.training.common.JsonResult;
import com.huaweisoft.training.entity.Attendance;


@Controller
@RequestMapping("/myset")
public class MySetController {

    private final Logger log = Logger.getLogger(MySetController.class);

    
    @RequestMapping(value = "/add", method = RequestMethod.GET)
    public String addumanresource() {
        log.info("跳转考勤添加页面");

        return "myset/add";
    }

    @RequestMapping(value = "/edit", method = RequestMethod.GET)
    public String getAttendance(@RequestParam("id") Integer id, Model model) {
        log.info("跳转考勤编辑页面");

        Map<Integer, Attendance> map = new HashMap<Integer, Attendance>();
        
        // 从模拟数据取值并返回
        Attendance attendance = map.get(id);
        if (attendance != null) {
            // 设置在model返回给页面
            model.addAttribute("attendance", attendance);
        }

        return "humanresource/edit";
    }

    @RequestMapping(value = "/get_list")
    public String getAttendanceList(Model model) {
        log.info("进入考勤列表信息查询");

        // 模拟数据返回
        List<Attendance> list = new ArrayList<>();
        
        // 设置在model返回给页面
        model.addAttribute("list", list);

        return "myset/list";
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult saveAttendance(@RequestParam("id") Integer id, @RequestParam("employeeId") Integer employeeId,
            @RequestParam("workDate") String workDate, @RequestParam("arrivalTime") String arrivalTime,
            @RequestParam("leaveTime") String leaveTime) {
        log.info("进入考勤信息保存");

        log.info("id=" + id);
        log.info("employeeId=" + employeeId);
        log.info("workDate=" + workDate);
        log.info("arrivalTime=" + arrivalTime);
        log.info("leaveTime=" + leaveTime);

        return JsonResult.success("保存成功");
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult deleteAttendance(@RequestParam("id") Integer id) {
        log.info("进入考勤信息删除");

        log.info("id=" + id);

        return JsonResult.success("删除成功");
    }
}
