package com.huaweisoft.training.dao;

import com.huaweisoft.training.entity.Audit;
import com.huaweisoft.training.entity.AuditExample;
import com.huaweisoft.training.entity.Employee;

import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface AuditMapper {
    int countByExample(AuditExample example);

    int deleteByExample(AuditExample example);

    int deleteByPrimaryKey(String pName);

    int insert(Audit record);

    int insertSelective(Audit record);

    List<Audit> selectByExample(AuditExample example);

    Audit selectByPrimaryKey(String pName);

    int updateByExampleSelective(@Param("record") Audit record, @Param("example") AuditExample example);

    int updateByExample(@Param("record") Audit record, @Param("example") AuditExample example);

    int updateByPrimaryKeySelective(Audit record);

    int updateByPrimaryKey(Audit record);
    List<Audit>findAll();
}