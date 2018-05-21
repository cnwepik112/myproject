package com.huaweisoft.training.service;

import java.util.List;

import com.huaweisoft.training.entity.Audit;

public interface AuditService {
	 void saveAudit(Audit audit);
	   

	  

	  
	    
	    List<Audit> findAll();
		int deleteAudit(String pname);
	   
}
