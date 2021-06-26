import './index.less';
import axios from 'axios';
import { useEffect } from 'react';
import React, { useRef } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Menu, Dropdown } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import request from 'umi-request';
import { useState } from 'react';
import { Link } from 'umi';

const columns: ProColumns<ColType>[] = [
  {
    title: '省份',
    dataIndex: 'province_name',
  },
  {
    title: '学校名称',
    dataIndex: 'name',
  },
  {
    title: '年份',
    dataIndex: 'year',
  },
  {
    title: '录取批次',
    dataIndex: 'local_batch_name',
  },
  {
    title: '招生类型',
    dataIndex: 'zslx_name',
  },
  {
    title: '最低分/最低位次	',
    dataIndex: 'min',
    hideInSearch: true,
    render: (r, record, s) => {
      return <>
        {record.min} / {record.min_section}
      </>
    }
  },
  {
    title: '省控线',
    dataIndex: 'proscore',
  },
  {
    title: '差值',
    hideInSearch: true,
    render: (r, record, s) => {
      if (record.proscore !== '-') {
        return <>
          {+record.min - (+record.proscore)}
        </>
      }
      return '-'
    }
  },

]
type ColType = ScoreType & {
  province_name: string;
  name: string;
}

export default () => {
  const [school, setSchool] = useState<SchoolType[]>([]);
  const [info, setInfo] = useState<ColType[]>([]);

  useEffect(() => {
    axios.get('./schools/school.json')
      .then(res => {
        setSchool(res.data);
      })
  }, [])

  useEffect(() => {
    if (school && school.length) {
      const arr: Promise<ScoreType[]>[] = [];

      school.forEach(item => {
        arr.push(axios.get(`/score/2020/${item.school_id}_${item.name}.json`))
      })
      Promise.all(arr)
        .then(res => {
          return res.map(item => item.data)
        }).then(res => {
          const obj: ColType[] = []

          res.forEach(item => {
            if (item && item.length) {
              item.forEach(inner => {
                const sl = school.filter(s => +s.school_id === +inner.school_id);

                obj.push({
                  ...inner,
                  province_name: sl[0].province_name,
                  name: sl[0].name,
                })
              })
            }
          })
          setInfo(obj);
        })
    }
  }, [school])
  return <>
    <div className="link">
      <Link to="/">2020</Link>
      <Link to="/2019">2019</Link>
      <Link to="/2018">2018</Link>
    </div>

    <ProTable<ColType>
      columns={columns}
      search={{
        collapsed: false
      }}
      params={{ info }}
      rowKey="id"
      request={async ({ current, pageSize, ...rest }, sort, filter) => {
        console.log(rest, 'p');
        console.log(sort, 'sort'),
          console.log(filter, 'f')
        delete rest.info;
        const keys = Object.keys(rest);
        const vals = Object.values(rest);
        const res = info.filter(item => {
          for (let i = 0; i < keys.length; i++) {
            if (item[keys[i]].indexOf(vals[i]) === -1) {
              return false;
            }
          }
          return true;
        })
        return {
          data: res
        }
      }}
      headerTitle="985山西录取情况 2020"
    />
  </>
}
