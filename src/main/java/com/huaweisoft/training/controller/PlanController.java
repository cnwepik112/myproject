package com.huaweisoft.training.controller;



import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.huaweisoft.training.common.JsonResult;
import com.huaweisoft.training.entity.Plan;
import com.huaweisoft.training.service.PlanService;


@Controller
	@RequestMapping("/plan")
public class PlanController {
	
	
	@Autowired
	private PlanService planService;
		private final Logger log = Logger.getLogger(PlanController.class);

		/**
		 * 跳转员工添加页面
		 */
		@RequestMapping(value="/toAddPlan")
		public String toAddPlan(){
		    return "plan/addPlan";
		}
		
		/**
		 * 添加员工
		 * @param model
		 * @param employee
		 * @return
		 */
		 @RequestMapping(value = "/addPlan")
		    @ResponseBody
		    public String addPlan(Plan plan,Model model) {
		        
		     log.info("跳转员工添加页面");
		      if(plan !=null){
		         planService.savePlan(plan);
		          
		      }
		   
		      return "ok";
		    }
		

		
		/**
		 
	    @RequestMapping(value = "/getEmployee_list")
	    public String getEmployeeList(Model model) {
	        log.info("进入员工列表信息查询");

	        // 模拟数据返回
	        List<Employee> list = new ArrayList<>();
	        try {
	            list.add(new Employee(1, "张三", 1, "13625645875", "1990-09-12"));
	            list.add(new Employee(2, "李四", 2, "13598654585", "1995-01-15")));
	        } catch (ParseException e) {
	            log.error("日期转换异常");
	        }
	        // 设置在model返回给页面
	        model.addAttribute("list", list);

	        return "employee/list";
	    } */
		
		@RequestMapping(value = "/getAllPlan")
		public String getPlanList(HttpServletRequest request,Model model) {
			log.info("进入员工列表信息查询");

			List<Plan> plans=planService.findAll();
			model.addAttribute("planList",plans);
			request.setAttribute("planList",plans);
			return "plan/planList";
		} 

		
		

	    @RequestMapping(value = "/deletePlan")
	    @ResponseBody
	    public JsonResult deleteAttendance(@RequestParam("planname") String planname,Model model) {
	        log.info("进入考勤信息删除");

	        
	        model.addAttribute("plan", planService.deletePlan(planname));
	        return JsonResult.success("删除成功");
	    }
		

		
}
