/*
Navicat MySQL Data Transfer

Source Server         : localhost-mysql
Source Server Version : 50637
Source Host           : localhost:3306
Source Database       : oa

Target Server Type    : MYSQL
Target Server Version : 50637
File Encoding         : 65001

Date: 2018-05-01 22:21:55
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for attendance
-- ----------------------------
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '考勤ID',
  `employee_id` int(11) DEFAULT NULL COMMENT '员工ID',
  `work_date` date DEFAULT NULL COMMENT '工作日期',
  `arrival_time` time DEFAULT NULL COMMENT '上班时间',
  `leave_time` time DEFAULT NULL COMMENT '下班时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=utf8 COMMENT='考勤表';

-- ----------------------------
-- Records of attendance
-- ----------------------------
INSERT INTO `attendance` VALUES ('1', '1', '2018-01-01', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('2', '1', '2018-01-02', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('3', '1', '2018-01-03', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('4', '1', '2018-01-04', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('5', '1', '2018-01-07', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('6', '1', '2018-01-08', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('7', '1', '2018-01-09', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('8', '1', '2018-01-10', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('9', '1', '2018-01-11', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('10', '1', '2018-01-14', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('11', '1', '2018-01-15', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('12', '1', '2018-01-16', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('13', '1', '2018-01-17', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('14', '1', '2018-01-18', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('15', '1', '2018-01-21', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('16', '1', '2018-01-22', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('17', '1', '2018-01-23', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('18', '1', '2018-01-24', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('19', '1', '2018-01-25', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('20', '1', '2018-01-28', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('21', '1', '2018-01-29', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('22', '1', '2018-01-30', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('23', '1', '2018-01-31', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('24', '2', '2018-01-01', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('25', '2', '2018-01-02', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('26', '2', '2018-01-03', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('27', '2', '2018-01-04', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('28', '2', '2018-01-07', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('29', '2', '2018-01-08', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('30', '2', '2018-01-09', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('31', '2', '2018-01-10', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('32', '2', '2018-01-11', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('33', '2', '2018-01-14', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('34', '2', '2018-01-15', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('35', '2', '2018-01-16', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('36', '2', '2018-01-17', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('37', '2', '2018-01-18', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('38', '2', '2018-01-21', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('39', '2', '2018-01-22', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('40', '2', '2018-01-23', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('41', '2', '2018-01-24', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('42', '2', '2018-01-25', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('43', '2', '2018-01-28', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('44', '2', '2018-01-29', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('45', '2', '2018-01-30', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('46', '2', '2018-01-31', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('47', '3', '2018-01-01', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('48', '3', '2018-01-02', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('49', '3', '2018-01-03', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('50', '3', '2018-01-04', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('51', '3', '2018-01-07', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('52', '3', '2018-01-08', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('53', '3', '2018-01-09', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('54', '3', '2018-01-10', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('55', '3', '2018-01-11', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('56', '3', '2018-01-14', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('57', '3', '2018-01-15', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('58', '3', '2018-01-16', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('59', '3', '2018-01-17', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('60', '3', '2018-01-18', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('61', '3', '2018-01-21', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('62', '3', '2018-01-22', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('63', '3', '2018-01-23', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('64', '3', '2018-01-24', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('65', '3', '2018-01-25', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('66', '3', '2018-01-28', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('67', '3', '2018-01-29', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('68', '3', '2018-01-30', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('69', '3', '2018-01-31', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('70', '4', '2018-01-01', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('71', '4', '2018-01-02', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('72', '4', '2018-01-03', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('73', '4', '2018-01-04', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('74', '4', '2018-01-07', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('75', '4', '2018-01-08', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('76', '4', '2018-01-09', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('77', '4', '2018-01-10', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('78', '4', '2018-01-11', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('79', '4', '2018-01-14', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('80', '4', '2018-01-15', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('81', '4', '2018-01-16', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('82', '4', '2018-01-17', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('83', '4', '2018-01-18', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('84', '4', '2018-01-21', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('85', '4', '2018-01-22', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('86', '4', '2018-01-23', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('87', '4', '2018-01-24', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('88', '4', '2018-01-25', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('89', '4', '2018-01-28', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('90', '4', '2018-01-29', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('91', '4', '2018-01-30', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('92', '4', '2018-01-31', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('93', '5', '2018-01-01', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('94', '5', '2018-01-02', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('95', '5', '2018-01-03', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('96', '5', '2018-01-04', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('97', '5', '2018-01-07', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('98', '5', '2018-01-08', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('99', '5', '2018-01-09', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('100', '5', '2018-01-10', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('101', '5', '2018-01-11', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('102', '5', '2018-01-14', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('103', '5', '2018-01-15', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('104', '5', '2018-01-16', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('105', '5', '2018-01-17', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('106', '5', '2018-01-18', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('107', '5', '2018-01-21', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('108', '5', '2018-01-22', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('109', '5', '2018-01-23', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('110', '5', '2018-01-24', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('111', '5', '2018-01-25', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('112', '5', '2018-01-28', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('113', '5', '2018-01-29', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('114', '5', '2018-01-30', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('115', '5', '2018-01-31', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('116', '6', '2018-01-01', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('117', '6', '2018-01-02', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('118', '6', '2018-01-03', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('119', '6', '2018-01-04', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('120', '6', '2018-01-07', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('121', '6', '2018-01-08', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('122', '6', '2018-01-09', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('123', '6', '2018-01-10', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('124', '6', '2018-01-11', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('125', '6', '2018-01-14', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('126', '6', '2018-01-15', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('127', '6', '2018-01-16', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('128', '6', '2018-01-17', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('129', '6', '2018-01-18', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('130', '6', '2018-01-21', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('131', '6', '2018-01-22', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('132', '6', '2018-01-23', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('133', '6', '2018-01-24', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('134', '6', '2018-01-25', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('135', '6', '2018-01-28', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('136', '6', '2018-01-29', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('137', '6', '2018-01-30', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('138', '6', '2018-01-31', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('139', '7', '2018-01-01', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('140', '7', '2018-01-02', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('141', '7', '2018-01-03', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('142', '7', '2018-01-04', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('143', '7', '2018-01-07', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('144', '7', '2018-01-08', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('145', '7', '2018-01-09', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('146', '7', '2018-01-10', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('147', '7', '2018-01-11', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('148', '7', '2018-01-14', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('149', '7', '2018-01-15', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('150', '7', '2018-01-16', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('151', '7', '2018-01-17', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('152', '7', '2018-01-18', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('153', '7', '2018-01-21', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('154', '7', '2018-01-22', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('155', '7', '2018-01-23', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('156', '7', '2018-01-24', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('157', '7', '2018-01-25', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('158', '7', '2018-01-28', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('159', '7', '2018-01-29', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('160', '7', '2018-01-30', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('161', '7', '2018-01-31', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('162', '8', '2018-01-01', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('163', '8', '2018-01-02', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('164', '8', '2018-01-03', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('165', '8', '2018-01-04', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('166', '8', '2018-01-07', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('167', '8', '2018-01-08', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('168', '8', '2018-01-09', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('169', '8', '2018-01-10', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('170', '8', '2018-01-11', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('171', '8', '2018-01-14', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('172', '8', '2018-01-15', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('173', '8', '2018-01-16', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('174', '8', '2018-01-17', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('175', '8', '2018-01-18', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('176', '8', '2018-01-21', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('177', '8', '2018-01-22', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('178', '8', '2018-01-23', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('179', '8', '2018-01-24', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('180', '8', '2018-01-25', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('181', '8', '2018-01-28', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('182', '8', '2018-01-29', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('183', '8', '2018-01-30', '08:40:10', '18:30:00');
INSERT INTO `attendance` VALUES ('184', '8', '2018-01-31', '08:40:10', '18:30:00');

-- ----------------------------
-- Table structure for employee
-- ----------------------------
DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '员工ID',
  `name` varchar(50) DEFAULT NULL COMMENT '姓名',
  `gender` int(1) DEFAULT NULL COMMENT '性别：1-男、2-女',
  `phone` varchar(50) DEFAULT NULL COMMENT '联系电话',
  `birthday` date DEFAULT NULL COMMENT '出生日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='员工表';

-- ----------------------------
-- Records of employee
-- ----------------------------
INSERT INTO `employee` VALUES ('1', '赵雷', '1', '13600001111', '1990-01-01');
INSERT INTO `employee` VALUES ('2', '钱电', '1', '13600001112', '1990-12-21');
INSERT INTO `employee` VALUES ('3', '孙风', '1', '13600001113', '1990-05-20');
INSERT INTO `employee` VALUES ('4', '李云', '1', '13600001114', '1990-08-06');
INSERT INTO `employee` VALUES ('5', '周梅', '2', '13600001115', '1991-12-01');
INSERT INTO `employee` VALUES ('6', '吴兰', '2', '13600001116', '1992-03-01');
INSERT INTO `employee` VALUES ('7', '郑竹', '2', '13600001117', '1989-07-01');
INSERT INTO `employee` VALUES ('8', '王菊', '2', '13600001118', '1990-01-20');
