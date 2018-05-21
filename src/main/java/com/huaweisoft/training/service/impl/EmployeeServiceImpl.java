package com.huaweisoft.training.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huaweisoft.training.dao.EmployeeMapper;
import com.huaweisoft.training.entity.Employee;
import com.huaweisoft.training.service.EmployeeService;

@Service
public class EmployeeServiceImpl implements EmployeeService{
    @Autowired
    private EmployeeMapper employeeMapper;
    /**
     * 新增员工
     * @return 
     */
    @Override
    public void saveEmployee(Employee employee) {
          employeeMapper.insert(employee);
    }

    /**
     * 更新员工
     */
    @Override
    public int updateEmployee(Employee employee) {
         return employeeMapper.updateByPrimaryKey(employee);
    }

    /**
     * 根据Id删除员工
     */
    @Override
    public int deleteEmployee(int id) {
        return employeeMapper.deleteByPrimaryKey(id);
    }

    /**
     * 根据id查找员工
     */
    @Override
    public Employee findEmployeeById(int id) {
        Employee employee = employeeMapper.selectByPrimaryKey(id);
        return employee;
    }

  public List<Employee> findAll(){
      List<Employee> employees=employeeMapper.findAll();
      return employees;
  }
  public Employee selectByName(String name){
      Employee employee=employeeMapper.selectByName(name);
    return employee;
  }
}
