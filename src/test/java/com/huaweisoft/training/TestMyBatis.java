package com.huaweisoft.training;

import java.util.Map;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.alibaba.fastjson.JSON;
import com.huaweisoft.training.dao.EmployeeMapper;
import com.huaweisoft.training.entity.Employee;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/applicationContext.xml")
public class TestMyBatis {
    private static final Logger log = Logger.getLogger(TestMyBatis.class);
    @Autowired
    private EmployeeMapper employeeMapper;
    @Test
    public void test1() {
        Employee employee = employeeMapper.selectByPrimaryKey(1);
        if (employee != null) {
            log.info(JSON.toJSONString(employee, true));
        }
    }
}