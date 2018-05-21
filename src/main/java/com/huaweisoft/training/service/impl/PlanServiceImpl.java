package com.huaweisoft.training.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huaweisoft.training.dao.PlanMapper;
import com.huaweisoft.training.entity.Plan;
import com.huaweisoft.training.service.PlanService;
@Service
public class PlanServiceImpl implements PlanService{
	
	
	    @Autowired
	    private PlanMapper planMapper;
	    /**
	     * 新增员工
	     * @return 
	     */
	    @Override
	    public void savePlan(Plan plan) {
	          planMapper.insert(plan);
	    }

	   

	    /**
	     * 根据Id删除员工
	     */
	    @Override
	    public int deletePlan(String planname) {
	        return planMapper.deleteByPrimaryKey(planname);
	    }

	 

	  public List<Plan> findAll(){
	      List<Plan> plans=planMapper.findAll();
	      return plans;
	  }
	  
}
