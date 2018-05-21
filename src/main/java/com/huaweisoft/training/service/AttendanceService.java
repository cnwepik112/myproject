package com.huaweisoft.training.service;

import java.util.List;

import com.huaweisoft.training.entity.Attendance;

public interface AttendanceService {
	  void saveAttendance(Attendance attendance);
	   int updateAttendance(Attendance attendance);

	   int deleteAttendance(int id);

	   Attendance findAttendanceById(int id);
	    
	    List<Attendance> findAll();
	    Attendance selectById(int id);
}
