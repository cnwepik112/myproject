package com.huaweisoft.training.common;

/**
 * 用于封装RESTful调用返回结果
 */
public class JsonResult {

	/**
	 * 调用是否成功标识，0：成功，-2:失败, -1:非法调用
	 */
	private int code;

	/**
	 * 调用结果
	 */
	private Object data;

	/**
	 * 结果消息，如果调用成功，消息通常为空
	 */
	private String msg;

	/**
	 * for JSON.parseObject(jsonString, JsonResult.class)
	 */
	public JsonResult() {
	}
	
	/**
	 * @param code
	 *            代码
	 * @param data
	 *            结果
	 * @param msg
	 *            消息
	 */
	public JsonResult(int code, Object data, String msg) {
		this.code = code;
		this.data = data;
		this.msg = msg;
	}

	/**
	 * 请求成功消息
	 *
	 * @param data
	 * @return
	 */
	public static JsonResult success(Object data) {
		return new JsonResult(0, data, "");
	}

	/**
	 * 请求成功方法 ，data返回值，msg提示信息
	 *
	 * @param data
	 * @param msg
	 * @return
	 */
	public static JsonResult success(Object data, String msg) {
		return new JsonResult(0, data, msg);
	}

	/**
	 * 请求失败消息
	 *
	 * @param msg
	 * @return
	 */
	public static JsonResult fail(String msg) {
		return new JsonResult(-2, null, msg == null ? "" : msg);
	}

	/**
	 * 请求失败消息，根据异常类型，获取不同的提供消息
	 *
	 * @param throwable
	 *            异常
	 * @return
	 */
	public static JsonResult fail(Throwable throwable) {
		return fail(throwable.getMessage());
	}

	/**
	 * 非法请求消息
	 *
	 * @param msg
	 * @return
	 */
	public static JsonResult illegal(String msg) {
		return new JsonResult(-1, null, msg);
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}
}
