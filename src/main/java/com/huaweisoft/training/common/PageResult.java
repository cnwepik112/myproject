package com.huaweisoft.training.common;

import java.io.Serializable;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

public class PageResult<E> implements Iterable<E>, Serializable {

	private static final long serialVersionUID = 4930312171246167210L;

	private long total;
	private List<E> list;

//	public PageResult(PageInfo<E> pageInfo) {
//		this.total = pageInfo.getTotal();
//		this.list = pageInfo.getList();
//	}
	
	@Override
	public Iterator<E> iterator() {
		if (this.list != null) {
			return this.list.iterator();
		}
		return Collections.emptyIterator();
	}

	public long gettotal() {
		return total;
	}

	public void settotal(long total) {
		this.total = total;
	}

	public List<E> getlist() {
		return list;
	}

	public void setlist(List<E> list) {
		this.list = list;
	}

}
