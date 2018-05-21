package com.huaweisoft.training.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.test.web.servlet.result.RequestResultMatchers;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.huaweisoft.training.common.JsonResult;
import com.huaweisoft.training.entity.Employee;
import com.huaweisoft.training.service.EmployeeService;

@Controller
@RequestMapping("/employee")
public class EmployeeController {
@Autowired
private EmployeeService employeeService;
	private final Logger log = Logger.getLogger(EmployeeController.class);

	/**
	 * 跳转员工添加页面
	 */
	@RequestMapping(value="/toAddEmployee")
	public String toAddEmployee(){
	    return "employee/addEmployee";
	}
	@RequestMapping(value="/toEditEmployee")
    public String toEditEmployee(Model model,Employee employee){
		
        return "employee/editEmployee";
    }
	/**
	 * 添加员工
	 * @param model
	 * @param employee
	 * @return
	 */
	 @RequestMapping(value = "/addEmployee")
	    @ResponseBody
	    public String addEmployee(Employee employee,Model model) {
	        
	     log.info("跳转员工添加页面");
	      if(employee !=null){
	         employeeService.saveEmployee(employee);
	          
	      }
	   
	      return "ok";
	    }
	

	@RequestMapping(value = "/editEmployee")
	
	public String updateEmployee(Model model,Employee employee) {
		log.info("跳转员工编辑页面");
		if(employeeService.updateEmployee(employee)!=0){
			
		    
		    model.addAttribute("employee",employee);
		    return "employee/editEmployee";
		}

		return "employee/editEmployee";
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
	
	@RequestMapping(value = "/getAllEmployee")
	public String getEmployeeList(HttpServletRequest request,Model model) {
		log.info("进入员工列表信息查询");

		List<Employee> employees=employeeService.findAll();
		model.addAttribute("employeeList",employees);
		request.setAttribute("employeeList",employees);
		return "employee/employeeList";
	} 

	@RequestMapping(value = "/getEmployee", method = RequestMethod.POST)
	public String getEmployee(int id,Model model){
	    model.addAttribute("employee", employeeService.findEmployeeById(id));
	    return "employee/editEmployee";
	}
	

    @RequestMapping(value = "/deleteEmployee")
    @ResponseBody
    public JsonResult deleteAttendance(@RequestParam("id") Integer id,Model model) {
        log.info("进入考勤信息删除");

        log.info("id=" + id);
        model.addAttribute("employee", employeeService.deleteEmployee(id));
        return JsonResult.success("删除成功");
    }
	@RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult saveEmployee(@RequestParam("id") Integer id, Model model,Employee employee) {
        log.info("进入员工信息保存");

        log.info("id=" + id);
        employeeService.updateEmployee(employee);
        model.addAttribute("employee", employee);
        return JsonResult.success("保存成功");
    }

	/**  
     * 根据用户名模糊查询，根据权限查询  
     */  
    @RequestMapping("/select")//为方法设置访问路径  
    
    public String select(Employee employee,Model model){  
       employee=employeeService.selectByName(employee.getName());
       model.addAttribute("employee", employee);
       return "employee/employeeList";
}  


	@RequestMapping(value = "employeeInfo")
	public String getEmpolyees(@RequestParam(value="pn",defaultValue="1")Integer pn,Model model){
	  //从第一条开始 每页查询10条数据
	    PageHelper.startPage(pn,10);
	    List<Employee> employees=employeeService.findAll();
	  //将用户信息放入PageInfo对象里
	    PageInfo page = new PageInfo(employees,10);
	    model.addAttribute("pageInfo", page);
	    return "employee/employeeList";
	}
}
