package com.huaweisoft.training.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huaweisoft.training.dao.AttendanceMapper;
import com.huaweisoft.training.entity.Attendance;
import com.huaweisoft.training.service.AttendanceService;

@Service
public class AttendanceServiceImpl implements AttendanceService{
	
	
	    @Autowired
	    private AttendanceMapper attendanceMapper;
	    /**
	     * 新增考勤
	     * @return 
	     */
	    @Override
	    public void saveAttendance(Attendance attendance) {
	    	attendanceMapper.insert(attendance);
	    }

	    /**
	     * 更新考勤
	     */
	    @Override
	    public int updateAttendance(Attendance attendance) {
	         return attendanceMapper.updateByPrimaryKey(attendance);
	    }

	    /**
	     * 根据Id删除考勤
	     */
	    @Override
	    public int deleteAttendance(int id) {
	        return attendanceMapper.deleteByPrimaryKey(id);
	    }

	    /**
	     * 根据id查找考勤
	     */
	    @Override
	    public Attendance findAttendanceById(int id) {
	    	Attendance attendance = attendanceMapper.selectByPrimaryKey(id);
	        return attendance;
	    }

	  public List<Attendance> findAll(){
	      List<Attendance> attendances=attendanceMapper.findAll();
	      return attendances;
	  }
	  public Attendance selectById(int id){
		  Attendance attendance=attendanceMapper.selectById(id);
	    return attendance;
	  }
}
