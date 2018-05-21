package com.huaweisoft.training.service;

import java.util.List;

import com.huaweisoft.training.entity.Employee;

public interface EmployeeService {
    void saveEmployee(Employee employee);
   int updateEmployee(Employee employee);

   int deleteEmployee(int id);

    Employee findEmployeeById(int id);
    
    List<Employee> findAll();
    Employee selectByName(String name);
}
