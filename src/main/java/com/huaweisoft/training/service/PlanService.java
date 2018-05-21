package com.huaweisoft.training.service;

import java.util.List;

import com.huaweisoft.training.entity.Plan;

public interface PlanService {
	 void savePlan(Plan plan);
	   

	   int deletePlan(String planname);

	  
	    
	    List<Plan> findAll();


		
	   
}
