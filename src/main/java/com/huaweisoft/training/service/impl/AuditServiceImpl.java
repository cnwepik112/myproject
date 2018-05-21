package com.huaweisoft.training.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huaweisoft.training.dao.AuditMapper;
import com.huaweisoft.training.entity.Audit;
import com.huaweisoft.training.service.AuditService;

@Service
public class AuditServiceImpl implements AuditService{
	@Autowired
	private AuditMapper auditMapper;
	
	@Override
	public void saveAudit(Audit audit) {
        auditMapper.insert(audit);
  }
	 /**
     * 根据Id删除员工
     */
    @Override
    public int deleteAudit(String pname) {
        return auditMapper.deleteByPrimaryKey(pname);
    }
    public List<Audit> findAll(){
	      List<Audit> audits=auditMapper.findAll();
	      return audits;
	  }
}
