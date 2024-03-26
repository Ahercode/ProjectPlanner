import {Badge, Tabs, Table} from 'antd'

const Notification = () => {
  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contractor',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Requester',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Date',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Priority',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  
  const tabItems =[
    {
      key: '1',
      label: <>
        <Badge count={0} showZero={true} title="Request" size="small">
          <span>Requests</span>
        </Badge>
      </>,
      children: <Table columns={columns}/>
    }
  ]
  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      {/*<Table columns={columns}/>*/}
      <Tabs defaultActiveKey="1"
            type="line"
            items={tabItems}
      />
    </div>
  );
}

export {Notification}