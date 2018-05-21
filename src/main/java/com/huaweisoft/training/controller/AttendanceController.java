package com.huaweisoft.training.controller;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.huaweisoft.training.common.JsonResult;
import com.huaweisoft.training.entity.Attendance;
import com.huaweisoft.training.entity.Employee;
import com.huaweisoft.training.service.AttendanceService;


@Controller
@RequestMapping("/attendance")
public class AttendanceController {
@Autowired
private AttendanceService attendanceService;
    private final Logger log = Logger.getLogger(AttendanceController.class);

    
    /**
	 * 跳转考勤添加页面
	 */
	@RequestMapping(value="/toAddAttendance")
	public String toAddAttendance(){
	    return "attendance/addAttendance";
	}
	@RequestMapping(value="/toEditAttendance")
    public String toEditAttendance(Model model,Attendance attendance){
		
        return "attendance/editAttendance";
    }
//    @RequestMapping(value = "/edit", method = RequestMethod.GET)
//    public String getAttendance(@RequestParam("id") Integer id, Model model) {
//        log.info("跳转考勤编辑页面");
//
//        Map<Integer, Attendance> map = new HashMap<Integer, Attendance>();
//        map.put(1, new Attendance(101, 1,  "2018-04-17", "08:40:00","18:00:00"));
//        map.put(2, new Attendance(102, 2,  "2018-04-17", "08:50:00","19:00:00"));
//
//        // 从模拟数据取值并返回
//        Attendance attendance = map.get(id);
//        if (attendance != null) {
//            // 设置在model返回给页面
//            model.addAttribute("attendance", attendance);
//        }
//
//        return "attendance/edit";
//    }
	/**
	 * 添加考勤
	 * @param model
	 * @param employee
	 * @return
	 */
	 @RequestMapping(value = "/addAttendance")
	    @ResponseBody
	    public String addAttendance(Attendance attendance,Model model) {
	        
	     log.info("跳转员工添加页面");
	      if(attendance !=null){
	         attendanceService.saveAttendance(attendance);
	          
	      }
	   
	      return "ok";
	    }
	 @RequestMapping(value = "/editAttendance")
		
		public String updateAttendance(Model model,Attendance attendance) {
			log.info("跳转员工编辑页面");
			if(attendanceService.updateAttendance(attendance)!=0){
				
			    
			    model.addAttribute("attendance",attendance);
			    return "attendance/editAttendance";
			}

			return "attendance/editAttendance";
		}
	
//    @RequestMapping(value = "/get_list")
//    public String getAttendanceList(Model model) {
//        log.info("进入考勤列表信息查询");
//
//        // 模拟数据返回
//        List<Attendance> list = new ArrayList<>();
//        list.add(new Attendance(101, 1,  "2018-04-17", "08:40:00","18:00:00"));
//        list.add(new Attendance(102, 2,  "2018-04-17", "08:50:00","19:00:00"));
//        // 设置在model返回给页面
//        model.addAttribute("list", list);
//
//        return "attendance/list";
//    }
	 @RequestMapping(value = "/getAllAttendance")
		public String getAttendanceList(HttpServletRequest request,Model model) {
			log.info("进入员工列表信息查询");

			List<Attendance> attendances=attendanceService.findAll();
			model.addAttribute("attendanceList",attendances);
			request.setAttribute("attendanceList",attendances);
			return "attendance/attendanceList";
		} 
	 
	 @RequestMapping(value = "/getAttendance", method = RequestMethod.POST)
		public String getAttendance(int id,Model model){
		    model.addAttribute("attendance", attendanceService.findAttendanceById(id));
		    return "attendance/editAttendance";
		}
	 
	 @RequestMapping(value = "/deleteAttendance")
	    @ResponseBody
	    public JsonResult deleteAttendance(@RequestParam("id") Integer id,Model model) {
	        log.info("进入考勤信息删除");

	        log.info("id=" + id);
	        model.addAttribute("attendance", attendanceService.deleteAttendance(id));
	        return JsonResult.success("删除成功");
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
    /**  
     * 根据用户名模糊查询，根据权限查询  
     */  
    @RequestMapping("/select")//为方法设置访问路径  
    
    public String select(Attendance attendance,Model model){  
       attendance=attendanceService.selectById(attendance.getId());
       model.addAttribute("attendance", attendance);
       return "attendance/attendanceList";
}  

   
}
